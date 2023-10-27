"use strict"

const player1Name = document.getElementById("player1-name")
const player2Name = document.getElementById("player2-name")
const player1Score = document.getElementById("player1-score")
const player2Score = document.getElementById("player2-score")

const player1NameBtn = document.getElementById("player1-name-btn")
const player2NameBtn = document.getElementById("player2-name-btn")
const player2CompBtn = document.getElementById("player2-comp-btn")

const modalMsg = document.getElementById("modal-msg")
const newNameModal = document.getElementById("new-name-modal")
const inputNewName = document.getElementById("input-new-name")
const imgCont = document.getElementById("img-cont")
const chosenImgCont = document.getElementById("chosen-img-cont")
const modalMsgText = document.getElementById("modal-msg-text")
const modalMsgBtn = document.getElementById("modal-msg-btn")

const fields = document.getElementsByClassName("field")

const newGameBtn = document.getElementById("new-game-btn")
const resetAllBtn = document.getElementById("reset-all-btn")

const symbolArray1 = [
    "images/group1/cactus.png",
    "images/group1/deathpool.png", 
    "images/group1/emoji1.png", 
    "images/group1/heart.png", 
    "images/group1/knight.png", 
    "images/group1/whale.png"
]
const symbolArray2 = [
    "images/group2/broken-heart.png", 
    "images/group2/emoji2.png", 
    "images/group2/goku.png", 
    "images/group2/penguin.png", 
    "images/group2/sandwich.png", 
    "images/group2/soldier.png"
]

let isCurrentPlayer1 = true
let isWin = false
let isTie = false
let playerName
let isPlayer2Comp = false


function createPlayer (name, symbol, symbolArray){
    let score = 0;
    const getScore = () => score
    const increaseScore = () => score++
    const resetScore = () => score = 0

    // checking which player - num/playerName to open window/modal to change his name/symbol
    // num/playerName is actually for modal button (modalMsgBtn)
    function getNewNameAndSymbol (num){
        modalMsg.style.display = "block"
        modalMsgText.style.display = "none"
        newNameModal.style.display = "block"
        playerName = num
        renderImgArr(symbolArray, this)
    }

    // rendering optional symbols from an array and current player symbol 
    function renderImgArr(arr, player){
        imgCont.textContent = ""
        const chosenImg = document.createElement("img")
        chosenImg.src = player.symbol
        chosenImg.classList.add("chosen-img")
        chosenImgCont.textContent= ""
        chosenImgCont.appendChild(chosenImg)

        arr.map(itemSrc => {
            const img = document.createElement("img")
            img.src = itemSrc
            img.alt = `image of small pixelated ${itemSrc.slice(14, -4)}`
            img.classList.add("choose-img")
    
            img.addEventListener("click", ()=>{
                    chosenImg.src = img.src
                    chosenImg.alt = img.alt
                    chosenImgCont.appendChild(chosenImg)
                    player.symbol = chosenImg.src  
            })
    
            imgCont.append(img)
        })
    }

    return {name, symbol, getScore, increaseScore, resetScore, getNewNameAndSymbol}
}


const player1 = createPlayer("Player1", "images/group1/emoji1.png", symbolArray1)
const player2 = createPlayer("Player2", "images/group2/emoji2.png", symbolArray2)


