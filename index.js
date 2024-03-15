import maps from "./map.js"

// !! ADD function help, show the way in a toggle button ?
//SECTIONS / CONTAINERS
const welcomeSection = document.getElementById("welcome-section")
const gameSection = document.getElementById("game-section")
const scoreContainer = document.getElementById("score-container")
const scoreSection = document.getElementById("score")
const pointsContainer = document.getElementById("points-rules")
const bannerGame = document.getElementById("banner-game")
const gameCont = document.getElementById("game-container")
// MODAL
const modalNextLevel = document.getElementById("dialog-level")
const modalFinish = document.getElementById("dialog-finish")
const modalEndGame = document.getElementById("dialog-endgame")
const modalGameOver = document.getElementById("dialog-gameover")
const modalTreasure = document.getElementById("dialog-treasure")
const modalVillains = document.getElementById("dialog-villains")
const modalKeyNeeded = document.getElementById("key-needed")
const modalKeyFound = document.getElementById("dialog-key")
const modalHelp = document.getElementById("dialog-help")
// BUTTONS
const startButton = document.getElementById("start-game")
const backHomeButton = document.getElementById("back-home")
const endButton = document.getElementById("end-game")
const quitGame = document.getElementById("quit-game")
const gameContainer = document.getElementById("game")
const restartButton = document.getElementById("restart-game")
const nextLevelButton = document.getElementById("next-level")


let cells = []
let playerPosition = 0
let level = 0
// !! reput the right starter score
let score = 120
let previousScore = score
let keyFound = true
let movementY = 15
let gameActive = true

// !! UNCOMMENT WHEN DESIGN OK
startButton.addEventListener("click", () => {
  welcomeSection.setAttribute("hidden", true)
  pointsContainer.removeAttribute("hidden")
  scoreContainer.removeAttribute("hidden")
  gameSection.removeAttribute("hidden")
  bannerGame.removeAttribute("hidden")
  gameCont.removeAttribute("hidden")
  generateTheBoard()
})

quitGame.addEventListener("click", function () {
  modalGameOver.close()
  // !!here or in function endTheGame? or go to a new page : Goodbye page ?
  welcomeSection.removeAttribute("hidden")
  scoreContainer.setAttribute("hidden", true)
  gameSection.setAttribute("hidden", true)
  pointsContainer.setAttribute("hidden", true)
})

nextLevelButton.addEventListener("click", goToNextLevel)

restartButton.addEventListener("click", function () {
  console.log("Restart button clicked");
  restartTheGame();
})


// !! Check
function endTheGame() {
  modalEndGame.close()
  // !! Reactivate - HERE ?
  //   welcomeSection.removeAttribute("hidden")
  // scoreContainer.setAttribute("hidden", true)
  // gameSection.setAttribute("hidden", true)
  // pointsContainer.setAttribute("hidden", true)
}

function closeDialogAfterDelay(dialog, delay) {
  setTimeout(function () {
    const tempElement = dialog.querySelector('.temp');
    if (tempElement) {
      tempElement.remove();
    }
    dialog.close();
  }, delay);
}

function restartTheGame() {
  score = previousScore
  gameActive = true
  playerPosition = 0
  cells = []
  gameContainer.innerHTML = ""
  modalGameOver.close()
  generateTheBoard()
  console.log("Restart button clicked");
}

function goToNextLevel() {
  score += previousScore
  playerPosition = 0
  cells = []
  gameContainer.innerHTML = ""
  modalNextLevel.close()
  generateTheBoard()
}



function generateTheBoard() {
  const map = maps[level]
  for (let i = 0; i < map.length; i++) {
    const state = map[i]
    const div = document.createElement("div")
    div.classList.add("cell")
    if (map.length > 210) {
      div.classList.add("small")
      movementY = 30
      // Working? More steps?
      score = 400
    } else {
      movementY = 15
    }
    // div.textContent = i
    if (state === 1) {
      const numSVGs = getRandomInt(1, 9);
      div.classList.add(`wall` + numSVGs);
    }
    if (state === 2) {
      playerPosition = i
      div.classList.add("entry")
    }
    if (state === 3) {
      const numSVGs = getRandomInt(1, 3);
      div.classList.add(`finish` + numSVGs);
    }
    if (state === 4) {
      const numSVGs = getRandomInt(1, 4);
      div.classList.add(`treasure` + numSVGs);
    }
    if (state === 5) {
      const numSVGs = getRandomInt(1, 5);
      div.classList.add(`help` + numSVGs);
    }
    if (state === 6) {
      // !! can show twice the same svg, way to improve it ?
      const numSVGs = getRandomInt(1, 3);
      div.classList.add(`villain` + numSVGs);
    }
    if (state === 7) {
      const numSVGs = getRandomInt(1, 4);
      div.classList.add(`key` + numSVGs);
      keyFound = false
    }
    gameContainer.append(div)
    cells.push(div)
  }
  // console.log(cells)
  displayPlayer()
  displayScore()
}

function displayPlayer(move) {
  cells[playerPosition].classList.add("player")
  if (move === "up" || move === "down") {
    cells[playerPosition].classList.add("player")
  }
  if (move === "right") {
    cells[playerPosition].classList.add("right");
  }
  if (move === "left") {
    cells[playerPosition].classList.add("left");
  }
}

