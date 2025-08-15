import GESpriteAtlas from "./GESpriteAtlas.js";

export default class Player extends GESpriteAtlas {
    constructor(id, layer, x, y) {
        const atlasSource = './assets/sprites/cars_atlas.png';
        const carSpriteBounds = { x: 0, y: 0, w: 64, h: 64 };
        super(id, layer, atlasSource, carSpriteBounds);
        this.setX(x);
        this.setY(y);
        this.angle = 0;
		// Movement state (speed is in pixels/second; physics simulated in SI and converted)
		this.speed = 0;
		this.turnSpeed = 2.5;

		// World scaling
		this.metersPerPixel = 0.05; // 1 px = 0.05 m (20 px = 1 m)

		// Vehicle properties
		this.massKg = 1200; // Weight ~1200 kg
		this.wheelRadiusM = 0.31;
		this.drivetrainEfficiency = 0.9;
		this.finalDrive = 3.42;
		// Neutral at index 0 for convenience
		this.gearRatios = [0, 3.60, 2.19, 1.41, 1.12, 0.89, 0.74]; // 6-speed
		this.currentGear = 1;
		this.lastShiftTimeMs = 0;
		this.shiftCooldownMs = 200;

		// Engine properties
		this.idleRpm = 900;
		this.redlineRpm = 6500;
		this.rpm = this.idleRpm;
		this.engineInertia = 0.20; // kg·m^2 equivalent flywheel inertia
		this.engineFrictionCoeff = 0.02; // Nm per rad/s internal viscous losses
		this.engineBaseFrictionNm = 10; // baseline static losses
		this.idleControlTorqueNm = 20; // extra torque to hold idle under no throttle
		// Torque curve points [rpm, torqueNm] (compact 150hp-ish NA engine)
		this.torqueCurve = [
			[ 800, 110],
			[1200, 140],
			[2000, 180],
			[3000, 210],
			[4000, 235],
			[5000, 240],
			[5800, 230],
			[6500, 200]
		];
		// Derived approximate peak HP (for reference/UI)
		this.hp = this.#calcHp(this.rpm, this.#torqueAt(this.rpm));
		this.engineTorqueNm = 0;

		// Resistances
		this.rollResistanceCoeff = 0.015; // Crr
		this.airDensity = 1.225; // kg/m^3
		this.dragCdA = 0.70; // Cd*A m^2

        this.keys = {
            w: false, // throttle
            a: false,
            s: false, // brake
            d: false,
            q: false, // gear down
            e: false, // gear up
        };
    }

    tick(delta) {
		// Manual gear shifting with cooldown
		const now = performance.now();
		if (this.keys.e && now - this.lastShiftTimeMs > this.shiftCooldownMs) {
			this.shiftUp();
			this.lastShiftTimeMs = now;
		}
		if (this.keys.q && now - this.lastShiftTimeMs > this.shiftCooldownMs) {
			this.shiftDown();
			this.lastShiftTimeMs = now;
		}

		// Throttle and braking (binary for now)
		const throttle = this.keys.w ? 1 : 0;
		const braking = this.keys.s ? 1 : 0;

		// Convert speed to m/s for physics
		let v_mps = this.speed * this.metersPerPixel;

		// Engine/flywheel dynamics
		const gearRatio = this.#getCurrentGearRatio();
		let omegaEngine = this.rpm * 2 * Math.PI / 60; // rad/s
		// Base engine torque from curve and throttle
		let engineTorqueNm = this.#torqueAt(this.rpm) * throttle;
		// Idle control to prevent stall when below idle with no throttle
		if (this.rpm < this.idleRpm && throttle < 0.05) {
			engineTorqueNm += this.idleControlTorqueNm;
		}
		// Soft limiter near redline
		if (this.rpm >= this.redlineRpm - 50 && throttle > 0) {
			engineTorqueNm *= 0.2;
		}
		// Internal engine losses
		const engineLossNm = this.engineBaseFrictionNm + this.engineFrictionCoeff * omegaEngine;
		let netEngineTorqueNm = engineTorqueNm - engineLossNm;
		// Gear top-speed limiting: if theoretical speed exceeds redline in current gear
		if (gearRatio > 0 && throttle > 0) {
			const vmax_mps = this.#gearVmaxMps(gearRatio);
			if (v_mps >= vmax_mps - 0.2) {
				engineTorqueNm = 0;
				netEngineTorqueNm = -engineLossNm; // only losses act
			}
		}
		if (gearRatio === 0) {
			// Neutral: free-rev based on net torque and flywheel inertia
			const alpha = netEngineTorqueNm / this.engineInertia; // rad/s^2
			omegaEngine += alpha * delta;
		} else {
			// In gear: move engine speed toward kinematic reference, limited by available torque/inertia
			const wheelOmega = (v_mps / Math.max(this.wheelRadiusM, 1e-6)); // rad/s
			const omegaRef = wheelOmega * gearRatio * this.finalDrive; // rad/s
			const alphaMax = netEngineTorqueNm / this.engineInertia; // rad/s^2
			const dOmegaNeeded = omegaRef - omegaEngine;
			let dOmegaAllowed = alphaMax * delta;
			if (dOmegaNeeded > 0) dOmegaAllowed = Math.max(0, Math.min(dOmegaNeeded, dOmegaAllowed));
			else dOmegaAllowed = Math.min(0, Math.max(dOmegaNeeded, dOmegaAllowed));
			omegaEngine += dOmegaAllowed;
		}
		// Clamp engine speed and update RPM
		omegaEngine = Math.max(this.idleRpm * 2 * Math.PI / 60, Math.min(this.redlineRpm * 2 * Math.PI / 60, omegaEngine));
		this.rpm = omegaEngine * 60 / (2 * Math.PI);

		// Wheel thrust (positive engine torque only drives wheels)
		let driveEngineTorqueNm = Math.max(0, engineTorqueNm);
		let wheelTorqueNm = driveEngineTorqueNm * gearRatio * this.finalDrive * this.drivetrainEfficiency;
		let driveForceN = wheelTorqueNm / Math.max(this.wheelRadiusM, 1e-6);
		this.engineTorqueNm = engineTorqueNm;

		// Resistances
		const sign = v_mps >= 0 ? 1 : -1;
		const Frr = this.massKg * 9.81 * this.rollResistanceCoeff;
		const Fd = 0.5 * this.airDensity * this.dragCdA * v_mps * v_mps;
		const brakeForceMax = 8000; // N
		const Fbr = braking * brakeForceMax * sign; // opposes motion

		// Net force and acceleration
		let netForce = driveForceN * (v_mps >= 0 ? 1 : -1) - Frr * sign - Fd * sign - Fbr;
		let accel_mps2 = netForce / this.massKg;

		// Integrate speed in m/s, then convert to px/s
		v_mps += accel_mps2 * delta;
		// Clamp very low speeds to zero to avoid jitter
		if (Math.abs(v_mps) < 0.01) v_mps = 0;
		this.speed = v_mps / this.metersPerPixel;

		// Update instantaneous HP (mechanical horsepower)
		this.hp = this.#calcHp(this.rpm, engineTorqueNm);

		// Turning proportional to speed
		if (this.speed !== 0) {
			if (this.keys.a) this.angle -= this.turnSpeed * delta;
			if (this.keys.d) this.angle += this.turnSpeed * delta;
		}

		// Integrate position using pixel speed
		this.setX(this.getX() + this.speed * Math.cos(this.angle) * delta);
		this.setY(this.getY() + this.speed * Math.sin(this.angle) * delta);
    }

