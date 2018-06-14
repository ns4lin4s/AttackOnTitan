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

RPG.SocketClient.prototype.disconnect = function()
{
    this.socket.on('disconnect', function (output) {
        RPG.GameState.disconnect(output)
    });
}
  
