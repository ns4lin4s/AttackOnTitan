var RPG = RPG || {};

RPG.dim = RPG.getGameLandscapeDimensions(640, 640);

RPG.game = new Phaser.Game(RPG.dim.w, RPG.dim.h, Phaser.AUTO);

RPG.game.state.add('Boot', RPG.BootState); 
RPG.game.state.add('Preload', RPG.PreloadState); 
RPG.game.state.add('Game', RPG.GameState);

RPG.game.state.start('Boot'); 
