// import {html, render} from 'lit-html';

// // Define a template
// const myTemplate = (name) => html`<p class="bla">Hello ${name}</p>`;

// // Render the template to the document
// render(myTemplate('World'), document.body);
import {router} from './routing.js'

const imageInputs = document.querySelectorAll('.image-input');
export const jsonTuple = {content:"", style:""};
export const tmpTuple = {content:"", style:"", result:""};
// for(let i = 0; i < imageInputs.length; i++){
//     imageInputs[i].addEventListener('change', (event)=>{
//         console.log('CHANGE YES');
//         const image = document.querySelectorAll('.input-img')[i];
//         const previewText = document.querySelectorAll('.preview-text')[i];
//         const file = event.target.files[0];
//         const reader =  new FileReader(); //Read input file/image as dataURL
//         previewText.style.display = "none";
//         image.style.display = "block";
//         reader.addEventListener("load", (event) => {
            
//             image.setAttribute('src', event.target.result);
//             if(i == 0){
//                 jsonTuple.content = event.target.result.substring(22);
//                 // tmpTuple.content = event.target.result;
//             } else if(i == 1){
//                 jsonTuple.style = event.target.result.substring(22);
//                 // tmpTuple.style = event.target.result;
//             }
//                 // } else if(i === 2){
//             //     tmpTuple.result = event.target.result;

//             // }
//         });
//         reader.readAsDataURL(file);
//     });
// }



const signOut = document.getElementById('sign-out');
signOut.addEventListener('click', (event) => {
    //TMP SOS!!
    if(localStorage.getItem('username') === 'undefined'){
        return;
    }
    localStorage.setItem('username', undefined);
    document.querySelector('.fa-sign-out-alt').style.visibility = 'hidden';
    document.getElementById('login').innerText = 'Login';
    document.getElementById('login').href = `/Sign`;
    router.navigate('/');
});

document.getElementById('search').addEventListener('input', (event) => {
    debounce(event.target.value);
});
let timer = 0;
const delay = 500;
function debounce(username){
    if(timer){
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        findUser(username);
    }, delay);
}
function findUser(username){
    if(username.length < 1){
        return;
    }
    fetch('/FindUser?' + new URLSearchParams({
        username:username
    })).then(response => response.json()). 
    then(data => {
        const dropdown = document.querySelector('.search-dropdown');
        dropdown.innerHTML = '';
        if(data.people.length === 0){
            console.log('No users found');
        } else {
            for(let i = 0; i < data.people.length; i++){
                if(data.people[i].username === localStorage.getItem('username')){
                    continue;
                }
                const searchRow = document.createElement('p');
                searchRow.className = 'search-row';
                searchRow.innerText = data.people[i].username;
                dropdown.appendChild(searchRow);
                searchRow.addEventListener('click', (event) => {
                    const username = event.target.innerText;
                    document.getElementById('search').placeholder = 'Search...';
                    document.getElementById('search').value = '';
                    document.querySelector('.search-dropdown').style.visibility = 'hidden';
                    router.navigate('/Visit/' + username);
                })
            }
            dropdown.style.visibility = 'visible';
            
        }
    }).catch(err => console.error(err));
}
//SOS maybe with this
document.getElementById('search').addEventListener('blur', (event) => {
    setTimeout(() => {
        document.getElementById('search').placeholder = 'Search...';
        document.getElementById('search').value = '';
        document.querySelector('.search-dropdown').style.visibility = 'hidden'
    }, 1000);

});
