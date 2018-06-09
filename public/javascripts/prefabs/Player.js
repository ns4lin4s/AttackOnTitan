var RPG = RPG || {};

RPG.Player = function(state, x, y, data) {
  Phaser.Sprite.call(this, state.game, x, y, 'player');

  this.state = state;
  this.game = state.game;
  this.data = data;
  this.anchor.setTo(0.5);

  //walking animation
  this.animations.add('walk', [0,1,0], 6, false);
  

  //enable physics
  this.game.physics.arcade.enable(this);
};

RPG.Player.prototype = Object.create(Phaser.Sprite.prototype);
RPG.Player.prototype.constructor = RPG.Player;