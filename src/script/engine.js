const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    max: document.querySelector("#max-score"),
    lives: document.querySelector(".live-score"),
  },
  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    currentTime: 60,
    lives: 3,
  },
  actions: {
    timerId: setInterval(randomSquare, 1000),
    countDownTimerId: setInterval(countDown, 1000),
  },
};

function loadMaxScore() {
  const savedMaxScore = localStorage.getItem("maxScore");
  if (savedMaxScore) {
    state.view.max.textContent = savedMaxScore;
  }
}

function saveMaxScore() {
  localStorage.setItem("maxScore", state.view.max.textContent);
}

function resetGame() {
  (state.values.result = 0),
    (state.values.currentTime = 60),
    (state.values.lives = 3);

  state.view.score.textContent = state.values.result;
  state.view.timeLeft.textContent = state.values.currentTime;
  state.view.lives.textContent = `x${state.values.lives}`;

  clearInterval(state.actions.timerId);
  clearInterval(state.actions.countDownTimerId);

  state.actions.timerId = setInterval(randomSquare, 1000);
  state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime <= 0) {
    clearInterval(state.actions.countDownTimerId),
      clearInterval(state.actions.timerId),
      alert("Game Over! O seu resultado foi: " + state.values.result);
    if (state.values.result > parseInt(state.view.max.textContent)) {
      state.view.max.textContent = state.values.result;
    }
    if (state.values.result > parseInt(state.view.max.textContent)) {
      state.view.max.textContent = state.values.result;
      saveMaxScore();
    }

    resetGame();
  }
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.m4a`);
  audio.volume = 0.2;
  audio.play();
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit");
      } else {
        state.values.lives--;
        state.view.lives.textContent = `x${state.values.lives}`;
        if (state.values.lives <= 0) {
          clearInterval(state.actions.countDownTimerId);
          clearInterval(state.actions.timerId);
          alert("Game Over! Você perdeu todas as suas vidas.");
          if (state.values.result > parseInt(state.view.max.textContent)) {
            state.view.max.textContent = state.values.result;
            saveMaxScore();
          }
          resetGame();
        }
      }
    });
  });
}
function initialize() {
  loadMaxScore();
  addListenerHitBox();
  resetGame();
}

initialize();
