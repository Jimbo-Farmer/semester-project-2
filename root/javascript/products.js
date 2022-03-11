import { productsUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { drawProductCards, editableCards } from "./components/draw.js";
import { getCart, doProductsReload } from "./components/storage.js";
import { drawFilteredProducts} from "./components/filter.js";

doProductsReload();

let cart = getCart();
cartQtyDisplay(cart);
hamburger();

const messageContainer = document.querySelector(".message-container");
const productsContainer = document.querySelector(".products-container");

(async function getProducts(){
    try {
        const response = await fetch(productsUrl);
        const products = await response.json();
        productsContainer.classList.remove("loading");
        drawProductCards(products, productsContainer);
        drawFilteredProducts(products, productsContainer);
        editableCards();
        const images = document.querySelectorAll(".product__image")
        images.forEach((image) => {
            image.addEventListener("click", function(event){
                const id = event.target.parentElement.parentElement.dataset.id;
                document.location = "detail.html?id="+id;
            })
        })
    } catch (errorMsg) {
        userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
    }
})();


