//var game = new Phaser.Game(320, 480, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });

var game = new Phaser.Game(320, 480, Phaser.CANVAS, 'game', {create: gameDefinitions, update: gameLoop});

var player;
var timer = 0;
var total = 0;
var score = 0;
var frutas;
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
        game.load.image('cenario', 'assets/pics/cenario.png');
        game.load.image('fruta_boa', 'assets/pics/fruta_boa.png');
        game.load.image('fruta_ruim', 'assets/pics/fruta_ruim.png');
        game.load.image('ship', 'assets/img/ship.gif');

    },
    create: function(){

    // incializa o sistema de física
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // adiciona o background
    game.add.sprite(0, 0, 'cenario');

    // Adiciona o jogador
    player = game.add.sprite(130, 380, 'ship');           
    game.physics.arcade.enable(player);
    player.enableBody = true;
    player.body.collideWorldBounds = true;

    // Adiciona as frutas
    frutas = game.add.group();
    frutas.enableBody = true;
    frutas.physicsBodyType = Phaser.Physics.ARCADE;

    // Adiciona as estragadas
    estragadas = game.add.group();
    estragadas.enableBody = true;
    estragadas.physicsBodyType = Phaser.Physics.ARCADE;

    // Adiciona a pontuação
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#f3fbfe' });

    },
    update: function(){

 //  Allow dragging - the 'true' parameter will make the sprite snap to the center

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
      if (game.input.pointer1.worldX > 270) {
           //player.body.velocity.x = 150;
            game.physics.arcade.moveToPointer(player, 400);

      }
      if (game.input.pointer1.worldX <= 270) {
           //player.body.velocity.x = -150;
           game.physics.arcade.moveToPointer(player, 400);
      }
      if (game.input.pointer1.worldY > 420) {
           //player.body.velocity.x = 150;
            game.physics.arcade.moveToPointer(player, 400);

      }
      if (game.input.pointer1.worldY <= 420) {
           //player.body.velocity.x = -150;
           game.physics.arcade.moveToPointer(player, 400);
      }
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
        criarNovaFruta();
    }

    // Checar colisões

    game.physics.arcade.collide(player, frutas, pegouFruta);
    game.physics.arcade.collide(player, estragadas, pegouEstragada);

    // Destruir frutas fora da tela
    frutas.forEach(destruirFrutasForaDaTela, this);
    estragadas.forEach(destruirFrutasForaDaTela, this);

    }
}
var LoseScreen = function(game){};
LoseScreen.prototype = {
    preload: function(){

    },
    create: function(){

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
        textStart.events.onInputDown.add(changeState, this);

    ;},
    update:  function() {/* update movements, collisions, score here */ ;}
}
game.state.add('gameScreen' , GameScreen);
game.state.add('menu' , MainMenu);
//pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
game.state.start('menu');

function changeState(){
    game.state.start('gameScreen');
}

function criarNovaFruta() {

    var x = game.world.randomX;
    var fruta;
    var chance = Math.random() * 100;

    if (chance < 60) {
        fruta = frutas.create(x, -20, 'fruta_boa');
    } else {
        fruta = estragadas.create(x, -40, 'fruta_ruim');
    }

    fruta.angle = game.rnd.angle();
    fruta.body.mass = 20;

    game.physics.arcade.accelerateToXY(fruta, x, 400, 100);

    total++;
    timer = game.time.now + 2000;
}

function pegouFruta(inPlayer, inFruta) {
    console.log("pegou!!!!");
    total--;
    score++;

    scoreText.text = 'Score: ' + score;

    inPlayer.body.velocity.y = -20;

    inFruta.kill();

}

function pegouEstragada(inPlayer, inFruta) {
    console.log("Rodou!!!!");
    total--;
    score -= 10;

    scoreText.text = 'Score: ' + score;

    inPlayer.body.velocity.y = -20;

    inFruta.kill();

}

function destruirFrutasForaDaTela(fruta) {
    if (fruta.world.y > 320) {
        fruta.kill();
        total--;
    }
}