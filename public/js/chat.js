let socket = io.connect(`http://localhost:5000`);

(() => {
    $('#message').on("keypress", function () {
        let user = $('#username-h4').text();
        socket.emit('typing', user);
    });

    $('#send-btn').on("click", function () {
        sendMessage();
    });
    $('#message').on("keydown", function(event){
       if (event.which == 13){
           sendMessage();
       }
    });
    $('#likeMessage').on("click", function () {
        let oldValue = $('#message').val();
    $('#message').val(oldValue + "👍");
    })
})();
function sendMessage(){
    let message = $('#message').val();
    if (message.trim() != ""){
        let sender = $('#usernameInput').val();
        let data = {message, sender};
        socket.emit('message', data);
        let messageDom = $('<p class="d-block">');
        let messageDiv = $(`<h5 class="px-3 mr-auto mt-1 text-white bg-secondary rounded p-1 mr-auto"><span class="text-black-50">Me:</span> ${message}</h5>`);
        $(messageDom).append(messageDiv);
        $('#messages').append(messageDom);
        $('#message').val("");
    }
}
socket.on('message', function (data) {
    let message = $('<p class="d-block">');
    $(message).append(`<h5 class="px-3 ml-auto mt-1 text-white bg-blue rounded p-1"><span class="text-black-50">${data.sender}:</span> ${data.message}</h5>`);
    $('#messages').append(message);
});