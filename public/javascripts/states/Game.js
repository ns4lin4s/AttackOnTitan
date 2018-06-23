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

    if(this.player == null)
      return

    //player can't walk through walls
    this.game.physics.arcade.collide(this.player, this.collisionLayer);

    this.otherPlayers.forEach(function (otherPlayer) {
      
      this.game.physics.arcade.collide(this.player, otherPlayer, this.overlapPlayers, null, this);

      this.game.physics.arcade.collide(otherPlayer, this.collisionLayer);

      this.game.physics.arcade.collide(otherPlayer, this.enemies, this.attack, null, this);

      this.game.physics.arcade.overlap(otherPlayer, this.items, this.collect, null, this);  
      
    },this)

    //attacking enemies
    this.game.physics.arcade.collide(this.player, this.enemies, this.attack, null, this);

    //items collection
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);  

    //stop each time
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    var rotateLeft = false

    
    if(this.cursors.left.isDown || this.player.btnsPressed.left || this.player.btnsPressed.upleft  || this.player.btnsPressed.downleft) {
      this.player.body.velocity.x = -this.PLAYER_SPEED;
      this.player.scale.setTo(1,1);
      rotateLeft = true;
      
    }
    if(this.cursors.right.isDown || this.player.btnsPressed.right || this.player.btnsPressed.upright  || this.player.btnsPressed.downright) {
      this.player.body.velocity.x = this.PLAYER_SPEED;
      this.player.scale.setTo(-1,1);
      rotateLeft = false
      
    }
    if(this.cursors.up.isDown || this.player.btnsPressed.up || this.player.btnsPressed.upright  || this.player.btnsPressed.upleft) {
      this.player.body.velocity.y = -this.PLAYER_SPEED;
      rotateLeft = this.player.oldPosition.rotateLeft
      
    }
    if(this.cursors.down.isDown || this.player.btnsPressed.down || this.player.btnsPressed.downright  || this.player.btnsPressed.downleft) {
      this.player.body.velocity.y = this.PLAYER_SPEED;
      rotateLeft = this.player.oldPosition.rotateLeft
      
    }

    //stop all movement if nothing is being pressed
    if(this.game.input.activePointer.isUp) {
      this.game.OnscreenControls.stopMovement();
    }

    //play walking animation'
    if((this.player.body.velocity.x != 0 || this.player.body.velocity.y != 0)) {
      
      // if(!validCollisionPlayer)
      // {
        this.player.play('walk');

        // emit player movement
        var x = this.player.x;
        var y = this.player.y;
        var f = this.player.frame;
        if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y || f !== this.player.oldPosition.frame)) {
          this.socket.PlayerMovement(this.player.x, this.player.y, rotateLeft,this.player.frame)
        }
      //}
    }
    else {
      this.player.animations.stop();
      this.player.frame = 0;
    }
    

    

    // save old position data
    this.player.oldPosition = {
      x: this.player.x,
      y: this.player.y,
      rotateLeft: rotateLeft,
      frame : this.player.frame 
    };
    

  },     
  loadLevel: function(){
    
    //init socketio
    this.socket = new RPG.SocketClient();

    this.otherPlayers = this.add.group();

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

    //group of items
    this.items = this.add.group();
    this.loadItems();

    //load current players
    this.socket.currentPlayer()

    //listen event disconnect players
    this.socket.disconnect()

    this.socket.newPlayer()

    this.socket.playerMoved()

    //this.socket.enemyMoved()

    //enemies
    this.enemies = this.add.group();
    //this.loadEnemies();

    //battle object
    this.battle = new RPG.Battle(this.game);

    //enemies
    this.enemies = this.add.group();
    this.loadEnemies();

    // var potion = new RPG.Item(this, 100, 150, 'potion', {health: 10});
    // this.items.add(potion);

    // var sword = new RPG.Item(this, 100, 180, 'sword', {attack: 2});
    // this.items.add(sword);

    // var shield = new RPG.Item(this, 100, 210, 'shield', {defense: 2});
    // this.items.add(shield);

    // var chest = new RPG.Item(this, 100, 240, 'chest', {gold: 100});
    // this.items.add(chest);

    
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
  overlapPlayers: function(player,other){
    
    this.game.stage.backgroundColor = '#992d2d';
    
    other.body.velocity.x = 0
    other.body.velocity.y = 0
    other.body.immovable = true;
    other.body.moves = false;
    
    // other.position.x = other.position.x
    // other.position.x = other.position.y
    return true
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
  },
  attack: function(player, enemy) {
    this.battle.attack(player, enemy);
    this.battle.attack(enemy, player);

    //bounce back a bit
    if(player.body.touching.up) {
      player.y += 20;
    }
    if(player.body.touching.down) {
      player.y -= 20;
    }
    if(player.body.touching.left) {
      player.x += 20;
    }
    if(player.body.touching.right) {
      player.x -= 20;
    }
  },
  loadEnemies: function(){
    var elementsArr = this.findObjectsByType('enemy', this.map, 'objectsLayer');
    var elementObj;

    elementsArr.forEach(function(element){
      elementObj = new RPG.Enemy(this, element.x, element.y, element.properties.asset, element.properties);
      this.enemies.add(elementObj);
    }, this);
  },
  currentPlayers: function(players){
    var self = this;

    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.getId()) {
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

        self.player = new RPG.Player(self, players[id].x, players[id].y, playerData);

        //add player to the world
        self.add.existing(self.player);

        self.initGUI();

        //follow player with the camera
        self.game.camera.follow(self.player);
        
      } 
      else 
      {
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

        var otherPlayer = new RPG.Player(self, players[id].x, players[id].y, playerData);
          
        otherPlayer.playerId = players[id].playerId;

        self.otherPlayers.add(otherPlayer);

      }
    });
  },
  addOtherPlayer:function(player)
  {
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

    var otherPlayer = new RPG.Player(this, player.x, player.y, playerData);
    // otherPlayer.body.gravity.set(0, 0);
    // otherPlayer.body.bounce.set(0, 0);
    otherPlayer.playerId = player.playerId;
    // otherPlayer.position.x = player.x
    // otherPlayer.position.y = player.y
    console.log('x:' + otherPlayer.position.x)
    console.log('y:' + otherPlayer.position.y)

    //this.player.addPlayer(otherPlayer)

    this.otherPlayers.add(otherPlayer);
  },
  disconnect:function(playerId){
    this.otherPlayers.forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.kill();
      }
    });
  },
  playerMoved: function(playerInfo){
    var self = this
    this.otherPlayers.forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.position.x = playerInfo.x
          otherPlayer.position.y = playerInfo.y
          otherPlayer.frame = playerInfo.frame;
          if(playerInfo.rotation)
          {
            //otherPlayer.body.velocity.x = -this.PLAYER_SPEED;
            otherPlayer.scale.setTo(1,1);
          }
          else
          {
            otherPlayer.scale.setTo(-1,1);
            //otherPlayer.body.velocity.x = this.PLAYER_SPEED;
          }
          console.log('frame:' + playerInfo.frame)
          
          //player can't walk through walls
          //self.game.physics.arcade.collide(otherPlayer, self.collisionLayer);

          //attacking enemies
          //self.game.physics.arcade.collide(otherPlayer, self.enemies, self.attack, null, self);

          //items collection
          //self.game.physics.arcade.overlap(otherPlayer, self.items, self.collect, null, self);  

          // if(otherPlayer.body.velocity.x != 0 || otherPlayer.body.velocity.y != 0)
          //   otherPlayer.play('walk');
          // else {
          //   otherPlayer.animations.stop();
          //   otherPlayer.frame = 0;
          // }
      }
    });
  },
  enemyMoved: function(playerInfo){
    
    this.otherPlayers.forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.position.x = playerInfo.x
          otherPlayer.position.y = playerInfo.y
      }
    });
  },
  render: function(){
    if(this.player)
      this.game.debug.spriteInfo(this.player, 30, 30);
  }
};
