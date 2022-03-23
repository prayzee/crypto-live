function setCookie(cname, cvalue) {
    document.cookie = cname + '=' + cvalue + ';';
}

function getCookie(cname) {
    const cookies = document.cookie.split('; ');
    for(cookie of cookies) {
        const [name, value] = cookie.split('=');
        if(name == cname) {
            return value;
        }
    }
}