import * as home from "./scripts/home/home.js"
import * as homeIndex from "./scripts/home/index.js"

import * as login from "./scripts/auth/login.js"
import * as loginIndex from "./scripts/auth/index.js"

export const router = {
    "/": {
        "html": home.home,
        "initialise": homeIndex.default,
    },
    "/login": {
        "html": login.login,
        "initialise": loginIndex.default,
    },
}