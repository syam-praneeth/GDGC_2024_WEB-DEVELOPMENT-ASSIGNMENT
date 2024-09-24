let itemsAddedCount = 0;
let itemsRemovedCount = 0;
let cartItems = [];
let totalAmount = 0;

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartInfo();
});

async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
            <button class="remove" onclick="removeFromCart(${product.id}, ${product.price})">Remove from Cart</button>
        `;

        productsContainer.appendChild(productCard);
    });
}

function addToCart(productId, productTitle, productPrice) {
    itemsAddedCount++;
    const existingItem = cartItems.find(item => item.id === productId);
    if (existingItem) {
        existingItem.count++;
        totalAmount += productPrice;
    } else {
        cartItems.push({ id: productId, title: productTitle, price: productPrice, count: 1 });
        totalAmount += productPrice;
    }
    updateCartInfo();
    updateCartDisplay();
}

function removeFromCart(productId, productPrice) {
    itemsRemovedCount++;
    const index = cartItems.findIndex(item => item.id === productId);
    if (index !== -1) {
        // Decrement the count
        if (cartItems[index].count > 1) {
            cartItems[index].count--;
            totalAmount -= productPrice;
        } else {
            totalAmount -= cartItems[index].price; 
            cartItems.splice(index, 1);
        }
    }
    updateCartInfo();
    updateCartDisplay(); 
}

function updateCartInfo() {
    document.getElementById('items-added').textContent = itemsAddedCount;
    document.getElementById('items-removed').textContent = itemsRemovedCount;
    document.getElementById('cart-items-count').textContent = cartItems.length;
    document.getElementById('cart-total-amount').textContent = totalAmount.toFixed(2);
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; 
    let total = 0;

    cartItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <p>${item.title} - $${item.price.toFixed(2)} (x${item.count})</p>
            <button onclick="removeItemFromCart(${item.id}, ${item.price})">Remove</button>
        `;
        cartItemsContainer.appendChild(itemDiv);
        total += item.price * item.count; 
    });

    document.getElementById('cart-total').innerText = total.toFixed(2);
}

function removeItemFromCart(productId, productPrice) {
    const index = cartItems.findIndex(item => item.id === productId);
    if (index !== -1) {
        if (cartItems[index].count > 1) {
            cartItems[index].count--;
            totalAmount -= productPrice;
        } else {
            totalAmount -= cartItems[index].price;
            cartItems.splice(index, 1); 
        }
    }
    updateCartDisplay();
    updateCartInfo();
}

function placeOrder() {
    if (cartItems.length > 0) {
        alert(`Order placed successfully! Total Amount: $${totalAmount.toFixed(2)}`);
        cartItems = [];
        totalAmount = 0;
        itemsAddedCount = 0;
        itemsRemovedCount = 0;
        updateCartInfo();
        updateCartDisplay(); 
    } else {
        alert("Your cart is empty!");
    }
}
