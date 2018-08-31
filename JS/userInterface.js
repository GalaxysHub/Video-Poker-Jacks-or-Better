"use strict";

const btnCanvas = document.getElementById('btnCanvas');
const BGBtnCanvas = document.getElementById('BGBtnCanvas');
const btncHeight = 150;

BGBtnCanvas.style.position = btnCanvas.style.position = "absolute";
BGBtnCanvas.style.top = btnCanvas.style.top = cShiftY+cHeight+'px';
BGBtnCanvas.style.left = btnCanvas.style.left = mainCanvas.style.left;
BGBtnCanvas.width = btnCanvas.width = cWidth;
BGBtnCanvas.height = btnCanvas.height = btncHeight;
btnCanvas.style.zIndex = 1;
BGBtnCanvas.style.zIndex = -1;

const BTNctx = btnCanvas.getContext('2d');
const BGBTNctx = BGBtnCanvas.getContext('2d');
BTNctx.fillStyle ='white';
const buttonsArr = []

const btnsPics = ['background2.jpg','LeftSideArrow.png','RightSideArrow.png','RedButtonMain.png'];
const btnsPicLoc = './Images/ButtonsInterface/'
const buttonsImgMap = new Map();

const promiseButtonsImgArr = asyncHelperFunctions.createPromImgArr(btnsPics, buttonsImgMap, btnsPicLoc);

Promise.all(promiseButtonsImgArr).then(()=>{
  BGBTNctx.drawImage(buttonsImgMap.get('background2'),0,0,cWidth,btncHeight);
  drawButtons();
});

function displayPaytable(){
  const maxW = cWidth/10;
  const xMargin = cWidth/6;
  const yTop = 50;
  let yCord = yTop;
  let xDif = (cWidth-maxW-xMargin)/(numCoins+1);
  let yDif = (cHeight/2)/paytableMap.size;
  const fontSize = cHeight/25;
  ctx.fillStyle = 'white';
  ctx.textAlign= 'center';
  ctx.textBaseline = "middle";
  ctx.font = fontSize+"px Arial";

  paytableMap.forEach((value, key)=>{
    ctx.fillText(key,xMargin,yCord);
    for(let i = 1; i<=numCoins; i++){
      ctx.fillText(value*i,xMargin+maxW+xDif*i,yCord);
    }
    yCord+=yDif;
  })

}

displayPaytable();

function setSideBtns(){
  const fontSize = btncHeight/2;
  const btnH = fontSize;
}

const buttonsMap = new Map();

//Separate into 2 functions
function setPlayButton(){
  BTNctx.textAlign = "center";
  BTNctx.textBaseline = "alphabetic";
  const xPos = cWidth/2,
    yPos = btncHeight*.65;
  const maxWid = cWidth/2;
  const fontSize = btncHeight/2;
  // BTNctx.clearRect(20,btncHeight/2-20,cWidth-40,btncHeight/2);
  BTNctx.font = fontSize+"px Arial";

  let msg;
  if(draw){msg = "Deal";}
  else{msg="Draw";}
  BTNctx.fillText(msg,xPos,yPos,maxWid);

  let btnWid = 3*fontSize,
    btnHeight = fontSize,
    btnXPos = xPos-btnWid/2,
    btnYPos = yPos-fontSize*0.8,
    LSBtnXPos = cWidth/16,
    RSBtnXPos = cWidth/4;

  BTNctx.strokeRect(btnXPos,btnYPos,btnWid,btnHeight);
  buttonsMap.set("Play Button",{img:'RedButtonMain',x:btnXPos,y:btnYPos,w:btnWid,h:btnHeight})
  buttonsMap.set("Left Side Arrow",{img:'LeftSideArrow',x:LSBtnXPos, y:btnYPos, w: btnHeight, h:btnHeight})
  buttonsMap.set("Right Side Arrow",{img:'RightSideArrow',x:RSBtnXPos, y:btnYPos, w: btnHeight, h:btnHeight})
}

setPlayButton();

