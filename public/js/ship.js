cellDivs.forEach(el => {
    el.addEventListener('click', event => {
        const selectedCell = event.currentTarget
        const selectedRow = selectedCell.dataset.row
        const selectedCol = selectedCell.dataset.col

        socket.emit('shootMessage', selectedCell)

        if (gameBoard['machine'][selectedRow][selectedCol].charAt(0) == 's') {
            selectedCell.classList += ' hit'
            // cellDiv.innerHTML = gameBoard[boardName][i][j]
        } else if (gameBoard['machine'][selectedRow][selectedCol] == '**') {
            selectedCell.classList += ' close'
        } else if (gameBoard['machine'][selectedRow][selectedCol] == '--') {
            selectedCell.classList += ' miss'
        }



    })
})

function initGrid(b) {
    const boardName = b.dataset.boardName
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let cellDiv = document.createElement('div')
            cellDiv.classList = 'cell'
            cellDiv.dataset.row = i
            cellDiv.dataset.col = j

            if (boardName == 'human') {
                if (gameBoard[boardName][i][j].charAt(0) == 's') {
                    cellDiv.classList += ' ship'
                    // cellDiv.innerHTML = gameBoard[boardName][i][j]
                }
            }

            b.append(cellDiv)
        }
    }
}
const cellDivs = document.querySelectorAll('#machine-board .cell')
const humanBoardDiv = document.querySelector('#human-board')
const machineBoardDiv = document.querySelector('#machine-board')





initGrid(humanBoardDiv)
initGrid(machineBoardDiv)