const gameBoard = (function(){
    // board array (3x3)
    const board = [["", "", ""], ["", "", ""],  ["", "", ""]]

    // checking who is current player/symbol
    const getCurrentSymbol = () => {
        let currentPlayer
        if(isCurrentPlayer1){
            isCurrentPlayer1 = false
            return currentPlayer = player1.symbol
        } 
        isCurrentPlayer1 = true
        return currentPlayer = player2.symbol
    }

    // check if the game is tie: that all fields are full and there is no winner
    // and rendering a message
    const checkIfTie = () => {
        if(compGame.getAvail(gameBoard.board).length === 0 && !isWin){
            modalMsg.style.display = "block"
            modalMsgText.style.display = "block"
            newNameModal.style.display = "none"
            modalMsgText.textContent = `It's a tie!`
            isTie = true
        }
    }

    // check win combinations: diagonally, horizontally and vertically
    const checkWin = (function(){
        const checkAny = (symbol) => {
            if (checkDiagonaly1(symbol) || checkDiagonaly2(symbol) || checkHorizontally(symbol) || checkVertically(symbol)){
                return true
            } 
        }
        // checking diagonally \    
        const checkDiagonaly1 = (symbol) => {
            if(gameBoard.board[1][1] === symbol){
                if(gameBoard.board[0][0] === gameBoard.board[1][1] && gameBoard.board[1][1] === gameBoard.board[2][2]){
                    return true
                } 
            } 
        }
        // checking diagonally /   
        const checkDiagonaly2 = (symbol) => {
            if(gameBoard.board[1][1] === symbol){
                if(gameBoard.board[0][2] === gameBoard.board[1][1] && gameBoard.board[1][1] === gameBoard.board[2][0]){
                    return true
                }
            } 
        }
        // checking horizontally    
        const checkHorizontally = (symbol) => {
            for (let i = 0; i < gameBoard.board.length; i++){
                if(gameBoard.board[i][0] === symbol){
                    if(gameBoard.board[i][0] === gameBoard.board[i][1] && gameBoard.board[i][1] === gameBoard.board[i][2]){
                        return true
                    } 
                } 
            }
        }
        // checking vertically    
        const checkVertically = (symbol) => {
            for (let i = 0; i < gameBoard.board.length; i++){
                if(gameBoard.board[0][i] === symbol){
                    if(gameBoard.board[0][i] === gameBoard.board[1][i] && gameBoard.board[1][i] === gameBoard.board[2][i]){
                            return true
                    }
                } 
            }
        }
        return {checkAny, checkDiagonaly1, checkDiagonaly2, checkHorizontally, checkVertically}
    })()

    
    // updating player score after win
    // changing win fields background color
    // win message
    function setWinStatus(symbol){
        if (gameBoard.checkWin.checkAny(symbol)) {
            // checking diagonally \
            if(gameBoard.checkWin.checkDiagonaly1(symbol)){
                document.getElementById(`f00`).style.backgroundColor = "#eac913"
                document.getElementById(`f11`).style.backgroundColor = "#eac913"
                document.getElementById(`f22`).style.backgroundColor = "#eac913"
            }
            // checking diagonally /
            if(gameBoard.checkWin.checkDiagonaly2(symbol)){
                document.getElementById(`f02`).style.backgroundColor = "#eac913"
                document.getElementById(`f11`).style.backgroundColor = "#eac913"
                document.getElementById(`f20`).style.backgroundColor = "#eac913"
            }
            // looping throught rows and columns
            for (let i = 0; i < gameBoard.board.length; i++){
                // checking horizontally (rows)   
                if(gameBoard.board[i][0] !== ""){
                    if(gameBoard.board[i][0] === gameBoard.board[i][1] && gameBoard.board[i][1] === gameBoard.board[i][2]){
                        document.getElementById(`f${i}0`).style.backgroundColor = "#eac913"
                        document.getElementById(`f${i}1`).style.backgroundColor = "#eac913"
                        document.getElementById(`f${i}2`).style.backgroundColor = "#eac913"
                    }
                }
                // checking vertically (columns) 
                if(gameBoard.board[0][i] !== ""){
                    if(gameBoard.board[0][i] === gameBoard.board[1][i] && gameBoard.board[1][i] === gameBoard.board[2][i]){
                        document.getElementById(`f0${i}`).style.backgroundColor = "#eac913"
                        document.getElementById(`f1${i}`).style.backgroundColor = "#eac913"
                        document.getElementById(`f2${i}`).style.backgroundColor = "#eac913"
                    }
                }
            }
            const player = isCurrentPlayer1 ? player2 : player1
            const score = isCurrentPlayer1 ? player2Score : player1Score
            isWin = true
            player.increaseScore()
            score.textContent = player.getScore()
            modalMsgText.textContent = `${player.name} won!`
            modalMsg.style.display = "block"
            modalMsgText.style.display = "block"
            newNameModal.style.display = "none"
        }
    }

    // reseting board and all the fields
    const resetGame = () => {
        for (const field of fields) {
            field.style.backgroundColor = "#fffffff0"
            field.textContent = ""
        }
        gameBoard.board = [["", "", ""], ["", "", ""],  ["", "", ""]]
    }

    return {board, getCurrentSymbol, checkIfTie, checkWin, setWinStatus, resetGame}
})()


