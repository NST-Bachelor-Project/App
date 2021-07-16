import {createMarker, html, render} from 'lit-html';
import { router } from '../script/routing';
import { validateRegistration } from './sign';

function createRowPicture(src){
    let img = document.createElement('img');
    img.setAttribute('src', src);
    img.className = 'row-picture';
    img.alt = 'Picture';
    img.width = 256;
    img.height = 256;
    return img;
}
export function createNewRow(newCatalog){
    for(let i = 0; i < newCatalog.length; i++){
        const current = newCatalog[i];
        const row = document.createElement('div');
        row.className = 'row';
        const content = createRowPicture(current.content);
        const style = createRowPicture(current.style);
        const result = createRowPicture(current.result);
        row.append(content);
        row.append(style);
        row.append(result);
        const username = window.location.href.split('/').pop();
        if(localStorage.getItem('username') === username){
            const remove = document.createElement('div');
            remove.className = 'remove-row';
            remove.setAttribute('index', `${i + parseInt(localStorage.getItem('offset'))}`);
            remove.innerHTML = '<i class="fas fa-trash"></i>';
            remove.addEventListener('click', (event) => {
                let target = event.target;
                if(target.className != 'remove-row'){
                    target = target.parentElement; 
                }
                if(target.disabled) {
                    return;
                }
                const index = Array.from(target.parentNode.parentNode.children).indexOf(target.parentNode);
                const username = window.location.href.split('/').pop();
                if(localStorage.getItem('username') != username){
                    return;
                } 
                document.querySelectorAll(".row")[index].style.opacity = 0.5;
                fetch(`/DeleteRow`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username: username, index:index})
                }).then((response) => response.json())
                .then((response) => {
                    document.getElementById('catalog-wrap').removeChild(document.querySelectorAll(".row")[index]);
                }).catch((err) => {
                    console.error(err);
                });  
            });
            row.append(remove);
        }
        document.getElementById('catalog-wrap').append(row);
    }    
}
window.onclick = function(event) {
    if (event.target == document.querySelector('.modal')) {
        document.querySelector('.modal').style.display = "none";
    }
}
const _onGoEdit = {
    handleEvent(event){
        const username = window.location.href.split('/').pop();
        if(localStorage.getItem('username') != username){
            return;
        } 
        document.querySelector('.modal').style.display = 'block';
        document.querySelector('.modal').style.opacity = '1';
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
const _onLoadMore = {
    handleEvent(e){
        document.getElementById('profile-loader').style.visibility = 'visible';
        let arr = window.location.href.split('/');
        const username = arr.pop();
        localStorage.setItem('offset', parseInt(localStorage.getItem('offset')) + parseInt(localStorage.getItem('limit')));
        fetch('/LoadMoreCatalog', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, offset:localStorage.getItem('offset'), limit:localStorage.getItem('limit')})
        }).then((response) => response.json())
        .then((data) => {
            createNewRow(data.catalog.catalog);
            document.getElementById('profile-loader').style.visibility = 'hidden';
            if(data.catalog.catalog.length < 1){
                document.getElementById('load-more-catalog').classList.add('none');
                document.getElementById('profile-loader').style.visibility = 'hidden';
                return;
            }
        })
        .catch((err) => {
            console.error(err);
        })
    }
}
const _onDeleteAccount = {
    handleEvent(event){
        const username = window.location.href.split('/').pop();
        if(localStorage.getItem('username') != username){
            return;
        } 
        let answer = confirm("You are going to delete account");
        if(answer){
            fetch('/DeleteAccount', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: username})
            }).then((response) => response.json())
            .then((data) => {
                localStorage.setItem('username', undefined);
                router.navigate('/');
            })
            .catch((err) => {
                console.error(err);
            })
        }
    }
}
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
                    <button id="edit-profile-btn" class="app-button" @click=${_onGoEdit}>Edit Profile</button>
                    <button id="delete-account" class="app-button"  @click=${_onDeleteAccount}>Delete Account</button>
                </div>
            </div>
            <div class="profile-item">
                <div class="catalog">
                    <p class="empty-catalog none">No Catalog Yet</p>
                    <div id="catalog-wrap">
                    </div>
                    <div class="load-wrap">
                        <button id="load-more-catalog" class="app-button" @click=${_onLoadMore}>Load More</button>
                        <div id="profile-loader" class="loader"></div>
                    </div>
                </div> 
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
// export const editProfileTemplate = (user) => html`
// <div class="modal">
// <div class="edit-container">
//     <div class="edit-row">
//         <p class="edit-field-title">Avatar</p>
//         <input @change=${_onUpload} class="edit-input" type="file" name="avatar-input" id="avatar-input">
//     </div>
    
//     <div class="edit-row">
//         <p class="edit-field-title">Username</p>
//         <input type="text" id="edit-username" class="edit-input" value="${user.username}" 
//             onfocus="this.placeholder=''" onblur="this.placeholder='${user.username}'" disabled/>
//     </div>
//     <div class="edit-row edit-password">
//         <p class="edit-field-title">Password</p>
//         <input type="password" id="edit-password" class="edit-input" value="${user.password}"
//             onfocus="this.placeholder=''" onblur="this.placeholder='${user.password}'"/>
//         <i @click=${_hidePassword} class="fas fa-eye"></i>
//         <i @click=${_showPassword} class="fas fa-eye-slash"></i>
//     </div>
//     <div class="edit-row">
//         <p class="edit-field-title">First Name</p>
//         <input type="text" id="edit-firstName" class="edit-input" value="${user.firstName}"
//             onfocus="this.placeholder=''" onblur="this.placeholder='${user.firstName}'"/>
//     </div>
//     <div class="edit-row">
//         <p class="edit-field-title">Second Name</p>
//         <input type="text" id="edit-secondName" class="edit-input" value="${user.secondName}"
//             onfocus="this.placeholder=''" onblur="this.placeholder='${user.secondName}'"/>
//     </div>
//     <p id="edit-alert">Please fill all fields</p>
//     <button id="save-change" class="app-button"  @click=${_onSave}>Save Changes</button>
// </div>
// </div>
// `;