# Elmeron - TDDD27 Project

This project will result in the game Elmeron. Elmeron is a real time multiplayer
game where every player competes on the exploration of the universe: the player
who first finds the planet Elmeron wins and the game is over. By strategically
use the planet's resources and other players' collections of gems it is possible
to explore the universe's three levels and finally find Elmeron.

Read more about it [here](docs/elmeron.md).

## The system

The project will result in three main components in the system: a web client,
a web server and a game server.

### The web client

The game will be played in a browser. [React](https://facebook.github.io/react/)
will be used to build the UI components, SVG will be used for the graphics and
[Redux](http://redux.js.org/) will be used as a state container.
[webpack](https://webpack.js.org/) will also be used to pack all the javascript
dependencies into one .js-file, one .html-file and one .css-file.

### The web server

The single purpose of the web server is to serve the static files required by
the web client. It will be a [NodeJS](https://nodejs.org/en/)-based server
using the library [Express](https://expressjs.com/).

### The game server

The game server runs the game engine. It will be communicated with by the web
client using web sockets. Here the library [socket.io](https://socket.io/) will
be used both by the web client and the game server. Like the web server it will
be run with NodeJS.

## Language

Javascript ES6 will be the language on all components in the system and
[Babel](http://babeljs.io/) will be used to compile to ES5.

## Testing

[Jest](https://facebook.github.io/jest/) will be used in all components as a
testing platform.

## Linting

[ESLint](http://eslint.org/) will be used as a linter on all components. The
style guide will be [airbnb](https://github.com/airbnb/javascript).

## CI/CD

[GitLab runners](https://gitlab.com/gitlab-org/gitlab-ci-multi-runner) will be
used to deploy and run automatic tests and lints. Any commit on any branch will
trigger tests and lints. Commits on master will also trigger deployment meaning
the latest release of the game will be available live all the time at
[elmeron.natanael.se](http://elmeron.natanael.se). The machine doing this will
be a Rasberry Pi and [Docker](https://www.docker.com/) will be used as a
container wrapping all jobs.

## Scope

There will be no such thing as a user database. A user does not exist if he is
not playing. He is identified by a nickname and a game ID which is stored in the
browser's local storage when he starts a new game. If he by any reason reloads
the browser or exits it and then returns to the web page the system will try to
rejoin him to the game identified by his local storage. If the game has ended or
if his local storage is deleted he cannot join the game again.

## Plan outline

The game will be developed in a set of iterations during the period.

### Iteration 1 - Development environment

* GitLab
* Runners
* Linting
* Testing
* Deployment
* Initial web server

### Iteration 2 - Client

* Local game engine
* Graphics, pan, zoom, tiles
* Universe discovery
* Game end when Elmeron planet is found

### Iteration 3 - Production and economy

* Fuel
* Gems
* Harvesting
* Refineries
* Cost to explore and zoom
* Cost to build

### Iteration 4 - Game server

* Remote game engine
* Multiplayer
* Trading

### Iteration 5 -  Game handling

* Lobby
* Multiple games
