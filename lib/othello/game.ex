defmodule Othello.Game do

  def new do
    %{
      tiles: new_tiles(),
      player: 1,
      players: 0,
      finished: false
    }
  end

  defp new_tiles do
    [0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,
     0,0,0,2,1,0,0,0,
     0,0,0,1,2,0,0,0,
     0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0]
  end

  def add_player(game) do
    case game.players do
      2 -> {"observer", game}
      players ->
        {players + 1, %{
          tiles: game.tiles,
          player: game.player,
          players: players + 1,
          finished: game.finished
        }}
    end
  end

  def has_all_players(game) do
    game.players == 2
  end

  def client_view(game) do
    %{
      tiles: game.tiles,
      player: game.player
    }
  end

  def place_tile(game, player, idx) do
    dirs = valid_move(game, player, idx)
    cond do
      Enum.any?(dirs, fn({_, v}) -> v end) -> update_game(game, idx, dirs)
      true -> game
    end
  end

  defp valid_move(game, player, idx) do
    cond do
      has_all_players(game) and player == game.player and Enum.at(game.tiles, idx) == 0 ->
        %{
          top: check_dir(game, idx, &top/1),
          bottom: check_dir(game, idx, &bottom/1),
          left: check_dir(game, idx, &left/1),
          right: check_dir(game, idx, &right/1),
          top_left: check_dir(game, idx, &top_left/1),
          top_right: check_dir(game, idx, &top_right/1),
          bottom_left: check_dir(game, idx, &bottom_left/1),
          bottom_right: check_dir(game, idx, &bottom_right/1)
        }
      true -> %{}
    end
  end

  defp any_valid(game) do
    Enum.any?(0..63, fn(idx) ->
      Enum.any?(valid_move(game, game.player, idx),
                fn({_, v}) -> v end)
    end)
  end

  defp update_game(game, idx, dirs) do
    game = game
    |> Map.put(:tiles, List.replace_at(game.tiles, idx, game.player))
    |> update_dir(idx, &top/1, Map.get(dirs, :top))
    |> update_dir(idx, &bottom/1, Map.get(dirs, :bottom))
    |> update_dir(idx, &left/1, Map.get(dirs, :left))
    |> update_dir(idx, &right/1, Map.get(dirs, :right))
    |> update_dir(idx, &top_left/1, Map.get(dirs, :top_left))
    |> update_dir(idx, &top_right/1, Map.get(dirs, :top_right))
    |> update_dir(idx, &bottom_left/1, Map.get(dirs, :bottom_left))
    |> update_dir(idx, &bottom_right/1, Map.get(dirs, :bottom_right))
    |> Map.put(:player, next_player(game.player))

    cond do
      any_valid(game) -> game
      true ->
        game = Map.put(game, :player, next_player(game.player))
        cond do
          any_valid(game) -> game
          true -> Map.put(game, :finished, true)
        end
    end
  end

  defp update_dir(game, idx, dir, condition) do
    cond do
      condition ->
        case dir.(idx) do
          nil -> game
          next_idx ->
            tile = Enum.at(game.tiles, next_idx)
            cond do
              tile == 0 -> :error
              tile == game.player -> game
              true ->
                game
                |> Map.put(:tiles, List.replace_at(game.tiles, next_idx, game.player))
                |> update_dir(next_idx, dir, condition)
            end
        end
      true -> game
    end
  end

  defp check_dir(game, idx, dir) do
    new_idx = dir.(idx)
    cond do
      new_idx == nil -> false
      Enum.at(game.tiles, new_idx) == next_player(game.player) ->
        check_dir_help(game, new_idx, dir)
      true -> false
    end
  end

  defp check_dir_help(game, idx, dir) do
    case dir.(idx) do
      nil -> false
      new_idx ->
        tile = Enum.at(game.tiles, new_idx)
        cond do
          tile == game.player -> true
          tile == 0 -> false
          true -> check_dir_help(game, new_idx, dir)
        end
    end
  end

  defp top(idx) do
    if idx < 8, do: nil, else: idx - 8
  end

  defp bottom(idx) do
    if idx > 55, do: nil, else: idx + 8
  end

  defp left(idx) do
    if rem(idx, 8) == 0, do: nil, else: idx - 1
  end

  defp right(idx) do
    if rem(idx, 8) == 7, do: nil, else: idx + 1
  end

  defp top_left(idx) do
    case top(idx) do
      nil -> nil
      top_idx -> left(top_idx)
    end
  end

  defp top_right(idx) do
    case top(idx) do
      nil -> nil
      top_idx -> right(top_idx)
    end
  end

  defp bottom_left(idx) do
    case bottom(idx) do
      nil -> nil
      bottom_idx -> left(bottom_idx)
    end
  end

  defp bottom_right(idx) do
    case bottom(idx) do
      nil -> nil
      bottom_idx -> right(bottom_idx)
    end
  end

  defp next_player(player) do
    rem(player, 2) + 1
  end
end
