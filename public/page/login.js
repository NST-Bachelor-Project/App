import {html, render} from 'lit-html';
import { router } from '../script/routing';

const _onLogin = {
    handleEvent(event){
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        fetch('/LoginCheck', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password:password})
        }).then((response) => response.json())
        .then((data) => {
            if(data.status === 'Nonexistent'){
                document.getElementById('username').value = '';
                document.getElementById('username').palceholder = 'Wrong Username';
            } else if(data.status === 'Wrong Password'){
                document.getElementById('password').value = '';
                document.getElementById('password').palceholder = 'Wrong Password';
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

export const loginTemplate = html`
<section class="login-section">
    <div class="container">
        <div class="login-items">
            <div class="login-background">
            </div>
            <div class="login-form">
                <p class="login-title">Login</p>
                <input type="text" class="login-input" name="username" id="username" placeholder="Username">
                <input type="text" class="login-input" name="password" id="password" placeholder="Password">
                <button @click=${_onLogin} class="app-button" id="sign-in">Login</button>
            </div>
        </div>
    </div>
</section>
`;

