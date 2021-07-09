import {html, render} from 'lit-html';
import { homeTemplate } from '../page/home';
import {signTemplate} from '../page/sign'
import { profileTemplate, createNewRow } from '../page/profile';
const Navigo = require('navigo');
export const router = new Navigo('/', { hash: true });
router.on({
    '/': () => {  
        if(localStorage.getItem('username') != 'undefined'){
            document.getElementById('login').innerText = localStorage.getItem('username');
            document.getElementById('login').href = `/Profile/${localStorage.getItem('username')}`;
            document.querySelector('.fa-sign-out-alt').style.visibility = 'visible';
        }
        render(homeTemplate, document.querySelector('main'));
    }, 
    '/Sign': () => {  
        render(signTemplate, document.querySelector('main'));
    },
    '/Profile/:username': (params) => {
        if(localStorage.getItem('username') != params.data.username){
            router.navigate('/');
            return;
        }
        const username = localStorage.getItem('username');
        localStorage.setItem('offset', 0);
        localStorage.setItem('limit', 4);
        console.log('A');
        fetch('/Profile?' + new URLSearchParams({
            username: username,
            offset: localStorage.getItem('offset'),
            limit: localStorage.getItem('limit')
        })).then((response) => response.json())
        .then((data) => {
            
            if(data.status === 'Nonexistent'){
                document.querySelector('main').innerHTML = 'User not found';
                return;
            }
            render(profileTemplate(data.user), document.querySelector('main'));
            document.getElementById('catalog-wrap').innerHTML = '';
            createNewRow(data.catalog.catalog);
            if(data.catalog.catalog.length < 1){
                document.querySelector('.empty-catalog').classList.remove('none');
                document.getElementById('load-more-catalog').classList.add('none');
            } else{
                document.querySelector('.empty-catalog').classList.add('none');
                document.getElementById('load-more-catalog').classList.remove('none');
            }   
            document.getElementById('edit-profile-btn').style.display = 'block';
            document.querySelector('.fa-sign-out-alt').style.visibility = 'visible';
            document.getElementById('login').innerText = username;            
        }).catch((err) => console.error(err))
    },
    '/Visit/:username': (params) => {
        localStorage.setItem('offset', 0);
        const username = params.data.username;
        fetch('/Profile?' + new URLSearchParams({
            username: username
        })).then((response) => response.json()).
        then((data) => {
            if(data.status === 'Nonexistent'){
                document.querySelector('main').innerHTML = 'User not found';
                return;
            }
            render(profileTemplate(data.user), document.querySelector('main'));
            document.getElementById('catalog-wrap').innerHTML = '';
            createNewRow(data.catalog.catalog);
            if(data.catalog.catalog.length < 1){
                document.querySelector('.empty-catalog').classList.remove('none');
                document.getElementById('load-more-catalog').classList.add('none');
            } else{
                document.querySelector('.empty-catalog').classList.add('none');
                document.getElementById('load-more-catalog').classList.remove('none');
            }
            document.getElementById('edit-profile-btn').style.display = 'none';
            if(localStorage.getItem('username') != 'undefined'){
                document.getElementById('login').innerText = localStorage.getItem('username');
                document.getElementById('login').href = `/Profile/${localStorage.getItem('username')}`;
                document.querySelector('.fa-sign-out-alt').style.visibility = 'visible';
            }
        }).catch((err) => console.error(err)) 
    },
    '*' : (params) => {
    }
});

router.resolve();