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
class String
  {
    red: 31, magenta: 35, cyan: 36, gray: 90,
    on_green: 42, on_white: 47, on_light_yellow: 103, on_light_cyan: 106,
  }.each do |name, code|
    define_method(name) { "\e[#{code}m#{self}\e[0m" }
  end
end

$LOADED_FEATURES << "colorize.rb" << "io/console.rb"
