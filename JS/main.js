"use strict";

const cWidth = 1000;
const cHeight = 700;
const cShiftY = 0;
const xMargin = 0;

const bCanvas = document.getElementById("bannerCanvas")
const BGCanvas = document.getElementById('BGCanvas');
const mainCanvas = document.getElementById('mainCanvas');
const glassCanvas = document.getElementById('glassCanvas');
const BGctx = BGCanvas.getContext('2d');
const ctx = mainCanvas.getContext('2d');
const xBorder = cWidth/50;

const numCoins = 5;
const minBet = 100, maxBet = minBet*numCoins;

const numCards = 5;
const xDif = cWidth/20;
const xDifS = cWidth/40;
const cardW = (cWidth-2*xBorder-(numCards+1)*xDif)/numCards;
const cardWS = (cWidth-2*xBorder-(numCards+1)*xDifS)/numCards;
const HWr = 3/2;
const cardH = cardW*HWr;
const cardHS = cardWS*HWr;

ctx.globalCompositionOperation='destination-over';
BGctx.globalCompositionOperation='destination-over';

bCanvas.style.position = mainCanvas.style.position = BGCanvas.style.position = glassCanvas.style.position = 'absolute';
mainCanvas.width = BGCanvas.width = glassCanvas.width = cWidth;
mainCanvas.height = BGCanvas.height = glassCanvas.height = cHeight;

BGCanvas.style.zIndex = -1;
glassCanvas.style.zIndex = -1;

const setUp = (function(){
  const cardPicLoc = "./Images/Cards/";
  const picLoc = "./Images/Misc/";
  const cardImgMap = new Map();
  const miscImgMap = new Map();
  const pics = ['GalaxyBackground.jpg','LeftSideArrow.png','RightSideArrow.png','RedButtonMain.png'];
  const btnPics = [];
  const cardSuits = ['C','S','D','H'];
  const deckCards = []; //All cards in array unshuffled

  cardSuits.forEach((suit)=>{
    for(let i = 1; i<=13; i++){
      deckCards.push(i+suit);
    }
  });

  const deckPics = [];
  deckCards.forEach((card)=>{deckPics.push(card+'.png');})

  const promiseCardImgArr = asyncHelperFunctions.createPromImgArr(deckPics, cardImgMap, cardPicLoc);
  const promiseMiscPicArr = asyncHelperFunctions.createPromImgArr(pics, miscImgMap, picLoc);

  Promise.all(promiseCardImgArr.concat(promiseMiscPicArr)).then(()=>{
    drawBG();
    dealHand();
    drawCards();
  });

  function drawBG(){
    BGctx.drawImage(miscImgMap.get('GalaxyBackground'),0,0,cWidth,cHeight);
  }

  let hand = new Array(numCards);//Array of card objects
  let deck;

  function dealHand(){
    deck = deckCards.slice(0,52);
    const xStart = xBorder+xDif,
      yLoc = cHeight/2+xDif*HWr;
    for(let i = 0; i<numCards; i++){
      //Replace with difference random number generator
      hand[i] = {id:draw()};
      hand[i].x = xStart+i*(cardW+xDif);
      hand[i].y = yLoc;
      hand[i].w = cardW;
      hand[i].h = cardH;
      hand[i].selected = false;
    }
    return hand;
  }

  function draw(){
    let r = Math.floor(Math.random()*deck.length)
    return deck.splice(r,1)[0];
  }

  // defines card clickboxes and draws cards
  function drawCards(){
    ctx.clearRect(0,cHeight*0.55,cWidth,cHeight/2);
    for(let i = 0; i<numCards; i++){
      let c = hand[i];
      ctx.drawImage(setUp.cardImgMap.get(c.id),c.x,c.y,c.w,c.h);
    }
  }

  return{
    draw:draw,
    drawCards: drawCards,
    hand: hand,
    numCards: numCards,
    dealHand:dealHand,
    cardImgMap:cardImgMap,
    miscImgMap:miscImgMap,
  }

})()
