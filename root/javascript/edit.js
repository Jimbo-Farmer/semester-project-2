import { baseUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { drawEditableProduct, drawImageForm } from "./components/draw.js";
import { getCart, getToken } from "./components/storage.js";
const messageContainer = document.querySelector(".message-container");
const productContainer = document.querySelector(".product-container");

const token = getToken();
if(!token){
    window.location = "index.html";
}

let cart = getCart();
cartQtyDisplay(cart);
hamburger();

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

const url = baseUrl +"/products/" +id;

(async function getProduct(){
    try {
        const response = await fetch(url);
        const product = await response.json();
        drawEditableProduct(product, productContainer, baseUrl);
        const featuredBox = document.querySelector("#featured");
        featuredBox.checked = product.featured; 

        const updateButton = document.querySelector(".product__edit");
        updateButton.onclick = function(event){
            event.preventDefault();
            const title = document.querySelector("#title").value.trim();
            const description = document.querySelector("#description").value.trim();
            const price = document.querySelector("#price").value.trim();
            const featured = document.querySelector("#featured").checked;
            if(title.length > 0 && description.length > 0 && price){
                updateProduct(title, description, price, featured);
            } else {
                userMessage("error", "Please complete all fields", messageContainer);
            }
            
        }

        const replaceImageButton = document.querySelector(".image-replace");

        replaceImageButton.onclick = function(){
            const imageFormContainer = document.querySelector(".product__image-form");
            drawImageForm(imageFormContainer);
            imageFormContainer.classList.add("open");
            const imageForm = document.querySelector("#image-form");
            const imageInputs = document.querySelectorAll("#image-form input");
            
            
            
            imageForm.onsubmit = function(event){
                event.preventDefault();
                // const fileInput = document.querySelector("#image");
                const formData = new FormData();
                const inputData = {};               //from Oliver Dipple's code

                for(let inputElement of imageInputs){
                    switch(inputElement.type){
                        case "file":
                            for(let file of inputElement.files){
                                formData.append(`files.${inputElement.name}`, file, file.name);
                            }
                            break;
                        default: 
                            inputData[inputElement.name] = inputElement.value;
                            break;
                    }
                }
                formData.append('data', JSON.stringify(inputData));


                // formData.append("image", imageInput.files[0]);
                // formData.append("refId", 2);
                // let fileData = {};
                // formData.forEach(function(value, key){
                //    fileData[key] = value;
                // })
                // console.log(JSON.stringify(fileData));
                // console.log(fileData)
                updateImage(formData);
            };

            const closeButton = document.querySelector(".close-button");
            closeButton.onclick = function(){
                imageFormContainer.innerHTML= "";
                imageFormContainer.classList.remove("open");
            }
        }
    } catch (errorMsg) {
        userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
    }   
})();

async function updateProduct(title, description, price, featured){
    const data = JSON.stringify({"title": title, "description": description, "price": price, "featured": featured});
    console.log(data);
    const options = {
        method: "PUT",
        body: data,
        headers: {
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`,
        }
    };

    try {
        const response = await fetch(baseUrl +"/products/", options);
        const updatedProduct = await response.json();

        console.log(updatedProduct);
    } catch (error) {
        userMessage("error", `An error occurred. Details: ${error}`, messageContainer)
    }

};

async function updateImage(data){
    
    
    const options = {
        method: "PUT",
        body: data,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    };

    try {
        const response = await fetch(url, options);
        const updatedProduct = await response.json();

        console.log(updatedProduct);
    } catch (error) {
        userMessage("error", `An error occurred. Details: ${error}`, messageContainer)
    }
};