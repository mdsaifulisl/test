
const search = document.querySelector('.headersearch');
const searchActive = document.querySelector('.search-active');
const noneDisplay = document.querySelector('.searce-display');

searchActive.onclick = () => {
    search.style.display = "inline-block"
}
noneDisplay.onclick = () => {
    search.style.display = "none"
}

const activeCart = document.querySelector('.active-cart');
const myCartActiveNone = document.querySelector('.my-cart-active-none');

activeCart.onclick = () => {
    document.querySelector('.cart-box').style.display = 'block';
}
myCartActiveNone.onclick = () => {
    document.querySelector('.cart-box').style.display = 'none';
}

// header bottom
const brasBtns = document.querySelector('.bras-btns');
const navBarDelate = document.querySelector('.nav-bar-delate');

brasBtns.onclick = () => {
    document.querySelector('.nav').style.display = 'inline-block';
}
navBarDelate.onclick = () => {
    document.querySelector('.nav').style.display = 'none';
}




// ----------------------------------------------
// Initialize cart and total price
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const addcart = document.querySelector('.allItem-cart');
let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

// Ensure totalPrice is a valid number
if (isNaN(totalPrice)) {
    totalPrice = 0;
}

// Load the cart items if available
if (addcart) {
    createCartItem(); 
}

// Add to Cart Button Event Listener
document.querySelectorAll('.cartbtns').forEach(button => {
    button.addEventListener('click', (e) => {
        const product = e.target.closest('.product-box');
        const img = product.querySelector('.productimg img').src; 
        const productName = product.querySelector('.pitem .ptext p').innerText;

        // Get the price text and remove any non-numeric characters, then parse it
        let priceText = product.querySelector('.price').innerText;
        priceText = priceText.replace(/[^0-9.]/g, ''); // Remove all except numbers and the decimal point
        const productPrice = parseFloat(priceText);

        if (isNaN(productPrice)) {
            console.error('Invalid price format:', priceText);
            return;
        }

        addProductToCart(img, productName, productPrice);
    });
});


// Function to Add Product to Cart
function addProductToCart(img, productName, productPrice) {
    const existingItemIndex = cart.findIndex(item => item.productName === productName);

    if (existingItemIndex > -1) {
        // Item already in the cart, increase quantity
        const existingItem = cart[existingItemIndex];
        existingItem.productQuantity += 1;
        existingItem.totalPrice = existingItem.productQuantity * existingItem.productPrice;
        totalPrice += existingItem.productPrice;
    } else {
        // New item, add to the cart
        cart.push({
            img, 
            productName, 
            productPrice,
            productQuantity: 1,
            totalPrice: productPrice
        });
        totalPrice += productPrice;
    }

    // Save cart and totalPrice to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', parseFloat(totalPrice).toFixed(2));

    console.log("Cart updated:", cart); // Debug message
    console.log("Total price updated:", totalPrice); // Debug message

    createCartItem();
}

// Function to Display Cart Items
function updateQuantity(productName, change) {
    const itemIndex = cart.findIndex(item => item.productName === productName);

    if (itemIndex > -1) {
        const item = cart[itemIndex];
        item.productQuantity += change;

        // If quantity is zero or less, remove the item from the cart
        if (item.productQuantity <= 0) {
            cart.splice(itemIndex, 1); // Remove item from the cart array
        } else {
            item.totalPrice = item.productQuantity * item.productPrice; 
        }

        // Recalculate totalPrice for the entire cart
        totalPrice = cart.reduce((sum, item) => sum + (item.productPrice * item.productQuantity), 0);

        // Save the updated cart and totalPrice to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('totalPrice', parseFloat(totalPrice).toFixed(2));

        // Re-render the cart
        createCartItem();
    }
}

function createCartItem() {
    addcart.innerHTML = ''; 

    if (cart.length === 0) {
        addcart.innerHTML = '<p>Your Cart is Empty</p>';
        document.getElementById('total-price').innerText = "0.00"; 
        return;
    }

    cart.forEach((item) => {
        const createDiv = document.createElement('div');
        createDiv.classList.add('items-cart-product');

        const quantity = item.productQuantity || 1;
        const productPrice = item.productPrice || 0;
        const itemTotalPrice = (quantity * productPrice).toFixed(2);

        createDiv.innerHTML = `
            <div class="items-cart-productto">
                <img src="${item.img}" alt="">
                <p>${item.productName}<br>
                    <span>${quantity} kg</span> X
                    <span>$ ${productPrice.toFixed(2)}</span><br>
                    <span>Total: $ ${itemTotalPrice}</span>
                </p>
            </div>
            <div class="delate-cart-product-items">
                <i class="fa-solid fa-plus plus"></i>
                <input type="number" id="quantity" name="quantity" min="1" value="${quantity}">
                <i class="fa-solid fa-minus minus"></i>
            </div>
        `;

        addcart.appendChild(createDiv);

        
        const plusButton = createDiv.querySelector('.plus');
        const minusButton = createDiv.querySelector('.minus');
        const quantityInput = createDiv.querySelector('#quantity');

        plusButton.addEventListener('click', () => updateQuantity(item.productName, 1));
        minusButton.addEventListener('click', () => updateQuantity(item.productName, -1));
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value) || 1;
            updateQuantity(item.productName, newQuantity - quantity);
        });
    });

    
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.innerText = totalPrice ? totalPrice.toFixed(2) : "0.00";
    } else {
        console.warn("Total price element not found"); 
    }
    updateCartLengthDisplay()
    
}

// Initialize totalPrice and cart on page load
totalPrice = totalPrice || 0;

function updateCartLengthDisplay() {
    document.querySelector('.active-cart span').innerHTML = cart.length;
    document.querySelector('.my-cart h5 span').innerHTML = `(${cart.length})`;
}
