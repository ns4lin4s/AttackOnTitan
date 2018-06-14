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
        debugger
        RPG.GameState.currentPlayer(output)
    });
}

RPG.SocketClient.prototype.newPlayer = function(playerInfo)
{
    this.socket.on('newPlayer', function (output) {
        
    });
}

RPG.SocketClient.prototype.disconnect = function(playerId)
{
    this.socket.on('disconnect', function (output) {
        
    });
}
  
