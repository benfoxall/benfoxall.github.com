source 'https://rubygems.org'

version = 43

gem 'github-pages', version

# check that we are using the right version
require 'json'
require 'open-uri'

begin
  newest = JSON.parse(open('https://pages.github.com/versions.json').read)['github-pages']
  if to_s(version) != to_s(newest)
    puts "OUT OF DATE GITHUB PAGES (using: #{version}, newest: #{newest})"
  end
rescue; end

