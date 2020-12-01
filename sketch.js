var jerry;
var jerryImg;
var tom;
var tomImg;
var backgroundImg;
var bg;
var ground;
var obstaclesGroup;
var obstacleImg;
 var jerryStandImg;
 var tomStandingImg;
 var restart;
 var gameOver;
 var restartImg;
 var gameOverImg;
var gameState="play";
var score=0;
var cheeseImg;
var CheeseGroup;
var eatingSound;
var deathSound;
var jumpSound;
var foodCount;
var winnerBg;
var winnerSound;
function preload() {
    
jerryImg=loadAnimation("images/jerryStand.png","images/Jerry_Rightside.png","images/Jerry_Run_Leftside.png");
tomImg=loadAnimation("images/tomStand.png","images/tomrun1.png","images/tomrun2.png");
backgroundImg=loadAnimation("images/bg1.jpg");
obstacleImg=loadAnimation("images/mouseTrap.png");
jerryStandImg=loadAnimation("images/jerryStand.png");
tomStandingImg=loadAnimation("images/tomStand.png");
restartImg=loadImage("images/restart.png");
gameOverImg=loadImage("images/gameover.png");
cheeseImg=loadAnimation("images/cheese.png");
eatingSound=loadSound("images/Eating-SoundBible.com-1470347575.mp3");
deathSound=loadSound("images/death.mp3");
jumpSound=loadSound("images/jump.mp3");
winnerSound=loadSound("images/Ta Da-SoundBible.com-1884170640.mp3")
winnerBg=loadAnimation("images/bg2-winner.jpg");
}

function setup(){
   createCanvas(windowWidth,windowHeight);
   

    bg=createSprite(width/2,height/2,windowWidth,windowHeight);
    bg.addAnimation("backgroundImage",backgroundImg);
    bg.addAnimation("winnerBg",winnerBg)
    bg.velocityX=-3;

    jerry=createSprite(displayWidth/2,displayHeight/2+200,50,50);
    jerry.addAnimation("jerryImage",jerryImg);
    jerry.addAnimation("jerryStand",jerryStandImg);
    jerry.scale=2;
    jerry.debug=false;
    jerry.setCollider("circle",0,0,20);
    

    ground=createSprite(windowWidth/2,windowHeight-50,displayWidth,10);
    ground.x = ground.width /2;
    ground.visible=false;

   tom=createSprite(displayWidth-1000,displayHeight/2+100,50,50);
    tom.addAnimation("tomImage",tomImg);
    tom.addAnimation("tomStand",tomStandingImg);
    tom.scale=10;

    restart=createSprite(displayWidth/2,displayHeight/2,50,50);
    restart.addImage("restartImg",restartImg);
    restart.visible=false;
    

    gameOver=createSprite(displayWidth/2,displayHeight/2-100);
    gameOver.addImage("gameOver",gameOverImg);
    gameOver.visible=false;

    obstaclesGroup = new Group();
    CheeseGroup=new Group();

    foodCount=1;

    
}
    
function draw(){
    background("black");
    console.log(bg.x);
    
    drawSprites();
    if(gameState==="play"){
        score = score + Math.round(getFrameRate()/60);
            if(keyDown("space")&&jerry.collide(ground)) {
                jerry.velocityY =-20;
                jumpSound.play();
            } 
                // add gravity
                jerry.velocityY=jerry.velocityY+0.85;
                jerry.collide(ground);

            if (bg.x < 0){
                bg.x = bg.width/2;
            }
            if(jerry.isTouching(CheeseGroup)){
            foodCount=foodCount+5;
            CheeseGroup.destroyEach(jerry);
            eatingSound.play();

           }

             if(jerry.isTouching(obstaclesGroup)){
                deathSound.play();
               gameState="end";
        }
       
        
        spawnObstacles();
        spawnCheese();
        barStatus("Food Count",50,foodCount,"blue");
        if(foodCount>100){
            gameState="winner";
        
        
        }
 }
   if(gameState==="winner"){
            bg.changeAnimation("winnerBg",winnerBg)
            bg.velocityX=0;
            
            jerry.velocityY=0;
            jerry.collide(ground);
            obstaclesGroup.setVelocityXEach(0);
            CheeseGroup.setVelocityXEach(0);
            obstaclesGroup.setLifetimeEach(0);
            CheeseGroup.setLifetimeEach(0);
            winnerSound.play();
        
            jerry.lifetime=0;
            tom.lifetime=0;
            
            restart.visible=true;
            textSize(40);
            fill("blue");
            text("Home Sweet Home",displayWidth/2-200,displayHeight/2-100)
    }
    if(gameState==="end"){
        jerry.velocityY=0;
        
        bg.velocityX=0;
        jerry.changeAnimation("jerryStand",jerryStandImg);
        tom.changeAnimation("tomStand",tomStandingImg);
        obstaclesGroup.setVelocityXEach(0);
        
        obstaclesGroup.setLifetimeEach(-1);
        CheeseGroup.setLifetimeEach(-1);
        gameOver.visible=true;
        restart.visible=true;
        restart.depth=jerry.depth+1;
        CheeseGroup.setVelocityXEach(0);
        if(mousePressedOver(restart)){
            reset();
            barStatus("Food Count",50,foodCount,"blue");
        }
    }
    

    
    
    fill("red");
    textSize(30);
    text("Score:"+score,1200,150);
    
}

function spawnObstacles(){
    if(frameCount%150===0){
        var rand=Math.round(random(displayHeight/2,displayHeight/2+200));
        var obstacle=createSprite(displayWidth-200,rand,50,50);
        obstacle.debug=false;
        obstacle.setCollider("circle",0,0,20);
        obstacle.addAnimation("obstacle",obstacleImg);
       
            obstacle.scale = 0.5;
             obstacle.lifetime = 300;
             obstacle.velocityX=-(3+3*score/100);
    //add each obstacle to the group
     obstaclesGroup.add(obstacle);

     
    }
}
function reset(){
    gameState="play";
    tom.changeAnimation("tomImage",tomImg);
    jerry.changeAnimation("jerryImage",jerryImg);
    restart.visible=false;
    gameOver.visible=false;
    bg.velocityX=-3;
    foodCount=1;
    
    obstaclesGroup.destroyEach();
    CheeseGroup.destroyEach();
}
function spawnCheese(){
    if(frameCount%200===0){
        var rand=Math.round(random(displayHeight/2,displayHeight/2+200));
        var cheese=createSprite(displayWidth-200,rand,50,50);
        cheese.debug=false;
        cheese.setCollider("circle",0,0,20);
        cheese.addAnimation("cheese",cheeseImg);
       
           cheese.scale = 0.2;
            cheese.lifetime = 300;
             cheese.velocityX=-3;
    //add each obstacle to the group
     CheeseGroup.add(cheese);

     
    }
}
function barStatus(foodType, y, w, color){ 
    stroke(color);
     fill(color)
     
      textSize(15)
       text (foodType,width-150,y-10);
        fill ("white"); 
        rect(width-150, y, 100, 20); 
        fill(color); 
        rect(width-150,y,w,20);
        console.log("bar status");
     }