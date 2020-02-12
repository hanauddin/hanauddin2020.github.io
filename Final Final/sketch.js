var player, player2, ball;
var dots = [];
var dSize = 10;
var playerScore = 0;
var player2Score = 0;
var txtSize = 20;


let video;
let classifier;

let imageModelURL = 'https://teachablemachine.withgoogle.com/models/cYxQqUN4/';

//loading the model
function preload()
{
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup()
{
  createCanvas(720, 460);
  
  //this allows the video to capture 
  video = createCapture(VIDEO);
  video.hide();
 // video.size(320,240);
   video.size(320,240);
  
  //This is the classification 
  classifyVideo();
  
  function classifyVideo()
  {
    classifier.classify(video, gotResults);
  }
  
  //Getting the classification 
  function gotResults(error, results)
  {
    if(error)
    {
      console.error(error);
      return;
    }
    label = results[0].label;
    controlBlock();
    classifyVideo();
  }
  player = new Player();
  ball = new Ball();
  player2 = new Player2();
  
  for(let y = dSize/2; y<height; y+=dSize*2)
  {
    for(let y = dSize/2; y<height; y+= dSize*2)
    {
      dots.push(createVector(width/2 - dSize/2, y));
    }
  }
}

function draw()
{
  background(0);
  image(video,0,0);
  textSize(32);
  fill(255);
  
 
    ball.edges();
    ball.update();
    player.update();
    player2.update();
    ball.scores();


  noStroke();
  fill(255,20,147);
  drawSquares();
  ball.show();

  player.show();
  player2.show();

  drawScores();

}

function drawScores()
{
  let x1 = width/4;
  let x2 = width*3/4;
  let y = txtSize*1.5;
  
  noStroke();
  fill(255);
  textAlign(CENTER);
  textSize(textSize);
  text((playerScore), x1, y);
  text((player2Score), x2, y);
}
function drawSquares()
{
  for(let i = 0; i < dots.length; i++)
  {
    let x = dots[i].x;
    let y = dots[i].y;
    
    rect(x, y, dSize, dSize);
    
  }
}

function Player()
{
  this.w = 15;
  this.h = 80;
  
  this.pos = createVector(this.w*2, height/2 - this.h/2);
  this.acc = createVector(0,0);
  this.spd = 10;
  this.maxSpd = 10;
  
  this.show = function()
  {
    noStroke();
    fill(255);
    rect(this.pos.x,this.pos.y,this.w,this.h);
  }
  
  this.up = function() 
  {
    this.acc.y -= this.spd;
  }
  
  this.down = function()
  {
    this.acc.y += this.spd;
  }
  
  this.stp = function()
  {
    this.acc.y = 0;
  }
  
  this.update = function()
  {
    this.acc.y = constrain(this.acc.y, -this.maxSpd, this.maxSpd);
    this.pos.add(this.acc);
    this.pos.y = constrain(this.pos.y, 0, height - this.h);
  }
}

function controlBlock()
{
 
  if(label === 'Up')
  {
    player.up();
  }
  else if(label === 'Down')
  {
    player.down();
  }
}

function keyReleased()
{
  if((key === 'Up' || keyCode === UP_ARROW) || (key == 'Down' || keyCode == DOWN_ARROW))
  {
    player.stp();
  }
}

function Ball()
{
  this.pos = createVector(width/2, height/2);
  this.r = 10; 
  this.maxSpd = createVector(20,15);
  this.collision = false;
  this.collObj = null;
  
  do
  {
    this.acc = p5.Vector.random2D();
    this.acc.setMag(random(4, 6));
  }
  while (abs(this.acc.x) < 3 || abs(this.acc.y) < 3);
  
  this.show = function()
  {
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r*2);
  }
  
  this.update = function()
  {
    this.pos.add(this.acc);
    
    if(this.pos.y < this.r || this.pos.y > height - this.r)
    {
      this.acc.y *=-1;
    }
  }
  
  this.edges = function()
  {
    let collided = false;
    let obj;
    let d1, d2;
    
    for(let i = 0; i < player2.h; i++)
    {
      d1 = dist(this.pos.x, this.pos.y, player2.pos.x, player2.pos.y+i);
      d2 = dist(this.pos.x, this.pos.y, player.pos.x + player.w, player.pos.y+i);
      
      if(d1 <= this.r)
      {
        collided = true;
        obj = player2;
        break;
      }
      else if(d2 <= this.r)
      {
        collided = true;
        obj = player;
        break;
      }
    }
    
    if(collided && !this.collision)
    {
      this.collision = true;
      this.collObj = obj;
      
      this.acc.add(createVector(0.5, obj.acc.y*0.25));
      this.acc.x *= -1;
      this.acc.x = constrain(this.acc.x, -this.maxSpd.x, this.maxSpd.x);
      this.acc.y = constrain(this.acc.y, -this.maxSpd.y, this.maxSpd.y);
    }
    else if(this.collObj)
    {
      let d = dist(this.pos.x, this.pos.y, this.collObj.pos.x, this.collObj.pos.y);
      if(d > 100)
      {
        this.collision = false;
      }
    }
    
    this.scores = function()
    {
      if(this.pos.x <-this.r)
      {
        player2++;
        this.res();
      }
      else if(this.pos.x > width + this.r)
      {
        playerScore++;
        this.res();
      }
    }
    
    this.res = function()
    {
   
      player2.pos = createVector(width-player2.w*3, height/2- player2.h/2);
      player.pos = createVector(player.w*2, height/2-player.h/2);
      
      this.pos = createVector(width/2, height/2);
      
      do
      {
        this.acc = p5.Vector.random2D();
        this.acc.setMag(random(4,6));
      }
      while(abs(this.acc.x)<3 || abs(this.acc.y)<3);
    }
    
  }
}

function Player2()
{
  this.w = player.w;
  this.h = player.h;
  this.pos = createVector(width - this.w*3, height/2 - this.h/2);
  this.acc = createVector(0,0);
  this.spd = 10;
  this.maxSpd = 10;
  
  this.show = function()
  {
    noStroke();
    fill(255);
    rect(this.pos.x, this.pos.y, this.w, this.h);
  }
  
  this.update = function()
  {
    let d1 = dist(ball.pos.x, ball.pos.y, this.pos.x, this.pos.y);
    let d2 = dist(ball.pos.x, ball.pos.y, this.pos.x, this.pos.y + this.h);
    let d = (d1 + d2)/2;
    
    this.pos.add(this.acc);
    this.pos.y = constrain(this.pos.y, 0, height - this.h);
    
    if(d < 450)
    {
      if(ball.pos.y < this.pos.y - this.h/2)
      {
        this.acc.y -= this.spd;
      }
      else
      {
        this.acc.y += this.spd;
      }
      
      this.acc.y = constrain(this.acc.y, -this.maxSpd, this.maxSpd);
      
    }
    else{
      this.acc.y += random(-this.spd*0.9, this.spd);
    }
  }
}