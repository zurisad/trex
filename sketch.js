var trex, trex_running, edges;
var groundImage;
var ground;
var invisibleGround;
var cloudImage;
var cactus1, cactus2, cactus3, cactus4, cactus5, cactus6;
var score=0;
var cloudsGroup;
var cactusGroup;
var PLAY = 1;
var END = 0; 
var gameState = PLAY;
var trexcollided;
var jumpSound;
var dieSound;
var checkPointSound;
var gameOver,gameOverImg;
var restart, restartImg;
var bird, birdImg;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png");
  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  trexcollided = loadImage("trex_collided.png");
  jumpSound = loadSound ("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  birdImg=loadAnimation("bird0.png","bird1.png");
}

function setup(){
  createCanvas(600,200);
  
  //crea el Trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trexcollided);
  edges = createEdgeSprites();
  
  //añade escala y posición al Trex
  trex.scale = 0.5;
  trex.x = 50;

  ground= createSprite(300,160,600,20);
  ground.addImage("ground1", groundImage);
  
  invisibleGround = createSprite(300,185,600,20);
  invisibleGround.visible = false;
  
  cloudsGroup=new Group();
  cactusGroup=new Group();
  
  trex.debug=false;
  trex.setCollider("rectangle",0,0,100,80);
  
  gameOver = createSprite(300,50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,100);
  restart.addImage(restartImg);
  restart.scale=0.5;
  
  
}


function draw(){
  
  //establece un color de fondo 
  background("white");
  
  text("score: "+score,500,30);
 
  
  //ingresa la posición y del Trex
  console.log(trex.y)
  
  if (gameState == PLAY){
    
      score=score+Math.round(getFrameRate()/60);
    
     //salta cuando se presiona la barra espaciadora
     if(keyDown("space")&& trex.y>150  ){
      trex.velocityY = -13;
      jumpSound.play();
     }
     trex.velocityY = trex.velocityY + 0.5;
    
     if (ground.x<0){
      ground.x= ground.width/2;
     }
    
     ground.velocityX = -(6+score/100);
    
     spawnCloud();
     spawnCactus();
     spawnBird();
    
    gameOver.visible=false;
    restart.visible=false;
    
     if(score>0 && score%500==0){
        checkPointSound.play();
     }
    
     if (cactusGroup.isTouching(trex)){
       gameState = END;
       dieSound.play();
     //trex.velocityY = -12;
     //jumpSound.play();
     
     }
  }
  
  else if(gameState == END){
    ground.velocityX = 0;
    cactusGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    cactusGroup.setLifetimeEach(-2);
    cloudsGroup.setLifetimeEach(-2);
    trex.velocityY=0;
    trex.changeAnimation("collided",trexcollided);
    
    gameOver.visible=true;
    restart.visible=true;  
    if(mousePressedOver(restart)){
      reset() 
    }
  }

  //evita que el Trex caiga
  trex.collide([invisibleGround]);
  
 
  drawSprites();
}

function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible= false;
  cactusGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0;
}

function spawnCactus(){
  if (frameCount%100==0){
    var cactus = createSprite(580,150,5,15);
    cactus.velocityX = -(6+score/100);
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: cactus.addImage(cactus1);
        break;
      case 2: cactus.addImage(cactus2);
        break;
      case 3: cactus.addImage(cactus3);
        break;
      case 4: cactus.addImage(cactus4);
        break;
      case 5: cactus.addImage(cactus5);
        break;
      case 6: cactus.addImage(cactus6); 
        break;
      default:break;
    }
  cactus.scale=0.5;
  cactus.lifetime=300;
  cactusGroup.add(cactus);
  }
}

function spawnCloud(){
  if (frameCount%60==0){
    var cloud = createSprite(580,20,20,20);
    cloud.addImage (cloudImage); 
    cloud.velocityX = -2;  
    cloud.y = Math.round(random(10,60));
    cloud.depth=trex.depth;
    trex.depth+=1;
    cloud.lifetime=300;
    cloudsGroup.add(cloud);
  }
}
function spawnBird(){
  if(frameCount%200==0){
     bird =createSprite(620,20,10,10);
     bird.addAnimation("bird",birdImg);
    bird.scale=0.10;
    bird.velocityX = -2;
    bird.y= Math.round(random(20,100));
  }
}