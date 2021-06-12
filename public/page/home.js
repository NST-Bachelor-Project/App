import {html, render} from 'lit-html';
import {tmpTuple} from '../script/index'



const _onGenerate = {
  // handleEvent(e) { 
  //   fetch('http://nst-env-2.eba-pgung23m.us-east-1.elasticbeanstalk.com/', {
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify(jsonTuple)
  //   }).then((response) => response.json())
  //   .then((data) => {
  //       console.log('VASHA');
  //       document.querySelector('.output-img').setAttribute('src', data.image);
  //       document.querySelector('.output-img').style.display = "block";
  //       document.querySelectorAll('.preview-text')[3].style.display = "none";
  //   }).catch((err) => console.log(err));
  // },
  handleEvent(e){
    fetch('/AddCatalog', {
      method: 'POST',
        headers: {'Content-Type': 'application/json'},
        
        body: JSON.stringify({username:localStorage.getItem('username'), catalog: tmpTuple})
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data.status);
      
    }).catch((err) => console.log(err));
  }
};

const _onScrollToGenerate = {
  handleEvent(event) {
    // const welcome = document.querySelector('.welcome');
    // let interval = setInterval(() => {
    //   if(window.scrollY >= welcome.scrollHeight){
    //     clearInterval(interval);
        
    //   }
    //   console.log(window.scrollY);
    //   window.scrollTo(0, scrollY+=10);
    // }, 10);
  }
}

export const homeTemplate = html `
<section class="welcome">
      <div class="container">
        <div class="welcome-items">
          <div class="welcome-block">
            <h1 class="welcome-title">Neural Style Transfer</h1>
            <p class="welcome-text">Neural style transfer is an optimization technique used to take two images, a content image and a style reference image (such as an artwork by a famous painter) and blend them together so the output image looks like the content image, but “painted” in the style of the style reference image.</p>
            <a class="app-button" @click=${_onScrollToGenerate}>Get Started</a>
          </div>
          
          <iframe class="welcome-video" width="600" height="350" src="https://www.youtube.com/embed/7UpK6Usjcns?autoplay=1&mute=1&loop=1&playlist=7UpK6Usjcns&controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </section>

    <section id="generation">
      <div class="container">
        <div class="image-items">
          <div class="image-item">  
            <div class="image-preview" >
              <img src="" alt="Content" class="input-img">
              <p class="preview-text">Content</p>
            </div>
            <input class="image-input" type="file" name="content-input" id="content-input">
          </div>
          <div class="image-item">
            <div class="image-preview" >
              <img src="" alt="Style" class="input-img">
              <p class="preview-text">Style</p>
            </div>
            <input class="image-input" type="file" name="style-input" id="style-input">
          </div>
          <div class="image-item">
            <div class="image-preview" >
              <img src="" alt="Result" class="input-img">
              <p class="preview-text">Result</p>
            </div>
            <input class="image-input" type="file" name="result-input" id="result-input"> 
            <button @click=${_onGenerate}class="app-button" id="generate">Generate</button>
          </div>
        </div>
      </div>  
    </section>
    
`

