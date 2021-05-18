import {html, render} from 'lit-html';
import { homeTemplate } from '../page/home';
import {loginTemplate} from '../page/login'
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
    '/Login': () =>{  
        console.log('Login');  
        render(loginTemplate, document.querySelector('main'));
    },
    '/Profile/:username': (params) => {
        if(localStorage.getItem('username') != params.data.username){
            return;
        }
        render(profileTemplate(params.data.username), document.querySelector('main'));
    },
    '*' : (params) => {
        console.log('*');
    }
});



router.resolve();