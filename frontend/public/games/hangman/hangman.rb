require 'json'

# Everything related to serialization goes here
module SaveFilesSystem
  def save_game
    @game_data = { 'random_word' => @random_word, 'hints' => @hints, 'guesses' => @guesses,
                   'failed_tries' => @failed_tries, 'game_over' => @game_over, 'hangman_rope' => @hangman_rope,
                   'hangman_head' => @hangman_head, 'hangman_upper_body' => @hangman_upper_body,
                   'hangman_lower_body' => @hangman_lower_body }
    @saved_game_data = JSON.generate(@game_data)
    File.open('save_game.json', 'w') { |file| file.write(@saved_game_data) }
    puts '  Please wait... saving the game...'
    sleep(3)
    puts '  Game saved!'
  end

  def load_game
    @saved_game_data = File.read('save_game.json')
    @loaded_game_data = JSON.parse(@saved_game_data)

    @random_word = @loaded_game_data['random_word']
    @hints = @loaded_game_data['hints']
    @guesses = @loaded_game_data['guesses']
    @failed_tries = @loaded_game_data['failed_tries']
    @game_over = @loaded_game_data['game_over']
    @hangman_rope = @loaded_game_data['hangman_rope']
    @hangman_head = @loaded_game_data['hangman_head']
    @hangman_upper_body = @loaded_game_data['hangman_upper_body']
    @hangman_lower_body = @loaded_game_data['hangman_lower_body']
  end
end

# Handles the basic setup rules of our game
class GameSetup
  attr_accessor :random_word, :hints, :game_loaded

  include SaveFilesSystem

  def initialize
    @hints = []
    @random_word = ''
    @game_loaded = false
  end

  def pick_game_state
    puts "  Let's play a game of Hangman! Send '1' for a new game, or '2' to load an existing game."
    @game_state_choice = gets.chomp

    case @game_state_choice
    when '1' then pick_game_difficulty
    when '2' then any_saved_games?
    else
      puts '  Please input a valid option.'
      pick_game_state
    end
  end

  def pick_game_difficulty
    puts "  Great! Now, send '1' for an easy ride, '2' for a normal game, or '3' for a challenge!"
    @difficulty_choice = gets.chomp

    case @difficulty_choice
    when '1' then generate_random_word(4, 6)
    when '2' then generate_random_word(7, 10)
    when '3' then generate_random_word(11, 15)
    else
      puts '  Please input a valid option.'
      pick_game_difficulty
    end
    generate_hints
  end

  def any_saved_games?
    if File.exist?('save_game.json')
      @game_loaded = true
      puts '  Please wait... loading the game...'
      sleep(3)
      puts '  Game loaded!'
    else
      puts "  You don't have any saved games."
      pick_game_state
    end
  end

  def generate_random_word(min_length, max_length)
    @random_word = File.readlines('10000_words.txt').sample.chomp until @random_word.length.between?(min_length, max_length)
  end

  def generate_hints
    @hints.push('_') until @hints.length == @random_word.length
  end
end

# Everything that happens after a game is setup goes here
class Game
  include SaveFilesSystem

  def initialize(random_word, hints, game_loaded)
    @random_word = random_word
    @hints = hints
    @game_loaded = game_loaded
    @guesses = []
    @failed_tries = 0
    @game_over = false
    @hangman_rope = ' '
    @hangman_head = ' '
    @hangman_upper_body = '   '
    @hangman_lower_body = '   '
  end

  def game_running
    game_loaded?
    @guess = gets.chomp.downcase
    validate_player_input
    guessed_letter?
    game_over?
  end

  # All methods below are used to make our method 'game_running' work
  def game_loaded?
    load_game unless @game_loaded == false
    @game_loaded = false
    update_display
  end

  def validate_player_input
    save_game if @guess == 'save'
    game_running unless @guess.length == 1 && /^[a-z]$/.match?(@guess)
    @guesses.push(@guess) unless @guesses.include?(@guess)
  end

  def guessed_letter?
    @random_word.each_char.with_index do |char, index|
      update_hints(index, @guess) unless @guess != char
    end

    update_failed_tries
  end

  def update_hints(index, letter)
    @hints.delete_at(index)
    @hints.insert(index, letter)
  end

  def update_failed_tries
    @failed_tries += 1 unless @random_word.include?(@guess) == true

    case @failed_tries
    when 1 then @hangman_rope = '|'
    when 2 then @hangman_head = 'O'
    when 3 then @hangman_upper_body = '/  '
    when 4 then @hangman_upper_body = '/| '
    when 5 then @hangman_upper_body = '/|\\'
    when 6 then @hangman_lower_body = '/  '
    when 7
      @hangman_lower_body = '/ \\'
      game_over
    end
  end

  def game_over?
    game_over if @hints.join == @random_word
    game_running unless @game_over == true
  end

  def game_over
    @game_over = true
    update_display
    if @failed_tries == 7
      puts "You just lost the game. The word was '#{@random_word}'. Try again? Y/N"
    else
      puts 'You won the game! Play again? Y/N'
    end
    replay?
  end

  def replay?
    @replay = gets.chomp.upcase
    if @replay == 'Y'
      new_match
    elsif @replay == 'N'
      puts '  Thank you for playing "Hangman"!'
    else
      puts '   Invalid input. Please choose between "Y" or "N".'
      replay?
    end
  end

  def hangman_drawing
    puts '       ______'
    puts "       #{@hangman_rope}    |"
    puts "       #{@hangman_head}    |"
    puts "      #{@hangman_upper_body}   |"
    puts "      #{@hangman_lower_body}   |"
    puts '            |'
  end

  def update_display
    hangman_drawing
    puts ''
    puts @hints.join(' ')
    puts ''
    puts "  You've already tried these letters: #{@guesses}" unless @game_over == true || @guesses.empty?
    puts '  Remember: You can save your game by sending "save" instead of guessing a letter!' unless @game_over == true
    puts '  Guess a letter!' unless @game_over == true
  end
end

def new_match
  game_settings = GameSetup.new
  game_settings.pick_game_state

  newgame = Game.new(game_settings.random_word, game_settings.hints, game_settings.game_loaded)
  newgame.game_running
end

new_match
