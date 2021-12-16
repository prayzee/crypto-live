export const login =
    `   
        <div id="auth" class="auth">
            <form id="loginForm" class="loginForm">
                <label for="emailLogin"> Username </label>
                <input type="text" id="emailLogin" class="emailLogin">
                
                <label for="passwordLogin"> Password </label>
                <input type="password" id="passwordLogin" class="passwordLogin">

                <button type="submit" id="loginButton"> Login </button>
            </form>
            
            <button id="registerButtonLink" class="registerButtonLink" type="text"> Register </button>

            <form id="registerForm" class="registerForm" style="visibility: hidden;">
                <label for="nameRegister"> First Name </label>
                <input type="text" id="nameRegister" class="nameRegister">
    
                <label for="usernameRegister"> Username </label>
                <input type="text" id="usernameRegister" class="usernameRegister">
                
                <label for="emailRegister"> Email </label>
                <input type="email" id="emailRegister" class="emailRegister">
                
                <label for="passwordRegister"> Password </label>
                <input type="password" id="passwordRegister" class="passwordRegister">
    
                <button type="submit" id="registerButton"> Register </button>
            </form>
        </div>
    `
;