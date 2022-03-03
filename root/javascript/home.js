import { mediaUrl, productsUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { drawProductCards } from "./components/draw.js";
import { getCart, doHomeReload } from "./components/storage.js";

hamburger();
let cart = getCart();
cartQtyDisplay(cart);


doHomeReload();

const heroContainer = document.querySelector(".hero-container");
const messageContainer = document.querySelector(".message-container");
const featuredContainer = document.querySelector(".featured-container");

(async function getBanner(){
    try {
        const response = await fetch(mediaUrl);
        const output = await response.json();
        output.forEach(item => {
            if(item.title.rendered === "banner"){
                heroContainer.innerHTML = `<img src="${item.source_url}" alt="${item.alt_text}">`
            }
        });

    } catch (errorMsg) {
        userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
    }
})();


const featuredUrl = productsUrl +"?featured=true";

(async function getFeatured(){
    try {
        const response = await fetch(featuredUrl);
        const output = await response.json();
        featuredContainer.classList.remove("loading");
        if(output.length === 0){
            featuredContainer.innerHTML = "No featured items";
        } else {
            drawProductCards(output, featuredContainer);
        }
        
    } catch (errorMsg) {
        userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
    }
})();





