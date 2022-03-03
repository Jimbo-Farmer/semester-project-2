// Cart Storage---------------------------------------------------------------
const cartKey = 'cart';

export function getCart(){
    if(!getFromStorage(cartKey)){
        return [];
    }
    else {return getFromStorage(cartKey)};
}

export function adjustCart(cart, product, adjustment){
    let inCart = false;                                 //Assume not in cart
    for(let i = 0; i < cart.length; i++){            
        if(cart[i].id === parseInt(product.id)){        //Check if in cart. ParseInt required for checking against dataset values. 
            if(adjustment === "add"){
                cart[i].qty += 1;
            } else if (adjustment === "remove"){
                cart[i].qty -= 1;
                if(cart[i].qty === 0){
                    cart.splice(i, 1);
                }
            } 
            updateCart(cart);
            inCart = true;                              //Set in cart to true                            
            break;
        }
    }
    if(!inCart){                    
        product.qty = 1;
        cart.push(product);
        updateCart(cart);  
    }
} 

function updateCart(item){
    savetoStorage(cartKey, item);
}

// User Storage-----------------------------------------------------------------------
const jwtKey = 'token';
const userKey = 'user';

export function saveUser(userInfo){
    savetoStorage(userKey, userInfo);
}

export function saveUserToken(token){
    savetoStorage(jwtKey, token);
}

export function getToken(){
    return getFromStorage(jwtKey);
}

export function getUserInfo(){
    return getFromStorage(userKey);
}

export function logOut(){
    localStorage.removeItem(userKey);
    localStorage.removeItem(jwtKey);
    location.reload();
}

// Hacky way of reloading pages to update with new product or edited product

export function scheduleReload(){
    savetoStorage("reloadHome", true);
    savetoStorage("reloadProducts", true);
}

export function doHomeReload(){
    if(getFromStorage("reloadHome")){
        localStorage.removeItem("reloadHome");
        document.location.reload(true);
    }  
}

export function doProductsReload(){
    if(getFromStorage("reloadProducts")){
        localStorage.removeItem("reloadProducts");
        document.location.reload(true);
    }  
}

// generic save and retrieve functions------------------------------------------------

function savetoStorage(key, value){
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key){
    const item = localStorage.getItem(key);
    if(!item){
        return null;
    }
    return JSON.parse(item);
}