function hidePlayer() {
  cells[playerPosition].classList.remove("player")
}

function displayScore() {
  scoreSection.innerHTML = score
}

document.addEventListener("keydown", (event) => {
  console.log(event.key)
  event.preventDefault()
  switch (event.key) {
    case "ArrowRight":
      if (nextCellIsAWall(playerPosition + 1)) return
      move("right")
      break
    case "ArrowLeft":
      if (nextCellIsAWall(playerPosition - 1)) return
      move("left")
      break
    case "ArrowDown":
      if (nextCellIsAWall(playerPosition + movementY)) return
      move("down")
      break
    case "ArrowUp":
      if (nextCellIsAWall(playerPosition - movementY)) return
      move("up")
      break
  }
})

function nextCellIsAWall(nextPosition) {
  if (nextPosition < 0 || nextPosition >= cells.length) {
    return true;
  }
  return ["wall1", "wall2", "wall3", "wall4", "wall5", "wall6", "wall7", "wall8", "wall9"].some(wall => cells[nextPosition].classList.contains(wall));
}

function foundATreasure() {
  const treasures = ["treasure1", "treasure2", "treasure3", "treasure4"];
  const itsATreasure = treasures.find(treasure => cells[playerPosition].classList.contains(treasure))
  if (itsATreasure) {
    console.log(itsATreasure);
    cells[playerPosition].classList.remove(itsATreasure);
    // ?? check how many points
    score += 15;
    generateModal(modalTreasure, itsATreasure)
    displayScore();
    closeDialogAfterDelay(modalTreasure, 1000)
  }
}

function foundHelp() {
  const helps = ["help1", "help2", "help3", "help4", "help5"];
  const itsAnHelp = helps.find(help => cells[playerPosition].classList.contains(help))

  if (itsAnHelp) {
    console.log("Resources secured, let's make good use of them!");
    cells[playerPosition].classList.remove(itsAnHelp);
    // ?? check how many points
    score += 10;
    generateModal(modalHelp, itsAnHelp)
    displayScore();
    closeDialogAfterDelay(modalHelp, 1000)
  }
}

function oopsVillain() {
  const villains = ["villain1", "villain2", "villain3", "villain4"];
  const itsAVillains = villains.find(villain => cells[playerPosition].classList.contains(villain))

  if (itsAVillains) {
    console.log("Oops you encounter a villain");
    cells[playerPosition].classList.remove(itsAVillains);
    // ?? remove the score if found it or end of the game ?
    // ?? check how many points
    score -= 30;
    generateModal(modalVillains, itsAVillains)
    displayScore();
    closeDialogAfterDelay(modalVillains, 1000)
  }
}

function foundTheKey() {
  const keys = ["key1", "key2", "key3", "key4"];

  if (keys.some(key => cells[playerPosition].classList.contains(key))) {
    keyFound = true
    console.log("Yay you found the key");
    keys.forEach(key => cells[playerPosition].classList.remove(key));
    // ?? check how many points
    score += 25;
    console.log("+ 25 points");
    displayScore();
    modalKeyFound.showModal()
    closeDialogAfterDelay(modalKeyFound, 1000)
  }
}

function generateModal(modal, image) {
  const div = document.createElement('div')
  div.classList.add(image, 'temp')
  div.style.height = "100px"
  div.style.width = "100px"
  const containerInner = modal.querySelector(".container-inner");
  const content = containerInner.querySelector(".content");
  const contentImgDiv = content.querySelector(".content-img");
  contentImgDiv.appendChild(div)
  // content.insertBefore(div, pElement);
  modal.showModal()
}


function move(direction) {
  if (!gameActive) return
  score -= 2;
  displayScore();


  switch (direction) {
    case "right":
      hidePlayer()
      playerPosition++
      displayPlayer("right")
      break
    case "left":
      hidePlayer()
      playerPosition--
      displayPlayer("left")
      break
    case "up":
      hidePlayer()
      playerPosition -= movementY
      displayPlayer("up")
      break
    case "down":
      hidePlayer()
      playerPosition += movementY
      displayPlayer("down")
      break
  }

  foundATreasure();
  foundHelp();
  oopsVillain();
  foundTheKey()

  if (theGameIsFinished()) {
    level++
    previousScore += score
    if (level === maps.length) {
      modalFinish.showModal()
      return
    }
    modalNextLevel.showModal()
  }
  gameOver();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function theGameIsFinished() {
  const exits = ["finish1", "finish2", "finish3"];
  const itsAnExit = exits.find(exit => cells[playerPosition].classList.contains(exit));
  if (itsAnExit && keyFound === false) {
    console.log("You need the key to exit")
    modalKeyNeeded.showModal();
    closeDialogAfterDelay(modalKeyNeeded, 1500)
    return false
  } else if (itsAnExit && keyFound) {
    return true
  }
}

function gameOver() {
  if (score <= 0) {
    console.log("Score is zero or negative");
    // score = 5
    gameActive = false;
    modalGameOver.showModal()    // ??add a message when game over (in html ?)

  }
}
