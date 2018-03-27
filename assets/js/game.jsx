import React from 'react';
import ReactDOM from 'react-dom';
import { Button, ButtonGroup, ButtonToolbar, Modal, ModalHeader, ModalBody,
         ModalFooter, Label, Input } from 'reactstrap';
import Instructions from './instructions';

export default function game_init(root, channel) {
  ReactDOM.render(<OthelloGame channel={channel}/>, root);
}

class OthelloGame extends React.Component {

  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      tiles: [],
      player: "observer",
      currentPlayer: 1,
      status: "waiting",
      leaveModal: false,
      linkModal: false,
      instructionsModal: false
    };

    this.channel.on("waiting", msg => { this.updateGame(msg, "waiting") });
    this.channel.on("playing", msg => { this.updateGame(msg, "playing") });
    this.channel.on("finished", msg => { this.closeGame(msg, "finished") });
    this.channel.on("player_left", msg => { this.closeGame(msg, "player_left") });

    this.channel.join()
      .receive("ok", this.setPlayer.bind(this))
      .receive("error", resp => { alert("Unable to connect to server:\n" + resp); });
  }

  setPlayer(msg) {
    console.log(this.state);
    this.setState({ player: msg.player });
  }

  updateGame(msg, status) {
    console.log("Update game", msg.game, status);
    this.setState({
      tiles: msg.game.tiles,
      currentPlayer: msg.game.player,
      status: status,
    });
  }

  getScores() {
    let result = [0, 0]
    for (var i = 0; i < this.state.tiles.length; i++) {
      switch(this.state.tiles[i]) {
        case 0: break;
        default:
          result[this.state.tiles[i] - 1] += 1;
      }
    }
    return result;
  }

  closeGame(game, status) {
    this.channel.leave();
    this.updateGame(game, status);
  }

  leaveGame() {
    this.channel.leave();
    window.location.href = "/";
  }

  toggleLeave() {
    this.setState({ leaveModal: !this.state.leaveModal });
  }

  toggleLink() {
    this.setState({ linkModal: !this.state.linkModal });
  }

  toggleInstructions() {
    this.setState({ instructionsModal: !this.state.instructionsModal });
  }

  clickTile(id) {
    this.channel.push("turn", {tile: id});
  }

  getTileColor(player) {
    switch(player) {
      case 1:
        return "bg-dark";
      case 2:
        return "bg-light";
      default:
        return "";
    }
  }

  render() {
    let scores = this.getScores();
    let playerName = this.state.player == "observer" ?
                     "an observer" :
                     `Player ${this.state.player}`;
    let gameTitle = ((status) => {
      switch(status) {
        case "waiting":
          return "Waiting for opponent.";
        case "playing":
          if (this.state.currentPlayer == this.state.player) {
            return "It's your turn.";
          }
          return `It's Player ${this.state.currentPlayer}'s turn.`;
        case "finished":
          if (scores[0] > scores[1]) {
            if (this.state.player == 1) {
              return "You won!";
            }
            return "Player 1 won!";
          } else if (scores[1] > scores[0]) {
            if (this.state.player == 2) {
              return "You won!";
            }
            return "Player 2 won!";
          } else {
            return "It's a tie!";
          }
        case "player_left":
          return "Opponent has left the game.";
        default:
          return "ERROR";
      }
    })(this.state.status);

    let toggleLeave = this.toggleLeave.bind(this);
    let toggleLink = this.toggleLink.bind(this);
    let toggleInstructions = this.toggleInstructions.bind(this);

    let tiles = _.map(this.state.tiles, (tile, i) => {
      let color = this.getTileColor(tile);
      let hover = false;
      let click = (x) => { };
      if (color == "" &&
          this.state.status == "playing" &&
          this.state.currentPlayer == this.state.player) {
        color = this.getTileColor(this.state.player);
        hover = true;
        click = this.clickTile.bind(this);
      }
      return <Tile color={color} click={click} hover={hover} key={i} id={i}/>;
    });

    return (
      <div>
        <div id="game-board" className="mx-auto">
          {tiles}
        </div>

        <div id="game-buttons">
          <ButtonToolbar className="float-right">
            <ButtonGroup className="mr-2">
              <Button color="primary" onClick={toggleInstructions}>
                Instructions
              </Button>
            </ButtonGroup>
            <ButtonGroup className="mr-2">
              <Button color="primary" onClick={toggleLink}>
                Get Game Link
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button color="danger" onClick={toggleLeave}>
                Leave Game
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>

        <div id="game-info" className="row">
          <div className="col-8">
            <div className="p-3">
              <h4>You are {playerName}</h4>
              <h1>{gameTitle}</h1>
            </div>
          </div>
          <div className="col-4">
            <div className="row">
              <div className="mw-150 ml-auto col-md-6 col-12">
                <div className="square">
                  <div className="disc bg-dark">
                    <div className="disc-text text-light">{scores[0]}</div>
                  </div>
                </div>
              </div>
              <div className="mw-150 ml-auto col-md-6 col-12">
                <div className="square">
                  <div className="disc bg-light">
                    <div className="disc-text text-dark">{scores[1]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={this.state.leaveModal} toggle={toggleLeave}>
          <ModalHeader toggle={toggleLeave}>Leave Game</ModalHeader>
          <ModalBody>Are you sure you want to leave the game?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.leaveGame.bind(this)}>
              Leave Game
            </Button>
            <Button color="secondary" onClick={toggleLeave}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.linkModal} toggle={toggleLink}>
          <ModalHeader toggle={toggleLink}>Game Link</ModalHeader>
          <ModalBody>
            <Label for="game-link">
              Send this link to friends so they can join your game!
            </Label>
            <input readonly
                   className="form-control"
                   type="text"
                   value={`http:\/\/othello.cdriskill.com/game/${window.gameName}`} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleLink}>Close</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.instructionsModal} toggle={toggleInstructions}>
          <ModalHeader toggle={toggleInstructions}>Instructions</ModalHeader>
          <ModalBody>
            <Instructions />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleInstructions}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

function Tile(params) {
  let hover = "";
  if (params.hover) {
    hover = "disc-hover";
  } else if (params.color == "") {
    hover = "d-none";
  }
  return (
    <div className="tile">
      <div className="square">
        <div className={`disc ${params.color} ${hover}`}
             onClick={() => {params.click(params.id);}}></div>
      </div>
    </div>
  );
}
