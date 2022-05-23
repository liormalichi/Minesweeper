//--------var---------
let boardSize
let boardArr
let difficulty = "Easy"
let mokeshMagicNum

//--------------------

//----Functions-------

// starts the game and calls a function that generates new table
const start = () => {
  val = document.getElementById("board-size").value
  if (typeof val !== "string") {
    alert("Enter positive integer")
    return
  }

  const num = Number(val)

  if (Number.isInteger(num) && num > 3 && num <= 25) {
    boardSize = num
    //document.location.href = "gamePage.html"
    boardArr = new Array(boardSize)
    generateBoard(boardSize)
    document.getElementById("inputs").style.display = "none"
    return true
  }

  alert("Enter positive integer between 4 and 25")
  return
}

//Calculating and Placing mokshim base on difficulty
const mokesh = () => {
  const MinMokesh = boardSize * boardSize * mokeshMagicNum
  const MaxMokesh = boardSize * boardSize * (mokeshMagicNum + 0.04)
  let mokeshAmount = Math.round(
    Math.random() * (MaxMokesh - MinMokesh) + MinMokesh
  )

  while (mokeshAmount > 0) {
    let randRow = Math.round((boardSize - 1) * Math.random())
    let randCol = Math.round((boardSize - 1) * Math.random())
    let cell = boardArr[randRow][randCol]
    if (cell != undefined && cell.innerHTML != "-1") {
      mokeshAmount--
      cell.hiddenVal = "-1"
      mokeshAmount--
    }
  }
}

// Right click
const onRightClickButton = (i, j) => {
  // cell haven't been clicked yet
  cell = boardArr[i][j]
  if (cell.innerHTML != "$") {
    if (cell.disable == false || cell.disable == undefined) {
      cell.innerHTML = "$"
      boardArr[i][j].disable = true
    }
  } else {
    boardArr[i][j].disable = false
    cell.innerHTML = ""
  }
  setTimeout(didWin(), 300)
  return false
}

const addBackGroundColor = (i, j) => {
  if (boardArr[i][j].hiddenVal == 1)
    boardArr[i][j].style.backgroundColor = "DarkTurquoise"
  else if (boardArr[i][j].hiddenVal == 2)
    boardArr[i][j].style.backgroundColor = "Cyan"
  else if (boardArr[i][j].hiddenVal == 3)
    boardArr[i][j].style.backgroundColor = "LightCyan"
  else if (boardArr[i][j].hiddenVal == 4)
    boardArr[i][j].style.backgroundColor = "LightSkyBlue"
  else if (boardArr[i][j].hiddenVal == 5)
    boardArr[i][j].style.backgroundColor = "MediumSlateBlue"
  else if (boardArr[i][j].hiddenVal == 6)
    boardArr[i][j].style.backgroundColor = "MediumTurquoise"
  else if (boardArr[i][j].hiddenVal == 7)
    boardArr[i][j].style.backgroundColor = "PaleTurquoise"
  else if (boardArr[i][j].hiddenVal == 8)
    boardArr[i][j].style.backgroundColor = "SkyBlue"
}

const reveal = (row, col) => {
  for (let i = row - 1; i <= row + 1; i++) {
    if (i >= 0 && i < boardSize) {
      for (let j = col - 1; j <= col + 1; j += 1) {
        if (j >= 0 && j < boardSize) {
          if (boardArr[i][j].hiddenVal == "0") {
            boardArr[i][j].style.backgroundColor = "AliceBlue"
            boardArr[i][j].hiddenVal = "-3"
            boardArr[i][j].style.borderStyle = "inset"
            boardArr[i][j].disable = true
            addBackGroundColor(i, j)
            reveal(i, j)
          } else if (
            boardArr[i][j].hiddenVal != "-1" &&
            boardArr[i][j].hiddenVal != "-3"
          ) {
            boardArr[i][j].innerHTML = boardArr[i][j].hiddenVal
            boardArr[i][j].style.borderStyle = "inset"
            boardArr[i][j].disable = true
            addBackGroundColor(i, j)
          }
        }
      }
    }
  }
}

