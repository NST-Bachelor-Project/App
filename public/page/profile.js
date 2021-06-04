import {html, render} from 'lit-html';
import { router } from '../script/routing';

export const profileTemplate = (user) =>  html`
<section class="profile-section">
    <div class="container">
        <div class="profile-items">
            <div class="info-container">
                <div class="picture-container">
                    <div class="profile-picture" style="background-image: url(${user.image});"> 
                    </div>
                    <input @change=${_onUpload} class="image-input" type="file" name="avatar-input" id="avatar-input">
                </div>
                <div class="user-info">
                    <p class="profile-username">@${user.username}</p>
                    <div class="fullName">
                        <p class="profile-name">${user.firstName}</p>
                        <p>${user.secondName}</p>
                    </div>
                </div>
            </div>
            <div class="catalog">
            ${(user.catalog).map((item) => {
                return html`
                <div class="row">
                    <img src="${item.content}" class="row-picture" width="256" height="256">
                    <img src="${item.style}" class="row-picture" width="256" height="256">
                    <img src="${item.result}" class="row-picture" width="256" height="256">


                </div>`
            })}
            
            </div>
        </div>
    </div>
</section>
`;
// <div class="row-picture" style="background-image: url(${item.content});"></div>
                    // <div class="row-picture" style="background-image: url(${item.style});"></div>
                    // <div class="row-picture" style="background-image: url(${item.result});"></div>

const _onUpload = {
    handleEvent(event){
        const file = event.target.files[0];
        const reader =  new FileReader(); //Read input file/image as dataURL
        
        reader.addEventListener("load", (event) => {
            document.querySelector('.profile-picture').style.backgroundImage = `url(${event.target.result})`;
            fetch(`/AvatarChange`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: localStorage.getItem('username'), image: event.target.result})
            }).then((response) => response.json())
            .then((data) => {
                conso
            }).catch((err) => {
                console.log('My Error');
                console.error(err);
            })
        });
        reader.readAsDataURL(file);
        
    }
}