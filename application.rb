require "sinatra"
require "sinatra/reloader"

set :protection, except: :frame_options

get "/" do
  send_file File.join(settings.public_folder, "index.html")
end