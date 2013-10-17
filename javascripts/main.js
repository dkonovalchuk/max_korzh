VK.init(function() {
  VK.api("wall.post", { message: "Я выбираю жить в кайф!", attachments: "photo-14690286_314770498,audio-14690286_235225896" }, function(data) {
  });
}, function() {
}, '5.2');

// $(function() {
//   var owner_id = -14690286,
//       album_id = 102421662;

//   var audio = VK.api("audio.get", { owner_id: owner_id }, function(data) {
//     var item = getItem(data.response.items);
//     return {
//       link: link(owner_id, item.id, "audio"),
//       lyrics_id: item.lyrics_id
//     };
//   });

//   var message = VK.api("audio.getLyrics", { lyrics_id: audio.lyrics_id }, function(data) {
//     var text = data.response.text;
//   });

//   var photo = VK.api("photos.get", { owner_id: owner_id, album_id: album_id }, function(data) {
//     item = getItem(data.response.items);
//     return { link: link(owner_id, item.id, "photo") }
//   });

//   $.when(audio, message, photo).then(function(){
//     VK.api("wall.post", { owner_id: -14690286, message: message, attachments: audio.link, photo.link }, function(data) {
//     });
//   });

//   function getItem(items) {
//     return items[Math.floor(Math.random()*items.length)];
//   }

//   function link(owner_id, item_id, type) {
//     return type + owner_id + "_" + item_id,
//   }
// });