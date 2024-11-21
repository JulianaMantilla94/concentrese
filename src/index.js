let cards = []

let boardElement = null
let timerElement = null
let pairsFoundElement = 0
let pairsRemainingElement = 0
let btnIniciarElement = null
let btnPausarElement = null
let btnReiniciarElement = null
let winElement = null
let victorySound = null
let matchSound = null
let scoresElement = null
let tableScoresElement = null

let validating = false
let timerInterval = null
const statusGame = {
  isPlaying: false,
  isPause: false,
  pairsFound: 0,
  parisRemaining: 0,
  time: {
    minutes: 0,
    seconds: 0,
    total: 0
  }
}
const images = [
  './public/images/goku.webp',
  './public/images/buu.webp',
  './public/images/freezer.webp',
  './public/images/gohan.webp',
  './public/images/gotenks.webp',
  './public/images/krilin.webp',
  './public/images/picolo.webp',
  './public/images/vegeta.webp',
  './public/images/cell.webp',
  './public/images/kaioshin.webp',
  './public/images/18.webp',
  './public/images/jiren.webp',
  './public/images/whis.webp',
  './public/images/beerus.webp',
  './public/images/babidi.webp',
  './public/images/dende.webp',
  './public/images/17.webp',
  './public/images/bardock.webp',
  './public/images/roshi.webp',
  './public/images/yamcha.webp',
  './public/images/trunks.webp',
  './public/images/tenshinhan.webp'
]

const init = () => {
  boardElement = document.querySelector('.game')
  timerElement = document.querySelector('#timer')
  pairsFoundElement = document.querySelector('#pairs')
  pairsRemainingElement = document.querySelector('#remaining')
  btnIniciarElement = document.querySelector('#btn-iniciar')
  btnPausarElement = document.querySelector('#btn-pausar')
  btnReiniciarElement = document.querySelector('#btn-reiniciar')
  winElement = document.querySelector('#win')
  victorySound = document.querySelector('#victory-sound')
  matchSound = document.querySelector('#match-sound')
  scoresElement = document.querySelector('.scores')
  tableScoresElement = document.querySelector('#table-scores')

  drawScores()

  fillGame()
}

const initGame = () => {
  if (statusGame.isPlaying) return
  btnIniciarElement.classList.add('btn-disabled')
  btnPausarElement.classList.remove('btn-disabled')
  btnReiniciarElement.classList.remove('btn-disabled')

  statusGame.isPlaying = true
  mixCards()
  fillGame()
  initTimer()
}

const pauseGame = () => {
  statusGame.isPause = !statusGame.isPause
  if (statusGame.isPause) {
    btnPausarElement.innerHTML = 'Reanudar'
    addLayer('El juego esta en pausa')
    clearInterval(timerInterval)
  } else {
    removeLayer()
    btnPausarElement.innerHTML = 'Pausar'
    initTimer()
  }
}

const reinitGame = () => {
  removeLayer()
  addLayer('Haz click en iniciar para comenzar')
  clearInterval(timerInterval)
  statusGame.isPlaying = false
  statusGame.isPause = false
  statusGame.pairsFound = 0
  statusGame.parisRemaining = 0
  statusGame.time.minutes = 0
  statusGame.time.seconds = 0
  statusGame.time.total = 0
  cards = []
  timerElement.innerHTML = '00:00'
  pairsFoundElement.innerHTML = '0'
  pairsRemainingElement.innerHTML = '0'
  btnIniciarElement.classList.remove('btn-disabled')
  btnPausarElement.classList.add('btn-disabled')
  btnReiniciarElement.classList.add('btn-disabled')
}

const removeLayer = () => {
  const preview = document.querySelector('.preview')
  if (preview) {
    boardElement.removeChild(preview)
  }
}

const initTimer = () => {
  let minutes = statusGame.time.minutes
  let seconds = statusGame.time.seconds
  timerInterval = setInterval(() => {
    statusGame.time.seconds++
    statusGame.time.total++
    seconds++
    if (seconds === 60) {
      minutes++
      seconds = 0
      statusGame.time.minutes++
      statusGame.time.seconds = 0
    }
    const minutesText = minutes >= 10 ? minutes : '0' + minutes
    const secondsText = seconds >= 10 ? seconds : '0' + seconds
    timerElement.innerHTML = minutesText + ':' + secondsText
  }, 1000)
}

const mixCards = () => {
  const selectedImages = []
  while (selectedImages.length < 8) {
    const randomIndex = Math.floor(Math.random() * images.length)
    const selectedImage = images[randomIndex]
    if (!selectedImages.includes(selectedImage)) {
      selectedImages.push(selectedImage)
    }
  }
  const localImages = [...selectedImages, ...selectedImages]
  statusGame.parisRemaining = localImages.length / 2
  pairsRemainingElement.innerHTML = statusGame.parisRemaining

  for (let i = 0; i < localImages.length; i++) {
    const j = Math.floor(Math.random() * localImages.length)
    const temp = localImages[i]
    localImages[i] = localImages[j]
    localImages[j] = temp
  }

  for (let i = 0; i < localImages.length; i++) {
    cards.push({
      img: localImages[i],
      flipped: false,
      isFoud: false
    })
  }
}

