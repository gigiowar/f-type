//var game = new Phaser.Game(320, 480, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });

var game = new Phaser.Game(320, 480, Phaser.CANVAS, 'game', {create: gameDefinitions, update: gameLoop});

var player;
var enemyChrome;
var timer = 0;
var total = 0;
var score = 0;
var bullets;
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
        game.load.image('bullet', 'assets/img/ship.gif');
        //game.load.image('fruta_ruim', 'assets/pics/fruta_ruim.png');
        game.load.image('ship', 'assets/img/ship.png');

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
    enemyChrome = game.add.group(); 
    enemyChrome.enableBody = true;
    enemyChrome.physicsBodyType = Phaser.Physics.ARCADE;
    createEnemy();

    // Adiciona os tiros
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

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

    // Criar mais frutinhas

    if (total < 50  && game.time.now > timer)
    {
        createBullet();
    }

    // Checar colisões

    game.physics.arcade.collide(enemyChrome, bullets, atingiuInimigo);
    game.physics.arcade.collide(player, estragadas, pegouEstragada);

    // Destruir frutas fora da tela
    bullets.forEach(destruirObjetoForaDaTela, this);
    estragadas.forEach(destruirObjetoForaDaTela, this);

    }
}
var LoseScreen = function(game){};
LoseScreen.prototype = {
    preload: function(){

    },
    create: function(){
        var textStart = game.add.text(120, 260, 'You lose!', { fill: '#ffffff',fontSize:30});
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

function createBullet() {

    var x = player.x;
    var y = player.y-20;
    var tiro;
    var chance = Math.random() * 100;

    if (chance < 60) {
        tiro = bullets.create(x, y, 'bullet');
    } else {
        tiro = estragadas.create(x, -40, 'fruta_ruim');
    }

    //tiro.angle = game.rnd.angle();
    //tiro.body.mass = 20;

    game.physics.arcade.accelerateToXY(tiro, x, -50, 100);

    total++;
    timer = game.time.now + 2000;
}
function createEnemy(){
    var x = game.world.randomX;
    var y = 0;


    enemyChrome.create(x, y, 'ship');
  

    //tiro.angle = game.rnd.angle();
    //tiro.body.mass = 20;

    //game.physics.arcade.accelerateToXY(tiro, x, -50, 100);
}

function atingiuInimigo(inEnemy, inBullet) {
    console.log("acertou!!!!");
    total--;
    score++;

    scoreText.text = 'Score: ' + score;

    //inEnemy.body.velocity.y = -20;

    inEnemy.kill();
    inBullet.kill();
    createEnemy();
}

function pegouEstragada(inPlayer, inFruta) {
    console.log("Rodou!!!!");
    total--;
    score -= 10;

    scoreText.text = 'Score: ' + score;

    inPlayer.body.velocity.y = -20;

    inFruta.kill();

}

function destruirObjetoForaDaTela(objeto) {
    if (objeto.world.y > 480 || objeto.world.y < 0) {
        objeto.kill();
        total--;
    }
}