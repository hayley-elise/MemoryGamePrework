// -------------------------------------------------------------------
// global constants

// div containing buttons
const gameButtons = document.getElementById("gameButtonArea")
// start button
const Start = document.getElementById("startBtn")
// stop button
const Stop = document.getElementById("stopBtn")
// mistake counter
const mistakeArea = document.getElementById("mistakeArea")
// round counter
const roundArea = document.getElementById("gameRound")
// game instructions
const instructions = document.getElementById("instructions")
const instructions2 = document.getElementById("instructions-2")

// empty array where random clue pattern will go
const pattern = []

// pause time between clues in seconds
const cluePauseTime = 300

// Moon
const button1 = document.getElementById("button1")
// Saturn
const button2 = document.getElementById("button2")
// Milky Way
const button3 = document.getElementById("button3")
// Jupiter
const button4 = document.getElementById("button4")
// Neptune
const button5 = document.getElementById("button5")
// Earth
const button6 = document.getElementById("button6")

// button sound frequencies
const freqMap = {
  1: 200,
  2: 250,
  3: 300,
  4: 350,
  5: 400,
  6: 410
};

// --------------------------
// global variables

// length of playback between clues in seconds
var nextClueWaitTime = 800
// length of sound/light per clue in seconds
var clueHoldTime = 800

// how far along user is in pattern; also indexes pattern array
var progress = 0
// where user is in guessing the clue sequence; resets each round
var guessCounter = 0

// determines if user has pressed Start/Stop
var gamePlaying = false

// round number
var roundCount = 1

// total mistakes user has left
var mistakeTotal = 3
// counter for mistakes made
var mistakeCounter = 0

// determines if tone is playing
var tonePlaying = false
// tone volume; must be between 0.0 - 1.0
var volume = 0.5

// -------------------------------------------------------------------
// displays round number on page

let round = roundCount
document.getElementById("roundCount").innerHTML = roundCount

// -------------------------------------------------------------------
// displays user mistakes on page

let chancesLeft = mistakeTotal
document.getElementById("chancesLeft").innerHTML = chancesLeft

// -------------------------------------------------------------------
// generates random pattern of 12 nums. between 1-6 (since there's 6 buttons)

function randomPattern() {
  for (let i = 0; i <= 11; i++) {
    pattern.push(Math.floor(Math.random() * 6) + 1)
  }
}

// -------------------------------------------------------------------
// starts game

function startGame() {
  gamePlaying = true

  // hides items
  Start.hidden = true
  instructions.hidden = true
  instructions2.hidden = true

  // unhides items
  Stop.hidden = false
  roundArea.hidden = false
  mistakeArea.hidden = false
  gameButtons.hidden = false

  // calls these functions:
  enableButtons()
  randomPattern()
  playClueSequence()
}

// -------------------------------------------------------------------
// stops game

function stopGame() {
  gamePlaying = false

  // unhides items
  Start.hidden = false
  instructions.hidden = false
  instructions2.hidden = false

  // hides items
  Stop.hidden = true
  roundArea.hidden = true
  mistakeArea.hidden = true
  gameButtons.hidden = true

  // resets these variables:
  pattern = []
  roundCount = 1
  mistakeTotal = 3
  progress = 0
}

// -------------------------------------------------------------------
// lights buttons during pattern clues

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit")
}

// -------------------------------------------------------------------
// unlights buttons after pattern clues

function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit")
}

// -------------------------------------------------------------------
// disables buttons
// want to make this a loop

function disableButtons() {
  button1.classList.add("disabled")
  button2.classList.add("disabled")
  button3.classList.add("disabled")
  button4.classList.add("disabled")
  button5.classList.add("disabled")
  button6.classList.add("disabled")
}

// -------------------------------------------------------------------
// enables buttons
// want to make this a loop

function enableButtons() {
  button1.classList.remove("disabled")
  button2.classList.remove("disabled")
  button3.classList.remove("disabled")
  button4.classList.remove("disabled")
  button5.classList.remove("disabled")
  button6.classList.remove("disabled")
}

// -------------------------------------------------------------------
// plays a single clue

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn)
    playTone(btn, clueHoldTime)
    setTimeout(clearButton, clueHoldTime, btn)
  }
}

// -------------------------------------------------------------------
// loops single clue into a sequence of clues

function playClueSequence() {
  // disables buttons
  disableButtons()
  
  // resets guess counter
  guessCounter = 0
  
  context.resume()

  let delay = nextClueWaitTime
  for (let i = 0; i <= progress; i++) {
    // console.log("play single clue: " + pattern[i])
    setTimeout(playSingleClue, delay, pattern[i])

    delay += clueHoldTime
    delay += cluePauseTime
  }
  // enables the buttons when sequence is finished
  setTimeout(enableButtons, delay)
}

// -------------------------------------------------------------------
// losing message, stops game

function loseGame() {
  alert("You lose. Sorry!")
  stopGame()
}

// -------------------------------------------------------------------
// winning message, stops game

function winGame() {
  alert("You win! Good memory.")
  stopGame()
}

// -------------------------------------------------------------------
// logic for user guesses

function guess(btn) {
  // console.log("user guessed: " + btn)

  // if user hasn't pressed Start, return
  if (!gamePlaying) {
    return
  }

  // user makes a mistake
  if (pattern[guessCounter] != btn) {
    mistakeCounter += 1
    chancesLeft -= 1
    document.getElementById("chancesLeft").innerHTML = chancesLeft

    // user out of chances, game over
    if (chancesLeft == 0 && mistakeCounter == 3) {
      loseGame()
    } else {
      // repeat the same sequence
      playClueSequence()
    }
    
  // user guessed correctly
  } else if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {
      
      // if it's the last turn
      if (progress == pattern.length - 1) {
        winGame()
      } else {
        // move on to next sequence
        progress++
        
        round += 1
        document.getElementById("roundCount").innerHTML = round
        
        // decreases clue length so each round will be faster
        clueHoldTime -= 3.5
        
        playClueSequence()
      }
    } else {
      // user continues guessing
      guessCounter++
    }
  }
}

// -------------------------------------------------------------------
// plays/stops tones (provided from CodePath; no touching)

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}

function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();

g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

// -------------------------------------------------------------------
