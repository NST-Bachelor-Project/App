// import {html, render} from 'lit-html';

// // Define a template
// const myTemplate = (name) => html`<p class="bla">Hello ${name}</p>`;

// // Render the template to the document
// render(myTemplate('World'), document.body);
import {router} from './routing.js'

const imageInputs = document.querySelectorAll('.image-input');
const jsonTuple = {content:"", style:""};
for(let i = 0; i < imageInputs.length; i++){
    imageInputs[i].addEventListener('change', (event)=>{
        const image = document.querySelectorAll('.input-img')[i];
        const previewText = document.querySelectorAll('.preview-text')[i];
        const file = event.target.files[0];
        const reader =  new FileReader(); //Read input file/image as dataURL
        previewText.style.display = "none";
        image.style.display = "block";
        reader.addEventListener("load", (event) => {
            image.setAttribute('src', event.target.result);
            if(i == 0){
                jsonTuple.content = event.target.result.substring(22);
            } else if(i == 1){
                jsonTuple.style = event.target.result.substring(22);
                
            }
        });
        reader.readAsDataURL(file);
    });
}

const signOut = document.getElementById('sign-out');
signOut.addEventListener('click', (event) => {
    //TMP SOS!!
    console.log(localStorage.getItem('username'));
    console.log(localStorage.getItem('username') === undefined);
    if(localStorage.getItem('username') === 'undefined'){
        return;
    }
    localStorage.setItem('username', undefined);
    document.getElementById('login').innerText = 'Login';
    document.getElementById('login').href = `/Sign`;
    router.navigate('/');
});