// check wheter the player won
const didWin = () => {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      console.log(i, j, boardArr[i][j].disable)
      if (boardArr[i][j] == undefined) return
      else {
        if (boardArr[i][j].innerHTML != "$" && boardArr[i][j].hiddenVal == "-1")
          return
        if (
          boardArr[i][j].disable == false ||
          boardArr[i][j].disable == undefined
        )
          return
      }
    }
  }
  setTimeout(() => {
    alert("YOU WIN!")
    return
  }, 100)
}

// left click
const onClickButton = (e, i, j) => {
  // cell haven't been clicked yet
  cell = boardArr[i][j]
  if (e.button == 0) {
    if (
      cell.innerHTML != "$" &&
      (cell.disable == false || cell.disable == undefined)
    ) {
      if (cell.hiddenVal == "-1") {
        cell.style.backgroundColor = "red"
        setTimeout(() => {
          alert("you lost")
          generateBoard(true)
        }, 100)
      } else reveal(i, j)
    }
  }
  setTimeout(didWin(), 300)
  return
}

// Check how many bombs there are around a given cell
const checkMokesh = (row, col) => {
  let mokeshAmountAround = 0
  for (let i = row - 1; i <= row + 1; i++) {
    if (i >= 0 && i < boardSize) {
      for (let j = col - 1; j <= col + 1; j += 1) {
        if (j >= 0 && j < boardSize) {
          if (boardArr[i][j].hiddenVal == "-1") mokeshAmountAround++
        }
      }
    }
  }

  boardArr[row][col].hiddenVal = mokeshAmountAround
}

// adds the number for a given cell
const addNumbersToCells = (cell) => {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j += 1) {
      if (boardArr[i][j].hiddenVal == "-2") {
        checkMokesh(i, j)
      }
    }
  }
}

// destroys the Previous Table
const destroyPreviousTable = (boardTable) => {
  while (boardTable.firstChild) {
    boardTable.removeChild(boardTable.firstChild)
  }
  document.getElementById("restart").style.display = "none"
  document.getElementById("menu").style.display = "none"
}

// generates new table
const generateBoard = (isRestart) => {
  /*
   * Generating the Board
   */
  let boardTable = document.querySelector("table")
  if (isRestart) {
    destroyPreviousTable(boardTable)
  }
  difficulty = document.getElementById("difficulty").value
  if (difficulty == "Normal") mokeshMagicNum = 0.28
  else if (difficulty == "Hard") mokeshMagicNum = 0.33
  else if (difficulty == "Easy") mokeshMagicNum = 0.23
  for (let i = 0; i < boardSize; i++) {
    boardArr[i] = new Array(boardSize)
  }
  // Generating empty Board
  for (let i = 0; i < boardSize; i += 1) {
    let tableRow = document.createElement("tr")
    boardTable.appendChild(tableRow)
    // generate boxes inside each row of a table
    for (let j = 0; j < boardSize; j += 1) {
      let td = document.createElement("td")
      let tableBox = document.createElement("button")
      tableRow.appendChild(td).appendChild(tableBox)
      boardArr[i][j] = tableBox
      boardArr[i][j].classList.add("btn")
      boardArr[i][j].classList.add("td-animation")
      boardArr[i][j].hiddenVal = "-2"
      boardArr[i][j].addEventListener("click", (e) => onClickButton(e, i, j))
      boardArr[i][j].addEventListener("contextmenu", () =>
        onRightClickButton(i, j)
      )
    }
  }
  // Calculating and Placing mokshim base on difficulty
  mokesh()
  // Add numbers to the cells
  addNumbersToCells()
  document.getElementById("restart").style.display = "block"
  document.getElementById("menu").style.display = "block"
}

// sets the difficulty
const setDiffiiculty = (value) => {
  difficulty = document.getElementById("difficulty").value
}

// goes back to menu
const menu = () => {
  let boardTable = document.querySelector("table")
  destroyPreviousTable(boardTable)
  document.getElementById("inputs").style.display = "block"
}
//----------------------
