import {html, render} from 'lit-html';


const jsonTuple = {content:"", style:""};
const tmpTuple = {content:"", style:"", result:""};

const _onGenerate = {
  // handleEvent(e) { 
  //   console.log(jsonTuple);
  //   fetch('http://3.236.55.7', {
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
  // }
  handleEvent(e) { 
    if(tmpTuple.content === "" || tmpTuple.style === ""){
      alert('Both iamge required')
      return;
    }

    fetch('/AddCatalog', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username:localStorage.getItem('username'), catalog: tmpTuple})
    }).then((response) => response.json())
    .then((data) => {
        console.log('VASHA');
        document.querySelector('.output-img').setAttribute('src', data.image);
        document.querySelector('.output-img').style.display = "block";
        document.querySelectorAll('.preview-text')[3].style.display = "none";
        document.getElementById('save').style.display = 'block';
    }).catch((err) => console.log(err));
  }   
};
const _onSaveRow = {
  handleEvent(event){

  }
}
const _onChange = {
  handleEvent(event){
    let index;
    let image;
    let previewText;
    if(event.target.id === 'content-input'){
        index = 0;
        image = document.querySelectorAll('.input-img')[0];
        previewText = document.querySelectorAll('.preview-text')[0];
    } else if(event.target.id === 'style-input'){
        image = document.querySelectorAll('.input-img')[1];
        previewText = document.querySelectorAll('.preview-text')[1];
        index = 1;
    }
    const file = event.target.files[0];
    const reader =  new FileReader(); //Read input file/image as dataURL
    previewText.style.display = "none";
    image.style.display = "block";
    reader.addEventListener("load", (event) => {
        image.setAttribute('src', event.target.result);
        console.log(event.target.result);
        if(index == 0){
            jsonTuple.content = event.target.result.substring(22);
            tmpTuple.content = event.target.result;
        } else if(index == 1){
            jsonTuple.style = event.target.result.substring(22);
            tmpTuple.style = event.target.result;
        } 
    });
    reader.readAsDataURL(file);
  }
}
const _onChange2 = {
  handleEvent(event){
    let index;
    let image;
    let previewText;
    if(event.target.id === 'content-input'){
        index = 0;
        image = document.querySelectorAll('.input-img')[0];
        previewText = document.querySelectorAll('.preview-text')[0];
    } else if(event.target.id === 'style-input'){
        image = document.querySelectorAll('.input-img')[1];
        previewText = document.querySelectorAll('.preview-text')[1];
        index = 1;
    } else if(event.target.id === 'result-input'){
      image = document.querySelectorAll('.input-img')[2];
        previewText = document.querySelectorAll('.preview-text')[2];
        index = 2;
    }
    const file = event.target.files[0];
    const reader =  new FileReader(); //Read input file/image as dataURL
    previewText.style.display = "none";
    image.style.display = "block";
    reader.addEventListener("load", (event) => {
        image.setAttribute('src', event.target.result);

        if(index == 0){
            jsonTuple.content = event.target.result.substring(22);
            tmpTuple.content = event.target.result;
        } else if(index == 1){
            jsonTuple.style = event.target.result.substring(22);
            tmpTuple.style = event.target.result;
        } else{
          tmpTuple.result = event.target.result;
        }
    });
    reader.readAsDataURL(file);
  }
}

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
export const homeTemplate = html `
<section class="welcome">
      <div class="container">
        <div class="welcome-items">
          <div class="welcome-block">
            <h1 class="welcome-title">𝓝𝓮𝓾𝓻𝓪𝓵 𝓢𝓽𝔂𝓵𝓮 𝓣𝓻𝓪𝓷𝓼𝓯𝓮𝓻
            </h1>
            <p class="welcome-text">Neural style transfer is an optimization technique used to take two images, a content image and a style reference image (such as an artwork by a famous painter) and blend them together so the output image looks like the content image, but “painted” in the style of the style reference image.</p>
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
              <label for="content-input" class="preview-text ">Content</label>
            </div>
            <input id="content-input" class="image-input" type="file" name="content-input" @change=${_onChange2}>
          </div>
          <div class="image-item">
            <div class="image-preview" >
              <img src="" alt="Style" class="input-img">
              <label for="style-input" class="preview-text ">Style</label>
            </div>
            <input id="style-input" class="image-input" type="file" name="style-input" @change=${_onChange2}>
          </div>
          <div class="result-wrap">
          <div class="image-item">
            <div class="image-preview" >
              <!-- <img src="" alt="Result" class="output-img"> -->
              <img src="" alt="Result" class="input-img">
              <label for="result-input" class="preview-text not">Result</label>
            </div>
            <input class="image-input" type="file"  name="result-input" id="result-input" @change=${_onChange2}> 
            
          </div>
          <button @click=${_onGenerate} class="app-button" id="generate">Generate</button>
          <button @click=${_onSaveRow} class="app-button" id="save">Save</button>
          </div>
        </div>
      </div>  
    </section>
    
`

