const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo(){
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
  }).catch(err => {console.error(`Webcam Denied.`, err);});
}

function paintToCanvas(){
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  return setInterval(()=>{
    ctx.drawImage(video, 0, 0, width, height); 
    let pixels = ctx.getImageData(0, 0, width, height); //take pixels out
    /* interesting modifiers
    pixels = randEffect(pixels);
    pixels = rgbSplit(pixels);
    pixels = greenScreen(pixels);
    */
    ctx.putImageData(pixels,0,0); //put pixels back
  }, 16);
}

function takePhoto(){
  //play the sound
  snap.currentTime = 0;
  snap.play();
  
  const data = canvas.toDataURL("image/jpeg");
  const link = document.creatElement("a");
  link.href = data;
  link.setAttribute("download", "handsome");
  link.innerHTML = `<img src="${data}" alt="Prettyboy />`;
  strip.insertBefore(link, strip.firstChild);
}

function randEffect(pixels){
  for(i=0;i<pixels.data.length;i+=4){
    pixels.data[i] = Math.floor(Math.random(pixels.data[i])*255)//red
    pixels.data[i+1] = Math.floor(Math.random(pixels.data[i+1])*255)//green
    pixels.data[i+2] = Math.floor(Math.random(pixels.data[i+2])*255)//blue
    pixels.data[i+3] = 255;//alpha
  }
  return pixels;
}

function rgbSplit(pixels){
  for(i=0;i<pixels.data.length;i+=4){
    pixels.data[i-0] = pixels.data[i+0]//red
    pixels.data[i+500] = pixels.data[i+1]//green
    pixels.data[i-500] = pixels.data[i+2]//blue
    pixels.data[i+3] = 255;//alpha
  }
  return pixels;
}

function greenScreen(pixels){
    for(i=0;i<pixels.data.length;i+=4){
    pixels.data[i] = 0//red
    pixels.data[i+1] = 255//green
    pixels.data[i+2] = 0//blue
    pixels.data[i+3] = 255;//alpha
  }
  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
