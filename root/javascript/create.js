import { baseUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { getCart, getToken } from "./components/storage.js";
const messageContainer = document.querySelector(".message-container");
const newProductForm = document.querySelector("#create-form");
const header = document.querySelector("h1");

const token = getToken();
if(!token){
    window.location = "index.html";
}

let cart = getCart();
cartQtyDisplay(cart);
hamburger();

const url = baseUrl +"/products/";

newProductForm.onsubmit = function(event) {
    event.preventDefault();
    const title = document.querySelector("#title").value.trim();
    const description = document.querySelector("#description").value.trim();
    const price = document.querySelector("#price").value.trim();
    const featured = document.querySelector("#featured").checked;
    const image = document.querySelector("#image").files[0];
    if(!image){
      userMessage("error", "Please select an image file", messageContainer);  
    }
    const formData = new FormData();
    formData.append("files.image", image, image.name); 
    const data = {"title": title, "description": description, "price": price, "featured": featured};
    formData.append("data", JSON.stringify(data));
    
    if(title.length > 0 && description.length > 0 && price){
      createProduct(formData);
    } else {
        userMessage("error", "Please complete all fields", messageContainer);
    }   
}
    
async function createProduct(formData){
    const options = {
        method: "POST",
        body: formData,
        headers: {
            // "Content-Type":"application/json",         this is removed in order to avoid an error. 
            Authorization: `Bearer ${token}`,
        }
    }
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        if(result.title){
          userMessage("success", `${result.title} created successfully`, messageContainer);
          newProductForm.innerHTML = ``;
          newProductForm.style.padding = "0";
          header.style.display = "none";
        }
    } catch (error) {
      
    }
}
