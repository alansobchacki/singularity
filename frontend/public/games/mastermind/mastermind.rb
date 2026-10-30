# frozen_string_literal: true

require 'colorize'

# This module allow us to restart or close the game after a match is completed
module SettingsHelper
  def play_again?
    puts '  Would you like to play again? Type "1" for Yes and "2" for No.'
    rematch = gets.chomp.to_s

    if rematch == '1' then game_started
    elsif rematch == '2' then puts "   Thank you for playing MASTERMIND, hope you've had fun!"
    else puts 'Please pick a valid option' && play_again?
    end
  end
end

# This class section is used to handle most basic settings of our game
class GameSettings
  attr_reader :choice

  def greetings
    puts ''
    puts '### Welcome to my good-enoughly(?) coded game of "Mastermind"! ###'
    puts '  Would you like to be the CODEMAKER, or the CODEBREAKER?'
    puts '  Send "1" for CODEMAKER, or "2" for CODEBREAKER.'
    puts '  Also, if you want to know the rules, send "3".'
    game_choice
  end

  def game_choice
    @choice = gets.chomp

    case
    when @choice == '1' then puts "  You're the CODEMAKER! Build a four digit code with values ranging from 1 to 6!"
    when @choice == '2' then puts "  You're the CODEBREAKER! Good luck! You have 10 tries left."
    when @choice == '3' then tutorial
    else puts '  Please pick a valid option.' && game_choice
    end
  end

  def tutorial
    puts ''
    puts '  Mastermind is a game where the CODEMAKER builds a four-digit code, and the CODEBREAKER '
    puts 'must guess that code. The CODEMAKER will pick digits ranging from 1 to 6 to build their'
    puts "code. For example, '2454' is a valid code, while '9495' isn't."
    puts ''
    puts '  The CODEBREAKER has 10 turns to guess the code. Every time they take a guess, little   '
    puts 'dots will show up telling you how good your guess was.'
    puts ''
    puts '  "x" means you guessed a right digit, but it was in the wrong spot.'
    puts '  "x"'.red << ' means you guessed a right digit in the right spot.'
    puts '  If no dots show up, your guess was completely wrong.'
    puts ''
    puts '  If the CODEBREAKER manages to crack the code, the CODEBREAKER wins. Otherwise, the     '
    puts 'CODEMAKER wins. Now, Send "1" for CODEMAKER, or "2" for CODEBREAKER.'
    puts ''

    game_choice
  end

  def computer_is_codemaster
    codemaster = Computer.new('')
    codemaster.build_mastermind_code
    codebreaker = Player.new(codemaster.computer_mastermind_code)
    codebreaker.guessing
    codebreaker.code_broken?
  end

  def player_is_codemaster
    codemaster = Player.new('')
    codemaster.build_mastermind_code
    codebreaker = Computer.new(codemaster.player_mastermind_code)
    codebreaker.guessing
    codebreaker.code_broken?
  end
end

# This class section handles all moves made by the computer
class Computer
  attr_reader :computer_mastermind_code

  include SettingsHelper

  def initialize(mastermind_code)
    @player_mastermind_code = mastermind_code
    @guess = []
  end

  # This method is only used if the computer is the codemaker (building the code for the player to guess)

  def build_mastermind_code
    @computer_mastermind_code = []
    @computer_mastermind_code.push(rand(1..6).to_s) until @computer_mastermind_code.length == 4

    puts '  *evil computer noises*'
    puts ''
  end

  # The methods below are only used if the computer is the codebreaker (guessing the player's code)

  def guessing
    4.times.each do |i|
      if @guess[i].nil? then @guess.push(rand(1..6).to_s)
      elsif @guess[i] == @player_mastermind_code[i]
        next
      elsif @guess[i] != @player_mastermind_code[i]
        @guess.delete_at(i)
        @guess.insert(i, rand(1..6).to_s)
      end
    end
  end

  def code_broken?
    (1..11).each do |i|
      if @guess == @player_mastermind_code
        puts "  I beat you, human! Your code was #{@player_mastermind_code}!"
        play_again?
        break
      elsif i <= 10 && @guess != @player_mastermind_code
        puts "  Bah! #{@guess} wasn't right?? I will get you, eventually... beep."
        sleep 2 and guessing
      elsif i > 10 && @guess != @player_mastermind_code
        puts '  I am... defeated....boop..'
        play_again?
      end
    end
  end
end

# This class section handles all moves made by the player
class Player
  attr_reader :player_mastermind_code

  include SettingsHelper

  def initialize(mastermind_code)
    @computer_mastermind_code = mastermind_code
  end

  # This method is only used if the player is the codemaker (building the code for the computer to guess)

  def build_mastermind_code
    @player_mastermind_code = gets.chomp.to_s.split('')
    valid_digits = %w[1 2 3 4 5 6]

    @player_mastermind_code.each do |element|
      next unless valid_digits.include?(element) == false || @player_mastermind_code.length != 4

      puts '  Invalid code. Please enter a four digit code with values ranging from 1 to 6.'
      build_mastermind_code
      break
    end
  end

  # The methods below are only used if the player is the codebreaker (guessing the computer's code)

  def guessing
    @guess = gets.chomp.to_s.split('')
    valid_digits = %w[1 2 3 4 5 6]

    @guess.each do |element|
      next unless valid_digits.include?(element) == false || @guess.length != 4

      puts '  Invalid code. Please enter a four digit code with values ranging from 1 to 6.'
      guessing
      break
    end
  end

  def code_broken?
    (1..11).each do |i|
      if @guess == @computer_mastermind_code
        puts '  You cracked the code! Great job!'
        play_again?
        break
      elsif i < 10 && @guess != @computer_mastermind_code
        puts "  Not quite. Try again! You have #{10 - i} tries left!"
        getting_tips(@guess, @computer_mastermind_code)
      elsif i == 10 && @guess != @computer_mastermind_code
        puts '  Not quite. Try again! This is your last chance!'
        getting_tips(@guess, @computer_mastermind_code)
      elsif i > 10 && @guess != @computer_mastermind_code
        puts "  You didn't manage to crack the code. It was #{@computer_mastermind_code}. Good luck next time!"
        play_again?
      end
    end
  end

  def getting_tips(guess, code)
    tempguess = guess.dup
    tempcode = code.dup

    (tempguess.length - 1).downto(0) do |i|
      next unless tempguess[i] == tempcode[i]

      tempguess.delete_at(i)
      tempcode.delete_at(i)
      puts 'x'.red
    end

    (tempguess.length - 1).downto(0) do |i|
      next unless tempcode.include?(tempguess[i])

      tempguess.delete_at(i)
      puts 'x'
    end

    guessing
  end
end

def game_started
  newgame = GameSettings.new
  newgame.greetings

  if newgame.choice == '1'
    newgame.player_is_codemaster
  elsif newgame.choice == '2'
    newgame.computer_is_codemaster
  end
end

game_started
