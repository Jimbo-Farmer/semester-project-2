export const baseUrl = "http://localhost:1337";

export function userMessage(type, content, container){
    container.innerHTML = `<div class= "message ${type}">${content}</div>`;
}

