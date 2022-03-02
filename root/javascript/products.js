import { productsUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { drawProductCards, editableCards } from "./components/draw.js";
import { getCart } from "./components/storage.js";
import { drawFilteredProducts} from "./components/filter.js";



let cart = getCart();
cartQtyDisplay(cart);
hamburger();

const messageContainer = document.querySelector(".message-container");
const productsContainer = document.querySelector(".products-container");

(async function getProducts(){
    try {
        const response = await fetch(productsUrl);
        const products = await response.json();
        console.log(products);
        products.forEach(element => {
            console.log(element)
        });
        
        drawProductCards(products, productsContainer);
        // drawFilteredProducts(products, productsContainer, baseUrl);
        editableCards();
    } catch (errorMsg) {
        userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
    }
})();


