import { baseUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { drawProductDetails } from "./components/draw.js";
import { adjustCart, getCart } from "./components/storage.js";
const messageContainer = document.querySelector(".message-container");
const productContainer = document.querySelector(".product-container");

let cart = getCart();
cartQtyDisplay(cart);
hamburger();

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

const url = baseUrl +"/products/" +id;

(async function getProduct(){
    try {
        const response = await fetch(url);
        const product = await response.json();
        drawProductDetails(product, productContainer, baseUrl);
        const addToCartButton = document.querySelector(".product__add");
        addToCartButton.onclick = function(event){
            adjustCart(cart, product, "add");
            cartQtyDisplay(cart);           
            event.target.blur();
        }

    } catch (errorMsg) {
        userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
    }   
})();


