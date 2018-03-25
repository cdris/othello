import React from 'react';
import ReactDOM from 'react-dom';
import { Card, CardHeader, CardBody, Button, Collapse } from 'reactstrap';
import Instructions from './instructions';
import JoinGame from './join_game';
import ListGames from './list_games';

export default function lobby_init(root, channel) {
  ReactDOM.render(<OthelloLobby channel={channel} />, root);
}

class OthelloLobby extends React.Component {

  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      instructions: false,
      joinGame: false,
      listGames: false
    };
  }

  toggleInstructions() {
    this.setState({instructions: !this.state.instructions});
  }

  toggleJoinGame() {
    this.setState({joinGame: !this.state.joinGame});
  }

  toggleListGames() {
    this.setState({listGames: !this.state.listGames});
  }

  render() {
    return (
      <div>
        <h1 className="p-5 text-center text-light big-title">Let's Play Othello!</h1>
        <div className="row px-3">
          <div className="col-12 col-md-4">
            <Card className="collapse-card">
              <CardHeader>
                <h3 className="d-inline-block">Instructions</h3>
                <Button color="primary"
                        className="float-right hide-lg"
                        onClick={this.toggleInstructions.bind(this)}>
                  {this.state.instructions ? "Hide" : "Show"}
                </Button>
              </CardHeader>
              <Collapse isOpen={this.state.instructions}>
                <CardBody>
                  <Instructions />
                </CardBody>
              </Collapse>
            </Card>
            <hr className="hide-lg" />
          </div>
          <div className="col-12 col-md-4">
            <Card className="collapse-card">
              <CardHeader>
                <h3 className="d-inline-block">Join a Game</h3>
                <Button color="primary"
                        className="float-right hide-lg"
                        onClick={this.toggleJoinGame.bind(this)}>
                  {this.state.joinGame ? "Hide" : "Show"}
                </Button>
              </CardHeader>
              <Collapse isOpen={this.state.joinGame}>
                <CardBody>
                  <JoinGame />
                </CardBody>
              </Collapse>
            </Card>
            <hr className="hide-lg" />
          </div>
          <div className="col-12 col-md-4">
            <Card className="collapse-card">
              <CardHeader>
                <h3 className="d-inline-block">Active Games</h3>
                <Button color="primary"
                        className="float-right hide-lg"
                        onClick={this.toggleListGames.bind(this)}>
                  {this.state.listGames ? "Hide" : "Show"}
                </Button>
              </CardHeader>
              <Collapse isOpen={this.state.listGames}>
                <CardBody>
                  <ListGames channel={this.channel} />
                </CardBody>
              </Collapse>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
