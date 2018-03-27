# Othello

## Game
This game was implemented with an elixir backend and react frontend. All game rules are enforced by the backend.

### Instructions
#### Overview
Othello is a two-player game played on an 8x8 board.

#### Starting the Game
The game starts with four alternating black and white discs in the center of the board. Black goes first.

#### Placing a Piece
On your turn, you must place a new piece such that you surround at least one of your opponent's pieces. A piece is surrounded if you can make a straight line from one of your existing pieces through the opponent's piece to the new piece you are placing. Once you have placed your piece in a valid move, all surrounded opponent pieces will be flipped to your color.

#### Winning the Game
The game ends when there are no more valid moves. At the end of the game, the number of pieces of each player's color are counted. The player with the most pieces in their color is the winner.

### The Lobby Page
The Othello lobby has the following three cards:
  * Instructions
  * Join a Game
  * Active Games

Each shows what their titles suggest. The instructions shown are the same as the game instructions given above.

Under "Join a Game" you can choose to join a random game which will either start a new game if no game is waiting for a second player, or add you to a game with only one player. You can also choose to join a game by name. If a game with that name does not exist, it will be created with you as the first player. If a game with that name exists and has only one player, you will become the second player. Otherwise, you will become an observer of that game.

Under "Active Games" you can see a list of games that are currently being played (meaning they have both players). Clicking on any of these will add you as an observer of that game.

### The Game Page
The game page has the following features:
  * Top button bar with the following buttons:
    * Instructions: shows the instructions given above
    * Game Link: shows the url for the current game so you can send it to friends to join
    * Leave Game: shows a confirmation dialog to leave the game
  * Game board in the center of the screen
  * Bottom bar with the following:
    * Your role (Player 1, Player 2, or observer)
    * Current game status (Waiting for opponent, It's ...'s turn, Opponent has left the game, ... has won!, It's a tie!)
    * Player 1's score on a black tile
    * Player 2's score on a white tile

If the game's status is waiting for an opponent, hang tight! Once someone else joins your game you'll be able to play.

If the game's status says the opponent has left, someone has one, or it's a tie, the game is over. You can go back to the lobby using the Leave Game button.

If the game's status says it's the other player's turn and you are not an observer, wait for the other player to take their turn. If you are an observer, sit back and watch, you won't be able to interact with the game board.

If the game's status says it's your turn, place a piece according to the game rules above. Hovering over an empty piece will show you a semi-transparent piece. When you click on a space, if the move is valid, the piece will become fully translucent and your turn will end. If the move is invalid, the piece will not be placed.

## To start your Phoenix server

  * Install dependencies with `mix deps.get`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
