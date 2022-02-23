import { baseUrl, userMessage } from "./resources/universal.js";
import { hamburger, cartQtyDisplay } from "./components/nav.js";
import { saveUser, logOut, getUserInfo, saveUserToken } from "./components/storage.js";

hamburger();

const url = baseUrl + '/auth/local';
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
    const errorAlerts = document.querySelectorAll(".form__error"); 
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
    simpleValidation();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    logUserIn(username, password);

    async function logUserIn(username, password){
        const data = JSON.stringify({identifier: username, password: password});
        const options = {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        try {
            const response = await fetch(url, options);
            const output = await response.json();
            if(output.jwt){
                saveUser(output.user);
                saveUserToken(output.jwt);
                window.location.reload();
            } else {
                userMessage("error", `An unknown error occurred`, messageContainer);
            }
            
        } catch (errorMsg) {
            userMessage("error", `An error occurred: ${errorMsg}`, messageContainer);
        }
    }
}


logoutButton.onclick = function(){
    logOut();
}