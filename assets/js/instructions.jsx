import React from 'react';

export default function Instructions(params) {
  return (
    <div>
      <h4>Overview</h4>
      <p>Othello is a two-player game played on an 8x8 board.</p>
      <h4>Starting the Game</h4>
      <p>The game starts with four alternating black and white discs in the center of the board. Black goes first.</p>
      <h4>Placing a Piece</h4>
      <p>On your turn, you must place a new piece such that you surround at least one of your opponent's pieces. A piece is surrounded if you can make a straight line from one of your existing pieces through the opponent's piece to the new piece you are placing. Once you have placed your piece in a valid move, all surrounded opponent pieces will be flipped to your color.</p>
      <h4>Winning the Game</h4>
      <p>The game ends when the board is filled. At the end of the game, the number of pieces of each player's color are counted. The player with the most pieces in their color is the winner.</p>
    </div>
  );
}
