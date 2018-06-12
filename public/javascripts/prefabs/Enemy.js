var RPG = RPG || {};

RPG.Enemy = function(state, x, y, key, data) {
  Phaser.Sprite.call(this, state.game, x, y, key);

  this.state = state;
  this.game = state.game;
  this.data = data;
  this.anchor.setTo(0.5);

  //make properties numbers
  this.data.attack = +this.data.attack;
  this.data.defense = +this.data.defense;
  this.data.health = +this.data.health;

  //add energy health
  this.healthBar = new Phaser.Sprite(state.game, this.x, this.y, 'bar');
  this.game.add.existing(this.healthBar);
  this.healthBar.anchor.setTo(0.5);
  this.refreshHealthbar();

  //enable physics
  this.game.physics.arcade.enable(this);
  this.body.immovable = true;
  this.game.physics.arcade.enable(this.healthBar);
  
};

RPG.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
RPG.Enemy.prototype.constructor = RPG.Enemy;

RPG.Enemy.prototype.refreshHealthbar = function() {
  this.healthBar.scale.setTo(this.data.health,0.5);
};

RPG.Enemy.prototype.update = function() {
  this.healthBar.x = this.x;
  this.healthBar.y = this.y - 25;

  this.healthBar.body.velocity = this.body.velocity;
};

RPG.Enemy.prototype.kill = function() {
  Phaser.Sprite.prototype.kill.call(this);
  this.healthBar.kill();
}