defmodule Othello.AllGames do
  use Agent

  def start_link do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def save(id, game) do
    Agent.update __MODULE__, fn state ->
      Map.put(state, id, game)
    end
  end

  def load(id) do
    Agent.get __MODULE__, fn state ->
      Map.get(state, id)
    end
  end

  def delete(id) do
    Agent.update __MODULE__, fn state ->
      Map.delete(state, id)
    end
  end
end
