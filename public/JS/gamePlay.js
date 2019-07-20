"use strict";

const account = {
  balance: 10000,
  bet: 100
}

let draw = false;
let canPlay = true;
let hand = setUp.hand;
const winningSound = new asyncHelperFunctions.Sound('./Sounds/ElectroWin.wav');


function discardAndDraw(){
  for(let i = 0; i<numCards; i++){
    let c = hand[i];
    if(hand[i].selected==false){hand[i].id = setUp.draw();}
    const xStart = xBorder+xDifS,
      yLoc = cHeight/2+xDifS*HWr;
    c.x = xStart+i*(cardWS+xDifS); c.y = yLoc;
    c.w = cardWS; c.h = cardHS;
    c.selected = true;
  }
  setUp.drawCards()
  glassCanvas.style.zIndex = 1;
}

function newHand(){
  let newBalance = account.balance-account.bet;
  anictx.clearRect(0,0,cWidth,cHeight);
  if(newBalance<0){
    glassCanvas.style.zIndex = 1;
    canPlay = false;
    console.log('Insufficient Balance');
  }else{
    canPlay = true;
    account.balance = newBalance;
    hand = setUp.dealHand();
    setUp.drawCards();
    glassCanvas.style.zIndex = -1;
  }
}

function findWinners(){
  let cardNums = hand.map(card=>card.id.substring(0,card.id.length-1)).map(num=>parseInt(num)).sort((a,b)=>a-b);
  let cardSuits = hand.map(card=>card.id.substring(card.id.length-1,card.id.length)).sort();
  cardSuits.sort();

  const yWinDisplay = cHeight*0.75;
  ctx.fillStyle = 'rgb(180,15,15)';
  ctx.shadowOffsetX = cWidth/200;
  ctx.shadowOffsetY = cHeight/200;
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 4;
  ctx.font = cHeight/5+"px Arial";
  let nDoubles=0,
    nTrips=0,
    pairs = [];

  //check for pairs/trips/four of a kind
  for(let i = 0; i<numCards-1; i++){
    if(cardNums[i]==cardNums[i+1]){
      if(cardNums[i]==cardNums[i+2]&&i<numCards-2){
        if(cardNums[i]==cardNums[i+3]&&i<numCards-3){
          return displayWinners('4 of a Kind');
        }else{i++;nTrips++;}
      }else{nDoubles++; pairs.push(cardNums[i])}
    }
  }

  if(nDoubles===1&&nTrips===1){
    return displayWinners('Full House');
  }else if(nDoubles===2){
    return displayWinners('2 Pair');
  }else if(nTrips==1){
    return displayWinners('3 of a Kind');
  }else if(nDoubles===1 && (parseInt(pairs[0])>10||parseInt(pairs[0])===1)){
    return displayWinners('Jacks or Better');
  }

  let uniqCardNums = [...new Set(cardNums)];
  let uniqCardSuits = [...new Set(cardSuits)];

  if(uniqCardSuits.length==1){
    if(uniqCardNums.length==5){
      if(uniqCardNums[0]==1&&uniqCardNums[1]==10&&uniqCardNums[4]==13){
        return displayWinners('Royal Flush');
      }else if(uniqCardNums[4]-uniqCardNums[0]==4){
        return displayWinners('Straight Flush');
      }else{
        return displayWinners('Flush');
      }

    }else{
      return displayWinners('Flush');
    }

  }else if(uniqCardNums.length==5){
    if((uniqCardNums[4]-uniqCardNums[0]==4)||(uniqCardNums[0]==1&&uniqCardNums[1]==10&&uniqCardNums[4]==13)){
      return displayWinners('Straight');
    }
  }
  return 0;
}

function displayWinners(winner){
  const yWinDisplay = cHeight*0.75;
  const PT = PTCords;
  const boxH = Math.floor(cHeight/15), boxW = Math.floor(cWidth/15);
  anictx.fillStyle = 'yellow';
  anictx.globalAlpha = 0.6;

  anictx.fillRect(PT.xMargin+PT.maxW+PT.xDif*account.bet/100-boxW/2, PT.yTop+PT.yDif*PTKeys.indexOf(winner)-boxH/2,boxW,boxH);
  ctx.fillText(winner,cWidth/2,yWinDisplay, cWidth*0.95);
  return account.bet*paytableMap.get(winner);
}

function updateBalance(){
  let payout = findWinners();
  if(payout!=0){console.log('play sound');winningSound.play();}
  account.balance+=payout;
  console.log('Balance: ', account.balance);
}
