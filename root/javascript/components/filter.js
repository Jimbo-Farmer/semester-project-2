import { drawProductCards, editableCards } from "./draw.js";
import {getUserInfo} from "./storage.js";

function filterList(list, searchText){
    const filteredProducts= list.filter(function(item){
        if(item.title.toLowerCase().includes(searchText.toLowerCase())){
            return true;
        }
    })
    return filteredProducts;
}

export function drawFilteredProducts(list, container, url){
    const searchInput = document.querySelector("#search");
    const searchButton = document.querySelector("#search-button");
    searchInput.onkeyup = function(){
        const filteredProducts = filterList(list, searchInput.value);
        drawProductCards(filteredProducts, container, url);
        editableCards();
    }
    searchButton.onclick = function(){
        const filteredProducts = filterList(list, searchInput.value);
        drawProductCards(filteredProducts, container, url);
        editableCards();
    }
}