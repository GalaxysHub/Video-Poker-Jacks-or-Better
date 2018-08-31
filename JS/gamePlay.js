"use strict";

const account = {
  balance: 10000,
  bet: 100
}

let draw = false;
let hand = setUp.hand;


const paytableMap = new Map([
  ["Number of Coins", 1],
  ["Royal Flush", 250],
  ["Straight Flush", 50],
  ["4 of a Kind", 25],
  ["Full House", 9],
  ["Flush", 6],
  ["Straight", 4],
  ["3 of a Kind", 3],
  ["2 Pair", 2],
  ["Jacks or Better", 1],
])

let cardNums;
let cardSuits;
let uniqCardNums;
let uniqCardSuits;

function discardAndDraw(){
  for(let i = 0; i<numCards; i++){
    let c = hand[i];
    if(hand[i].selected==false){hand[i].id = setUp.draw();}
    const xStart = xBorder+xDifS,
      yLoc = cHeight/2+xDifS*HWr;
    c.x = xStart+i*(cardWS+xDifS);
    c.y = yLoc;
    c.w = cardWS;
    c.h = cardHS;
    c.selected = true;
  }
  setUp.drawCards()
  glassCanvas.style.zIndex = 1;
}

function newHand(){

  let newBalance = account.balance-=account.bet;
  if(newBalance<0){
    glassCanvas.zindex = 1;
    console.log('Insufficient Balance');
  }else{account.balance = newBalance;}

  hand = setUp.dealHand();
  setUp.drawCards();
  glassCanvas.style.zIndex = -1;
}

function findWinners(){
  cardNums = hand.map(card=>card.id.substring(0,card.id.length-1)).map(num=>parseInt(num)).sort((a,b)=>a-b);
  cardSuits = hand.map(card=>card.id.substring(card.id.length-1,card.id.length)).sort();
  cardSuits.sort();

  let nDoubles=0;
  let nTrips=0;
  let pairs = [];
  //check for pairs/trips/four of a kind
  for(let i = 0; i<numCards-1; i++){
    if(cardNums[i]==cardNums[i+1]){
      if(cardNums[i]==cardNums[i+2]&&i<numCards-2){
        if(cardNums[i]==cardNums[i+3]&&i<numCards-3){
          console.log('Four of a Kind');
          return account.bet*paytableMap.get('4 of a Kind');
        }else{i++;nTrips++;}
      }else{nDoubles++; pairs.push(cardNums[i])}
    }
  }

  // console.log('pairs',pairs);

  if(nDoubles===1&&nTrips===1){
    console.log('Full House');
    return account.bet*paytableMap.get('Full House');
  }else if(nDoubles===2){
    console.log('Two Pair');
    return account.bet*paytableMap.get('2 Pair');
  }else if(nTrips==1){
    console.log('Trips');
    return account.bet*paytableMap.get('3 of a Kind');
  }else if(nDoubles===1 && (parseInt(pairs[0])>10||parseInt(pairs[0])===1)){
    console.log('Jacks or Better');
    return account.bet*paytableMap.get('Jacks or Better');
  }

  uniqCardNums = [...new Set(cardNums)];
  uniqCardSuits = [...new Set(cardSuits)];

  // console.log(cardNums);
  // console.log(cardSuits);
  // console.log(uniqCardNums);
  // console.log(uniqCardSuits);

  if(uniqCardSuits.length==1){

    if(uniqCardNums.length==5){

      if(uniqCardNums[0]==1&&uniqCardNums[1]==10&&uniqCardNums[4]==13){
        console.log('Royal Flush');
        return account.bet*paytableMap.get('Royal Flush');
      }else if(uniqCardNums[4]-uniqCardNums[0]==4){
        console.log('Straight Flush');
        return account.bet*paytableMap.get('Straight Flush');
      }else{
        console.log('Flush');
        return account.bet*paytableMap.get('Flush');
      }
    }else{
      console.log('Flush');
      return account.bet*paytableMap.get('Flush');
    }
  }else if(uniqCardNums.length==5){
    if((uniqCardNums[4]-uniqCardNums[0]==4)||(uniqCardNums[0]==1&&uniqCardNums[1]==10&&uniqCardNums[4]==13)){
      console.log('Straight');
      return account.bet*paytableMap.get('Straight');
    }
  }
  return 0;
}

function updateBalance(){
  account.balance+=findWinners();
  console.log('Balance: ', account.balance);
}
