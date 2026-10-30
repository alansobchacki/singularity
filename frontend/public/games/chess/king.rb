require 'colorize'

class King
  def initialize(board, piece, moving_piece, player, enemy_player, enemy_player_color)
    @board = board
    @piece = piece
    @moving_piece = moving_piece
    @player = player
    @enemy_player = enemy_player
    @enemy_player_color = enemy_player_color
    @attacking_king_id = nil
  end

  def move?(row, col)
    return if @board.board[row][col][:targeted_by]&.include?(@enemy_player_color)

    square = @board.board[row][col]
    king_id = @board.board[row][col][:id]

    if square[:targeted_by] == @piece
      capture?(row, col, @attacking_king_id)
    elsif square[:piece] == @piece
      reset_movements
      show_viable_movement(row, col, king_id)
    elsif square[:piece] == @moving_piece
      move_king(row, col, king_id)
    end
  end

  def show_viable_movement(row, col, king_id)
    king_movements(row, 1, col, 1, king_id) # bottom right square
    king_movements(row, 1, col, 0, king_id) # bottom square
    king_movements(row, 1, col, -1, king_id) # bottom left square
    king_movements(row, 0, col, -1, king_id) # left square
    king_movements(row, 0, col, 1, king_id) # right square
    king_movements(row, -1, col, 1, king_id) # upper right square
    king_movements(row, -1, col, 0, king_id) # upper square
    king_movements(row, -1, col, -1, king_id) # upper left square
  end

  def king_movements(row, new_row, col, new_col, king_id)
    return unless (row + new_row) < 8 && (row + new_row) >= 0
    return unless (col + new_col) < 8 && (col + new_col) >= 0

    if @board.board[row + new_row][col + new_col][:belongs_to] == @enemy_player
      @attacking_king_id = king_id
      @board.board[row + new_row][col + new_col][:targeted_by] = @piece
    elsif @board.board[row + new_row][col + new_col][:belongs_to].nil?
      @board.board[row + new_row][col + new_col][:piece] = @moving_piece
      @board.board[row + new_row][col + new_col][:id] = king_id
      @board.board[row + new_row][col + new_col][:contents] = ' X '.gray
    end
  end

  def move_king(row, col, king_id)
    pick_up_king(king_id)
    place_king(row, col, king_id)
    reset_movements
    reset_targeted_pieces
    pass_turn
  end

  def pick_up_king(king_id)
    8.times do |i|
      8.times do |j|
        next unless @board.board[i][j][:piece] == @piece && @board.board[i][j][:id] == king_id

        remove_movement_squares(i, j)
      end
    end
  end

  def place_king(row, col, king_id)
    @board.board[row][col][:piece] = @piece
    @board.board[row][col][:belongs_to] = @player
    @board.board[row][col][:id] = king_id

    if @player == 'player_one' then
      @board.board[row][col][:contents] = ' ♚ '.cyan
    else
      @board.board[row][col][:contents] = ' ♚ '.magenta
    end
  end

  def show_viable_captures(row, col)
    return unless (row + 1) < 8 && (row + 1) >= 0

    @attacking_king_id = @board.board[row][col][:id]

    if (col + 1) < 7 && @board.board[row + 1][col + 1][:belongs_to] == @enemy_player
      @board.board[row + 1][col + 1][:targeted_by] = @piece
    end

    if (col - 1) >= 0 && @board.board[row + 1][col - 1][:belongs_to] == @enemy_player
      @board.board[row + 1][col - 1][:targeted_by] = @piece
    end
  end

  def capture?(row, col, attacking_king)
    move_king(row, col, attacking_king)
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
