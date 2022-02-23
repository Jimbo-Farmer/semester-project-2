export function hamburger(){
    const hamburgerMenu = document.querySelector("#hamburger");
    const homeLink = document.querySelector("#home-link");
    const navLinks = document.querySelectorAll(".nav__link");
    hamburgerMenu.onclick = function(event){
        hamburgerMenu.classList.toggle("open");
        hamburgerMenu.parentElement.classList.toggle("expand");
        homeLink.classList.toggle("show");
        navLinks.forEach(link => link.classList.toggle("show"));
    }
}

export function cartQtyDisplay(cart){
    const cartLink = document.querySelector(".cart__link");
    let cartQty = 0
    for(let i = 0; i < cart.length; i++){
        cartQty += cart[i].qty;
    }
    if(cartQty){
        cartLink.innerHTML = `Cart [${cartQty}]`;
    } else {
        cartLink.innerHTML = `Cart`;
    }
}