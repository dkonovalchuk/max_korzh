VK.init(function() {
}, function() {
}, '5.2');

$(function() {
    var owner_id = -14690286,
        album_id = 102421662,
        data = {};

    //    
    //  VK API Interaction
    //

    function getFriends() {
        var dfd = $.Deferred();
        VK.api("friends.get", { order: "name", fields: "photo_50" }, function(data) {
            var friends = $.map(data.response.items, function(friend){
                var name = friend.first_name + " " + friend.last_name;
                return {
                    name: name,
                    id: friend.id,
                    image: friend.photo_50,
                    label: name,
                    value: friend.id
                }
            });
            dfd.resolve(friends);
        });  
        return dfd.promise();  
    }        

    function getAudio() {
        var dfd = $.Deferred();
        VK.api("audio.get", { owner_id: owner_id }, function(data) {
            var item = chooseItem(data.response.items);
            data = {
              link: link(owner_id, item.id, "audio"),
              lyrics_id: item.lyrics_id
            };    
            dfd.resolve(data);
        });
        return dfd.promise();
    }

    function getLyrics(audio) {
        var dfd = $.Deferred();
        VK.api("audio.getLyrics", { lyrics_id: audio.lyrics_id }, function(data) {
            var phrases = data.response.text.split("\n");
            var startPoint = Math.floor(Math.random()*phrases.length);
            var message = phrases.slice(startPoint, startPoint + 2).join("\n").replace(/\,$/, "");
            dfd.resolve(message);
        });
        return dfd.promise();
    }

    function getPhoto(){
        var dfd = $.Deferred();
        VK.api("photos.get", { owner_id: owner_id, album_id: album_id }, function(data) {
            item = chooseItem(data.response.items);
            photo = link(owner_id, item.id, "photo")
            dfd.resolve(photo);
        });
        return dfd.promise();
    }

    function wallPost(data){
        var postData = {
            owner_id: data.friend_id,
            message: data.message,
            attachments: data.audio + "," + data.photo
        };
        VK.api("wall.post", postData, function(data) {
            if (data.response) {
                $("#message").fadeIn(1000, function(){ $(this).delay(2000).fadeOut(1000) });
            }
        });
    }

    //
    // Helpers
    //

    function chooseItem(items) {
        return items[Math.floor(Math.random()*items.length)];
    }

    function link(owner_id, item_id, type) {
        return type + owner_id + "_" + item_id;
    }

    function friendBlock(friend) {
        var li = document.createElement("li");
        var image = "<div class=\"avatar\" style=\"background-image: url(" + friend.image + ")\"></div>";
        var name = "<div class=\"name\">" + friend.name + "</div>";
        return $(li).addClass("friend").append("<a href=\"#\" class=\"friend\" data-id=\"" + friend.id + "\">" + image + name + "</a>");
    }

    function renderFriends(friends) {
        var ul = $("#friends").children("ul");
        ul.html("");
        $.each(friends, function(){
            ul.append(friendBlock(this));
        })
    }

    function postToFriendButton(type) {
        var button = $("#post-to-friend");
        if (type == "default") {
            button.children("#text").show().end()
                  .children("#loader").hide().end()
                  .children("#search").hide();
        } else if (type == "loader") {
            button.children("#text").hide().end()
                  .children("#loader").show().end()
                  .children("#search").hide();
        } else if (type == "search") {
            button.children("#text").hide().end()
                  .children("#loader").hide().end()
                  .children("#search").show();
        }
    }

    //
    // Main Actions
    //

    function basicPost() {
        getAudio().done(function(audio){
            data.audio = audio.link;
            getLyrics(audio).done(function(message){
                data.message = message;
                getPhoto().done(function(photo){
                    data.photo = photo;
                    wallPost(data);
                });
            });
        });
    }

    function initSearch(friends) {
        $("#search-field").keyup(function(event) {
            var regexp = new RegExp($(this).val(),"i");            
            var foundedFriends = $.grep(friends, function(friend) {
                if (regexp.test(friend.name)) {
                    return this;
                }
            });
            renderFriends(foundedFriends);
        });
    }    

    // 
    // Main events bindings
    //

    $("#post-to-own").click(function(e){
        e.preventDefault();
        data.friend_id = undefined;
        basicPost();
    });

    $("#post-to-friend").click(function(e){
        e.preventDefault();
        var self = $(this),
            friendsBlock = $("#friends");

        if (friendsBlock.is(":hidden")) {
            postToFriendButton("loader");
            if (friendsBlock.data("fetched") == true) {
                postToFriendButton("search");
                friendsBlock.show();
            } else {
                getFriends().done(function(friends){
                    friendsBlock.show();
                    renderFriends(friends);
                    initSearch(friends);
                    postToFriendButton("search");
                    friendsBlock.data("fetched", true);
                });
            }
        }
    });

    $(document).on("click", "a.friend", function(e){
        e.preventDefault();
        data.friend_id = $(this).data("id");
        $("#friends").hide();
        postToFriendButton("default");
        basicPost();
    });

});