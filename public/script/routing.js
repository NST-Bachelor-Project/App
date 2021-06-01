import {html, render} from 'lit-html';
import { homeTemplate } from '../page/home';
import {signTemplate} from '../page/sign'
import { profileTemplate } from '../page/profile';

const Navigo = require('navigo');
export const router = new Navigo('/', { hash: true });

router.on({
    '/':  () =>  {    
        if(localStorage.getItem('username') != 'undefined'){
            document.getElementById('login').innerText = localStorage.getItem('username');
            document.getElementById('login').href = `/Profile/${localStorage.getItem('username')}`;
        }
        console.log('/ Page');
        render(homeTemplate, document.querySelector('main'));
    },
    '/Home': () =>{   
        if(localStorage.getItem('username') != 'undefined'){
            document.getElementById('login').innerText = localStorage.getItem('username');
            document.getElementById('login').href = `/Profile/${localStorage.getItem('username')}`;
        } 
        console.log('Home Page');
    },
    '/Sign': () =>{  
        console.log('Sign Page');  
        render(signTemplate, document.querySelector('main'));
    },
    '/Profile/:username': (params) => {
        if(localStorage.getItem('username') != params.data.username){
            router.navigate('/');
            return;
        }
        const username = localStorage.getItem('username');
        fetch('/Profile?' + new URLSearchParams({
            username: username
        })).then((response) => response.json()).
        then((data) => {
            if(data.status === 'Nonexistent'){
                document.querySelector('main').innerHTML = 'User not found';
                return;
            }
            console.log(data.user);
            render(profileTemplate(data.user), document.querySelector('main'));
            document.getElementById('login').innerText = username;
            document.getElementById('login').href = `/Profile/${username}`;
            
        }).catch((err) => console.error(err))

        
    },
    '*' : (params) => {
    }
});



router.resolve();