    draw(alpha, context) {
        if (!this.isReady()) return;

        context.save();
        context.translate(this.getX(), this.getY());
        context.rotate(this.angle);
        context.drawImage(
            this.texture,
            this.atlasRect.x,
            this.atlasRect.y,
            this.atlasRect.w,
            this.atlasRect.h,
            -this.getWidth() / 2,
            -this.getHeight() / 2,
            this.getWidth(),
            this.getHeight()
        );
        context.restore();
    }

	// Public helpers for UI
	getSpeedMps() {
		return this.speed * this.metersPerPixel;
	}

	getSpeedKmh() {
		return this.getSpeedMps() * 3.6;
	}

	getRpm() {
		return this.rpm;
	}

	getHp() {
		return this.hp;
	}

	getTorqueNm() {
		return this.engineTorqueNm;
	}

	getGearLabel() {
		if (this.#getCurrentGearRatio() === 0) return 'N';
		return `${this.currentGear}`;
	}

	shiftUp() {
		if (this.currentGear < this.gearRatios.length - 1) {
			this.currentGear++;
		}
	}

	shiftDown() {
		if (this.currentGear > 0) {
			this.currentGear--;
		}
	}

	// Private helpers
	#getCurrentGearRatio() {
		return this.gearRatios[this.currentGear] ?? 0;
	}

	#approach(current, target, ratePerSec, deltaSeconds) {
		if (current < target) return Math.min(target, current + ratePerSec * deltaSeconds);
		if (current > target) return Math.max(target, current - ratePerSec * deltaSeconds);
		return current;
	}

	#torqueAt(rpm) {
		// Linear interpolate between curve points
		const pts = this.torqueCurve;
		if (rpm <= pts[0][0]) return pts[0][1];
		for (let i = 0; i < pts.length - 1; i++) {
			const [r0, t0] = pts[i];
			const [r1, t1] = pts[i + 1];
			if (rpm >= r0 && rpm <= r1) {
				const f = (rpm - r0) / (r1 - r0);
				return t0 + f * (t1 - t0);
			}
		}
		return pts[pts.length - 1][1];
	}

	#calcHp(rpm, torqueNm) {
		// P[kW] = T[Nm] * omega[rad/s] / 1000
		const omega = rpm * 2 * Math.PI / 60;
		const kw = torqueNm * omega / 1000;
		return kw * 1.34102209; // mechanical HP
	}

	#gearVmaxMps(gearRatio) {
		const engineOmegaMax = this.redlineRpm * 2 * Math.PI / 60; // rad/s
		const wheelOmegaMax = engineOmegaMax / (gearRatio * this.finalDrive);
		return wheelOmegaMax * this.wheelRadiusM;
	}
}