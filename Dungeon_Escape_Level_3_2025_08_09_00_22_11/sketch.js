let x = 100,
  y = 100;
let character;
let door;
let gameBackground;
let turnBack;
let niceJob;
let angle1 = 0.0,
  segLength = 50;
let insideVertices = false;
let isPaused = false;
let squareX = 908;
let squareY = 410;
let squareSize = 100;
let timerDuration = 25000; // 25 seconds
let startTime;
let gameActive = true;
let gameOver;
let initial5SecondsPassed = false;
let remainingTime;
const vertices = [0, 520, 0, 0, 75, 0, 70, 490, 200, 450, 350, 400, 500, 355, 700, 350, 980, 410, 980, 520, 500, 400, 100, 525];


// Define the boundaries of the invisible wall
// Adjust these values as needed
const wallRight = 600;

function setup() {
  createCanvas(1000, 600);

  niceJob = createImg('fc5e5179e126bb8b8878c65ed0639179-great-job-badge (1).png', 'niceJobImg');
   gameBackground = loadImage('haunted-dungeon-game-background_7814-476.avif');
  character = createImg('CEK35f.png', 'characterImg');
  door = createImg('object-door-dungeon-1.png', 'doorImg');
  turnBack = createImg('Screenshot 2023-11-16 at 3.23.50 AM.png', 'turnBackImg');
  gameOver = createImg('Screenshot 2023-11-15 at 10.13.05 PM.png', 'gameOverImg')

  strokeWeight(2.0);
  stroke(255, 100);

  // Set up the restart button
  let restartButton = createButton('Restart');
  restartButton.position(width / 2 - 50, height - 50);
  restartButton.mousePressed(restartGame);

  // Initialize the start time
  startTime = millis();
}

function draw() {
  resetbackg();
  
  
  dx = mouseX - x;
  dy = mouseY - y;
  angle1 = atan2(dy, dx);
  x = mouseX - cos(angle1) * segLength;
  y = mouseY - sin(angle1) * segLength;

  // Check if the mouse is inside the defined vertices
  insideVertices = pointInPolygon(
    mouseX,
    mouseY,
    [0, 520, 0, 0, 75, 0, 70, 490, 200, 450, 350, 400, 500, 355, 700, 350, 980, 410, 980, 520, 500, 400, 100, 525]
  );

  let insideSquare = mouseX > squareX && mouseX < squareX + squareSize && mouseY > squareY && mouseY < squareY + squareSize;

  // Adds an invisible wall that is only there when the user is not inside the vertices.
  if (!insideVertices && x > wallRight) {
    x = wallRight;
  }
  
   if (remainingTime <= 5000) {
    initial5SecondsPassed = true;
  }

  if (initial5SecondsPassed && remainingTime <= 35000 && remainingTime > 30000) {
    image(turnBack, 200, 200);
  }

  if (!insideVertices) {
    
    isPaused = true; // Pause the game when outside the region
    image(turnBack, 280, 200);
    insideSquare = false;
  } else if (insideSquare) {
    noLoop();
    image(niceJob, 225, -80); // Adjust the position as needed
    console.log('Game Complete!');
} else {
    isPaused = false; // Resume the game when inside the region
  }

  if (!isPaused) {
    // If the game is not paused, continue drawing other elements
    drawZigzagLinesOutsideRegion();
     // Reset the character's position when the game is active
    //cha();
  }

  // Creates a rectangle around the door
  noFill();
  noStroke();
  rect(squareX, squareY, squareSize, squareSize);
  image(door, 895, 410, 100, 100);
  image(character, x, y, 50, 50);

  if (gameActive) {
    drawTimer();
  }
}

function drawZigzagLinesOutsideRegion() {
  // Draw zigzag lines when outside the region
  stroke(255);
  noFill();
  beginShape();
  for (let x = 0; x < 1120; x += 100) {
    let y = height / 2 + 60 * sin(TWO_PI * x / width);
    vertex(x - 200, y + 150);
    vertex(x + 5 - 200, y + 130); // Zigzag: Add a point slightly above the current point
  }
  endShape();
}

// Function to check if a point is inside a polygon
function pointInPolygon(x, y, vertices) {
  let oddNodes = false;
  let j = vertices.length - 2;

  for (let i = 0; i < vertices.length; i += 2) {
    const xi = vertices[i];
    const yi = vertices[i + 1];
    const xj = vertices[j];
    const yj = vertices[j + 1];

    if ((yi < y && yj >= y || yj < y && yi >= y) && (xi <= x || xj <= x)) {
      if (xi + ((y - yi) / (yj - yi)) * (xj - xi) < x) {
        oddNodes = !oddNodes;
      }
    }

    j = i;
  }

  return oddNodes;
}

function mousePressed() {
  if (isPaused) {
    if (
      mouseX > width / 2 - 50 &&
      mouseX < width / 2 + 50 &&
      mouseY > height / 2 - 25 &&
      mouseY < height / 2 + 25
    ) {
      // If the "Try Again" button is clicked, reset the game and resume
      isPaused = false;
      redraw(); // Resume the draw loop
    }
  }
}

function resetbackg() {
  background(gameBackground);
}

function cha() {
  dx = mouseX - x;
  dy = mouseY - y;
  angle1 = atan2(dy, dx);
  x = mouseX - cos(angle1) * segLength;
  y = mouseY - sin(angle1) * segLength;
}

function restartGame() {
  
  x = -200; // Set the x-coordinate to the left of the sin graph
  y = height / 2 + 120; // Set the y-coordinate based on the sin graph
  startTime = millis();
  gameActive = true;
  loop(); // Resume the draw loop
  console.log('Game Restarted!');
}

function drawTimer() {
  let elapsedTime = millis() - startTime;
  let remainingTime = timerDuration - elapsedTime;

  if (remainingTime <= 0) {
    noLoop();
    gameActive = false;
    console.log('Game Over!');
    alert("Game Over");
  }

  // Display the countdown timer in the upper right corner
  textAlign(RIGHT, TOP);
  textSize(24);
  fill(255);
  text("Timer: " + ceil(remainingTime / 1000) + "s", width - 10, 10);
}