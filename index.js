//hello😊

const easyButton = document.getElementById('easy');
const intermediateButton = document.getElementById('intermediate');
const expertButton = document.getElementById('expert');
const masterButton = document.getElementById('master');

const flagCountDom = document.getElementById('counter')

const grid = document.getElementById('grid');

const cellsInfo =[];
const bombCount= 0;

let firstClicked = false;

easyButton.addEventListener('click', ()=> createGrid(9));
intermediateButton.addEventListener('click', ()=> createGrid(16));
expertButton.addEventListener('click', ()=> createGrid(22));
masterButton.addEventListener('click', ()=> createGrid(30));


function createGrid(number){
    flagCountDom.innerText = 0
    cellsInfo.length =0;
    grid.innerHTML = '';
    firstClicked = false;

    grid.style.gridTemplateColumns = `repeat(${number}, 20px)`;
    grid.style.gridTemplateRows = `repeat(${number}, 20px)`;

    for (let i = 1; i <= number; i++) {
        for (let j = 1; j <= number; j++){
            const cell = document.createElement('div');
            const img = document.createElement('img');
            cell.setAttribute('x-p', i);
            cell.setAttribute('y-p', j);
            cell.setAttribute('id', 'x'+i+'y'+j);

            const cellObj = new Cell(i, j, false, false, false)
            cellsInfo.push(cellObj);

            const image = cell.appendChild(img);
            image.src = '/assets/normal.png';
            grid.appendChild(cell);

        } 
    }
    grid.addEventListener('click', clickAction);
    grid.addEventListener('contextmenu', rightClickHandler);

}

const rightClickHandler = (e) => {
    e.preventDefault();
    setFlag(e);
}

const clickAction = (e) => {

    const x = parseInt(e.target.parentElement.getAttribute('x-p'));
    const y = parseInt(e.target.parentElement.getAttribute('y-p'));
    const clickedCellDiv = document.getElementById(`x${x}y${y}`);

    const cellIndex = cellsInfo.findIndex(cellObj => 
        cellObj.xposition === x && cellObj.yposition === y
    );

//first click
    if (!firstClicked && cellsInfo[cellIndex].isFlagged == false) {
        firstClicked = true;
        cellsInfo[cellIndex].isClicked = true;
        clickedCellDiv.firstChild.src = '/assets/empty.png';

        switch(cellsInfo.length) {
            case 81:
                setBombs(10)
              break;
            case 256:
                setBombs(40)
              break;
            case 484:
                setBombs(100)
                break;
            case 900:
                setBombs(250)
                break;
            default:
              alert('There was a problem generating bombs')
          }
    }
//any other clicks

    else if( firstClicked && cellsInfo[cellIndex].isFlagged == false){
        if (!cellsInfo[cellIndex].isBomb){
            clickedCellDiv.firstChild.src = '/assets/empty.png';
        }
        else{
            grid.removeEventListener('click', clickAction);
            grid.removeEventListener('contextmenu', rightClickHandler)

            for(i = 0; i < cellsInfo.length; i++){
                if(cellsInfo[i].isBomb){
                    document.getElementById(`x${cellsInfo[i].xposition}y${cellsInfo[i].yposition}`).firstChild.src = '/assets/bomb.png';
                }
                else{
                    document.getElementById(`x${cellsInfo[i].xposition}y${cellsInfo[i].yposition}`).firstChild.src = '/assets/empty.png';
                }
            }
        }


    }
};


function getRandomIntWithExclusion(min, max, excluded) {
    let randomInt;
    do {
        randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (randomInt === excluded);
    return randomInt;
}

function getRandomIntsWithExclusion(min, max, excluded, count) {
    const results = new Set();
    while (results.size < count) {
        const randomInt = getRandomIntWithExclusion(min, max, excluded);
        results.add(randomInt);
    }
    return Array.from(results); 
}

function setBombs(bombNumber) {

    const cellIndex = cellsInfo.findIndex(cellObj => 
        cellObj.isClicked = true
    );
    const bombIndexes = getRandomIntsWithExclusion(0, cellsInfo.length-1, cellIndex ,bombNumber);

    for(i=0; i< bombIndexes.length; i++){
        
        cellsInfo[bombIndexes[i]].isBomb = true;
    }

}

function setFlag(e){

    const x = parseInt(e.target.parentElement.getAttribute('x-p'));
    const y = parseInt(e.target.parentElement.getAttribute('y-p'));
    const clickedCellDiv = document.getElementById(`x${x}y${y}`);

    const cellIndex = cellsInfo.findIndex(cellObj => 
        cellObj.xposition === x && cellObj.yposition === y
    );
    if(cellsInfo[cellIndex].isFlagged == false && cellsInfo[cellIndex].isClicked == false){

    cellsInfo[cellIndex].isFlagged = true;
    clickedCellDiv.firstChild.src = '/assets/flag.png';

    }
    else if(cellsInfo[cellIndex].isFlagged == true && cellsInfo[cellIndex].isClicked == false){
        clickedCellDiv.firstChild.src = '/assets/normal.png';
        cellsInfo[cellIndex].isFlagged = false;

    }

    setFlagCount()
}
 

function setFlagCount(){
    
    flagCountDom.innerText = cellsInfo.filter(cell => cell.isFlagged).length;
}


class Cell {
    constructor(xposition, yposition, isBomb, isClicked, isFlagged) {
        this.xposition = xposition; 
        this.yposition = yposition; 
        this.isBomb = isBomb;
        this.isClicked = isClicked;
        this.isFlagged = isFlagged;
    }
}