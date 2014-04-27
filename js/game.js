//var game = new Phaser.Game(320, 480, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });

var game = new Phaser.Game(320, 480, Phaser.CANVAS, 'game', {create: gameDefinitions, update: gameLoop});

var player;
var enemyChrome;
var timer = 0;
var timerEnemy = 0;
var timerBulletEnemy = 0;
var total = 0;
var score = 0;
var bullets;
var enemyBullets;
var estragadas;
var scoreText;

function gameDefinitions() { 
    /* object initializations here */ 
    //var keyboard: Phaser.Keyboard;

}
function gameLoop() { 
/* movements, collisions, rendering here */ 

}

var GameScreen = function(game){}
GameScreen.prototype = {
    preload: function(){
        game.load.image('cenario', 'assets/img/bg_nebula.jpg');
        game.load.image('bgstars1', 'assets/img/bg_stars1.png');
        game.load.image('bgstars2', 'assets/img/bg_stars2.png');
        game.load.image('bullet', 'assets/img/shot_std.png');
        game.load.image('enemyBullet', 'assets/img/shot_enm.png');
        game.load.image('ship', 'assets/img/ship.png');
        game.load.image('enemyOpera','assets/img/enm_op.png');

    },
    create: function(){

    // incializa o sistema de física
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // adiciona o background
    //bgNebula = game.add.sprite(0, -620, 'cenario');
    bgStars1 = game.add.sprite(0, 0, 'bgstars1');
    bgStars2 = game.add.sprite(0, -200, 'bgstars2');
    bgStars3 = game.add.sprite(0, -800, 'bgstars2');

    // Adiciona o jogador
    player = game.add.sprite(130, 380, 'ship');           
    game.physics.arcade.enable(player);
    player.enableBody = true;
    player.body.collideWorldBounds = true;

    //Adiciona o inimigo
    enemyOpera = game.add.group(); 
    enemyOpera.enableBody = true;
    enemyOpera.physicsBodyType = Phaser.Physics.ARCADE;
    createEnemy();

    // Adiciona os tiros
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    // Adiciona os tiros do inimigo
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

    // Adiciona as estragadas
    estragadas = game.add.group();
    estragadas.enableBody = true;
    estragadas.physicsBodyType = Phaser.Physics.ARCADE;

    // Adiciona a pontuação
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#f3fbfe' });

    },
    update: function(){

    
    //moveBackground(this.background2);

    var moveBackground = function(background,velocity,position,resetPosition) {
      if (background.y > resetPosition) {
        background.y = position;
        background.y += velocity;
      } else {}
        background.y += velocity;
    }
    //moveBackground(bgNebula, 0.2, -1110, 600);
    moveBackground(bgStars1, 0.6, -700, 600);
    moveBackground(bgStars2, 1.5, -1000, 600);
    moveBackground(bgStars3, 1.5, -1000, 600);
    
    /*
    if (game.input.mousePointer.isDown){
        if(game.input.mousePointer.worldX  > 270){
            console.log('hey');
            game.physics.arcade.moveToPointer(player, 400);
        }
        if (game.input.mousePointer.worldX <= 270) {
           console.log('hey-1');
           game.physics.arcade.moveToPointer(player, 400);
        }
        if (game.input.mousePointer.worldY > 420) {
           console.log('hey-2');
           game.physics.arcade.moveToPointer(player, 400);
        }
        if (game.input.mousePointer.worldY <= 420) {
           console.log('hey-3');
           game.physics.arcade.moveToPointer(player, 400);
        }

    }*/

    //Input touch
    if (game.input.pointer1.isDown) {

       //player.body.velocity.x = 150;
        game.physics.arcade.moveToPointer(player, 400);

      if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
        {
            player.body.velocity.setTo(0, 0);
        }
    }
    else
    {
        player.body.velocity.setTo(0, 0);
    }

    // Criar mais inimigos

    if (total < 50  && game.time.now > timerEnemy)
    {
        createEnemy();;
    }
    
    // Criar mais frutinhas

    if (total < 50  && game.time.now > timer)
    {
        createBullet();
    }

    if (total < 50  && game.time.now > timerBulletEnemy)
    {
        createEnemyBullet();
    
    }

    // Checar colisões

    game.physics.arcade.collide(enemyOpera, bullets, atingiuInimigo);
    game.physics.arcade.collide(enemyOpera, player, morreu);
    game.physics.arcade.collide(player, enemyBullets, morreu);


    // Destruir objetos fora da tela
    bullets.forEach(destruirObjetoForaDaTela, this);
    estragadas.forEach(destruirObjetoForaDaTela, this);
    enemyBullets.forEach(destruirObjetoForaDaTela, this);

    }
}
var LoseScreen = function(game){};
LoseScreen.prototype = {
    preload: function(){

    },
    create: function(){
        var textLose = game.add.text(90, 180, 'You lose!', { fill: '#ffffff',fontSize:30});
        var textStart = game.add.text(65, 260, 'Restart game', { fill: '#ffffff',fontSize:30});
        textStart.inputEnabled = true;
        textStart.events.onInputDown.add(changeStateToGameScreen, this);
    },
    update: function(){

    }
}

