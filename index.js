import maps from "./map.js"

// !! ADD function help, show the way in a toggle button ?

const welcomeSection = document.getElementById("welcome-section")
const gameSection = document.getElementById("game-section")
const modalNextLevel = document.getElementById("dialog-level")
// const modalFinish = document.querySelector("dialog-finish")
const modalTreasure = document.getElementById("dialog-treasure")
const modalVillains = document.getElementById("dialog-villains")
// const modalHelp = document.getElementById("dialog-help")
const startButton = document.getElementById("start-game")
const gameContainer = document.getElementById("game")
// const restartButton = document.getElementById("restart-game")
const nextLevelButton = document.getElementById("next-level")
const scoreContainer = document.getElementById("score-container")
const scoreSection = document.getElementById("score")
const pointsContainer = document.getElementById("points-rules")

let cells = []
let playerPosition = 0
let level = 0
let score = 200
let keyFound = true
let movementY = 15
let gameActive = true

// !! UNCOMMENT WHEN DESIGN OK
// startButton.addEventListener("click", () => {
//   welcomeSection.setAttribute("hidden", true)
scoreContainer.removeAttribute("hidden")
gameSection.removeAttribute("hidden")
pointsContainer.removeAttribute("hidden")
generateTheBoard()
// })

// restartButton.addEventListener("click", restartTheGame)
nextLevelButton.addEventListener("click", goToNextLevel)

function closeDialogAfterDelay(dialog, delay) {
  setTimeout(function () {
    dialog.close();
  }, delay);
}

// function restartTheGame() {
//   playerPosition = 0
//   cells = []
//   gameContainer.innerHTML = ""
//   modal.close()
//   generateTheBoard()
// }
function goToNextLevel() {
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
      score = 1000
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
      div.classList.add("finish")
    }
    if (state === 4) {
      const numSVGs = getRandomInt(1, 4);
      div.classList.add(`treasure` + numSVGs);
    }
    if (state === 5) {
      div.classList.add("help")
    }
    if (state === 6) {
      // !! can show twice the same svg, way to improve it ?
      const numSVGs = getRandomInt(1, 3);
      div.classList.add(`villain` + numSVGs);
    }
    if (state === 7) {
      div.classList.add("key")
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
  if (treasures.some(treasure => cells[playerPosition].classList.contains(treasure))) {
    console.log("You found it");
    treasures.forEach(treasure => cells[playerPosition].classList.remove(treasure));
    // ?? check how many points
    score += 15;
    displayScore();
    //? add the svg displayed for this treasure
    modalTreasure.showModal()
    closeDialogAfterDelay(modalTreasure, 1500)
  }
}

function foundHelp() {
  if (cells[playerPosition].classList.contains("help")) {
    console.log("Here is some help to get there");
    cells[playerPosition].classList.remove("help");
    // ?? check how many points
    score += 10;
    console.log("+ 10 points");
    displayScore();
  }
}

function oopsVillain() {
  const villains = ["villain1", "villain2", "villain3", "villain4"];

  if (villains.some(villain => cells[playerPosition].classList.contains(villain))) {
    console.log("Oops you encounter a villain");
    villains.forEach(villain => cells[playerPosition].classList.remove(villain));
    // ?? remove the score if found it or end of the game ?
    // ?? check how many points
    score -= 50;
    displayScore();
    modalVillains.showModal()
    closeDialogAfterDelay(modalVillains, 1500)
  }
}

function foundTheKey() {
  if (cells[playerPosition].classList.contains("key")) {
    keyFound = true
    console.log("You found the key");
    cells[playerPosition].classList.remove("key");
    // ?? check how many points
    score += 25;
    console.log("+ 25 points");
    displayScore();
  }
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
    modalNextLevel.showModal()
  }
  gameOver();
}

// to add a number for the cell wall. Going to change the tree in a random way
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function theGameIsFinished() {
  if (cells[playerPosition].classList.contains("finish") && keyFound === false) {
    console.log("You need the key to exit")
  }
  return cells[playerPosition].classList.contains("finish") && keyFound;
}

function gameOver() {
  if (score <= 0) {
    score = 0
    gameActive = false;
    console.log("Game Over! Your score is 0.");
    // ??add a message when game over (in html ?)
  }
}
