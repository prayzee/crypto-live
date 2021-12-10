import { router } from "./router.js";

const app = () => {
    let location = document.location.pathname;
    let route = router[document.location.pathname];

    typeAnimatedText();
    
    if(route === undefined) {
        location = '/';
        route = router["/"];
    }

    history.pushState(null, null, location);

    const main = document.getElementById('main');
    const animatedText = document.getElementById('animatedText');

    main.innerHTML = route.html;
    route.initialise();

    setTimeout(function () {
        animatedText.style.display = "none";
        main.style.display = "block";
    }, 2500);
}

function typeAnimatedText() {
    // main display currently set to none - turn typed text on
    animatedText.style.fontSize = "100px";
    animatedText.style.alignItems = "center";
    animatedText.style.textAlign = "center";
    animatedText.style.justifyContent = "center";
    animatedText.style.display = "flex";
    animatedText.style.minHeight = "100vh";

    let toType = "Cryptocurrency Prices. Live.";
    let i = 0;

    const type = () => {
        if (i < toType.length) {
            let prev = animatedText.innerHTML;
            animatedText.innerHTML += toType.charAt(i) + "|";
            setTimeout(() => {
                animatedText.innerHTML = prev + toType.charAt(i);
                i++;
            }, 50)
            setTimeout(type, 50);
        }
    }
    type();
}

document.addEventListener("DOMContentLoaded", app);