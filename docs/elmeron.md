# Elmeron

Elmeron is a real time multiplayer game where every player competes on the
exploration of the universe: the player who first finds the planet Elmeron wins
and the game is over. By strategically use the planet's resources and other
players' collections of gems it is possible to explore the universe's three
levels and finally find Elmeron.

## The universe

The universe is modeled like a tree with three levels: space, planet and island.
A planet can hold many islands and the space can hold many planets. Each level
is built up by hexagon tiles and each tile can, depending on what level it's
located on, hold a finite amount of resources. Each tile also generates gems
from time to time.

### Tiles

Each tile holds a resource type and a finite amount of it. For instance, a
forest tile holds a finite amount of forest resources. A player can extract
these resources by building a refinery on top of it. A tile can be explored by
any player with the cost of fuel. The player who explores it declares ownership
of it. However, any player can force the owner to sell the tile if the player
wants to build a refinery on top of it. The selling price of a tile depends on
the global demand and availability. Each tile also generates a gem which can be
harvested by any player.

### Fuel

Fuel is used by the player to explore new tiles. The cost of exploration is
constant on each level on any tile, however it is more expensive the higher up
in the universe the player is located. For instance, exploring an island tile is
cheaper than exploring a planet tile. Zooming in and out (going from an island
to a planet) also costs fuel. Fuel is also used as currency in the game.
Whenever a player buys a tile or a gem from another player it is payed with
fuel.

### Gems

Each tile generates gems which can be harvested by any player. Only tiles on the
island-level can generate gems. The gem generation frequency depends on the
amount of tiles with the same resources that are grouped together on the island.
A player who collects a gem declares ownership of it. However, any player can
force the owner to sell the gem if the player needs it to build a refinery.

### Refineries

A player can build a refinery on top of tiles. A refinery can be built on any
number of tiles from 1 to infinity. Refineries can only be built on islands. The
tiles that are used by the refinery must be connected. The refinery extracts the
tile's resources and turns them into fuel. The amount of fuel a refinery can
produce per time unit depends both on the amount of tiles the refinery is built
on and the variation of tiles the refinery is built on. For instance, building a
refinery on a forest tile and a rock tile gives better efficiency than a
refinery built only on two forest tiles.

A refinery can never be removed once it is built. A tile which is covered by a
refinery cannot generate gems. Since the resource amount in a tile is finite the
refinery will eventually be depleted and no more fuel can be produced. Of a
collection of tiles included in a refinery, once any tile runs out of resources
the production will continue but with reduced efficiency until all tiles are out
of resources, then the refinery is depleted.

Refineries requires gems to work. The amount of gems required depends on the
refinery's efficiency, i.e. the amount and variation of tiles the refinery will
be built on. If a player does not hold enough gems to pay for the refinery he
will receive an indirect fuel price of buying the rest of the required gems from
the other players. If a player does not own tiles he wishes to include in the
refinery the cost will also include the price of buying the tile from the player
owning it.  If the player has enough fuel to pay for the refinery he can
directly do so, forcing the other players to sell their gems and tiles.

## Economy and production

The game requires interaction between players and this takes place in a global
market containing gems and tiles. Players can buy and sell these assets and the
price is automatically calculated by the game and depends on the global demand
and availability of the asset.

### How is the refinery production calculated?

Refineries are built on top of tiles and extracts the available resources to
create fuel. Refineries are very dynamic constructions with variable efficiency.
A refinery works best when it can extract from different resource types at the
same time. That means that a forest and a rock tile gives better efficiency than
two forest tiles. The refinery also works better when the variation is balanced,
i.e. a refinery built on two forest and two rocks has better efficiency than a
refinery built on three forest and one rock.

* `f` denotes the amount of fuel a refinery generate per time unit per tile
* `m` denotes the global total amount of resource types available on an island
  (refineries can only be built on islands)
* `x_i` denotes the amount of resources of type `i` included in the refinery
* `v` denotes the vector `(x_1, x_2, ..., x_m)`
* `n` denotes the amount of `x_i` in `v` greater than zero
* `fi_min` denotes the smallest angle `v` has to any of its axes

Then

```

f = 1 + "vector factor" * "variation factor"

"vector factor" = sqrt( |v|^2 * sqrt(m) * fi_min )

"variation factor" = ( e ^ ( n / m ) - 1 ) / ( e - 1 )

```

The total production value per time unit is `∑ f * x_i`.


### How is the refinery gem requirement calculated?

Let `g` denote the vector `(c_1, c_2, ..., c_m)` where `c_i` is the amount of
gems of type `i` required to build the refinery. Then `g = v * f`.

### How is the fuel cost to buy gems calculated?

The fuel price is narrowed down to the sum of the cost to buy each single gem
required. The cost depends on the total production value of the refinery, the
required amount of gems to buy and the global amount of gems available.

* `gr_i` denotes the amount of gems of type `i` required to buy from other
  players
* `gg_i` denotes the global amount of gems of type `i`
* `f_i` denotes the fuel cost to buy one gem of type `i`
* `p` denotes the total production value of the refinery

Then `f_i = gr_i ^ 2 * p / gg_i`. The total fuel price to buy all gems required
is the sum of all `f_i`.

### How is the fuel cost to buy tiles calculated?

By the same reasoning as earlier.

* `tr_i` denotes the amount of tiles of type `i` on this island required to buy
  from other players
* `tg_i` denotes the total amount of tiles of type `i` on this island
* `f_i` denotes the fuel cost to buy one tile of type `i`

Then `f_i = tr_i ^ 2 * p / tg_i`. The total fuel price to buy all tiles required
is the sum of all `f_i`.

### Which player am I buying gems from?

Whenever a player harvest a gem it is registered in a global queue. When a
player needs to buy a gem he buys it automatically from the player at the top of
the queue.

### Which player am I buying tiles from?

The player who discovered the tile.
