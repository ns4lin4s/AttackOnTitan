var RPG = RPG || {};

RPG.Player = function(state, x, y, data) {

  this.state = state;
  this.game = state.game;
  this.data = data;
  

  //	Create our bitmapData which we'll use as a Sprite texture
	var bmd = this.game.add.bitmapData(24, 24);

	//	Fill it
  var grd = bmd.context.createLinearGradient(0, 0, 0, 32);

  grd.addColorStop(0, '#8ED6FF');
  grd.addColorStop(1, '#004CB3');
  bmd.context.fillStyle = grd;
  bmd.context.fillRect(0, 0, 24, 24);

  //	Put the bitmapData into the cache
  this.game.cache.addBitmapData('blueShade', bmd);

   //	This one is just for reference (next to the instructions text)
  //this.bitmapCollision = new Phaser.Sprite(state.game, this.x, this.y + 20, );
  // // this.bitmapCollision.immovable = true;
  // // this.bitmapCollision.enable = true;
  // // this.bitmapCollision.collideWorldBounds = true;
  //this.game.add.existing(this.bitmapCollision)
  // // this.bitmapCollision.anchor.setTo(0.5);
  
  Phaser.Sprite.call(this, state.game, x, y - 20, this.game.cache.getBitmapData('blueShade'));
  this.anchor.setTo(0.5);
  //this.addChild(new Phaser.Sprite(state.game, this.x, this.y, 'player'));

  
  
  
  
  //add energy health
  this.healthBar = new Phaser.Sprite(state.game, this.x, this.y, 'bar');
  this.game.add.existing(this.healthBar);
  this.healthBar.anchor.setTo(0.5);

  this.character = new Phaser.Sprite(state.game, this.x, this.y, 'player');
  //walking animation
  this.character.animations.add('walk', [0,1,0], 6, false);
  //this.game.add.existing(this.character);
  this.character.anchor.setTo(0.5);

  this.addChild(this.character)

  this.refreshHealthbar();

  //enable physics
  this.game.physics.arcade.enable(this);
  this.game.physics.arcade.enable(this.healthBar);
  //this.game.physics.arcade.enable(this.character);
  //this.game.physics.arcade.enable(this.bitmapCollision);
};

RPG.Player.prototype = Object.create(Phaser.Sprite.prototype);
RPG.Player.prototype.constructor = RPG.Player;
RPG.Player.prototype.collectItem = function(item) {
  //two types of items, quest items and consumables
  if(item.data.isQuest) {
    this.data.items.push(item);

    //check quest completion
  }
  else {
    //consumable items

    //add properties
    this.data.health += item.data.health ? item.data.health : 0;
    this.data.attack += item.data.attack ? item.data.attack : 0;
    this.data.defense += item.data.defense ? item.data.defense : 0;
    this.data.gold += item.data.gold ? item.data.gold : 0;

    //refresh stats
    this.state.refreshStats();
  }
  item.kill();
}
RPG.Player.prototype.refreshHealthbar = function() {
  this.healthBar.scale.setTo(this.data.health,0.5);
};

RPG.Player.prototype.update = function() {
  this.healthBar.x = this.x;
  this.healthBar.y = this.y - 25;

  this.character.x = this.x;
  this.character.y = this.y + 18;

  this.character.body.velocity = this.body.velocity;
  this.healthBar.body.velocity = this.body.velocity;
};

RPG.Player.prototype.addPlayer = function(player){

  //this.healthBar = new Phaser.Sprite(state.game, this.x, this.y, 'bar');
  //this.game.add.existing(player);

}

RPG.Player.prototype.kill = function() {
  Phaser.Sprite.prototype.kill.call(this);
  this.healthBar.kill();
}

