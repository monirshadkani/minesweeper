//hello😊

const easyButton = document.getElementById('easy');
const intermediateButton = document.getElementById('intermediate');
const expertButton = document.getElementById('expert');
const masterButton = document.getElementById('master');

const grid = document.getElementById('grid');

const cellsInfo =[];
let firstClicked = false;

easyButton.addEventListener('click', ()=> createGrid(9));
intermediateButton.addEventListener('click', ()=> createGrid(16));
expertButton.addEventListener('click', ()=> createGrid(22));
masterButton.addEventListener('click', ()=> createGrid(30));


function createGrid(number){
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

            const cellObj = new Cell(i, j, false, false)
            cellsInfo.push(cellObj);

            const image = cell.appendChild(img);
            image.src = '/assets/normal.png';
            grid.appendChild(cell);

        } 
    }
    grid.addEventListener('click', clickAction);

}


const clickAction = (e) => {
    if (!firstClicked) {
        firstClicked = true;
        console.log(cellsInfo)
        console.log(cellsInfo.length)

        const x = parseInt(e.target.parentElement.getAttribute('x-p'));
        const y = parseInt(e.target.parentElement.getAttribute('y-p')); 

        const cellIndex = cellsInfo.findIndex(cellObj => 
            cellObj.xposition === x && cellObj.yposition === y
        );

        cellsInfo[cellIndex].isClicked = true;
        const clickedCellDiv = document.getElementById(`x${x}y${y}`);
        clickedCellDiv.firstChild.src = '/assets/empty.png';
        
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
    const results = [];
    while (results.length < count) {
        const randomInt = getRandomIntWithExclusion(min, max, excluded);
        results.push(randomInt);
    }
    return results;
}

function setBombs(bombNumber) {

}

class Cell {
    constructor(xposition, yposition, isBomb, isClicked) {
        this.xposition = xposition; 
        this.yposition = yposition; 
        this.isBomb = isBomb;
        this.isClicked = isClicked;
    }
}