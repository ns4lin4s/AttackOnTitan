var RPG = RPG || {};

RPG.GameState = {

  init: function(currentLevel) {    
    //keep track of the current level
    this.currentLevel = currentLevel ? currentLevel : 'mapa';

    //constants
    this.PLAYER_SPEED = 90;
    
    //no gravity in a top-down game
    this.game.physics.arcade.gravity.y = 0;    

    //keyboard cursors
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },
  create: function() {   

    this.game.OnscreenControls = this.game.plugins.add(Phaser.Plugin.OnscreenControls);

    this.loadLevel();
  },   
  update: function() {    

    //player can't walk through walls
    this.game.physics.arcade.collide(this.player, this.collisionLayer);

    //stop each time
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if(this.cursors.left.isDown || this.player.btnsPressed.left || this.player.btnsPressed.upleft  || this.player.btnsPressed.downleft) {
      this.player.body.velocity.x = -this.PLAYER_SPEED;
      this.player.scale.setTo(1,1);
    }
    if(this.cursors.right.isDown || this.player.btnsPressed.right || this.player.btnsPressed.upright  || this.player.btnsPressed.downright) {
      this.player.body.velocity.x = this.PLAYER_SPEED;
      this.player.scale.setTo(-1,1);
    }
    if(this.cursors.up.isDown || this.player.btnsPressed.up || this.player.btnsPressed.upright  || this.player.btnsPressed.upleft) {
      this.player.body.velocity.y = -this.PLAYER_SPEED;
    }
    if(this.cursors.down.isDown || this.player.btnsPressed.down || this.player.btnsPressed.downright  || this.player.btnsPressed.downleft) {
      this.player.body.velocity.y = this.PLAYER_SPEED;
    }

    //stop all movement if nothing is being pressed
    if(this.game.input.activePointer.isUp) {
      this.game.OnscreenControls.stopMovement();
    }

    //play walking animation'
    if(this.player.body.velocity.x != 0 || this.player.body.velocity.y != 0) {
      this.player.play('walk');
    }
    else {
      this.player.animations.stop();
      this.player.frame = 0;
    }
  },     
  loadLevel: function(){
    
    //create a tilemap object
    this.map = this.add.tilemap('map_3200x3200')//(this.currentLevel);
    
    //join the tile images to the json data
    this.map.addTilesetImage('tiles_attack_on_titan', 'tilesheet');
    
    //create tile layers
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.collisionLayer = this.map.createLayer('collisionLayer');
    
    //send background to the back
    this.game.world.sendToBack(this.backgroundLayer);
    
    //collision layer should be collisionLayer
    this.map.setCollisionBetween(1,291, true, 'collisionLayer');
    
    //resize the world to fit the layer
    this.collisionLayer.resizeWorld();

    //create player
    var playerData = {
      //list of items
      items: [],

      //player stats
      health: 25,
      attack: 12,
      defense: 8,
      gold: 100,

      //quest
      quests: []
    };

    this.player = new RPG.Player(this, 100, 100, playerData);

    //add player to the world
    this.add.existing(this.player);

    this.initGUI();
  },
  gameOver: function() {
    this.game.state.start('Game', true, false, this.currentLevel);
  },
  initGUI: function() {
    //onscreen controls setup
    this.game.OnscreenControls.setup(this.player, {
      left: true,
      right: true,
      up: true,
      down: true,
      upleft: true,
      downleft: true,
      upright: true,
      downright: true,
      action: false
    })
  }
};
