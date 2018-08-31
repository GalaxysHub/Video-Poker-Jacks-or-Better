"use strict";

const animations = (()=>{

  function flip(img1,img2,x,y,w,h,n,inc,cvs,cb=()=>{}){
    w-=inc;
    if(w>0){
      cvs.clearRect(x-w,y,2*w,h);
      cvs.drawImage(img1,x-w/2,y,w,h);
    }
    else{cvs.drawImage(img2,x-w/2,y,w,h);}
    if(n>1){
      requestAnimationFrame(()=>{flip(img1,img2,x,y,w,h,n-1,inc,cvs,cb)})
    }else{cb();}
  }

  function grow(img,xStart,yStart,xFin,yFin,w,h,n,cvs,cb=()=>{}){
    let xDif = (xFin-xStart)/n,
      yDif = (yFin-yStart)/n,
      xLoc = xStart+xDif,
      yLoc = yStart+yDif,
      width = w+Math.abs(2*xDif),
      height = h+Math.abs(2*yDif);
    if(n>2){
      console.log('drawing Image');
      cvs.drawImage(img,xLoc,yLoc,width,height);
      requestAnimationFrame(()=>{
        grow(img,xLoc,yLoc,xFin,yFin,width,height,n-1,cvs,cb);
      })
    }else{
      cb();
    }
  }

  return{
    flip: flip,
    grow: grow
  }

})()
