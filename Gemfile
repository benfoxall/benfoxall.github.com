source 'https://rubygems.org'

version = 96

gem 'github-pages', version

# check that we are using the right version
require 'json'
require 'open-uri'

begin
  newest = JSON.parse(open('https://pages.github.com/versions.json').read)['github-pages']
  if version.to_s != newest.to_s
    puts "OUT OF DATE GITHUB PAGES (using: #{version}, newest: #{newest})"
  end
rescue; end
