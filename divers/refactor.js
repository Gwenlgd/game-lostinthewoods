// TO MAKE THIS SHORTER :
return cells[nextPosition].classList.contains("wall1") || cells[nextPosition].classList.contains("wall2") || cells[nextPosition].classList.contains("wall3") || cells[nextPosition].classList.contains("wall4") || cells[nextPosition].classList.contains("wall5")
// WE CAN DO THIS
// return ["wall1", "wall2", "wall3", "wall4", "wall5"].some(wall => cells[nextPosition].classList.contains(wall));
