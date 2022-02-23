import { userMessage } from "../resources/universal.js";
import { getUserInfo } from "./storage.js";

export function drawProductCards(list, container, url){
    container.innerHTML = "";
    if(list.length === 0){
        userMessage("info", "No products to display", container);
    } else {
        list.forEach(product => {
            container.innerHTML += 
            `<div class="product__card" data-id=${product.id}>
                <img class="product__image"  src="${url}${product.image.url}" alt="${product.image.alternativeText}">
                <h2>${product.title}</h2>
                <p class="product__price">$${product.price.toFixed(2)}</p>
                <a class="product__cta" href="detail.html?id=${product.id}">More</a>
            </div>`;
        })
    }   
}

export function drawProductDetails(product, container, url){
    document.title = `Kicks | ${product.title}`
    container.innerHTML = 
    `<h1>${product.title}</h1>
    <div class="product__details">
        <img class="product__image"  src="${url}${product.image.url}" alt="${product.image.alternativeText}">
        <div class="product__info">
            <p class="product__description">${product.description}</p>
            <p class="product__price">$${product.price.toFixed(2)}</p>
            <button class="product__cta product__add">Add to cart</button>
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

export function drawEditableProduct(product, container, url){
    document.title = `Edit | ${product.title}`
    container.innerHTML = 
    `
    <form id="edit-form" action="">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" value="${product.title}"/>
        <div class="form__product-details">
            <img class="product__image"  src="${url}${product.image.url}" alt="${product.image.alternativeText}">
            <button type="button" class="product__cta image-replace">Replace Image</button>
            <div class="product__info">
                <label for="description">Description</label>
                <textarea id="description" name="description" cols="30" rows="10">${product.description}</textarea>
                <label for="price">Price ($)</label>
                <input type="text" id="price" name="price" value="${product.price.toFixed(2)}"/>
                <label for="featured">Featured</label>
                <input type="checkbox" id="featured" name="featured"/>
                <button type="submit" class="product__cta product__edit">Update</button>
                <button class="product__cta product__delete">Delete</button>
            </div>
        </div>
    </form>
    <div class="product__image-form"></div>`;    
}

export function drawImageForm(container){
    container.innerHTML = 
    `<form id="image-form" action="">
        <label for="image">Select Image File</label>
        <input type="file" id="image" name="image"/>
        <label for="alt-text">Alt Text</label>
        <input type="text" id="alt-text" name="alternativeText"/>
        <button type="submit" class="product__cta image-upload">Upload</button>
        <button type="button" class="close-button">Close X</button>
    </form>`;    
}

export function drawCreateProduct(product, container, url){
    document.title = `Edit | ${product.title}`
    container.innerHTML = 
    `
    <h1>Create new product</h1>
    <form id="create-form" action="">
        <label for="title">Title</label>
        <input type="text" id="title" name="title"/>
        <div class="form__product-details">
            <label for="image">Image</label>
            <input type="file" id="image" name="image"/>
            <div class="product__info">
                <label for="description">Description</label>
                <textarea id="description" name="description" cols="30" rows="10"></textarea>
                <label for="price">Price ($)</label>
                <input type="text" id="price" name="price"/>
                <label for="featured">Featured</label>
                <input type="checkbox" id="featured" name="featured"/>
                <button class="product__cta product__edit">Update</button>
                <button class="product__cta product__delete">Delete</button>
            </div>
        </div>
    </form>`;    
}


{/* <label for="image">Replace Image</label>
            <input type="file" id="image" name="image"/> */}