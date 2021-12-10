import { router } from "./router.js";

const app = () => {
    const root = document.getElementById('main');
    root.innerHTML = router["/"].html();
    router["/"].initialise();
}

document.addEventListener("DOMContentLoaded", app);