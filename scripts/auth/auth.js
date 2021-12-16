import { API_URL } from "../home/index.js";
import * as index from "./index.js";
import * as mainIndex from "../../index.js";

export default function initialise() {

    const loginForm = document.getElementById('loginForm');
    const registerButtonLink = document.getElementById('registerButtonLink');
    const registerForm = document.getElementById('registerForm');

    loginForm.addEventListener('submit', async function (event) {
        try {
            event.preventDefault();
            const email = document.getElementById('emailLogin').value;
            const password = document.getElementById('passwordLogin').value;

            const loggedIn = await loginUser(email, password);
            
            if (loggedIn) {
                index.setLoggedIn(true);
                history.pushState(null, null, '/');
                mainIndex.app();
                return;
            }
        } catch (e) { }

        index.setLoggedIn(false);
    });


    registerButtonLink.addEventListener('click', (event) => {
        event.preventDefault();
        loginForm.style.display = "none";
        registerForm.style.visibility = 'visible';
        registerButtonLink.style.visibility = "hidden";
    });


    registerForm.addEventListener('submit', async function (event) {
        try {
            event.preventDefault();
            const name = document.getElementById('nameRegister').value;
            const username = document.getElementById('usernameRegister').value;
            const email = document.getElementById('emailRegister').value;
            const password = document.getElementById('passwordRegister').value;

            const registered = await registerUser(name, username, email, password);

            if (registered) {
                index.setLoggedIn(true);
                // TODO: redirect to login page instead to retrieve JWT
                history.pushState(null, null, '/');
                // TODO: make an event that watches the history state and appropriately calls the correct init function
                mainIndex.app();
                return;
            }
        } catch (e) { }

        index.setLoggedIn(false);
    });
}

async function loginUser(email, password) {
    try {
        const response = await fetch(API_URL + 'users/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });

        if (response.status == 200) {
            return true;
        }
    } catch (e) { }
    return false;
}

async function registerUser(name, username, email, password) {
    try {
        const response = await fetch(API_URL + 'users/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                username: username,
                email: email,
                password: password,
            })
        });

        if (response.status == 200) {
            return true;
        }
    } catch (e) { }
    return false;
}
