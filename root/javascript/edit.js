import { baseUrl, productsUrl, mediaUrl, userMessage } from "./resources/universal.js";
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

const url = productsUrl +id;
const featuredUrl = productsUrl + "?featured=true";
const updatesUrl = baseUrl +"wp-json/wc/v3/products/" +id;




(async function getProduct(){
    try {
        const response = await fetch(url);
        const product = await response.json();
        drawEditableProduct(product, productContainer);
        const featuredBox = document.querySelector("#featured");
        console.log(product)

        try {
            const featResponse = await fetch(featuredUrl);
            const featProducts = await featResponse.json();
            console.log(featProducts)
            featProducts.forEach(featuredProduct => {
                if(featuredProduct.id === product.id){
                    featuredBox.checked = true;
                }
            })
        }
        catch {

        }
        
        //Update product details-------------------------------------------------
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

        const deleteButton = document.querySelector(".product__delete");
        deleteButton.onclick = deleteProduct;

        const replaceImageButton = document.querySelector(".image-replace");

        replaceImageButton.onclick = function(){
            const imageFormContainer = document.querySelector(".product__image-form");
            drawImageForm(product, imageFormContainer);
            imageFormContainer.classList.add("open");
            const imageContainer = document.querySelector(".image-container");
            const imageForm = document.querySelector("#image-form");         
            const imageInput = document.querySelector("#image");

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
                const image = imageInput.files[0];
                // const altText = document.querySelector("#alt-text").value.trim();
                const formData = new FormData();
                formData.append("file", image); 
                formData.append("data", JSON.stringify({}));
                updateImage(formData)
                
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
    const data = JSON.stringify({"name": title, "description": description, "regular_price": price, "featured": featured});
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
        const response = await fetch(updatesUrl, options);
        const updatedProduct = await response.json();
        console.log(updatedProduct)
        if(updatedProduct.name){
            userMessage("success", `${updatedProduct.name} has been successfully updated`, messageContainer)
            productContainer.innerHTML = ``;
        }
        
    } catch (error) {
        userMessage("error", `An error occurred. Details: ${error}`, messageContainer)
    }

};

async function updateImage(data){
    
    const options = {
        method: "POST",
        body: data,
        headers: {
            
            Authorization: `Bearer ${token}`,
        }
    };

    try {
        const response = await fetch(mediaUrl, options);
        const updatedProduct = await response.json();
        // if(updatedProduct.image){
        //     userMessage("success", `Image for ${updatedProduct.title} has been successfully updated`, messageContainer)
        //     productContainer.innerHTML = ``;
        // }
        console.log(updatedProduct);
    } catch (error) {
        userMessage("error", `An error occurred. Details: ${error}`, messageContainer)
    }
};

async function deleteProduct(){
            
    const verified = confirm("Are you sure you want to delete this product?");
    if(verified){
        const options = {
            method: "DELETE",
            headers: {Authorization: `Bearer ${token}`}
        }
        try {
            console.log(id);
            const response = await fetch(url, options);
            const result = await response.json();
    
            if(result.title){
                userMessage("success", `${result.title} has been successfully deleted`, messageContainer)
                productContainer.innerHTML = ``;
            }
        } catch (error) {
            userMessage("error", `An error occurred. Details: ${error}`, messageContainer)
        }
    } 
}