export const baseUrl = "https://frontendfarmer.com/semester_project_ii/"
export const productsUrl = "https://frontendfarmer.com/semester_project_ii/wp-json/wc/store/products/"
export const mediaUrl = "https://frontendfarmer.com/semester_project_ii/wp-json/wp/v2/media"
export const loginUrl = "https://frontendfarmer.com/semester_project_ii/wp-json/jwt-auth/v1/token"

export function userMessage(type, content, container){
    container.innerHTML = `<div class= "message ${type}">${content}</div>`;
}

