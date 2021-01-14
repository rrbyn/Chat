const socket = io()

const messageContainer = document.querySelector('#message-container')
const messageInput = document.querySelector('#message-box')
const boardsContainer = document.getElementById('boardsContainer')


messageInput.addEventListener('keyup', e => {
    if (e.key == 'Enter') {
        socket.emit('chatMessage', messageInput.value)
        messageInput.value = ' '
    }
})

socket.on('chatMessage', res => {
    const messageLi = document.createElement('li')
    messageLi.innerText = res.userid + ': ' + res.message
    messageContainer.append(messageLi)
})
socket.on('initGameBoard', res => {
    console.log(res)

    let humanBoardDiv = document.createElement('div')
    humanBoardDiv.classList.add('board')
    humanBoardDiv.setAttribute('data-board-name', 'human');
    humanBoardDiv.setAttribute("id", "human-board");


    let oneBoard = document.createElement('div')
    oneBoard.classList.add('oneBoard')
    oneBoard.setAttribute("userId", res.userid)



    nameDiv = document.createElement('div')
    nameDiv.innerText = res.userid
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let cellDiv = document.createElement('div')
            cellDiv.classList = 'cell'
            cellDiv.dataset.row = i
            cellDiv.dataset.col = j

            if (res.humanGameBoard[i][j].charAt(0) == 's') {
                cellDiv.classList += ' ship'
                // cellDiv.innerHTML = gameBoard[boardName][i][j]
            }

            humanBoardDiv.append(cellDiv)
            oneBoard.append(humanBoardDiv)
            oneBoard.append(nameDiv)
            boardsContainer.append(oneBoard)

        }
    }
})

socket.on('removeBoard', res => {
    console.log(res.userid)
    userBoard = document.querySelector("[userid=" + CSS.escape(res.userid) + "]");
    userBoard.remove()
})




messageInput.focus
messageContainer.scrollTop = messageContainer.scrollHeight
