import { drawProductCards, editableCards } from "./draw.js";


function filterList(list, searchText){
    const filteredProducts= list.filter(function(item){
        if(item.name.toLowerCase().includes(searchText.toLowerCase())){
            return true;
        }
    })
    return filteredProducts;
}

export function drawFilteredProducts(list, container){
    const searchInput = document.querySelector("#search");
    const searchButton = document.querySelector("#search-button");
    searchInput.onkeyup = function(){
        const filteredProducts = filterList(list, searchInput.value);
        drawProductCards(filteredProducts, container);
        editableCards();
    }
    searchButton.onclick = function(){
        const filteredProducts = filterList(list, searchInput.value);
        drawProductCards(filteredProducts, container);
        editableCards();
    }
}