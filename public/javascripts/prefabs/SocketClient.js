var RPG = RPG || {};

RPG.SocketClient = function() {
    this.socket = io('http://localhost:9999');
};

RPG.SocketClient.prototype.getId = function()
{
    return this.socket.id;
}

RPG.SocketClient.prototype.currentPlayer = function()
{
    this.socket.on('currentPlayers', function (output) {
        RPG.GameState.currentPlayers(output)
    });
}

RPG.SocketClient.prototype.newPlayer = function()
{
    this.socket.on('newPlayer', function (output) {
        debugger
        RPG.GameState.addOtherPlayer(output)
    });
}

RPG.SocketClient.prototype.playerMoved = function()
{
    this.socket.on('playerMoved', function (playerInfo) {
        RPG.GameState.playerMoved(playerInfo)
    });
}

RPG.SocketClient.prototype.enemyMoved = function()
{
    this.socket.on('enemyMoved', function (playerInfo) {
        RPG.GameState.enemyMoved(playerInfo)
    });
}

RPG.SocketClient.prototype.PlayerMovement = function(x,y,rotation,frame)
{
    this.socket.emit('playerMovement',{ x: x, y: y, rotation: rotation, frame: frame });
}

RPG.SocketClient.prototype.EnemyMovement = function(x,y,id)
{
    this.socket.emit('enemyMovement',{ x: x, y: y, id: id });
}

RPG.SocketClient.prototype.disconnect = function()
{
    this.socket.on('disconnect', function (output) {
        RPG.GameState.disconnect(output)
    });
}
  
