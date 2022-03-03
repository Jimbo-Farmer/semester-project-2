import { baseUrl, mediaUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { getCart, getToken, scheduleReload } from "./components/storage.js";
import { drawNewImageForm } from "./components/draw.js";
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

const url = baseUrl + "wp-json/wc/v3/products"
const replaceImageButton = document.querySelector(".image-replace");
const imageFormContainer = document.querySelector(".product__image-form");
let newImageUrl;

const placeHolder = document.querySelector(".placeholder");

replaceImageButton.onclick = function(){
    drawNewImageForm(imageFormContainer);
    imageFormContainer.classList.add("open");
    const imageContainer = document.querySelector(".image-container");
    const imageForm = document.querySelector("#image-form");         
    const imageInput = document.querySelector("#image");
    // Display selected image
    imageInput.addEventListener("change", ()=> {
        const reader = new FileReader();
        reader.addEventListener("load", ()=> {
            imageContainer.innerHTML="";
            imageContainer.style.backgroundImage = `url(${reader.result})`; 
        })
        reader.readAsDataURL(imageInput.files[0]);  
    })
    
    imageForm.onsubmit = function(event){
        event.preventDefault();
        const imageFormMessage = document.querySelector(".image-form__message")                
        const image = imageInput.files[0];
        const formData = new FormData();
        formData.append("file", image); 
        if(!image){
            userMessage("error", `Please select an image file`, imageFormMessage);
        } else  {
            newImage(formData)  
        } 
    };
    const closeButton = document.querySelector(".close-button");
    closeButton.onclick = function(){
        imageFormContainer.innerHTML= "";
        imageFormContainer.classList.remove("open");
    }
}

newProductForm.onsubmit = function(event) {
    event.preventDefault();
    const title = document.querySelector("#title").value.trim();
    const description = document.querySelector("#description").value.trim();
    const price = document.querySelector("#price").value.trim();    
    const featured = document.querySelector("#featured").checked;
    const altText = document.querySelector("#alt-text").value.trim();
    const imageSrc = document.querySelector(".placeholder").src;
    const data = {"name": title, "description": description, "regular_price": price, "featured": featured, "images": [{"src": `${imageSrc}`,"alt":`${altText}`}]};
    
    if(isNaN(parseInt(price))){
        userMessage("error", "Please enter a number in the price field", messageContainer);
    } else if(title.length > 0 && description.length > 0 && price && newImageUrl && altText.length > 0){
      createProduct(data);
    } else {
        userMessage("error", "Please complete all fields", messageContainer);
    }   
}
//add image separately via upload to media endpoint, retrieve url from response and add this url to image info on rest of request
    
async function createProduct(data){
    const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type":"application/json",      //   this is removed in order to avoid an error. 
            Authorization: `Bearer ${token}`,
        }
    }
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        if(result.name){
            userMessage("success", `${result.name} created successfully`, messageContainer);
            newProductForm.innerHTML = ``;
            newProductForm.style.padding = "0";
            header.style.display = "none";
            scheduleReload();
        }
    } catch (error) {
        userMessage("error", `An error occurred. Details: ${error}`, messageContainer);
    }
}

async function newImage(data){
    const options = {
        method: "POST",
        body: data,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    try {
        const response = await fetch(mediaUrl, options);
        const uploadedImage = await response.json();
        console.log(uploadedImage)
        newImageUrl = uploadedImage.source_url;
        imageFormContainer.classList.remove("open");
        imageFormContainer.innerHTML= "";
        placeHolder.src = newImageUrl;
        
    } catch (error) {
        userMessage("error", `An error occurred. Details: ${error}`, messageContainer)
    }
};