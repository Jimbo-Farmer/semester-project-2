import { mediaUrl } from "../resources/universal.js";
import { getToken } from "./storage.js";
import { userMessage } from "../resources/universal.js";

export async function deleteProductImage(imageId){   
    const token = getToken(); 
    const messageContainer = document.querySelector(".message-container");
    const productContainer = document.querySelector(".product-container"); 
    const options = {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}`}
    }
    try {
        const response = await fetch(mediaUrl+`/${imageId}?force=true`, options);
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