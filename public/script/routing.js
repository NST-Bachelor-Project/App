import {html, render} from 'lit-html';
import { homeTemplate } from '../page/home';
import {signTemplate} from '../page/sign'
import { profileTemplate, catalogTemplate, createNewRow } from '../page/profile';

const Navigo = require('navigo');
export const router = new Navigo('/', { hash: true });

router.on({
    '/':  () =>  {  

        if(localStorage.getItem('username') != 'undefined'){
            document.getElementById('login').innerText = localStorage.getItem('username');
            document.getElementById('login').href = `/Profile/${localStorage.getItem('username')}`;
            document.querySelector('.fa-sign-out-alt').style.visibility = 'visible';
        }
        // console.log('/ Page');
        render(homeTemplate, document.querySelector('main'));

    },
    '/Home': () =>{   
        if(localStorage.getItem('username') != 'undefined'){
            document.getElementById('login').innerText = localStorage.getItem('username');
            document.getElementById('login').href = `/Profile/${localStorage.getItem('username')}`;
        } 
        // console.log('Home Page');
    },
    '/Sign': () =>{  
        // console.log('Sign Page');  
        render(signTemplate, document.querySelector('main'));
    },
    '/Profile/:username': (params) => {
        // console.log(window.innerHeight);
        if(localStorage.getItem('username') != params.data.username){
            router.navigate('/');
            return;
        }
        const username = localStorage.getItem('username');
        localStorage.setItem('offset', 0);
        localStorage.setItem('limit', 3);
        fetch('/Profile?' + new URLSearchParams({
            username: username,
            offset: 0,
            limit: 3
        })).then((response) => response.json()).
        then((data) => {
           
            if(data.status === 'Nonexistent'){
                document.querySelector('main').innerHTML = 'User not found';
                return;
            }
            // console.log(data.catalog.catalog.length);
            render(profileTemplate(data.user), document.querySelector('main'));

            render(catalogTemplate(data.catalog.catalog), document.querySelector('.profile-item'));
            
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
            document.getElementById('login').href = `/Profile/${username}`;

            // localStorage.setItem('catalog', JSON.stringify(data.catalog.catalog));
            
        }).catch((err) => console.error(err))

        
    },
    // '/Profile/Edit/:username': (params) => {
    //     console.log('EDITINO');
    //     if(localStorage.getItem('username') != params.data.username){
    //         router.navigate('/');
    //         return;
    //     }
    //     const username = localStorage.getItem('username');
    //     fetch('/Profile?' + new URLSearchParams({
    //         username: username
    //     })).then((response) => response.json()).
    //     then((data) => {
    //         if(data.status === 'Nonexistent'){
    //             document.querySelector('main').innerHTML = 'User not found';
    //             return;
    //         }
    //         // console.log(data.user);
    //         render(profileTemplate(data.user), document.querySelector('main'));
    //         render(editProfileTemplate(data.user), document.querySelector('.profile-item'));
    //         document.getElementById('login').innerText = username;
    //         document.getElementById('login').href = `/Profile/${username}`;
            
    //     }).catch((err) => console.error(err)) 
    // },
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
            // console.log(data.user);
            render(profileTemplate(data.user), document.querySelector('main'));
            // render(catalogTemplate(data.catalog.catalog), document.querySelector('.profile-item'));
            document.getElementById('catalog-wrap').innerHTML = '';
            createNewRow(data.catalog.catalog);
            // render(editProfileTemplate(data.user), document.querySelector('.profile-item'));
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