require 'colorize'

class Bishop
  def initialize(board, piece, moving_piece, player, enemy_player, enemy_player_color)
    @board = board
    @piece = piece
    @moving_piece = moving_piece
    @player = player
    @enemy_player = enemy_player
    @enemy_player_color = enemy_player_color
    @attacking_bishop_id = nil
  end

  def move?(row, col)
    return if @board.board[row][col][:targeted_by]&.include?(@enemy_player_color)

    square = @board.board[row][col]
    bishop_id = @board.board[row][col][:id]

    if square[:targeted_by] == @piece
      capture?(row, col, @attacking_bishop_id)
    elsif square[:piece] == @piece
      reset_movements
      show_viable_movements(row, col, bishop_id)
    elsif square[:piece] == @moving_piece
      move_bishop(row, col, bishop_id)
    end
  end

  def show_viable_movements(row, col, bishop_id)
    bishop_movement(row, 1, col, 1, bishop_id) # lower right diagonal
    bishop_movement(row, 1, col, -1, bishop_id) # lower left diagonal
    bishop_movement(row, -1, col, 1, bishop_id) # upper right diagonal
    bishop_movement(row, -1, col, -1, bishop_id) # upper left diagonal
  end

  def bishop_movement(row, new_row, col, new_col, bishop_id)
    8.times do |i|
      return unless (row + (i * new_row)) < 8 && (row + (i * new_row)) >= 0
      return unless (col + (i * new_col)) < 8 && (col + (i * new_col)) >= 0
      next if col == (col + (i * new_col)) || row == (row + (i * new_row))

      if @board.board[row + (i * new_row)][col + (i * new_col)][:piece].is_a?(String)
        if @board.board[row + (i * new_row)][col + (i * new_col)][:belongs_to] == @enemy_player
          @attacking_bishop_id = bishop_id
          @board.board[row + (i * new_row)][col + (i * new_col)][:targeted_by] = @piece
        end
        break
      end

      @board.board[row + (i * new_row)][col + (i * new_col)][:piece] = @moving_piece
      @board.board[row + (i * new_row)][col + (i * new_col)][:contents] = ' X '.gray
      @board.board[row + (i * new_row)][col + (i * new_col)][:id] = bishop_id
    end
  end

  def move_bishop(row, col, bishop_id)
    pick_up_bishop(bishop_id)
    place_bishop(row, col, bishop_id)
    reset_movements
    reset_targeted_pieces
    pass_turn
  end

  def pick_up_bishop(bishop_id)
    8.times do |i|
      8.times do |j|
        next unless @board.board[i][j][:piece] == @piece && @board.board[i][j][:id] == bishop_id

        remove_movement_squares(i, j)
      end
    end
  end

  def place_bishop(row, col, bishop_id)
    @board.board[row][col][:piece] = @piece
    @board.board[row][col][:belongs_to] = @player
    @board.board[row][col][:id] = bishop_id

    if @player == 'player_one' then
      @board.board[row][col][:contents] = ' ♝ '.cyan
    else
      @board.board[row][col][:contents] = ' ♝ '.magenta
    end
  end

  def show_viable_captures(row, col)
    return unless (row + 1) < 8 && (row + 1) >= 0

    @attacking_bishop_id = @board.board[row][col][:id]

    if (col + 1) < 7 && @board.board[row + 1][col + 1][:belongs_to] == @enemy_player
      @board.board[row + 1][col + 1][:targeted_by] = @piece
    end

    if (col - 1) >= 0 && @board.board[row + 1][col - 1][:belongs_to] == @enemy_player
      @board.board[row + 1][col - 1][:targeted_by] = @piece
    end
  end

  def capture?(row, col, attacking_bishop)
    move_bishop(row, col, attacking_bishop)
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
