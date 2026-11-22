// ========================================================
// ROTATING WINDMILL BLADES
// Mathematics: Angles, Radians, and Circular Rotation
// ========================================================

// Hub (center of rotation) coordinates
let hubX;
let hubY;

// Windmill dimensions
let bladeLength = 150;
let bladeWidth = 24;
let numberOfBlades = 4;

// Angular motion variables
let currentAngle = 0;       // Current rotation angle in radians
let angularSpeed = 0.02;    // Radians added per frame
let direction = 1;          // 1 = Clockwise, -1 = Counter-Clockwise
let isPaused = false;       // Pause toggle state

function setup() {
  let canvas = createCanvas(700, 500);
  canvas.parent("canvas-container");

  // Position the windmill hub at the upper-center of the canvas
  hubX = width / 2;
  hubY = 230;
}

function draw() {
  // Sky background and rolling green hill
  background(135, 206, 235);
  noStroke();
  fill(76, 175, 80);
  rect(0, 390, width, 110);

  // Draw windmill tower (trapezoid base)
  fill(235, 235, 230);
  stroke(80);
  strokeWeight(2);
  quad(
    hubX - 25, hubY,
    hubX + 25, hubY,
    hubX + 65, 410,
    hubX - 65, 410
  );

  // Draw windmill door
  fill(120, 72, 40);
  rect(hubX - 15, 355, 30, 55, 12, 12, 0, 0);

  // Draw reference circle showing the swept path of the blade tips
  noFill();
  stroke(255, 255, 255, 130);
  strokeWeight(1.5);
  circle(hubX, hubY, bladeLength * 2);

  // --------------------------------------------------------
  // MATHEMATICAL ROTATION OF THE 4 BLADES
  // Each blade is separated by 90 degrees (TWO_PI / 4 = HALF_PI radians)
  // Blade Angle_i = currentAngle + (i * HALF_PI)
  // --------------------------------------------------------
  for (let i = 0; i < numberOfBlades; i++) {
    let bladeAngle = currentAngle + i * HALF_PI;

    push();
    translate(hubX, hubY);   // Move origin to the windmill hub
    rotate(bladeAngle);      // Rotate coordinate system by bladeAngle

    // Draw blade arm
    stroke(60);
    strokeWeight(2);
    fill(i === 0 ? color(255, 110, 64) : color(250, 250, 245)); // Highlight Blade 0 in orange
    rect(0, -bladeWidth / 2, bladeLength, bladeWidth, 4);

    // Draw lattice lines on the blade
    stroke(150);
    line(30, -bladeWidth / 2, 30, bladeWidth / 2);
    line(70, -bladeWidth / 2, 70, bladeWidth / 2);
    line(110, -bladeWidth / 2, 110, bladeWidth / 2);
    pop();
  }

  // Draw center rotor hub cap
  fill(60);
  noStroke();
  circle(hubX, hubY, 28);
  fill(200);
  circle(hubX, hubY, 12);

  // Calculate exact (x, y) tip position of the orange reference blade (Blade 0)
  // Formula: x = hubX + cos(angle) * r,  y = hubY + sin(angle) * r
  let tipX = hubX + cos(currentAngle) * bladeLength;
  let tipY = hubY + sin(currentAngle) * bladeLength;

  // Draw a marker dot on the orange blade's tip
  fill(255, 50, 50);
  noStroke();
  circle(tipX, tipY, 10);

  // Update angle over time if not paused
  // Formula: newAngle = oldAngle + (angularSpeed * direction)
  if (!isPaused) {
    currentAngle += angularSpeed * direction;
    // Keep angle wrapped between 0 and TWO_PI (0 to 360 degrees) for clean reading
    currentAngle = (currentAngle + TWO_PI) % TWO_PI;
  }

  // --------------------------------------------------------
  // ON-SCREEN MATH READOUT & CONTROL INSTRUCTIONS
  // --------------------------------------------------------
  let angleDegrees = degrees(currentAngle);

  noStroke();
  fill(20, 30, 45); // Dark text so it's readable on the sky background
  textAlign(LEFT);
  textSize(14);
  text("Angle: " + angleDegrees.toFixed(1) + "° (" + currentAngle.toFixed(2) + " rad)", 24, 34);
  text("Angular Speed: " + angularSpeed.toFixed(3) + " rad/frame", 24, 56);
  text("Direction: " + (direction === 1 ? "Clockwise (+1)" : "Counter-Clockwise (-1)"), 24, 78);
  text("Orange Tip (x, y): (" + tipX.toFixed(1) + ", " + tipY.toFixed(1) + ")", 24, 100);

  // Bottom control bar
  fill(20, 30, 45, 220);
  rect(0, height - 36, width, 36);
  fill(255);
  textAlign(CENTER);
  textSize(13);
  text(
    "SPACE: Pause/Resume  |  A/D: Speed +/-  |  Q: Reverse Direction  |  R: Reset",
    width / 2,
    height - 13
  );
}

// ========================================================
// KEYBOARD CONTROLS
// ========================================================
function keyPressed() {
  // Pause or resume animation
  if (key === ' ') {
    isPaused = !isPaused;
    return false; // Prevent page scrolling when pressing Space
  }

  // Increase angular speed
  if (key === 'a' || key === 'A') {
    angularSpeed += 0.005;
  }

  // Decrease angular speed (minimum 0.005 rad/frame)
  if (key === 'd' || key === 'D') {
    angularSpeed = max(0.005, angularSpeed - 0.005);
  }

  // Reverse direction
  if (key === 'q' || key === 'Q') {
    direction *= -1;
  }

  // Reset animation values
  if (key === 'r' || key === 'R') {
    currentAngle = 0;
    angularSpeed = 0.02;
    direction = 1;
    isPaused = false;
  }
}