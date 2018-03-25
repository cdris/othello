defmodule OthelloWeb.PageController do
  use OthelloWeb, :controller

  alias Othello.WaitingGames

  def index(conn, _params) do
    render conn, "index.html"
  end

  def random(conn, _params) do
    game_name = case WaitingGames.random() do
      nil -> random_name()
      game -> game
    end
    redirect conn, to: "/game/#{game_name}"
  end

  def game(conn, params) do
    render conn, "game.html", game: params["game"]
  end

  # credit to this answer for generating url safe random strings
  # https://stackoverflow.com/questions/32001606/how-to-generate-a-random-url-safe-string-with-elixir
  defp random_name do
    :crypto.strong_rand_bytes(12)
    |> Base.url_encode64
    |> binary_part(0, 12)
  end
end
