require 'colorize'

class Queen
  def initialize(board, piece, moving_piece, player, enemy_player, enemy_player_color)
    @board = board
    @piece = piece
    @moving_piece = moving_piece
    @player = player
    @enemy_player = enemy_player
    @enemy_player_color = enemy_player_color
    @attacking_queen_id = nil
  end

  def move?(row, col)
    return if @board.board[row][col][:targeted_by]&.include?(@enemy_player_color)

    square = @board.board[row][col]
    queen_id = @board.board[row][col][:id]

    if square[:targeted_by] == @piece
      capture?(row, col, @attacking_queen_id)
    elsif square[:piece] == @piece
      reset_movements
      show_viable_movements(row, col, queen_id)
    elsif square[:piece] == @moving_piece
      move_queen(row, col, queen_id)
    end
  end

  def show_viable_movements(row, col, queen_id)
    queen_movement(row, 0, col, 1, queen_id) # right horizontal
    queen_movement(row, 0, col, -1, queen_id) # left horizontal
    queen_movement(row, 1, col, 0, queen_id) # lower vertical
    queen_movement(row, -1, col, 0, queen_id) # upper vertical
    queen_movement(row, 1, col, 1, queen_id) # lower right diagonal
    queen_movement(row, 1, col, -1, queen_id) # lower left diagonal
    queen_movement(row, -1, col, 1, queen_id) # upper right diagonal
    queen_movement(row, -1, col, -1, queen_id) # upper left diagonal
  end

  def queen_movement(row, new_row, col, new_col, queen_id)
    8.times do |i|
      return unless (row + (i * new_row)) < 8 && (row + (i * new_row)) >= 0
      return unless (col + (i * new_col)) < 8 && (col + (i * new_col)) >= 0
      next if col == (col + (i * new_col)) && row == (row + (i * new_row))

      if @board.board[row + (i * new_row)][col + (i * new_col)][:piece].is_a?(String)
        if @board.board[row + (i * new_row)][col + (i * new_col)][:belongs_to] == @enemy_player
          @attacking_queen_id = queen_id
          @board.board[row + (i * new_row)][col + (i * new_col)][:targeted_by] = @piece
        end
        break
      end

      @board.board[row + (i * new_row)][col + (i * new_col)][:piece] = @moving_piece
      @board.board[row + (i * new_row)][col + (i * new_col)][:contents] = ' X '.gray
      @board.board[row + (i * new_row)][col + (i * new_col)][:id] = queen_id
    end
  end

  def move_queen(row, col, queen_id)
    pick_up_queen(queen_id)
    place_queen(row, col, queen_id)
    reset_movements
    reset_targeted_pieces
    pass_turn
  end

  def pick_up_queen(queen_id)
    8.times do |i|
      8.times do |j|
        next unless @board.board[i][j][:piece] == @piece && @board.board[i][j][:id] == queen_id

        remove_movement_squares(i, j)
      end
    end
  end

  def place_queen(row, col, queen_id)
    @board.board[row][col][:piece] = @piece
    @board.board[row][col][:belongs_to] = @player
    @board.board[row][col][:id] = queen_id

    if @player == 'player_one' then
      @board.board[row][col][:contents] = ' ♛ '.cyan
    else
      @board.board[row][col][:contents] = ' ♛ '.magenta
    end
  end

  def capture?(row, col, attacking_queen)
    move_queen(row, col, attacking_queen)
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
