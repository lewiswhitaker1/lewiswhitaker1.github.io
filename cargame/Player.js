import GESpriteAtlas from "./GESpriteAtlas.js";

export default class Player extends GESpriteAtlas {
    constructor(id, layer, x, y) {
        const atlasSource = './assets/sprites/cars_atlas.png';
        const carSpriteBounds = { x: 0, y: 0, w: 64, h: 64 };
        super(id, layer, atlasSource, carSpriteBounds);
        this.setX(x);
        this.setY(y);
        this.angle = 0;
        this.speed = 0;

        
        this.horsepower = 150;
        this.weight = 1200; 
        this.rpm = 0;
        this.maxRpm = 7000;
        this.minRpm = 800;
        this.engineTorque = 180; 
        this.wheelRadius = 0.3; 
        this.finalDriveRatio = 3.42;
        this.gearRatios = [-2.90, 0, 2.66, 1.78, 1.30, 0.97, 0.75]; 
        this.currentGear = 1; 

        this.turnSpeed = 2.5;

        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
        };
    }

    tick(delta) {
        

        
        const gearRatio = this.gearRatios[this.currentGear + 1];
        if (gearRatio > 0 && this.speed > 0.1) {
            
            const wheelRotationsPerSecond = this.speed / (2 * Math.PI * this.wheelRadius);
            this.rpm = wheelRotationsPerSecond * gearRatio * this.finalDriveRatio * 60;
        } else if (this.keys.w && this.currentGear === 1) {
            
            this.rpm += 4000 * delta;
        } else {
            
            this.rpm -= 2000 * delta;
        }
        
        
        this.rpm = Math.max(this.minRpm, Math.min(this.maxRpm, this.rpm));

        
        let drivingForce = 0;
        if (this.keys.w && this.currentGear !== 1) { 
            const torque = this.getTorque(this.rpm);
            const transmissionEfficiency = 0.7; 
            const wheelTorque = torque * gearRatio * this.finalDriveRatio * transmissionEfficiency;
            drivingForce = wheelTorque / this.wheelRadius;
        }

        
        const rollingResistance = 30 * this.speed; 
        const airDrag = 0.2 * this.speed * this.speed; 
        const totalResistance = rollingResistance + airDrag;

        
        const netForce = drivingForce - totalResistance;
        const acceleration = netForce / this.weight; 

        
        this.speed += acceleration * delta;

        
        if (this.keys.s) {
            const brakingForce = 6000; 
            const brakingAcceleration = brakingForce / this.weight;
            this.speed -= brakingAcceleration * delta;
        }

        
        if (this.speed < 0) this.speed = 0;

        

        
        if (this.speed > 0.1) {
            
            const turnFactor = Math.max(0.2, 1 - this.speed / 50); 
            if (this.keys.a) {
                this.angle -= this.turnSpeed * turnFactor * delta;
            }
            if (this.keys.d) {
                this.angle += this.turnSpeed * turnFactor * delta;
            }
        }

        
        this.setX(this.getX() + this.speed * Math.cos(this.angle) * delta * 10); 
        this.setY(this.getY() + this.speed * Math.sin(this.angle) * delta * 10);
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

    getTorque(rpm) {
        
        const peakTorqueRpm = 4500;
        const maxTorque = this.engineTorque;

        if (rpm < this.minRpm) {
            return 0;
        }

        if (rpm < peakTorqueRpm) {
            
            return maxTorque * (rpm - this.minRpm) / (peakTorqueRpm - this.minRpm);
        } else {
            
            return maxTorque * (1 - (rpm - peakTorqueRpm) / (this.maxRpm - peakTorqueRpm));
        }
    }

    shiftUp() {
        if (this.currentGear < 5) {
            this.currentGear++;
            this.rpm = this.minRpm + 1500; 
        }
    }

    shiftDown() {
        if (this.currentGear > 0) {
            this.currentGear--;
            this.rpm = this.minRpm + 1500; 
        }
    }
}
