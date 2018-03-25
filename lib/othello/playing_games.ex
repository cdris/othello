defmodule Othello.PlayingGames do
  use Agent

  def start_link do
    Agent.start_link(fn -> MapSet.new end, name: __MODULE__)
  end

  def save(id) do
    Agent.update __MODULE__, fn state ->
      MapSet.put(state, id)
    end
  end

  def delete(id) do
    Agent.update __MODULE__, fn state ->
      MapSet.delete(state, id)
    end
  end

  def list do
    Agent.get __MODULE__, fn state -> MapSet.to_list(state) end
  end
end
