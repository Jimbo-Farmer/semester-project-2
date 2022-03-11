import { userMessage } from "../resources/universal.js";
import { getUserInfo } from "./storage.js";

export function drawProductCards(list, container){
    container.innerHTML = "";
    if(list.length === 0){
        userMessage("info", "No products to display", container);
    } else {
        list.forEach(product => {
            container.innerHTML += 
            `<div class="product__card" data-id=${product.id}>
                <div class="product__image-container">
                    <img class="product__image"  src="${product.images[0].src}" alt="${product.images[0].alt}">
                </div>
                <h2>${product.name}</h2>
                <p class="product__price">kr ${parseInt(product.prices.price)}</p>
                <a class="product__cta" href="detail.html?id=${product.id}">More</a>
            </div>`;
        })
    }   
}

export function drawProductDetails(product, container){
    document.title = `Kicks | ${product.name}`
    container.innerHTML = 
    `<h1>${product.name}</h1>
    <div class="product__details">
        <img class="product__image"  src="${product.images[0].src}" alt="${product.images[0].alt}">
        <div class="product__info">
            <p class="product__description">${product.description.slice(0, -4).substring(3)}</p>
            <p class="product__price">kr ${parseInt(product.prices.price).toFixed(2)}</p>
            <button class="product__cta product__add">Add to cart</button>
            <img id="add-feedback" src="./images/logo-bare.svg" alt="logo to give feedback that item has been added">
        </div>
    </div>`;
}

export function editableCards(){
    const user = getUserInfo();
        if(user){
            const productCards = document.querySelectorAll(".product__card");
            productCards.forEach(card => {
                card.innerHTML += `<a class="product__card-edit" href="edit.html?id=${card.dataset.id}">Edit</a>`
            })
        } 
}

export function drawEditableProduct(product, container){
    document.title = `Edit | ${product.name}`;
    container.innerHTML = 
    `
    <form id="edit-form" action="">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" value="${product.name}"/>
        <div class="form__product-details">
            <img class="product__image"  src="${product.images[0].src}" alt="${product.images[0].alt}">
            <button type="button" class="product__cta image-replace">Replace Image</button>
            <div class="product__info">
                <label for="alt-text">Image Alternative Text</label>
                <input type="text" id="alt-text" name="alt-text" value="${product.images[0].alt}"/>
                <label for="description">Description</label>
                <textarea id="description" name="description" cols="30" rows="10">${product.description.slice(0, -4).substring(3)}</textarea>  
                <label for="price">Price (NOK)</label>
                <input type="text" id="price" name="price" value="${parseInt(product.prices.price).toFixed(2)}"/>
                <label for="featured">Featured</label>
                <input type="checkbox" id="featured" name="featured"/>
                <button type="submit" class="product__cta product__edit">Update</button>
                <button type="button" class="product__cta product__delete">Delete</button>
            </div>
        </div>
    </form>
    <div class="product__image-form"></div>`;    
}

export function drawImageForm(product, container){
    const image = product ? product.images[0].src : "";
    const altText = product ? product.images[0].alt : "";
    container.innerHTML = 
    `<form id="image-form" action="">
        <div class="image-form__message"></div>
        <div class="image-container">
            <img class="product__image" id="image-preview" src="${image}" alt="${altText}">
        </div>
        <label for="image">Select Image File</label>
        <input type="file" id="image" name="image"/>
        <button type="submit" class="product__cta image-upload">Upload</button>
        <button type="button" class="close-button">Close X</button>
    </form>`;    
}
 