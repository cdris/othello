defmodule OthelloWeb.GameChannel do
  use OthelloWeb, :channel

  alias Othello.Game
  alias Othello.AllGames
  alias Othello.WaitingGames
  alias Othello.PlayingGames

  def join("game:" <> id, _payload, socket) do
    game = AllGames.load(id) || Game.new()
    {player, game} = Game.add_player(game)
    IO.inspect(game)
    AllGames.save(id, game)

    send(self(), :after_join)

    socket = socket
             |> assign(:game, id)
             |> assign(:player, player)
    {:ok, %{player: player}, socket}
  end

  # Based on the Phoenix.Presence tutorial though I ended up not using presences
  def handle_info(:after_join, socket) do
    id = socket.assigns[:game]
    game = AllGames.load(id)

    cond do
      Game.has_all_players(game) ->
        WaitingGames.delete(id)
        PlayingGames.save(id)
        broadcast!(socket, "playing", %{game: Game.client_view(game)})
      true ->
        WaitingGames.save(id)
        PlayingGames.delete(id)
        broadcast!(socket, "waiting", %{game: Game.client_view(game)})
    end

    OthelloWeb.Endpoint.broadcast("lobby", "update", %{games: PlayingGames.list()})
    {:noreply, socket}
  end

  def handle_in("turn", %{"tile" => tile}, socket) do
    id = socket.assigns[:game]
    player = socket.assigns[:player]

    game = AllGames.load(id)
           |> Game.place_tile(player, tile)
    AllGames.save(id, game)

    cond do
      Game.finished(game) ->
        delete_game(id)
        broadcast!(socket, "finished", %{game: Game.client_view(game)})
      true -> broadcast!(socket, "playing", %{game: Game.client_view(game)})
    end
    {:noreply, socket}
  end

  def terminate(_msg, socket) do
    IO.puts("TERMINATE")
    id = socket.assigns[:game]
    player = socket.assigns[:player]
    game = AllGames.load(id)

    if game != nil and player != "observer" do
      delete_game(id)
      broadcast!(socket, "player_left", %{game: Game.client_view(game)})
    end
    socket
  end

  defp delete_game(id) do
    AllGames.delete(id)
    WaitingGames.delete(id)
    PlayingGames.delete(id)
    OthelloWeb.Endpoint.broadcast("lobby", "update", %{games: PlayingGames.list()})
  end

end
