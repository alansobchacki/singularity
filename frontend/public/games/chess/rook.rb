require 'colorize'

class Rook
  def initialize(board, piece, moving_piece, player, enemy_player, enemy_player_color)
    @board = board
    @piece = piece
    @moving_piece = moving_piece
    @player = player
    @enemy_player = enemy_player
    @enemy_player_color = enemy_player_color
    @attacking_rook_id = nil
  end

  def move?(row, col)
    return if @board.board[row][col][:targeted_by]&.include?(@enemy_player_color)

    square = @board.board[row][col]
    rook_id = @board.board[row][col][:id]

    if square[:targeted_by] == @piece
      capture?(row, col, @attacking_rook_id)
    elsif square[:piece] == @piece
      reset_movements
      show_viable_movements(row, col, rook_id)
    elsif square[:piece] == @moving_piece
      move_rook(row, col, rook_id)
    end
  end

  def show_viable_movements(row, col, rook_id)
    rook_movement(row, 0, col, 1, rook_id) # right horizontal
    rook_movement(row, 0, col, -1, rook_id) # left horizontal
    rook_movement(row, 1, col, 0, rook_id) # lower vertical
    rook_movement(row, -1, col, 0, rook_id) # upper vertical
  end

  def rook_movement(row, new_row, col, new_col, rook_id)
    8.times do |i|
      return unless (row + (i * new_row)) < 8 && (row + (i * new_row)) >= 0
      return unless (col + (i * new_col)) < 8 && (col + (i * new_col)) >= 0
      next if col == (col + (i * new_col)) && row == (row + (i * new_row))

      if @board.board[row + (i * new_row)][col + (i * new_col)][:piece].is_a?(String)
        if @board.board[row + (i * new_row)][col + (i * new_col)][:belongs_to] == @enemy_player
          @attacking_rook_id = rook_id
          @board.board[row + (i * new_row)][col + (i * new_col)][:targeted_by] = @piece
        end
        break
      end

      @board.board[row + (i * new_row)][col + (i * new_col)][:piece] = @moving_piece
      @board.board[row + (i * new_row)][col + (i * new_col)][:contents] = ' X '.gray
      @board.board[row + (i * new_row)][col + (i * new_col)][:id] = rook_id
    end
  end

  def move_rook(row, col, rook_id)
    pick_up_rook(rook_id)
    place_rook(row, col, rook_id)
    reset_movements
    reset_targeted_pieces
    pass_turn
  end

  def pick_up_rook(rook_id)
    8.times do |i|
      8.times do |j|
        next unless @board.board[i][j][:piece] == @piece && @board.board[i][j][:id] == rook_id

        remove_movement_squares(i, j)
      end
    end
  end

  def place_rook(row, col, rook_id)
    @board.board[row][col][:piece] = @piece
    @board.board[row][col][:belongs_to] = @player
    @board.board[row][col][:id] = rook_id

    if @player == 'player_one' then
      @board.board[row][col][:contents] = ' ♜ '.cyan
    else
      @board.board[row][col][:contents] = ' ♜ '.magenta
    end
  end

  def capture?(row, col, attacking_rook)
    move_rook(row, col, attacking_rook)
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