function displayBet(){

  const fontSize = btncHeight/4;
  // BGBTNctx.textAlign = "center";
  // BGBTNctx.textBaseline = "hanging";
  // BGBTNctx.font = fontSize+"px Arial";

  BTNctx.textAlign = "center";
  BTNctx.textBaseline = "hanging";
  BTNctx.font = fontSize+"px Arial";

  const LSA = buttonsMap.get('Left Side Arrow');
  let betXPos = (LSA.x+buttonsMap.get('Right Side Arrow').x+LSA.w)/2;
  let betYPos = (LSA.y);
  BTNctx.clearRect(betXPos-LSA.w,betYPos,4*fontSize,2*fontSize);
  BTNctx.fillText('Bet', betXPos, betYPos);
  BTNctx.fillText(account.bet, betXPos, betYPos+fontSize);
}

displayBet();

function incBet(){
  if(account.bet<maxBet){
    account.bet+=minBet;
    console.log('increasing bet');
  }
  displayBet();
}

function decBet(){
  console.log('decBet clicked');
  if(account.bet>minBet){
    account.bet-=minBet;
  }
  displayBet();
}

function displayBalance(){
  const fontSize = btncHeight/3;
  BTNctx.textBaseline = "middle";
  BTNctx.font = fontSize+"px Arial";
  let xPos = cWidth*0.8;
  let yPos = btncHeight/2
  BTNctx.clearRect(cWidth*0.6,0,cWidth*0.4,btncHeight);
  BTNctx.textAlign = 'right'
  BTNctx.fillText("Credit",xPos,yPos);
  BTNctx.textAlign = 'left'
  BTNctx.fillText("  "+account.balance,xPos,yPos);
}

displayBalance();

BTNctx.strokeRect(0, 0, btnCanvas.width, btnCanvas.height);

function drawButtons(){

  buttonsMap.forEach((b)=>{
    BGBTNctx.drawImage(buttonsImgMap.get(b.img),b.x,b.y,b.w,b.h);
  })
}

function getMousePos(mainCanvas, evt){
  var rect = mainCanvas.getBoundingClientRect();
  return{
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.w && pos.y < rect.y+rect.h && pos.y > rect.y
}

mainCanvas.addEventListener('mousedown', function(evt){
  let mousePos = getMousePos(mainCanvas,evt);

  for(let i=0; i<setUp.numCards; i++){
    let c = setUp.hand[i]
    if(isInside(mousePos,c)){
      console.log('card:',c.id);
      if(c.selected){
        const xStart = xBorder+xDif,
          yLoc = cHeight/2+xDif*HWr;
        c.x = xStart+i*(cardW+xDif); c.y = yLoc;
        c.w = cardW; c.h = cardH;
        c.selected = false;
      }else{
        const xStart = xBorder+xDifS,
          yLoc = cHeight/2+xDifS*HWr;
        c.x = xStart+i*(cardWS+xDifS); c.y = yLoc;
        c.w = cardWS; c.h = cardHS;
        c.selected = true;
      }
      ctx.clearRect(0,cHeight*0.6,cWidth,cHeight/2);
      setUp.drawCards();
    }
  }
},false);

//checks for clicks draw buttons
btnCanvas.addEventListener('mousedown', function(evt){
  let mousePos = getMousePos(btnCanvas,evt);
  let playBtn = buttonsMap.get("Play Button");
  if(isInside(mousePos,playBtn)){
    if(draw==false){
      draw = true;
      discardAndDraw();
      updateBalance();
    }else{
      draw=false;
      newHand();
    }
    //Draw btns in background canvas and delete line below
    BTNctx.clearRect(playBtn.x,playBtn.y,playBtn.w,playBtn.h)
    setPlayButton();// Change only play button later
  }

  if(isInside(mousePos,buttonsMap.get("Left Side Arrow"))){
    decBet();
  }
  if(isInside(mousePos,buttonsMap.get("Right Side Arrow"))){
    incBet();
  }
  displayBalance();
},false);
