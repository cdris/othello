import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

export default class ListGames extends React.Component {

  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = { games: [] };

    this.channel.on("update", this.updateGames.bind(this));

    this.channel.join()
      .receive("ok", resp => {console.log("ok");})
      .receive("error", resp => { alert("Unable to join:\n" + resp); });
  }

  updateGames(games) {
    console.log("New games", games);
    this.setState({ games: games.games });
  }

  render() {
    let games = _.map(this.state.games, game => {
      return <ListGroupItem tag="a" href={`/game/${game}`}>{game}</ListGroupItem>
    });
    return (
      <div>
        <h4>Watch a Game</h4>
        <p>These games are all currently active. Click on one to watch it played live!</p>
        <ListGroup>{games}</ListGroup>
      </div>
    );
  }
}


