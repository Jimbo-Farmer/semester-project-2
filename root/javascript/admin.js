import { loginUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { saveUser, logOut, getUserInfo, saveUserToken, getCart } from "./components/storage.js";

hamburger();
let cart = getCart();
cartQtyDisplay(cart);

const messageContainer = document.querySelector(".message-container");
const adminLinks = document.querySelector(".admin-links");
const logoutButton = document.querySelector("#logout");

const form = document.querySelector("form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");

const user = getUserInfo();
if(user){
    form.classList.add("hidden");
    adminLinks.classList.remove("hidden");
} 

function simpleValidation(){
    const inputs = document.querySelectorAll("form input");
    const errorAlerts = document.querySelectorAll(".form__error")
    for(let i = 0; i < inputs.length; i++){
        if(!inputs[i].value.length){
            errorAlerts[i].classList.remove("hidden");
        } else {
            errorAlerts[i].classList.add("hidden");
        }    
    }
}

form.onsubmit = function(event){
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    simpleValidation();
    if(username && password){
        logUserIn(username, password);
    }
    
    async function logUserIn(username, password){
        const data = JSON.stringify({username: username, password: password});
        const options = {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        try {
            const response = await fetch(loginUrl, options);
            const output = await response.json();
            console.log(output)
            if(output.data.token){
                saveUser(output.data.nicename);
                saveUserToken(output.data.token);
                window.location.reload();
            } else {
                userMessage("error", `An error occurred: ${output.code}`, messageContainer);
            }
            
        } catch (errorMsg) {
            userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
        }
    }
}


logoutButton.onclick = function(){
    logOut();
}