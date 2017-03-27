# API

The game engine is event-based and does not rely on a direct request-response
model. Instead the user can listen and emit to the game. This is due to the real
time requirement of the game.

This document will be updated and new API methods will be added.

## Listeners

These are events the user can listen to.

### gameStart

* `id` <int> - The game ID
* `player` <Object> - The player object belonging to this client
* `tiles` <Object> - The tiles on this world

### goToWorld

* `location` <Object> - The location object belonging to this world
* `tiles` <Object> - The tiles on this world

### exploreTile

* `tile` <Object> - The resulting tile object

### logEvent

* `message` <string> - A description of an event that occured

## Emitters

These are events the user can emit to.

### startGame

* `nickname` <string> - The nickname of the player

### goToWorld

* `location` <Object> - The location object belonging to the destination world

### exploreTile

* `position` <Object> - The position of the tile to explore
