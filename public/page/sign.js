import {html, render} from 'lit-html';
import { router } from '../script/routing';

const _onLogin = {
    handleEvent(event){
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        fetch('/Login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password:password})
        }).then((response) => response.json())
        .then((data) => {
            if(data.status === 'Nonexistent'){
                document.getElementById('login-username').value = '';
                document.getElementById('login-username').placeholder = 'Wrong Username';
                document.getElementById('login-password').value = '';
                document.getElementById('login-password').placeholder = 'Password';
            } else if(data.status === 'Wrong Password'){
                document.getElementById('login-username').value = '';
                document.getElementById('login-username').placeholder = 'Username';
                document.getElementById('login-password').value = '';
                document.getElementById('login-password').placeholder = 'Wrong Password';
            } else if(data.status === 'Successful'){
                localStorage.setItem('username', username);
                router.navigate('/Profile/' + username);
            }
        }).catch((err) => {
            console.log('Error while login');
            console.error(err);
        })
    }
}

const _onRegister = {
    handleEvent(event){
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const firstName = document.getElementById('register-firstName').value;
        const secondName = document.getElementById('register-secondName').value;
        const alert = document.getElementById('sign-alert');
        let validateFields = validateRegistration(username, password, firstName, secondName);
        if(!validUsername){
            alert.innerText = 'Username taken';
            return;
        }
        if(!validateFields){
            alert.innerText = 'Please fill all fields';
            return;
        }
        
        alert.innerText = '';
        fetch('/Register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password:password, firstName:firstName, secondName:secondName})
        }).then((response) => response.json())
        .then((data) => {
            if(data.status === 'ok'){
                localStorage.setItem('username', username);
                router.navigate('/Profile/' + username);
            }
        }).catch((err) => {
            console.log('Error while login');
            console.error(err);
        })
    }
}
const _onUsernameChange = {
    handleEvent(event){
        const username = document.getElementById('register-username').value;
        debounce(username);
    }
}
function validateRegistration(username, password, firstName, secondName){
    if(username.length < 1 || password.length < 1 || firstName.length < 1 || secondName.length < 1){
        return false;
    }
    return true;
}
let validUsername = true;
function validateUsername(username){
    fetch('/Register?' + new URLSearchParams({
        username: username
    })).then((response)=> response.json())
    .then((data) => {
        console.log(data.status);
        if(data.status === 'Existent'){
            document.querySelector('.fa-check').style.visibility = 'hidden';
            document.querySelector('.fa-times').style.visibility = 'visible';
            validUsername = false;
        } else if(data.status === 'Nonexistent'){
            document.querySelector('.fa-check').style.visibility = 'visible';
            document.querySelector('.fa-times').style.visibility = 'hidden';
            validUsername = true;
        }
    })
    .catch((err)=> console.log(err))
}
let timer = 0;
const delay = 1000;
function debounce(username){
    if(timer){
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        validateUsername(username);  
    }, delay);
}
const _chooseLogin = {
    handleEvent(event){
        changeForm();
        document.querySelector('.login-form').style.left = "0%";
        document.querySelector('.register-form').style.left = "100%";
    }
}
const _chooseRegister = {
    
    handleEvent(event){
        changeForm(); 
        document.querySelector('.login-form').style.left = "-100%";
        document.querySelector('.register-form').style.left = "0%";
    }
}
function changeForm(){
    const login = document.querySelectorAll('.sign-title')[0];
    const register = document.querySelectorAll('.sign-title')[1];
    login.classList.toggle('chosen');
    register.classList.toggle('chosen');
}
const _showPassword = {
    handleEvent(e){
        document.getElementById('register-password').type = 'text';
        document.querySelector('.fa-eye').style.display = 'block';
        document.querySelector('.fa-eye-slash').style.display = 'none';
    }
}
const _hidePassword = {
    handleEvent(e){
        document.getElementById('register-password').type = 'password';
        document.querySelector('.fa-eye').style.display = 'none';
        document.querySelector('.fa-eye-slash').style.display = 'block';
    }
}
export const signTemplate = html`
<section class="login-section">
    <div class="container">
        <div class="login-items">
          
            <div class="sign-form">
                <div class="sign-navigation"> 
                    <button @click="${_chooseLogin}" class="sign-title chosen">Login</button>
                    <button @click="${_chooseRegister}" class="sign-title">Register</button>
                </div>
                <div class="form-changer">
                    <div class="login-form">
                        <input type="text" class="sign-input" name="login-username" id="login-username" placeholder="Username" spellcheck="false"/>
                        <input type="password" class="sign-input" name="login-password" id="login-password" placeholder="Password" spellcheck="false"/>
                        <button @click=${_onLogin} class="app-button" id="sign-in">Login</button>
                    </div>
                    <div class="register-form">
                        <div class="username-box">
                            <input @input="${_onUsernameChange}"type="text" class="sign-input" name="register-username" id="register-username" placeholder="Username" spellcheck="false"/>
                            <i class="fas fa-check"></i>
                            <i class="fas fa-times"></i>
                        </div>
                        <div class="password-box">
                            <input type="password" class="sign-input" name="register-password" id="register-password" placeholder="Password" spellcheck="false"/>
                            <i @click=${_hidePassword} class="fas fa-eye"></i>
                            <i @click=${_showPassword} class="fas fa-eye-slash"></i>
                        </div>
                        <input type="text" class="sign-input" name="register-firstName" id="register-firstName" placeholder="Name" spellcheck="false"/>
                        <input type="text" class="sign-input" name="register-secondName" id="register-secondName" placeholder="Second Name" spellcheck="false"/>
                        <button @click=${_onRegister} class="app-button" id="register">Register</button>
                        <p id="sign-alert"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
`;

{/* <div class="login-background">
</div> */}