document.addEventListener("DOMContentLoaded", ()=>{
    // making click on a field and triggering action 
    for (const field of fields) {
        field.addEventListener("click", ()=>{
            if(field.textContent) return
            if(!isWin){
                // row
                const r = Number( field.id.slice(1, 2) )
                // column
                const c = Number( field.id.slice(2, 3) )
                // if the is not empty return nothing
                if(gameBoard.board[r][c] !== "") return
                const currentSymbol = gameBoard.getCurrentSymbol()
                const currentSymbolImg = document.createElement("img")
                currentSymbolImg.src = currentSymbol
                currentSymbolImg.style.width = "50px"
                field.appendChild(currentSymbolImg)
                gameBoard.board[r][c] = currentSymbol
                gameBoard.setWinStatus(currentSymbol)
                gameBoard.checkIfTie()
                compGame.compMove()
            }
        })
    }

    // OK button on the info/message modal
    // OK button on the new name/symbol modal
    modalMsgBtn.addEventListener("click", ()=>{
        modalMsg.style.display = "none"
        modalMsgText.style.display = "none"
        newNameModal.style.display = "none"
    
        if(inputNewName.value){
            const newName = inputNewName.value
            if(playerName === 1){
                player1.name = newName
                player1Name.textContent = newName
            } else {
                player2.name = newName
                player2Name.textContent = newName
            }
        }
        inputNewName.value = ""
    })

    // new game button
    newGameBtn.addEventListener("click", ()=>{
        isWin = false
        isTie = false
        gameBoard.resetGame()
        compGame.compMove()
    })

    // reset button - reseting player score and board (and all the fields)
    resetAllBtn.addEventListener("click", ()=>{
        isWin = false
        isTie = false
        gameBoard.resetGame()
        player1.resetScore()
        player2.resetScore()
        player1Score.textContent = player1.getScore()
        player2Score.textContent = player2.getScore()
    })

    // change player name and symbol buttons
    player1NameBtn.addEventListener("click", ()=>player1.getNewNameAndSymbol(1))
    player2NameBtn.addEventListener("click", ()=>player2.getNewNameAndSymbol(2))

    // toggle player2 computer on and off
    player2CompBtn.addEventListener("click", ()=>{
        isPlayer2Comp = !isPlayer2Comp
        player2CompBtn.classList.toggle("active-btn")
        compGame.compMove()
    })

})


const compGame = (function(){
    // check if computer mode is on player2
    // and playing a move as a comp player2
    function compMove(){
        if(!isCurrentPlayer1 && isPlayer2Comp && !isWin && !isTie){

            const randomPercent = Math.floor((Math.random()*100) + 1)
            // const medium = 65
            const hard = 85
            // const easyMove = compGame.getRandomMove()
            // const mediumMove = randomPercent > medium ? compGame.getRandomMove() : compGame.minimax(gameBoard.board, player2).index
            const hardMove = randomPercent > hard ? compGame.getRandomMove() : compGame.minimax(gameBoard.board, player2).index
            // const notDefeatableMove = compGame.minimax(gameBoard.board, player2).index

            const move = hardMove
            const currentSymbolImg = document.createElement("img")
            currentSymbolImg.src = player2.symbol
            currentSymbolImg.style.width = "50px"
            gameBoard.board[move.r][move.c] = player2.symbol
            document.getElementById(`f${move.r}${move.c}`).appendChild(currentSymbolImg)
            isCurrentPlayer1 = !isCurrentPlayer1
            gameBoard.setWinStatus(player2.symbol)
            gameBoard.checkIfTie()
        } return
    }

    // getting a random available move 
    function getRandomMove(){
        const availArr = compGame.getAvail(gameBoard.board)
        const randomSpot = availArr[Math.floor(Math.random()*availArr.length)]
        return randomSpot
    }

    // getting the best move that is possible
    function minimax(newBoard, player) {

        let array = compGame.getAvail(newBoard)
        if (gameBoard.checkWin.checkAny(player1.symbol)) {
            return { score: -10 }
        } else if (gameBoard.checkWin.checkAny(player2.symbol)) {
            return { score: 10 }
        } else if (array.length === 0) {
            return { score: 0 }
        }
    
        let moves = []
        for (let i = 0; i < array.length; i++) {
            const move = {}
            move.index = array[i]
            newBoard[array[i].r][array[i].c] = player.symbol
        
            if (player === player2) {
                const g = compGame.minimax(newBoard, player1)
                move.score = g.score
            } else {
                const g = compGame.minimax(newBoard, player2)
                move.score = g.score
            }
            newBoard[array[i].r][array[i].c] = ""
            moves.push(move)
        }
    
        let bestMove
        if (player === player2) {
            let bestScore = -10000
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score
                    bestMove = i
                }
            }
        } else {
            let bestScore = 10000
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score
                    bestMove = i
                }
            }
        }
        return moves[bestMove]
    }
    
    //getting all available spots/moves in the array
    function getAvail(board) {
        const availSpotsArray = []
        for (let r = 0; r < board.length; r++){
            for(let c = 0; c < 3; c++){
                if (board[r][c] === "") {
                    const availSpot = {}
                    availSpot.r = r
                    availSpot.c = c
                    availSpotsArray.push(availSpot)
                }
            }
        }
        return availSpotsArray
    }
    
    return {compMove, getRandomMove, minimax, getAvail}
})()

