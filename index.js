const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 5;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Get high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Pass a random as food position
const updateFoodPosition = () => {
  foodX = Math.ceil(Math.random() * 30);
  foodY = Math.ceil(Math.random() * 30);
  if (foodX === snakeX && foodY === snakeY) updateFoodPosition();
};

// Function to handle the end of a game
const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Game Over. Press OK to replay...");
  location.reload();
};

// Function to change direction based on what key is clicked
const changeDirection = (e) => {
  console.log(e.key)
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  }
};

// Change direction on each key click
controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key })
  )
);

// Game initialization
const initGame = () => {
  if (gameOver) return handleGameOver();
  let html = `<divl class="food" style="grid-area: ${foodY} / ${foodX}"></divl>`;

  // When snake eat food
  if (snakeX === foodX && snakeY === foodY) {
    console.log("ate")
    updateFoodPosition();
    snakeBody.push([foodY, foodX]); // Add food to snake body array

    score++;
    highScore = score >= highScore ? score : highScore; // if score > highscore, highscore = score

    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }

  // update snake head
  snakeX += velocityX;
  snakeY += velocityY;

  // Shifting values of elements in the snake body forward by one
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  // Check if snake is outside the wall
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    return (gameOver = true);
  }

  // Add div for each part of the snake body
  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 150);
document.addEventListener("keydown", (e) => {
  changeDirection(e)
});
