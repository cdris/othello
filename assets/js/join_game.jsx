import React from 'react';

export default class JoinGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {game: ''}
  }

  handleChange(event) {
    this.setState({game: event.target.value});
  }

  handleSubmit(event) {
    window.location.href = `/game/${this.state.game}`;
    event.preventDefault();
  }

  handleRandom() {
    window.location.href = '/random';
  }

  render() {
    return (
      <div>
        <h4>Join a Random Game</h4>
        <button className="btn btn-primary" onClick={this.handleRandom.bind(this)}>Random Game</button>
        <hr/>
        <h4>OR Join a Game by Name</h4>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label htmlFor="gameName">Game Name</label>
            <input type="text" name="gameName" id="gameName" className="form-control" required pattern="[a-zA-Z0-9]+" placeholder="alphanumeric characters only" onChange={this.handleChange.bind(this)}/>
          </div>
          <button type="submit" className="btn btn-primary">Join Game</button>
        </form>
      </div>
    );
  }
}


