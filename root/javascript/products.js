import { baseUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { drawProductCards, editableCards } from "./components/draw.js";
import { getCart } from "./components/storage.js";
import { drawFilteredProducts} from "./components/filter.js";

let cart = getCart();
cartQtyDisplay(cart);
hamburger();

const messageContainer = document.querySelector(".message-container");
const productsContainer = document.querySelector(".products-container");
const productUrl = baseUrl + "/products";

(async function getProducts(){
    try {
        const response = await fetch(productUrl);
        const products = await response.json();
        
        drawProductCards(products, productsContainer, baseUrl);
        drawFilteredProducts(products, productsContainer, baseUrl);
        editableCards();
    } catch (errorMsg) {
        userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
    }
})();


