var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var score = 0;

var ballRadius = 10;
var ballColor = "#0095DD";
var x = Math.floor(Math.random() * canvas.width);
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var paddleHeight = 10;
var paddleWidth = 175;
var paddleColor = "#0095DD";
var paddleSpeed = 6;
var paddleX = (canvas.width - paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

var brickRowCount = 4;
var brickColCount = 7;
var brickWidth = 50;
var brickHeight = 10;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for(c=0; c < brickColCount; c++){
  bricks[c] = [];
  for(r=0; r < brickRowCount; r++){
    bricks[c][r] = {x: 0, y: 0, status: 2};
  }
}

function drawPaddle(color){
  ctx.beginPath();
  ctx.rect(paddleX,canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawBall(color, radius){
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawBricks(){
  for(c=0; c < brickColCount; c++){
    for(r=0; r < brickRowCount; r++){
      switch(bricks[c][r].status){
        case 2:
          var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
          var brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
          break;
        case 1:
          var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
          var brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#6e00db";
          ctx.fill();
          ctx.closePath();
          break;
      }
    }
  }
}

function drawScore(){
  ctx.font = "14px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScore();
  drawPaddle(paddleColor);
  drawBall(ballColor, ballRadius);
  drawBricks();
  collisionDetection();

  // Ball Movement
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy < ballRadius) {
    dy = -dy;
  }
  else if(y + dy > canvas.height-ballRadius){
    if(x > paddleX && x < paddleX + paddleWidth){
      if(Math.abs(dy) < 10)
        dy = -++dy;
      else
        dy = -dy;
      ballColor = getRandomColor();
    }
    else{
      document.location.reload();
    }
  }
  x += dx;
  y += dy;

  // Paddle Movement
  if(rightPressed && paddleX < canvas.width - paddleWidth){
    paddleX += paddleSpeed;
  }
  if(leftPressed && paddleX > 0){
    paddleX -= paddleSpeed;
  }
}

function getRandomColor(){
  var letters = "0123456789ABCDEF";
  var color = "#";
  for(var i=0; i < 6; i++)
  {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomRadius(){
  return Math.floor(Math.random() * 99) + 1;
}

function keyDownHandler(e){
  if(e.keyCode == 39){
    rightPressed = true;
  }
  else if(e.keyCode == 37){
    leftPressed = true;
  }
}

function keyUpHandler(e){
  if(e.keyCode == 39){
    rightPressed = false;
  }
  else if(e.keyCode == 37){
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
  }
}

function collisionDetection(){
  for(c=0; c < brickColCount; c++){
    for(r=0; r < brickRowCount; r++){
      var brick = bricks[c][r];
      if(x > brick.x &&
         x < brick.x + brickWidth &&
         y > brick.y &&
         y < brick.y + brickHeight){

        if(brick.status == 1){
          brick.status = 0;
          score += 100;
        }
        if(brick.status == 2){
          brick.status = 1;
        }
        dy = -dy;
      }
    }
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
setInterval(draw, 10);