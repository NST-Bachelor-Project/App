import {createMarker, html, render} from 'lit-html';
import { router } from '../script/routing';
import { validateRegistration } from './sign';

export const profileTemplate = (user) =>  html`
<section class="profile-section">
    <div class="container">
        <div class="profile-items">
            <div class="info-container">
                <div class="picture-container">
                    <div class="profile-picture" style="background-image: url(${user.image});"> 
                    </div>
                    
                </div>
                <div class="user-info">
                    <p class="profile-username">@${user.username}</p>
                    <div class="fullName">
                        <p class="profile-name">${user.firstName}</p>
                        <p>${user.secondName}</p>
                    </div>
                </div>
                <button id="edit-profile-btn" class="app-button" @click=${_onGoEdit}>Edit Profile</button>
            </div>
            <div class="profile-item"
            </div>
           
        </div>
        <div class="modal">
            <div class="edit-container">
                <div class="edit-row">
                    <p class="edit-field-title">Avatar</p>
                    <input @change=${_onUpload} class="edit-input" type="file" name="avatar-input" id="avatar-input">
                </div>
                
                <div class="edit-row">
                    <p class="edit-field-title">Username</p>
                    <input type="text" id="edit-username" class="edit-input" value="${user.username}" 
                        onfocus="this.placeholder=''" onblur="this.placeholder='${user.username}'" disabled/>
                </div>
                <div class="edit-row edit-password">
                    <p class="edit-field-title">Password</p>
                    <input type="password" id="edit-password" class="edit-input" value="${user.password}"
                        onfocus="this.placeholder=''" onblur="this.placeholder='${user.password}'"/>
                    <i @click=${_hidePassword} class="fas fa-eye"></i>
                    <i @click=${_showPassword} class="fas fa-eye-slash"></i>
                </div>
                <div class="edit-row">
                    <p class="edit-field-title">First Name</p>
                    <input type="text" id="edit-firstName" class="edit-input" value="${user.firstName}"
                        onfocus="this.placeholder=''" onblur="this.placeholder='${user.firstName}'"/>
                </div>
                <div class="edit-row">
                    <p class="edit-field-title">Second Name</p>
                    <input type="text" id="edit-secondName" class="edit-input" value="${user.secondName}"
                        onfocus="this.placeholder=''" onblur="this.placeholder='${user.secondName}'"/>
                </div>
                <p id="edit-alert">Please fill all fields</p>
                <button id="save-change" class="app-button"  @click=${_onSave}>Save Changes</button>
            </div>
        </div>
    </div>
</section>
`;
export const catalogTemplate = (catalog) => html `
    <div class="catalog">
        ${(catalog).map((item) => {
            return html`
            <div class="row">
                
                <img src="${item.content}" @click=${_onZoom} class="row-picture" width="256" height="256">
                <img src="${item.style}" class="row-picture" width="256" height="256">
                <img src="${item.result}" class="row-picture" width="256" height="256">


            </div>`
            
        })}
        <button id="load-more-catalog" class="app-button">Load More</button>
    </div>
                
    
            
`;

export const editProfileTemplate = (user) => html`
    <div class="modal">
        <div class="edit-row">
            <p class="edit-field-title">Avatar</p>
            <input @change=${_onUpload} class="edit-input" type="file" name="avatar-input" id="avatar-input">
        </div>
        
        <div class="edit-row">
            <p class="edit-field-title">Username</p>
            <input type="text" id="edit-username" class="edit-input" value="${user.username}" 
                onfocus="this.placeholder=''" onblur="this.placeholder='${user.username}'" disabled/>
        </div>
        <div class="edit-row edit-password">
            <p class="edit-field-title">Password</p>
            <input type="password" id="edit-password" class="edit-input" value="${user.password}"
                onfocus="this.placeholder=''" onblur="this.placeholder='${user.password}'"/>
            <i @click=${_hidePassword} class="fas fa-eye"></i>
            <i @click=${_showPassword} class="fas fa-eye-slash"></i>
        </div>
        <div class="edit-row">
            <p class="edit-field-title">First Name</p>
            <input type="text" id="edit-firstName" class="edit-input" value="${user.firstName}"
                onfocus="this.placeholder=''" onblur="this.placeholder='${user.firstName}'"/>
        </div>
        <div class="edit-row">
            <p class="edit-field-title">Second Name</p>
            <input type="text" id="edit-secondName" class="edit-input" value="${user.secondName}"
                onfocus="this.placeholder=''" onblur="this.placeholder='${user.secondName}'"/>
        </div>
        <p id="edit-alert">Please fill all fields</p>
        <button id="save-change" class="app-button"  @click=${_onSave}>Save Changes</button>
   </div>
`


// <div class="row-picture" style="background-image: url(${item.content});"></div>
                    // <div class="row-picture" style="background-image: url(${item.style});"></div>
                    // <div class="row-picture" style="background-image: url(${item.result});"></div>


const _onCatalogScroll = {
    handleEvent(event){
        const catalog = document.querySelector('.catalog');

        if((catalog.scrollHeight - catalog.clientHeight) * 0.6 <= catalog.scrollTop){
            
        }
    }
}
const _onZoom = {
    handleEvent(event){
        document.querySelector(".row-image").classList.toggle("image-open");

    }
}

const _onGoEdit = {
    handleEvent(event){
        
        document.querySelector('.modal').style.display = 'block';
        document.querySelector('.modal').style.opacity = '1';
        // router.navigate('/Profile/Edit/' + localStorage.getItem('username'));
    }
}
window.onclick = function(event) {
    if (event.target == document.querySelector('.modal')) {
        document.querySelector('.modal').style.display = "none";
    }
  }
let image = undefined;
const _onUpload = {
    handleEvent(event){
        const file = event.target.files[0];
        const reader =  new FileReader(); //Read input file/image as dataURL
        
        reader.addEventListener("load", (event) => {
            document.querySelector('.profile-picture').style.backgroundImage = `url(${event.target.result})`;
            image = event.target.result;
            
        });
        reader.readAsDataURL(file);
    }
}
const _onSave = {
    handleEvent(event){
        const username = localStorage.getItem('username');
        const password = document.getElementById('edit-password').value;
        const firstName = document.getElementById('edit-firstName').value;
        const secondName = document.getElementById('edit-secondName').value;
        const valid = validateRegistration("username", password, firstName, secondName);
        if(!valid){
            document.getElementById('edit-alert').style.visibility = 'visible';
            return;
        }
        console.log(image);
        fetch(`/ProfileInfoChange`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username,password:password, firstName:firstName, secondName:secondName, image:image})
        }).then((response) => response.json())
        .then((data) => {
            if(data.status === 'ok'){
                location.reload();
            }
        }).catch((err) => {
            console.log('My Error');
            console.error(err);
        });

        
    }
}


const _showPassword = {
    handleEvent(e){
        document.getElementById('edit-password').type = 'text';
        document.querySelector('.fa-eye').style.display = 'block';
        document.querySelector('.fa-eye-slash').style.display = 'none';
    }
}
const _hidePassword = {
    handleEvent(e){
        document.getElementById('edit-password').type = 'password';
        document.querySelector('.fa-eye').style.display = 'none';
        document.querySelector('.fa-eye-slash').style.display = 'block';
    }
}