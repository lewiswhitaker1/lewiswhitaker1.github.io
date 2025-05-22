// OUTSPKN - UK Car Culture Brand
// Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            
            if (nav.classList.contains('active')) {
                nav.style.display = 'block';
            } else {
                setTimeout(() => {
                    nav.style.display = '';
                }, 300);
            }
        });
    }
    
    // Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.getElementById('cart-count');
    
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('outspkn_cart')) || [];
    updateCartCount();
    
    // Add to cart button click event
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const productName = this.closest('.product-card').querySelector('h3').innerText;
                const productPrice = this.closest('.product-card').querySelector('.price').innerText;
                const productImage = this.closest('.product-card').querySelector('img').getAttribute('src');
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });
                }
                
                // Save cart to localStorage
                localStorage.setItem('outspkn_cart', JSON.stringify(cart));
                
                // Update cart count
                updateCartCount();
                
                // Show notification
                showNotification(`${productName} added to cart!`);
            });
        });
    }
    
    // Product Detail Page Functionality
    const productDetailPage = document.querySelector('.product-detail');
    if (productDetailPage) {
        // Thumbnail Gallery
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.querySelector('.product-gallery img');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const imgSrc = this.getAttribute('src');
                mainImage.setAttribute('src', imgSrc);
                
                // Remove active class from all thumbnails
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
            });
        });
        
        // Quantity Input
        const quantityInput = document.querySelector('.quantity-input input');
        const increaseBtn = document.querySelector('.quantity-btn.increase');
        const decreaseBtn = document.querySelector('.quantity-btn.decrease');
        
        if (increaseBtn && decreaseBtn) {
            increaseBtn.addEventListener('click', function() {
                quantityInput.value = parseInt(quantityInput.value) + 1;
            });
            
            decreaseBtn.addEventListener('click', function() {
                if (parseInt(quantityInput.value) > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                }
            });
        }
        
        // Add to Cart from Product Detail
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const productName = document.querySelector('.product-info h1').innerText;
                const productPrice = document.querySelector('.product-price').innerText;
                const productImage = document.querySelector('.product-gallery img').getAttribute('src');
                const quantity = parseInt(quantityInput.value);
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: quantity
                    });
                }
                
                // Save cart to localStorage
                localStorage.setItem('outspkn_cart', JSON.stringify(cart));
                
                // Update cart count
                updateCartCount();
                
                // Show notification
                showNotification(`${productName} added to cart!`);
            });
        }
    }
    
    // Cart Page Functionality
    const cartPage = document.querySelector('.cart-page');
    if (cartPage) {
        renderCart();
        
        // Remove item from cart
        document.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('remove-btn')) {
                const productId = e.target.getAttribute('data-id');
                
                // Remove item from cart
                cart = cart.filter(item => item.id !== productId);
                
                // Save cart to localStorage
                localStorage.setItem('outspkn_cart', JSON.stringify(cart));
                
                // Update cart count
                updateCartCount();
                
                // Re-render cart
                renderCart();
            }
        });
        
        // Update quantity
        document.addEventListener('change', function(e) {
            if (e.target && e.target.classList.contains('cart-quantity')) {
                const productId = e.target.getAttribute('data-id');
                const quantity = parseInt(e.target.value);
                
                if (quantity < 1) {
                    e.target.value = 1;
                    return;
                }
                
                // Update item quantity
                const item = cart.find(item => item.id === productId);
                if (item) {
                    item.quantity = quantity;
                }
                
                // Save cart to localStorage
                localStorage.setItem('outspkn_cart', JSON.stringify(cart));
                
                // Update cart count
                updateCartCount();
                
                // Re-render cart
                renderCart();
            }
        });
    }
    
    // Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // In a real application, you would send this to your server
            // For now, just show a notification
            showNotification(`Thank you for subscribing with ${email}!`);
            
            // Clear the input
            emailInput.value = '';
        });
    }
    
    // Helper Functions
    function updateCartCount() {
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.innerText = totalItems;
        }
    }
    
    function renderCart() {
        const cartTableBody = document.querySelector('.cart-table tbody');
        const cartSummary = document.querySelector('.cart-summary');
        
        if (!cartTableBody || !cartSummary) return;
        
        if (cart.length === 0) {
            document.querySelector('.cart-container').innerHTML = `
                <div class="empty-cart">
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any products to your cart yet.</p>
                    <a href="shop.html" class="btn">Continue Shopping</a>
                </div>
            `;
            return;
        }
        
        // Render cart items
        let cartHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const price = parseFloat(item.price.replace('£', ''));
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;
            
            cartHTML += `
                <tr>
                    <td data-label="Product">
                        <div class="cart-product">
                            <img src="${item.image}" alt="${item.name}">
                            <div>
                                <h4>${item.name}</h4>
                            </div>
                        </div>
                    </td>
                    <td data-label="Price">${item.price}</td>
                    <td data-label="Quantity">
                        <input type="number" class="cart-quantity" value="${item.quantity}" min="1" data-id="${item.id}">
                    </td>
                    <td data-label="Total">£${itemTotal.toFixed(2)}</td>
                    <td data-label="Remove">
                        <button class="remove-btn" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        cartTableBody.innerHTML = cartHTML;
        
        // Calculate shipping (free over £50)
        const shipping = subtotal >= 50 ? 0 : 4.99;
        
        // Calculate total
        const total = subtotal + shipping;
        
        // Render summary
        const summaryHTML = `
            <div class="summary-row">
                <span>Subtotal</span>
                <span>£${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'Free' : '£' + shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Total</span>
                <span>£${total.toFixed(2)}</span>
            </div>
        `;
        
        document.querySelector('.summary-content').innerHTML = summaryHTML;
    }
    
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Add active class after a small delay (for animation)
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('active');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Shop Page Functionality
    const shopPage = document.querySelector('.shop-page');
    if (shopPage) {
        // Get category from URL if available
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            // Set the category filter
            const categorySelect = document.getElementById('category-filter');
            if (categorySelect) {
                categorySelect.value = category;
            }
            
            // Update page title
            const shopTitle = document.querySelector('.shop-header h1');
            if (shopTitle) {
                shopTitle.innerText = formatCategoryName(category);
            }
        }
        
        // Filter functionality
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                // In a real application, you would filter products
                // For now, just redirect to the category page
                const selectedCategory = this.value;
                if (selectedCategory) {
                    window.location.href = `shop.html?category=${selectedCategory}`;
                } else {
                    window.location.href = 'shop.html';
                }
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', function() {
                // In a real application, you would sort products
                // For now, just show a notification
                const selectedSort = this.value;
                showNotification(`Products sorted by: ${selectedSort}`);
            });
        }
    }
    
    function formatCategoryName(category) {
        if (!category) return 'All Products';
        
        // Replace hyphens with spaces and capitalize each word
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        z-index: 1000;
    }
    
    .notification.active {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification-content {
        background-color: #333;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .notification p {
        margin: 0;
    }
`;
document.head.appendChild(style); 