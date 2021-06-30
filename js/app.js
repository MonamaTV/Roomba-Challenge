//Loading all the DOM elements before the game
//Author: Monama Tadima Vincent
//Github: Monama_Tv
const game = document.getElementById("game");
const scoreElem = document.querySelector(".score span");
const movesElem = document.querySelector(".moves span");
const dirtyElem = document.querySelector(".dirty span");
const message = document.querySelector(".message");
const details = document.querySelector(".more-details");
const updater = document.querySelector(".game-details");
const container = document.querySelector(".game-container");
const more = document.querySelector(".more");

const ROWS = 8;
const COLS = 8;

//Game objects
const ROOMBA = 1;
const DIRTY = -1;
const CLEAN = 0;

//The initial position of the Rooma
let roombaRow = 7;
let roombaCol = 0;

const STARTINGROW = 7;
const STARTINGCOL = 0;

let score = 0;
let moves = 1000;
let dirtyTiles = 18;
let gameArray = [];

const initializeGame = () => {
    //Fill the array with clean tiles then place the player, then dirty tiles
    for(let row = 0; row < ROWS; row++) {
        let subArray = []
        for(let col = 0; col < COLS; col++) {
            subArray.push(0)
        }
        gameArray.push(subArray);
    }
    //Place roomba at the initial position
    gameArray[7][0] = 1;
    // //Fill the array with the dirty tiles
    fillTheGameWithDirtyTiles();
    //After initializing the array, display the game
    renderGame();
}
//Filling in the array with the dirty squares
const fillTheGameWithDirtyTiles = () => {

    let dirtyTilesCounter = 0;
    let pointX = generateRandomNumber();
    let pointY = generateRandomNumber();

    //
    while(dirtyTilesCounter < dirtyTiles) {
        if(gameArray[pointX][pointY] === 0) {
            gameArray[pointX][pointY] = -1;
            dirtyTilesCounter++;
        }
        pointX = generateRandomNumber();
        pointY = generateRandomNumber();
    }
}
//Get random spot to place the dirty tiles
const generateRandomNumber = () =>  Math.floor(Math.random() * 8);

//Render the game
const renderGame = () => {
    game.innerHTML = ""
     //Fill the array with clean tiles then place the player, then dirty tiles
     for(let row = 0; row < ROWS; row++) {  
        for(let col = 0; col < COLS; col++) {
            if(gameArray[row][col] === 0) {
                game.innerHTML += "<div class='tile'></div";
            }
            if(gameArray[row][col] === 1) {
                game.innerHTML += "<div class='roomba'></div";
            }
            if(gameArray[row][col] === -1) {
                game.innerHTML += "<div class='dirty-tile'></div";
            }
        }
        game.innerHTML += "<br />";
    }
}

//Listens to key presses
document.addEventListener("keydown", e => {

    //prevent the default behaviour of the keys
    e.preventDefault();

    const oldX = roombaRow;
    const oldY = roombaCol;

    //We only listen to moves or presses from the arrow keys
    if(e.code === "ArrowLeft") {
        //if your moves is out of bounce, we restrict your move
        if((roombaCol - 1) < 0) return;
        roombaCol--;
        movePlayer(roombaRow, roombaCol, oldX, oldY)
    }
    if(e.code === "ArrowUp") {
        if((roombaRow - 1) < 0) return;
        roombaRow--;
        movePlayer(roombaRow, roombaCol, oldX, oldY);
    }
    if(e.code === "ArrowRight") {
        if((roombaCol + 1) >= 8) return;
        roombaCol++;
        movePlayer(roombaRow, roombaCol, oldX, oldY);
    }
    if(e.code === "ArrowDown") {
        if((roombaRow + 1) >= 8) return;
        roombaRow++;
        movePlayer(roombaRow, roombaCol, oldX, oldY);
    }
   
})


const movePlayer = (x, y, oldx, oldy) => {
  
    //When moving the roomba, there are couple of updates we need to make
    if(gameArray[x][y] === -1) {
        updateScore(true);
        updateDirtyTiles();
    }
    updateScore(false);
    //Moves the Roomba
    gameArray[x][y] = 1;
    //Places a clean tile where Roomba was
    gameArray[oldx][oldy] = 0;
    updateMoves();
    checkGameState();
    renderGame();
}

const updateMoves = () => {
    moves--;
    movesElem.innerText = moves;
}
//Your score either gains or loses points
const updateScore = (gains) => {
    score = gains ? score + 250 : score - 10;
    scoreElem.innerText = score;
}
const updateDirtyTiles = () => {
    dirtyTiles--;
    dirtyElem.innerText = dirtyTiles;
}
//Check if the player has won or lost
const checkGameState = () => {
    //If you ran out of moves and still have dirty tiles to clean, you have lost
    if(moves < 1 && dirtyTiles > 0) {
        container.style.display = "none";
        updater.style.display = "none";
        more.className = "game-state";
        message.className = "lost";
        details.className = "win";
        message.innerText = "Sorry, you could not accomplish the mission😥";
        details.innerText = `Score: ${score}, moves remaining: ${moves}`;
    }
    //If you are at your starting position, still have moves and with no dirty tiles, you are a champ...💪🏋️‍♂️⛹️‍♂️🚴‍♂️
    if(gameArray[STARTINGROW][STARTINGCOL] === ROOMBA && moves > 0 && dirtyTiles < 1) {
        container.style.display = "none";
        updater.style.display = "none";
        more.className = "game-state";
        message.className = "win";
        details.className = "win";
        message.innerText = "Congratulations, you have won🎉🎊🎉🎉";
        details.innerText = `Score: ${score}, moves remaining: ${moves}`;
    }

}


//Basically, the beginning of simulation
initializeGame();

