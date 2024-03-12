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
      div.classList.add("villain")
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
      if ((playerPosition + 1) % 15 === 0) return
      move("right")
      break
    case "ArrowLeft":
      if (nextCellIsAWall(playerPosition - 1)) return
      if (playerPosition % 15 === 0) return
      move("left")
      break
    case "ArrowDown":
      if (nextCellIsAWall(playerPosition + 15)) return
      if (playerPosition >= 190) return
      move("down")
      break
    case "ArrowUp":
      if (nextCellIsAWall(playerPosition - 15)) return
      if (playerPosition < 15) return
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
    console.log("You find it");
    cells[playerPosition].classList.remove("treasure");
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

function move(direction) {
  switch (direction) {
    case "right":
      if (nextCellIsAWall(playerPosition + 1) || (playerPosition + 1) % 15 === 0) return;
      hidePlayer()
      playerPosition++
      displayPlayer()
      break
    case "left":
      if (nextCellIsAWall(playerPosition - 1) || playerPosition % 15 === 0) return;
      hidePlayer()
      playerPosition--
      displayPlayer()
      break
    case "up":
      if (nextCellIsAWall(playerPosition - 15) || playerPosition < 15) return;
      hidePlayer()
      playerPosition -= 15
      displayPlayer()
      break
    case "down":
      if (nextCellIsAWall(playerPosition + 15) || playerPosition >= 190) return;
      hidePlayer()
      playerPosition += 15
      displayPlayer()
      break
  }

  foundATreasure();
  oopsVillain()

  if (theGameIsFinished()) {
    level++
    modal.showModal()
  }
}

function theGameIsFinished() {
  return cells[playerPosition].classList.contains("finish")
}
