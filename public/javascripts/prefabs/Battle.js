var RPG = RPG || {};

RPG.Battle = function(game) {
  this.game = game;
};

RPG.Battle.prototype.attack = function(attacker, attacked) {
  var damage = Math.max(0, attacker.data.attack * Math.random() - attacked.data.defense * Math.random());

  console.log(damage);

  attacked.data.health -= damage;
  attacked.refreshHealthbar();

  //make attacked character red
  var attackedTween = this.game.add.tween(attacked);
  attackedTween.to({tint: 0xFF0000}, 200);
  attackedTween.onComplete.add(function(){
    attacked.tint = 0xFFFFFF;
  }, this);
  attackedTween.start();

  if(attacked.data.health <= 0) {
    attacked.kill();
  }
  
};