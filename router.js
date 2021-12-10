import { home } from "./scripts/home/home.js"
import { default as initialisePage } from "./scripts/home/index.js"
import { login } from "./scripts/login/login.js"

export const router = {
    "/": {
        "html": home,
        "initialise": initialisePage,
    },
    "login": {
        "html": login,
    }
}