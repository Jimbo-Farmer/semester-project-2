import { baseUrl, productsUrl, mediaUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { drawEditableProduct, drawImageForm } from "./components/draw.js";
import { getCart, getToken, scheduleReload } from "./components/storage.js";
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

let newImageUrl;
let productImage;
let imageFormContainer;

(async function getProduct(){
    try {
        const response = await fetch(url);
        const product = await response.json();
        drawEditableProduct(product, productContainer);
        productImage = document.querySelector(".product__image");
        console.log(productImage);
        // Check if product is featured and adjust checkbox accordingly
        const featuredBox = document.querySelector("#featured");
        try {
            const featResponse = await fetch(featuredUrl);
            const featProducts = await featResponse.json();
            featProducts.forEach(featuredProduct => {
                if(featuredProduct.id === product.id){
                    featuredBox.checked = true;
                }
            })
        }
        catch(errorMsg) {
            userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
        }

        // Check if the alt text has been altered. If not, and the image is unchanged, then the put request will not contain any image-related info. 
        let altTextField = document.querySelector("#alt-text");
        let altTextaltered = false;
        altTextField.addEventListener('focus', () => {
            altTextaltered = true;
            console.log(altTextaltered)
        })
        //Update product details-------------------------------------------------
        const updateButton = document.querySelector(".product__edit");
        updateButton.onclick = function(event){
            event.preventDefault();
            const title = document.querySelector("#title").value.trim();
            const description = document.querySelector("#description").value.trim();
            const price = document.querySelector("#price").value.trim();
            const featured = document.querySelector("#featured").checked;
            const altText = document.querySelector("#alt-text").value.trim();
            const imageSrc = document.querySelector(".product__image").src;
            let data = JSON.stringify({"name": title, "description": description, "regular_price": price, "featured": featured, "images": [{"src": `${imageSrc}`,"alt":`${altText}`}]});
            if(!newImageUrl && !altTextaltered){
                data = JSON.stringify({"name": title, "description": description, "regular_price": price, "featured": featured});
            }
            
            if(isNaN(parseInt(price))){
                userMessage("error", "Please enter a number in the price field", messageContainer);
            } else if(title.length > 0 && description.length > 0 && altText.length > 0 && price){
                updateProduct(data);
            } else {
                userMessage("error", "Please complete all fields", messageContainer);
            }   
        }

        const deleteButton = document.querySelector(".product__delete");
        deleteButton.onclick = deleteProduct;
        const replaceImageButton = document.querySelector(".image-replace");

        replaceImageButton.onclick = function(){
            imageFormContainer = document.querySelector(".product__image-form");
            drawImageForm(product, imageFormContainer);
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
                    updateImage(formData)  
                }
                
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

async function updateProduct(data){
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
        console.log(updatedProduct);
        if(updatedProduct.name){
            userMessage("success", `${updatedProduct.name} has been successfully updated`, messageContainer)
            productContainer.innerHTML = ``;
            scheduleReload();
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
        console.log(updatedProduct)
        newImageUrl = updatedProduct.source_url;
        console.log(newImageUrl);
        imageFormContainer.classList.remove("open");
        imageFormContainer.innerHTML= "";
        productImage.src = newImageUrl;
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
            const response = await fetch(updatesUrl, options);
            const result = await response.json();
    
            if(result.name){
                userMessage("success", `${result.name} has been successfully deleted`, messageContainer)
                productContainer.innerHTML = ``;
                scheduleReload();
            }
        } catch (error) {
            userMessage("error", `An error occurred. Details: ${error}`, messageContainer)
        }
    } 
}





// import { baseUrl, mediaUrl, userMessage } from "./resources/universal.js";
// import { hamburger, cartQtyDisplay } from "./components/nav.js";
// import { getCart, getToken } from "./components/storage.js";
// import { drawNewImageForm } from "./components/draw.js";
// const messageContainer = document.querySelector(".message-container");
// const newProductForm = document.querySelector("#create-form");
// const header = document.querySelector("h1");

// const token = getToken();
// if(!token){
//     window.location = "index.html";
// }

// let cart = getCart();
// cartQtyDisplay(cart);
// hamburger();

// const url = baseUrl + "wp-json/wc/v3/products"
// const replaceImageButton = document.querySelector(".image-replace");
// const imageFormContainer = document.querySelector(".product__image-form");
// let newImageUrl;

// const placeHolder = document.querySelector(".placeholder");

// replaceImageButton.onclick = function(){
//     drawNewImageForm(imageFormContainer);
//     imageFormContainer.classList.add("open");
//     const imageContainer = document.querySelector(".image-container");
//     const imageForm = document.querySelector("#image-form");         
//     const imageInput = document.querySelector("#image");
//     // Display selected image
//     imageInput.addEventListener("change", ()=> {
//         const reader = new FileReader();
//         reader.addEventListener("load", ()=> {
//             imageContainer.innerHTML="";
//             imageContainer.style.backgroundImage = `url(${reader.result})`; 
//         })
//         reader.readAsDataURL(imageInput.files[0]);  
//     })
    
//     imageForm.onsubmit = function(event){
//         event.preventDefault();
//         const imageFormMessage = document.querySelector(".image-form__message")                
//         const image = imageInput.files[0];
//         const formData = new FormData();
//         formData.append("file", image); 
//         if(!image){
//             userMessage("error", `Please select an image file`, imageFormMessage);
//         } else  {
//             newImage(formData)  
//         }
        
//     };

//     const closeButton = document.querySelector(".close-button");
//     closeButton.onclick = function(){
//         imageFormContainer.innerHTML= "";
//         imageFormContainer.classList.remove("open");
//     }
// }



// newProductForm.onsubmit = function(event) {
//     event.preventDefault();
//     const title = document.querySelector("#title").value.trim();
//     const description = document.querySelector("#description").value.trim();
//     const price = document.querySelector("#price").value.trim();
//     const featured = document.querySelector("#featured").checked;
//     const altText = document.querySelector("#alt-text").value.trim();
//     const imageSrc = document.querySelector(".placeholder").src;
//     const data = JSON.stringify({"name": title, "description": description, "regular_price": price, "featured": featured, "images": [{"src": `${imageSrc}`,"alt":`${altText}`}]});
//                  JSON.stringify({"name": title, "description": description, "regular_price": price, "featured": featured, "images": [{"src": `${imageSrc}`,"alt":`${altText}`}]});
//     // formData.append("data", JSON.stringify(data));
//     const formData = new FormData();
//     formData.append("data", JSON.stringify(data));
//     if(title.length > 0 && description.length > 0 && price && newImageUrl && altText.length > 0){
//       createProduct(formData);
//     } else {
//         userMessage("error", "Please complete all fields", messageContainer);
//     }   
// }
// //add image separately via upload to media endpoint, retrieve url from response and add this url to image info on rest of request
    
// async function createProduct(data){
//     const options = {

//         method: "POST",
//         body: JSON.stringify(data),
//         headers: {
//             "Content-Type":"application/json",      //   this is removed in order to avoid an error. 
//             Authorization: `Bearer ${token}`,
//         }
//     }
//     try {
//         const response = await fetch(url, options);
//         const result = await response.json();
//         console.log(result);
//         if(result.name){
//           userMessage("success", `${result.name} created successfully`, messageContainer);
//           newProductForm.innerHTML = ``;
//           newProductForm.style.padding = "0";
//           header.style.display = "none";
//         }
//     } catch (error) {
      
//     }
// }

// async function newImage(data){
//     const options = {
//         method: "POST",
//         body: data,
//         headers: {
//             Authorization: `Bearer ${token}`,
//         }
//     };
//     try {
//         const response = await fetch(mediaUrl, options);
//         const uploadedImage = await response.json();
//         console.log(uploadedImage)
//         newImageUrl = uploadedImage.source_url;
//         imageFormContainer.classList.remove("open");
//         imageFormContainer.innerHTML= "";
//         placeHolder.src = newImageUrl;
        
//     } catch (error) {
//         userMessage("error", `An error occurred. Details: ${error}`, messageContainer)
//     }
// };