var MainMenu = function(game) {  };  // State object created, a function accepting a game Object as parameter
MainMenu.prototype = {
    preload: function() { 
        /* download assets code here */
        game.load.image('logo', 'assets/img/logo_f-type.png');
        
    ;},
    create:  function() {
        // adiciona o background
        //game.add.sprite(0, 0, 'logo');
        var logo = game.add.sprite(20, game.world.centerY-65, 'logo');
        var textStart = game.add.text(120, 260, 'Start', { fill: '#ffffff',fontSize:30});
        textStart.inputEnabled = true;
        textStart.events.onInputDown.add(changeStateToGameScreen, this);

    ;},
    update:  function() {/* update movements, collisions, score here */ ;}
}

game.state.add('menu' , MainMenu);
game.state.add('gameScreen' , GameScreen);
game.state.add('loseScreen' , LoseScreen);
//pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
game.state.start('menu');

function changeStateToGameScreen(){
    game.state.start("gameScreen");
}

function changeStateToLoseScreen(){
    game.state.start("loseScreen");
}

function createBullet() {

    var x = player.x+20;
    var y = player.y-20;
    var tiro;
    var chance = Math.random() * 100;

    tiro = bullets.create(x, y, 'bullet');


    //tiro.angle = game.rnd.angle();
    //tiro.body.mass = 20;

    //tiro.y = player.y-20;
    //tiro.y += 2;
    game.physics.arcade.moveToXY(tiro, x, -50, 200);
    //game.physics.arcade.accelerateToXY(tiro, x, -50, 100);

    total++;
    timer = game.time.now + 500;
}
function createEnemyBullet(){
    console.log('enemy-shoot');
    var x = enemy.x+20;
    var y = enemy.y+100;
    var enemyTiro;

    console.log(enemy.y-20);

    enemyTiro = enemyBullets.create(x, y, 'enemyBullet');

    game.physics.arcade.moveToXY(enemyTiro, x, 500, 200);

    timerBulletEnemy = game.time.now + 1200;

}

function createEnemy(){
    var x = game.world.randomX;
    var y = -100;


    enemy = enemyOpera.create(x, y, 'enemyOpera');
  

    //tiro.angle = game.rnd.angle();
    //tiro.body.mass = 20;

    game.physics.arcade.moveToXY(enemy, x, 500, 150);
    //game.physics.arcade.accelerateToXY(tiro, x, -50, 100);
    timerEnemy = game.time.now + 1200;

}

function atingiuInimigo(inEnemy, inBullet) {
    total--;
    score++;

    scoreText.text = 'Score: ' + score;

    //inEnemy.body.velocity.y = -20;

    inEnemy.kill();
    inBullet.kill();
}

function morreu(inEnemy, inPlayer) {
    total--;
    //score -= 10;

    scoreText.text = 'Score: ' + score;

    //inPlayer.body.velocity.y = -20;

    inPlayer.kill();

    changeStateToLoseScreen();
}

function destruirObjetoForaDaTela(objeto) {
    if (objeto.world.y > 480 || objeto.world.y < 0) {
        objeto.kill();
        total--;
    }
}