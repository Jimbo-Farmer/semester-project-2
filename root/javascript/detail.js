import { productsUrl, userMessage } from "./resources/universal.js";
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
const url = productsUrl + id;

(async function getProduct(){
    try {
        const response = await fetch(url);
        const product = await response.json();
        productContainer.classList.remove("loading");
        drawProductDetails(product, productContainer);
        const addToCartButton = document.querySelector(".product__add");
        const addFeedback = document.querySelector("#add-feedback");
        addFeedback.style.top = addToCartButton.offsetTop+"px";
        addFeedback.style.left = addToCartButton.offsetLeft+addToCartButton.offsetWidth+-30+"px";
        addToCartButton.onclick = function(event){
            addFeedback.style.left = addToCartButton.offsetLeft+addToCartButton.offsetWidth+30+"px";;
            setTimeout(() => {addFeedback.style.left = addToCartButton.offsetLeft+addToCartButton.offsetWidth-30+"px"}, 500); 
            adjustCart(cart, product, "add");
            cartQtyDisplay(cart);           
            event.target.blur();
        }
    } catch (errorMsg) {
        userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
    }   
})();



