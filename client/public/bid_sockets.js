var socket = io.connect();

// socket.on('user_created', function(data){
//   $('#user').html(data.username)
// })
(function(){
socket.emit('page_refresh',{})
})()
// var currentBid = $('.bidInput').value();
// console.log(currentBid);

$('.placeBid').click(function(){

  console.log(".placeBid pushed");
  var pack_id = "package1";
  var bid = document.getElementById("bid");

  socket.emit('msg_sent',{
    bid: bid,
    packId: pack_id,
    userId: userID,
    userName: userName
  })

})


socket.on('update_chat', function(data){
  // if(pack_id == data.packId){
  //   /// update current bid
  // }
  $('.bids').html(data)
})
