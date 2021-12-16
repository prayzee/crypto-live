import * as register from "./auth.js";

export default function initialise() {
    register.default();
}

export function setLoggedIn(status) {
    sessionStorage.setItem('loggedIn', status);
}

export function isLoggedIn() {
    return sessionStorage.getItem('loggedIn');
}