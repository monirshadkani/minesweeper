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

let startTime = 0;  
let elapsedTime = 0; 
let running = false; 

easyButton.addEventListener('click', ()=> createGrid(9));
intermediateButton.addEventListener('click', ()=> createGrid(16));
expertButton.addEventListener('click', ()=> createGrid(22));
masterButton.addEventListener('click', ()=> createGrid(30));


function createGrid(number){

    resetTimer();
    
    flagCountDom.innerText = 0;

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

    if (cellsInfo[cellIndex].isFlagged || cellsInfo[cellIndex].isClicked) {
        return; 
    }

//first click
    if (!firstClicked && cellsInfo[cellIndex].isFlagged == false) {
        firstClicked = true;
        cellsInfo[cellIndex].isClicked = true;

        clickedCellDiv.firstChild.src = '/assets/empty.png';
        startTimer();


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

            for(let i = 0; i < cellsInfo.length; i++){
                if(cellsInfo[i].isBomb){
                    document.getElementById(`x${cellsInfo[i].xposition}y${cellsInfo[i].yposition}`).firstChild.src = '/assets/bomb.png';
                }
                else{
                    document.getElementById(`x${cellsInfo[i].xposition}y${cellsInfo[i].yposition}`).firstChild.src = '/assets/empty.png';
                }
            }
            stopTimer();
        }


    }
    expandCells(cellsInfo[cellIndex]);
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

    const cellIndex = cellsInfo.findIndex(cellObj => cellObj.isClicked === true);
    
    const bombIndexes = getRandomIntsWithExclusion(0, cellsInfo.length-1, cellIndex ,bombNumber);

    for(let i=0; i< bombIndexes.length; i++){
        
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

    if (!firstClicked) {
        alert("Start the game first by clicking any of the boxes!");
        return;
    }

    const bombCount = getBombCount();

    if (!cellsInfo[cellIndex].isFlagged && cellsInfo.filter(cell => cell.isFlagged).length >= bombCount) {
        alert("No more flags available!");
        return;
    }

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
 

function setFlagCount() {
    const bombCount = getBombCount(); 
    const flaggedCount = cellsInfo.filter(cell => cell.isFlagged).length;
    const remainingFlags = bombCount - flaggedCount;

    flagCountDom.innerText = remainingFlags >= 0 ? remainingFlags : 0;
}

function getCellIndex(x, y) {
    return cellsInfo.findIndex(cellObj => 
        cellObj.xposition === x && cellObj.yposition === y
    );
}

function expandCells(cell) {
    if(cell.isBomb){
        return;
    }
    if (cell.countNeighbourBombs() === 0) {
        const neighbors = cell.checkNeighbours();
        for (let i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i];

            if (!neighbor.isClicked) {
                neighbor.isClicked = true;
                const neighborCellDiv = document.getElementById(`x${neighbor.xposition}y${neighbor.yposition}`);
                
                if (neighbor.countNeighbourBombs() === 0) {
                    neighborCellDiv.firstChild.src = '/assets/empty.png';
                    expandCells(neighbor);
                } else {

                    neighborCellDiv.firstChild.src = `/assets/${neighbor.countNeighbourBombs()}.png`;

                }
            }
        }
    } else {

        const clickedCellDiv = document.getElementById(`x${cell.xposition}y${cell.yposition}`);
        clickedCellDiv.firstChild.src = `/assets/${cell.countNeighbourBombs()}.png`;

    }
}

function getBombCount() {
    return cellsInfo.filter(cell => cell.isBomb).length;
}




function startTimer() {
    if (!running) {
        startTime = Date.now() - elapsedTime;
        running = true;
        requestAnimationFrame(updateTimer);
    }
}

function stopTimer() {
    running = false;
}

function resetTimer() {
    startTime = 0;
    elapsedTime = 0;  
    running = false;
    updateTimerDisplay();  
}

function updateTimer() {
    if (running) {
        elapsedTime = Date.now() - startTime;  
        updateTimerDisplay();  
        requestAnimationFrame(updateTimer);  
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(elapsedTime / 60000);  // Convert to minutes
    const seconds = Math.floor((elapsedTime % 60000) / 1000);  // Convert to seconds
    const milliseconds = elapsedTime % 1000;  // Get the remaining milliseconds

    document.getElementById("timer").innerText = 
        `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}.${milliseconds < 100 ? "0" : ""}${milliseconds}`;
}




class Cell {
    constructor(xposition, yposition, isBomb, isClicked, isFlagged) {
        this.xposition = xposition; 
        this.yposition = yposition; 
        this.isBomb = isBomb;
        this.isClicked = isClicked;
        this.isFlagged = isFlagged;
    }

    checkNeighbours(){

        const neighbour1 = cellsInfo[getCellIndex(this.xposition-1, this.yposition)];
        const neighbour2 = cellsInfo[getCellIndex(this.xposition+1, this.yposition)];
        const neighbour3 = cellsInfo[getCellIndex(this.xposition,   this.yposition-1)];
        const neighbour4 = cellsInfo[getCellIndex(this.xposition,   this.yposition+1)];
        const neighbour5 = cellsInfo[getCellIndex(this.xposition-1, this.yposition-1)];
        const neighbour6 = cellsInfo[getCellIndex(this.xposition-1, this.yposition+1)];
        const neighbour7 = cellsInfo[getCellIndex(this.xposition+1, this.yposition-1)];
        const neighbour8 = cellsInfo[getCellIndex(this.xposition+1, this.yposition+1)];

        const neighbours = [neighbour1,neighbour2,neighbour3,neighbour4,neighbour5,neighbour6,neighbour7,neighbour8].filter(Boolean);
        return neighbours;
    }

    countNeighbourBombs() {
        const voisins = this.checkNeighbours();
        let count = 0; 
        for (let i = 0; i < voisins.length; i++) {
            if (voisins[i].isBomb) {
                count++;
            }
        }
        return count;
    }


}

