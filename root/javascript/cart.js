import { baseUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { adjustCart, getCart } from "./components/storage.js";

hamburger();
let cart = getCart();
cartQtyDisplay(cart);

const cartContainer = document.querySelector(".cart-container");

if(!cart.length){
    userMessage("info", "Your cart is empty", cartContainer);            
} else {
    drawCart(cart, cartContainer, baseUrl);
}

function drawCart(cart, container, url){
    container.innerHTML = ``;
    let totalPrice = 0;
    cart.forEach(item => {
        let image;
        let altText;
        if(!(item.image)){
            image = item.image_url;
            altText = item.alternativeText;
        } else {
            image = url + item.image.url;
            altText = item.image.alternativeText;
        }
        container.innerHTML += `
        <div class="cart-item">
            <div class="cart-item__thumbnail">
                <img src="${image}" alt="${altText}"></img>
            </div>
            <div class="cart-item__details">
                <h2>${item.title}</h2>
                <p class="cart__price">Price $${item.price.toFixed(2)}</p>
                <p class="cart__quantity">Quantity <span class="quantity__minus" data-id=${item.id}>-</span>${item.qty}<span class="quantity__plus" data-id=${item.id}>+</span>
                <div class="cart__details-link"><a href="detail.html?id=${item.id}">Details</a></div>
            </div>
        </div>`
        totalPrice += (item.qty*item.price);
    })
    container.innerHTML += `
    <div class="cart__total">Total $${totalPrice.toFixed(2)}</div>
    <a class="cart__checkout-link" href="">Proceed to checkout</a>
    `

    const addButtons = document.querySelectorAll(".quantity__plus");
    addButtons.forEach(button => {
        button.addEventListener("click", function(event){
            adjustCart(cart, event.target.dataset, "add");
            cartQtyDisplay(cart);
            drawCart(cart, cartContainer, baseUrl);
            
        })
    })

    const removeButtons = document.querySelectorAll(".quantity__minus");
    removeButtons.forEach(button => {
        button.addEventListener("click", function(event){
            adjustCart(cart, event.target.dataset, "remove");
            drawCart(cart, cartContainer, baseUrl);
            cartQtyDisplay(cart);
            if(!cart.length){
                userMessage("info", "Your cart is empty", cartContainer);
            }
        })
    })

    
    
}