const fillGame = () => {
  boardElement = document.querySelector('.board')
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild)
  }

  const length = statusGame.isPlaying ? cards.length : 16

  if (!statusGame.isPlaying) {
    addLayer('Haz click en iniciar para comenzar')
  }

  for (let i = 0; i < length; i++) {
    const item = document.createElement('div')
    item.classList.add('item')

    const card = document.createElement('div')
    card.classList.add('card')

    card.onclick = () => flipCard(item, card)

    const cardFront = document.createElement('div')
    cardFront.classList.add('card-front')

    const imgFront = document.createElement('img')
    imgFront.src = `./public/images/interrogation.png`
    imgFront.alt = 'interrogation'

    cardFront.appendChild(imgFront)
    card.appendChild(cardFront)

    const cardBack = document.createElement('div')
    cardBack.classList.add('card-back')

    if (statusGame.isPlaying) {
      const imgBAck = document.createElement('img')
      imgBAck.src = cards[i].img
      imgBAck.alt = 'interrogation'

      cardBack.appendChild(imgBAck)
      card.appendChild(cardBack)
    }

    item.appendChild(card)

    if (statusGame.isPlaying) {
      cards[i].element = item
    }

    boardElement.appendChild(item)
  }
}

const addLayer = (text) => {
  const preview = document.createElement('div')
  preview.classList.add('preview')
  preview.innerHTML = text
  boardElement.appendChild(preview)
}

const flipCard = (item, card) => {
  if (validating) return
  const index = Array.from(boardElement.children).indexOf(item)
  if (cards[index].isFoud) return
  card.classList.toggle('rotate')
  cards[index].flipped = !cards[index].flipped
  validatePair()
}

const validatePair = () => {
  const flippedCards = cards.filter((card) => card.flipped && !card.isFoud)

  if (flippedCards.length === 2) {
    validating = true

    if (flippedCards[0].img === flippedCards[1].img) {
      foundPair(flippedCards)
    } else {
      setTimeout(() => shuffle(flippedCards), 1000)
    }
  }
}

const foundPair = (flippedCards) => {
  flippedCards[0].isFoud = true
  flippedCards[1].isFoud = true
  validating = false
  statusGame.pairsFound++
  statusGame.parisRemaining--

  pairsFoundElement.innerHTML = statusGame.pairsFound
  pairsRemainingElement.innerHTML = statusGame.parisRemaining

  setTimeout(() => {
    flippedCards[0].element.querySelector('.card-back').classList.add('found')
    flippedCards[1].element.querySelector('.card-back').classList.add('found')
  }, 500)
  matchSound.play()

  foundAll()
}

const foundAll = () => {
  const found = cards.filter((card) => card.isFoud)
  if (found.length === cards.length) {
    const timeEnd = document.querySelector('#final-time')
    timeEnd.innerHTML = statusGame.time.minutes + ':' + statusGame.time.seconds
    winElement.classList.add('active')
    victorySound.play()
    setScore()
    drawScores()
    clearInterval(timerInterval)
  }
}

const setScore = () => {
  const scores = localStorage.getItem('scores')
    ? JSON.parse(localStorage.getItem('scores'))
    : []

  const score = {
    minutes: statusGame.time.minutes,
    seconds: statusGame.time.seconds,
    time: statusGame.time.total,
    date: new Date().toUTCString()
  }

  const lowestScoreIndex = scores.findIndex((s) => s.time >= score.time)
  if (lowestScoreIndex !== -1) {
    scores.splice(lowestScoreIndex, 0, score)
  } else {
    scores.push(score)
  }
  if (scores.length > 5) {
    scores.pop()
  }

  localStorage.setItem('scores', JSON.stringify(scores))
}

const drawScores = () => {
  tableScoresElement.innerHTML = ''
  if (!localStorage.getItem('scores')) {
    scoresElement.style.display = 'none'
  } else {
    scoresElement.style.display = 'block'
    const scores = JSON.parse(localStorage.getItem('scores'))
    for (let index = 0; index < scores.length; index++) {
      const tr = document.createElement('tr')
      const tdDate = document.createElement('td')
      tdDate.innerHTML = scores[index].date

      const tdScore = document.createElement('td')
      const minutes =
        scores[index].minutes >= 10
          ? scores[index].minutes
          : '0' + scores[index].minutes
      const seconds =
        scores[index].seconds >= 10
          ? scores[index].seconds
          : '0' + scores[index].seconds
      tdScore.innerHTML = minutes + ':' + seconds

      tr.appendChild(tdDate)
      tr.appendChild(tdScore)
      tableScoresElement.appendChild(tr)
    }
  }
}

const closeMessage = () => {
  winElement.classList.remove('active')
  reinitGame()
}

const shuffle = (flippedCards) => {
  flippedCards[0].flipped = false
  flippedCards[1].flipped = false

  flippedCards.forEach((card) =>
    card.element.querySelector('.card').classList.remove('rotate')
  )
  validating = false
}

window.addEventListener('load', init)
