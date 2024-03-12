import maps from "./map.js"

const welcomeSection = document.getElementById("welcome-section")
const gameSection = document.getElementById("game-section")
const modal = document.querySelector("dialog")
const startButton = document.getElementById("start-game")
const gameContainer = document.getElementById("game")
const restartButton = document.getElementById("restart-game")
const scoreSection = document.getElementById("score")

let cells = []
let playerPosition = 0
let level = 0
let score = 200
let keyFound = true
let movementY = 15
let gameActive = true

startButton.addEventListener("click", () => {
  welcomeSection.setAttribute("hidden", true)
  gameSection.removeAttribute("hidden")
  generateTheBoard()
})

restartButton.addEventListener("click", restartTheGame)

function restartTheGame() {
  playerPosition = 0
  cells = []
  gameContainer.innerHTML = ""
  modal.close()
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
    } else {
      movementY = 15
    }
    // div.textContent = i
    if (state === 1) {
      div.classList.add("wall")
    }
    if (state === 2) {
      playerPosition = i
    }
    if (state === 3) {
      div.classList.add("finish")
    }
    if (state === 4) {
      div.classList.add("treasure")
    }
    if (state === 5) {
      div.classList.add("help")
    }
    if (state === 6) {
      div.classList.add("villain")
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

function displayPlayer() {
  cells[playerPosition].classList.add("player")
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
  return cells[nextPosition].classList.contains("wall");
}

function foundATreasure() {
  if (cells[playerPosition].classList.contains("treasure")) {
    console.log("You found it");
    cells[playerPosition].classList.remove("treasure");
    // ?? check how many points
    score += 15;
    console.log("+ 15 points");
    displayScore();
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
  if (cells[playerPosition].classList.contains("villain")) {
    console.log("Oops you encounter a villain");
    cells[playerPosition].classList.remove("villain");
    // ?? remove the score if found it or end of the game ?
    // ?? check how many points
    score -= 50;
    console.log("-50 points");
    displayScore();
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
      displayPlayer()
      break
    case "left":
      hidePlayer()
      playerPosition--
      displayPlayer()
      break
    case "up":
      hidePlayer()
      playerPosition -= movementY
      displayPlayer()
      break
    case "down":
      hidePlayer()
      playerPosition += movementY
      displayPlayer()
      break
  }

  foundATreasure();
  foundHelp();
  oopsVillain();
  foundTheKey()

  if (theGameIsFinished()) {
    level++
    modal.showModal()
  }
  gameOver();
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
