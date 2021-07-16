import {router} from './routing.js'

/* Sign Out */
const signOut = document.getElementById('sign-out');
signOut.addEventListener('click', (event) => {
    if(localStorage.getItem('username') === 'undefined'){
        return;
    }
    localStorage.setItem('username', undefined);
    localStorage.setItem('offset', 0);
    document.querySelector('.fa-sign-out-alt').style.visibility = 'hidden';
    document.getElementById('login').innerText = 'Login';
    document.getElementById('login').href = `/Sign`;
    router.navigate('/');
});

/* Search Users */
document.getElementById('search').addEventListener('input', (event) => {
    debounce(event.target.value);
});
let timer = 0;
const delay = 500;
function debounce(username){
    if(username.length < 1){
        clearTimeout(timer);
        document.getElementById('search').placeholder = 'Search...';
        document.getElementById('search').value = '';
        document.querySelector('.search-dropdown').style.visibility = 'hidden';
        return;
    }
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
            const searchRow = document.createElement('p');
            searchRow.className = 'search-row-empty';
            searchRow.innerText = 'No users';
            dropdown.appendChild(searchRow);
            dropdown.style.visibility = 'visible';
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
document.getElementById('search').addEventListener('blur', (event) => {
    setTimeout(() => {
        document.getElementById('search').placeholder = 'Search...';
        document.getElementById('search').value = '';
        document.querySelector('.search-dropdown').style.visibility = 'hidden';
    }, 500);
});
