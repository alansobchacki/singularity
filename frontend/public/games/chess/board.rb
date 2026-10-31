require 'io/console'
require 'colorize'

# Everything board related (building our board, displaying its contents, performing board setup) goes here.
class Board
  attr_accessor :board, :row, :col, :player_turn

  def initialize
    @board = []
    @row = 0
    @col = 0
    @player_turn = 1
    create_pieces
  end

  # First, we create our board: a nested array of 8 arrays, with each array holding a hash value
  # This allows for powerful customization of pieces and easy board coordinates positioning
  def create_board
    8.times do |i|
      nested_row = []
      8.times do |j|
        if i.even?
          nested_row << (j.even? ? add_square('white') : add_square('light_yellow'))
        else
          nested_row << (j.odd? ? add_square('white') : add_square('light_yellow'))
        end
      end
      @board << nested_row
    end
    @board[0][0][:current_square] = true
  end

  def add_square(color)
    {
      'color': color,
      'current_square': false,
      'targeted_by': nil,
      'belongs_to': nil,
      'piece': nil,
      'id': nil,
      'contents': '   '
    }
  end

  # Then, we create the pieces to place in our board
  def create_pieces
    create_white_pieces
    create_black_pieces
  end

  def create_white_pieces
    @white_pawn = Pawn.new(self, 'white_pawn', 'moveable_white_pawn', 'player_one', 'player_two', 'black', 1)
    @white_rook = Rook.new(self, 'white_rook', 'moveable_white_rook', 'player_one', 'player_two', 'black')
    @white_knight = Knight.new(self, 'white_knight', 'moveable_white_knight', 'player_one', 'player_two', 'black')
    @white_king = King.new(self, 'white_king', 'moveable_white_king', 'player_one', 'player_two', 'black')
    @white_bishop = Bishop.new(self, 'white_bishop', 'moveable_white_bishop', 'player_one', 'player_two', 'black')
    @white_queen = Queen.new(self, 'white_queen', 'moveable_white_queen', 'player_one', 'player_two', 'black')
  end

  def create_black_pieces
    @black_pawn = Pawn.new(self, 'black_pawn', 'moveable_black_pawn', 'player_two', 'player_one', 'white', -1)
    @black_rook = Rook.new(self, 'black_rook', 'moveable_black_rook', 'player_two', 'player_one', 'white')
    @black_knight = Knight.new(self, 'black_knight', 'moveable_black_knight', 'player_two', 'player_one', 'white')
    @black_king = King.new(self, 'black_king', 'moveable_black_king', 'player_two', 'player_one', 'white')
    @black_bishop = Bishop.new(self, 'black_bishop', 'moveable_black_bishop', 'player_two', 'player_one', 'white')
    @black_queen = Queen.new(self, 'black_queen', 'moveable_black_queen', 'player_two', 'player_one', 'white')
  end

  # After that, we place our chess pieces on the board
  def setup_pieces
    place_pawns
    place_rooks
    place_knights
    place_bishops
    place_queens
    place_kings
  end

  def place_pieces(row, col, contents, belongs_to, piece, id)
    @board[row][col][:contents] = contents
    @board[row][col][:belongs_to] = belongs_to
    @board[row][col][:piece] = piece
    @board[row][col][:id] = id
  end

  def place_pawns
    8.times do |i|
      place_pieces(1, i, ' ♟ '.cyan, 'player_one', 'white_pawn', i)
      place_pieces(6, i, ' ♟ '.magenta, 'player_two', 'black_pawn', i)
    end
  end

  def place_rooks
    place_pieces(0, 0, ' ♜ '.cyan, 'player_one', 'white_rook', 1)
    place_pieces(0, 7, ' ♜ '.cyan, 'player_one', 'white_rook', 2)
    place_pieces(7, 0, ' ♜ '.magenta, 'player_two', 'black_rook', 1)
    place_pieces(7, 7, ' ♜ '.magenta, 'player_two', 'black_rook', 2)
  end

  def place_knights
    place_pieces(0, 1, ' ♞ '.cyan, 'player_one', 'white_knight', 1)
    place_pieces(0, 6, ' ♞ '.cyan, 'player_one', 'white_knight', 2)
    place_pieces(7, 1, ' ♞ '.magenta, 'player_two', 'black_knight', 1)
    place_pieces(7, 6, ' ♞ '.magenta, 'player_two', 'black_knight', 2)
  end

  def place_bishops
    place_pieces(0, 2, ' ♝ '.cyan, 'player_one', 'white_bishop', 1)
    place_pieces(0, 5, ' ♝ '.cyan, 'player_one', 'white_bishop', 2)
    place_pieces(7, 2, ' ♝ '.magenta, 'player_two', 'black_bishop', 1)
    place_pieces(7, 5, ' ♝ '.magenta, 'player_two', 'black_bishop', 2)
  end

  def place_queens
    place_pieces(0, 3, ' ♛ '.cyan, 'player_one', 'white_queen', 1)
    place_pieces(7, 3, ' ♛ '.magenta, 'player_two', 'black_queen', 1)
  end

  def place_kings
    place_pieces(0, 4, ' ♚ '.cyan, 'player_one', 'white_king', 1)
    place_pieces(7, 4, ' ♚ '.magenta, 'player_two', 'black_king', 1)
  end

  # Now that the board is set, we can display it on our terminal
  def update_board
    8.times do |i|
      print '  '
      8.times do |j|
        print_squares(i, j)
      end
      puts "\e[0m" # returns our default background color to black
    end
  end

  def print_squares(row, col)
    square = @board[row][col]

    if square[:current_square]
      print square[:contents].on_light_cyan
    elsif !square[:targeted_by].nil?
      print square[:contents].on_green
    elsif square[:color] == 'white'
      print square[:contents].on_white
    elsif square[:color] == 'light_yellow'
      print square[:contents].on_light_yellow
    end
  end

  # Now we can interact with the board and its pieces
  # We pick which board square we want to play with
  def move_square_selector
    movement = $stdin.getch.upcase
    case movement
    when 'W' then move(-1, 0)  # up
    when 'A' then move(0, -1)  # left
    when 'S' then move(1, 0)   # down
    when 'D' then move(0, 1)   # right
    when "\r" then select_square # enter
    end
  end

  def move(row_change, col_change)
    puts "\e[H\e[2J" # resets our terminal input
    new_row = @row + row_change
    new_col = @col + col_change

    return unless new_row.between?(0, 7) && new_col.between?(0, 7)

    @board[new_row][new_col][:current_square] = true
    @board[@row][@col][:current_square] = false
    @row = new_row
    @col = new_col
  end

  def select_square
    puts "\e[H\e[2J" # Resets our terminal input
    player_one_plays? if @player_turn == 1
    player_two_plays? if @player_turn == 2
  end

  def player_one_plays?
    @white_pawn.move?(@row, @col)
    @white_rook.move?(@row, @col)
    @white_knight.move?(@row, @col)
    @white_king.move?(@row, @col)
    @white_bishop.move?(@row, @col)
    @white_queen.move?(@row, @col)
  end

  # A very basic opponent: captures the most valuable piece it can, otherwise makes a random move.
  PIECE_VALUES = { 'pawn' => 1, 'knight' => 3, 'bishop' => 3, 'rook' => 5, 'queen' => 9, 'king' => 100 }.freeze

  def computer_plays
    sleep(1)
    cursor = [@row, @col]
    move = computer_moves.max_by { |_from, _to, value| value + rand }

    if move
      clear_markers
      select_square_at(*move[0])
      select_square_at(*move[1])
    else
      @player_turn = 1
    end

    clear_markers
    @row, @col = cursor
    puts "\e[H\e[2J"
  end

  def computer_moves
    moves = []

    8.times do |i|
      8.times do |j|
        next unless @board[i][j][:belongs_to] == 'player_two'

        clear_markers
        select_square_at(i, j)
        moves.concat(destinations_for(i, j))
      end
    end

    moves
  end

  def destinations_for(row, col)
    piece = @board[row][col][:piece]
    destinations = []

    8.times do |i|
      8.times do |j|
        square = @board[i][j]
        if square[:targeted_by] == piece
          destinations << [[row, col], [i, j], PIECE_VALUES[square[:piece].split('_').last]]
        elsif square[:piece] == "moveable_#{piece}"
          destinations << [[row, col], [i, j], 0]
        end
      end
    end

    destinations
  end

  def select_square_at(row, col)
    @row = row
    @col = col
    player_two_plays?
  end

  def clear_markers
    @board.each do |board_row|
      board_row.each do |square|
        square[:targeted_by] = nil
        next unless square[:piece]&.include?('moveable')

        square.merge!(piece: nil, belongs_to: nil, id: nil, contents: '   ')
      end
    end
  end

  def player_two_plays?
    @black_pawn.move?(@row, @col)
    @black_rook.move?(@row, @col)
    @black_knight.move?(@row, @col)
    @black_king.move?(@row, @col)
    @black_bishop.move?(@row, @col)
    @black_queen.move?(@row, @col)
  end
end
