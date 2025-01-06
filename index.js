

const easyButton = document.getElementById('easy');
const intermediateButton = document.getElementById('intermediate');
const expertButton = document.getElementById('expert');

const grid = document.getElementById('grid');

const cellsInfo =[];

easyButton.addEventListener('click', ()=> createGrid(9));
intermediateButton.addEventListener('click', ()=> createGrid(16));
expertButton.addEventListener('click', ()=> createGrid(22));


function createGrid(number){
    cellsInfo.length =0;
    grid.innerHTML = '';

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
    console.log(cellsInfo)
}

const clickAction = (e) => {
    //first click
    if (grid.getAttribute('firstClicked') === 'false') {
        grid.setAttribute('firstClicked', 'true');
        console.log(cellsInfo)

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

class Cell {
    constructor(xposition, yposition, isBomb, isClicked) {
        this.xposition = xposition; 
        this.yposition = yposition; 
        this.isBomb = isBomb;
        this.isClicked = isClicked;
    }
}