require 'colorize'

class Pawn
  def initialize(board, piece, moving_piece, player, enemy_player, enemy_player_color, new_row)
    @board = board
    @piece = piece
    @moving_piece = moving_piece
    @player = player
    @enemy_player = enemy_player
    @enemy_player_color = enemy_player_color
    @new_row = new_row
    @attacking_pawn_id = nil
  end

  def move?(row, col)
    return if @board.board[row][col][:targeted_by]&.include?(@enemy_player_color)

    square = @board.board[row][col]
    pawn_id = @board.board[row][col][:id]

    if square[:targeted_by] == @piece
      capture?(row, col, @attacking_pawn_id)
    elsif square[:piece] == @piece
      reset_movements
      show_viable_captures(row, @new_row, col)
      show_viable_movement(row, @new_row, col, pawn_id)
    elsif square[:piece] == @moving_piece
      reset_movements
      move_pawn(row, col, pawn_id)
    end
  end

  def show_viable_movement(row, new_row, col, pawn_id)
    return unless (row + new_row) < 8 && (row + new_row) >= 0
    return unless @board.board[row + new_row][col][:id].nil?

    pawn_move?(row, new_row, col, pawn_id)

    if @board.board[row][col][:piece] == 'white_pawn' && row == 1
      pawn_double_move?(row, new_row, col, pawn_id)
    elsif @board.board[row][col][:piece] == 'black_pawn' && row == 6
      pawn_double_move?(row, new_row, col, pawn_id)
    end
  end

  def pawn_move?(row, new_row, col, pawn_id)
    @board.board[row + new_row][col][:piece] = @moving_piece
    @board.board[row + new_row][col][:id] = pawn_id
    @board.board[row + new_row][col][:contents] = ' X '.gray
  end

  def pawn_double_move?(row, new_row, col, pawn_id)
    return unless @board.board[row + new_row + new_row][col][:id].nil?

    @board.board[row + new_row + new_row][col][:piece] = @moving_piece
    @board.board[row + new_row + new_row][col][:id] = pawn_id
    @board.board[row + new_row + new_row][col][:contents] = ' X '.gray
  end

  def move_pawn(row, col, pawn_id)
    pick_up_pawn(pawn_id)
    place_pawn(row, col, pawn_id)
    reset_targeted_pieces
    pass_turn
  end

  def pick_up_pawn(pawn_id)
    8.times do |i|
      8.times do |j|
        next unless @board.board[i][j][:piece] == @piece && @board.board[i][j][:id] == pawn_id

        remove_movement_squares(i, j)
      end
    end
  end

  def place_pawn(row, col, pawn_id)
    @board.board[row][col][:piece] = @piece
    @board.board[row][col][:belongs_to] = @player
    @board.board[row][col][:id] = pawn_id

    if @player == 'player_one' then
      @board.board[row][col][:contents] = ' ♟ '.cyan
    else
      @board.board[row][col][:contents] = ' ♟ '.magenta
    end
  end

  def show_viable_captures(row, new_row, col)
    return unless (row + new_row) < 8 && (row + new_row) >= 0

    @attacking_pawn_id = @board.board[row][col][:id]

    if (col + 1) < 8 && @board.board[row + new_row][col + 1][:belongs_to] == @enemy_player
      @board.board[row + new_row][col + 1][:targeted_by] = @piece
    end

    if (col - 1) >= 0 && @board.board[row + new_row][col - 1][:belongs_to] == @enemy_player
      @board.board[row + new_row][col - 1][:targeted_by] = @piece
    end
  end

  def capture?(row, col, attacking_pawn)
    move_pawn(row, col, attacking_pawn)
    reset_targeted_pieces
    reset_movements
  end

  def reset_targeted_pieces
    8.times do |i|
      8.times do |j|
        @board.board[i][j][:targeted_by] = nil unless @board.board[i][j][:targeted_by].nil?
      end
    end
  end

  def reset_movements
    8.times do |i|
      8.times do |j|
        next unless @board.board[i][j][:piece]&.include?('moveable')

        remove_movement_squares(i, j)
      end
    end
  end

  def remove_movement_squares(row, col)
    @board.board[row][col][:piece] = nil
    @board.board[row][col][:targeted_by] = nil
    @board.board[row][col][:belongs_to] = nil
    @board.board[row][col][:id] = nil
    @board.board[row][col][:contents] = '   '
  end

  def pass_turn
    @board.player_turn += 1 if @player == 'player_one'
    @board.player_turn -= 1 if @player == 'player_two'
  end
end
