require 'colorize'

class Knight
  def initialize(board, piece, moving_piece, player, enemy_player, enemy_player_color)
    @board = board
    @piece = piece
    @moving_piece = moving_piece
    @player = player
    @enemy_player = enemy_player
    @enemy_player_color = enemy_player_color
    @attacking_knight_id = nil
  end

  def move?(row, col)
    return if @board.board[row][col][:targeted_by]&.include?(@enemy_player_color)

    square = @board.board[row][col]
    knight_id = @board.board[row][col][:id]

    if square[:targeted_by] == @piece
      capture?(row, col, @attacking_knight_id)
    elsif square[:piece] == @piece
      reset_movements
      show_viable_movements(row, col, knight_id)
    elsif square[:piece] == @moving_piece
      move_knight(row, col, knight_id)
    end
  end

  def show_viable_movements(row, col, knight_id)
    do_the_L?(row, 2, col, 1, knight_id)
    do_the_L?(row, 1, col, 2, knight_id)
    do_the_L?(row, -2, col, -1, knight_id)
    do_the_L?(row, -1, col, -2, knight_id)
    do_the_L?(row, 2, col, -1, knight_id)
    do_the_L?(row, 1, col, -2, knight_id)
    do_the_L?(row, -2, col, 1, knight_id)
    do_the_L?(row, -1, col, 2, knight_id)
  end

  def do_the_L?(row, new_row, col, new_col, knight_id)
    return unless (row + new_row) < 8 && (col + new_col) < 8 && (row + new_row) >= 0 && (col + new_col) >= 0

    if @board.board[row + new_row][col + new_col][:belongs_to] == @enemy_player
      @attacking_knight_id = knight_id
      @board.board[row + new_row][col + new_col][:targeted_by] = @piece
    elsif @board.board[row + new_row][col + new_col][:belongs_to].nil?
      @board.board[row + new_row][col + new_col][:piece] = @moving_piece
      @board.board[row + new_row][col + new_col][:contents] = ' X '.gray
      @board.board[row + new_row][col + new_col][:id] = knight_id
    end
  end

  def move_knight(row, col, knight_id)
    pick_up_knight(knight_id)
    place_knight(row, col, knight_id)
    reset_movements
    reset_targeted_pieces
    pass_turn
  end

  def pick_up_knight(knight_id)
    8.times do |i|
      8.times do |j|
        next unless @board.board[i][j][:piece] == @piece && @board.board[i][j][:id] == knight_id

        remove_movement_squares(i, j)
      end
    end
  end

  def place_knight(row, col, knight_id)
    @board.board[row][col][:piece] = @piece
    @board.board[row][col][:belongs_to] = @player
    @board.board[row][col][:id] = knight_id

    if @player == 'player_one' then
      @board.board[row][col][:contents] = ' ♞ '.cyan
    else
      @board.board[row][col][:contents] = ' ♞ '.magenta
    end
  end

  def capture?(row, col, attacking_knight)
    move_knight(row, col, attacking_knight)
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
