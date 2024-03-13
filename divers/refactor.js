// TO MAKE THIS SHORTER :
return cells[nextPosition].classList.contains("wall1") || cells[nextPosition].classList.contains("wall2") || cells[nextPosition].classList.contains("wall3") || cells[nextPosition].classList.contains("wall4") || cells[nextPosition].classList.contains("wall5")
// WE CAN DO THIS
// return ["wall1", "wall2", "wall3", "wall4", "wall5"].some(wall => cells[nextPosition].classList.contains(wall));


return ["villain1", "villain2", "villain3"].some(villain => cells[nextPosition].classList.contains(villain));



if (cells[playerPosition].classList.contains("villain")) {
  console.log("Oops you encounter a villain");
  cells[playerPosition].classList.remove("villain");
}

if (cells[playerPosition].classList.contains("villain1") || cells[playerPosition].classList.contains("villain2") || cells[playerPosition].classList.contains("villain3") || cells[playerPosition].classList.contains("villain4")) {
  console.log("Oops you encounter a villain");
  cells[playerPosition].classList.remove("villain");
}
