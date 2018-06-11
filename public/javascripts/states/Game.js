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

    //items collection
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);  

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

    //group of items
    this.items = this.add.group();
    this.loadItems();

    //follow player with the camera
    this.game.camera.follow(this.player);
    
    // var potion = new RPG.Item(this, 100, 150, 'potion', {health: 10});
    // this.items.add(potion);

    // var sword = new RPG.Item(this, 100, 180, 'sword', {attack: 2});
    // this.items.add(sword);

    // var shield = new RPG.Item(this, 100, 210, 'shield', {defense: 2});
    // this.items.add(shield);

    // var chest = new RPG.Item(this, 100, 240, 'chest', {gold: 100});
    // this.items.add(chest);

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

    this.showPlayerIcons();
  },
  collect: function(player, item) {
    this.player.collectItem(item);
  },
  showPlayerIcons: function() {
    //gold icon
    this.goldIcon = this.add.sprite(10, 10, 'coin');
    this.goldIcon.fixedToCamera = true;

    var style = {font: '14px Arial', fill: '#fff'};
    this.goldLabel = this.add.text(30, 10, '0', style);
    this.goldLabel.fixedToCamera = true;

    //attack icon
    this.attackIcon = this.add.sprite(70, 10, 'sword');
    this.attackIcon.fixedToCamera = true;

    var style = {font: '14px Arial', fill: '#fff'};
    this.attackLabel = this.add.text(90, 10, '0', style);
    this.attackLabel.fixedToCamera = true;

    //defense icon
    this.defenseIcon = this.add.sprite(130, 10, 'shield');
    this.defenseIcon.fixedToCamera = true;

    var style = {font: '14px Arial', fill: '#fff'};
    this.defenseLabel = this.add.text(150, 10, '0', style);
    this.defenseLabel.fixedToCamera = true;

    this.refreshStats();
  },
  refreshStats: function(){
    this.goldLabel.text = this.player.data.gold;
    this.attackLabel.text = this.player.data.attack;
    this.defenseLabel.text = this.player.data.defense;
  },
  findObjectsByType: function(targetType, tilemap, layer){
    var result = [];
    
    tilemap.objects[layer].forEach(function(element){
      if(element.properties.type == targetType) {
        element.y -= tilemap.tileHeight/2;        
        element.x += tilemap.tileHeight/2;        
        result.push(element);
      }
    }, this);
    
    return result;
  },
  loadItems: function(){
    var elementsArr = this.findObjectsByType('item', this.map, 'objectsLayer');
    var elementObj;

    elementsArr.forEach(function(element){
      elementObj = new RPG.Item(this, element.x, element.y, element.properties.asset, element.properties);
      this.items.add(elementObj);
    }, this);
  }

};
