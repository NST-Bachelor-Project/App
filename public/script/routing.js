import {html, render} from 'lit-html';
import { homeTemplate } from '../page/home';
import {signTemplate} from '../page/sign'
import { profileTemplate } from '../page/profile';

const Navigo = require('navigo');
export const router = new Navigo('/', { hash: true });

router.on({
    '/':  () =>  {    
        console.log('/');
        render(homeTemplate, document.querySelector('main'));
    },
    '/Home': () =>{    
        console.log('Home');
    },
    '/Sign': () =>{  
        console.log('Sign');  
        render(signTemplate, document.querySelector('main'));
    },
    '/Profile/:username': (params) => {
        if(localStorage.getItem('username') != params.data.username){
            router.navigate('/');
            return;
        }
        render(profileTemplate(params.data.username), document.querySelector('main'));
        document.getElementById('login').innerText = localStorage.getItem('username');
        document.getElementById('login').href = `/Profile/${localStorage.getItem('username')}`;
    },
    '*' : (params) => {
    }
});



router.resolve();