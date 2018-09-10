"use strict";
const asyncHelperFunctions = (()=>{

  function createPromImgArr(pictures, imgMap, loc){
    return pictures.map((imgName)=>{
      let prom = new Promise((resolve,reject)=>{
        let img = new Image();
        img.onload= ()=>{
          imgMap.set(imgName.split('.')[0], img);
          resolve();
        };
        img.src = loc+imgName;
      });
      return prom;
    });
  }

  function Sound(src) {
      this.sound = document.createElement("audio");
      this.sound.src = src;
      this.sound.setAttribute("preload", "auto");
      this.sound.setAttribute("controls", "none");
      this.sound.style.display = "none";
      document.body.appendChild(this.sound);
      this.play = function(){
          this.sound.play();
      }
      this.stop = function(){
          this.sound.pause();
      }
  }

  return{
    createPromImgArr:createPromImgArr,
    Sound:Sound
  }

})()
