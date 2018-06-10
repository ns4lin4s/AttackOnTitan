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