import { baseUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { drawProductCards } from "./components/draw.js";
import { getCart } from "./components/storage.js";

hamburger();
let cart = getCart();
cartQtyDisplay(cart);


const heroContainer = document.querySelector(".hero-container");
const messageContainer = document.querySelector(".message-container");
const featuredContainer = document.querySelector(".featured-container");

const heroUrl = baseUrl + "/home";
const productUrl = baseUrl + "/products";


(async function getBanner(){
    try {
        const response = await fetch(heroUrl);
        const output = await response.json();
        heroContainer.innerHTML = `<img src="${baseUrl}${output.hero_banner.url}" alt="${output.hero_banner.alternativeText}">`;

    } catch (errorMsg) {
        userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
    }
})();

(async function getFeatured(){
    try {
        const response = await fetch(productUrl);
        const output = await response.json();
        let featuredList = [];
        for(let i= 0; i < output.length; i++){
            if(output[i].featured){
                featuredList.push(output[i]);
            }
        }
        if(featuredList.length === 0){
            featuredContainer.innerHTML = "No featured items";
        } else {
            drawProductCards(featuredList, featuredContainer, baseUrl);
        }
        
    } catch (errorMsg) {
        userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
    }
})();





