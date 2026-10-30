# Bridges terminal I/O to the browser, since WebAssembly can't block while waiting for input.
require "js"

$stdout.sync = true

module Kernel
  def gets(*)
    JS.global[:rubyTerminal].call(:readLine).await.to_s
  end

  def sleep(seconds = 0)
    JS.global[:rubyTerminal].call(:sleep, seconds.to_f).await
    seconds.to_i
  end
end

class IO
  def getch(*)
    JS.global[:rubyTerminal].call(:readKey).await.to_s
  end
end

# Minimal stand-in for the colorize gem, covering the colors the games use.
# Chess is the only game using cyan, magenta, gray and the backgrounds, so those are softened for its board.
class String
  {
    red: "31",
    cyan: "38;2;125;211;252",
    magenta: "38;2;240;171;252",
    gray: "38;2;148;163;184",
    on_white: "48;2;71;85;105",
    on_light_yellow: "48;2;51;65;85",
    on_light_cyan: "48;2;3;105;161",
    on_green: "48;2;22;101;52",
  }.each do |name, code|
    define_method(name) { "\e[#{code}m#{self}\e[0m" }
  end
end

$LOADED_FEATURES << "colorize.rb" << "io/console.rb"
