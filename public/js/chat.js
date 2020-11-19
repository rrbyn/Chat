const socket = io()

const messageContainer = document.querySelector('#message-container')
const messageInput = document.querySelector('#message-box')

messageInput.addEventListener('keyup', e => {
    if ( e.key == 'Enter' ) {
        socket.emit('chatMessage', messageInput.value)
        messageInput.value = ' '
    }
})

socket.on('chatMessage', res => {
    const messageLi = document.createElement('li')
    messageLi.innerText = res.userid + ': ' + res.message
    messageContainer.append(messageLi)
})

messageInput.focus
