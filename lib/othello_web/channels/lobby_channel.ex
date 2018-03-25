defmodule OthelloWeb.LobbyChannel do
  use OthelloWeb, :channel

  alias Othello.PlayingGames

  def join("lobby", _payload, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    push(socket, "update", %{
      games: PlayingGames.list()
    })
    {:noreply, socket}
  end
end
