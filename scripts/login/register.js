import { API_URL } from "../home/index.js";

export default function initialise() {
    const register = document.getElementById('registerForm');

    register.addEventListener('submit', async function(event) {
        try {
            event.preventDefault();
            const fName = document.getElementById('fName').value;
            const lName = document.getElementById('lName').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
    
            await registerUser(fName, lName, username, email, password);
        } catch (e) {
            console.log(e);
        }

    });
}

async function registerUser(fName, lName, username, email, password) {
    try {
        const response = await fetch(API_URL + 'users/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fName: fName,
                lName: lName,
                username: username,
                email: email,
                password: password,
            })
        });
    } catch(e) {
        console.log(e);
    }
}