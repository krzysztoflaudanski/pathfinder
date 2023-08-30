const map = document.getElementById('map');

const generateBlocks = function () {
  const blockSize = 100;
  const space = 5;
  const blockClass = 'gameBlock';

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let gameBlock = document.createElement('div');
      gameBlock.style.width = `${blockSize}px`;
      gameBlock.style.height = `${blockSize}px`;
      gameBlock.style.display = 'inline-block';
      gameBlock.style.margin = space + 'px';
      gameBlock.id = `x${i}y${j}`;
      gameBlock.className = blockClass;
      map.appendChild(gameBlock);
    }
  }
};
generateBlocks();

const game = () => {

  const gameBlocks = map.querySelectorAll('div');

  let start = true;

  const removeBadMoves = () => {
    for (let gameBlock of gameBlocks)
      gameBlock.classList.remove('red');
  };

  const firstMove = () => {
    for (let gameBlock of gameBlocks)
      gameBlock.addEventListener('click', function (e) {
        e.preventDefault();
        if (start) {
          for (let i = 0; i < 10; i++) {
            if (gameBlock.id === ('x0y' + i) || gameBlock.id === ('x' + i + 'y0')
              || gameBlock.id === ('x9y' + i) || gameBlock.id === ('x' + i + 'y9')) {
              removeBadMoves();
              gameBlock.classList.add('green', 'start');
              start = false;
              availableMove();
              addEventListenerForMove();
              return;
            }
            else {
              gameBlock.classList.add('red');
            }
          }
        }
      });
  };

  firstMove();

  const availableMove = () => {
    for (let gameBlock of gameBlocks) {
      if (gameBlock.classList.contains('green')) {
        const id = gameBlock.getAttribute('id');
        const x = parseInt(id.substring(1, 2));
        const y = parseInt(id.substring(3, 4));
        nextMoves(x, y);
      }
    }
  };
  const fuu = [];
  const fuu2 = [];


  const checkUndoMove = (id) => {
    let startId = ('');

    const checkStart = (startId) => {
      const x = parseInt(startId.substring(1, 2));
      const y = parseInt(startId.substring(3, 4));
      const arrayId = [
        ('x' + x + 'y' + (y + 1)),
        ('x' + (x + 1) + 'y' + y),
        ('x' + x + 'y' + (y - 1)),
        ('x' + (x - 1) + 'y' + y),
      ];

      for (let id2 of arrayId) {
        for (let gameBlock of gameBlocks) {
          if (gameBlock.id === id2 && gameBlock.classList.contains('green') && !(gameBlock.classList.contains('checked'))) {
            gameBlock.classList.add('checked');
            console.log(id2);
            fuu2.push(id2);
            checkStart(id2);
          }
        }
      }
    };


    for (let gameBlock of gameBlocks) {
      if (gameBlock.id === id) {
        gameBlock.classList.remove('green');
      }
      if (gameBlock.classList.contains('green') && !(gameBlock.id === id)) {
        fuu.push(gameBlock.id);
      }
      if (gameBlock.classList.contains('start')) {
        startId = gameBlock.id;
      }
      if (gameBlock.id === startId) {
        checkStart(startId);
      }
    }
    console.log(fuu.length);
    console.log(fuu2.length);
    console.log(fuu);
    console.log(fuu2);
    if (fuu.length > fuu2.length)
      return false;
    if (fuu.length <= fuu2.length)
      return true;

  };
  const nextMoves = (x, y) => {
    removeEventListenerForMove();
    removeEventListenerForBadMove();

    let arrayId = [
      // ('x' + (x + 1) + 'y' + (y + 1)),
      ('x' + x + 'y' + (y + 1)),
      ('x' + (x + 1) + 'y' + y),
      // ('x' + (x - 1) + 'y' + (y - 1)),
      ('x' + x + 'y' + (y - 1)),
      ('x' + (x - 1) + 'y' + y),
      // ('x' + (x + 1) + 'y' + (y - 1)),
      // ('x' + (x - 1) + 'y' + (y + 1)),
    ];
    for (let id of arrayId) {
      for (let gameBlock of gameBlocks) {
        if (gameBlock.id === id && !gameBlock.classList.contains('green')) {
          gameBlock.classList.add('clickable');
          addEventListenerForMove();
          addEventListenerForBadMove();
        }
      }
    }
  };

  function move() {
    const clickedElement = this;
    removeBadMoves();
    clickedElement.classList.add('green');
    addEventListenerForUndo();
    clickedElement.classList.remove('clickable');
    availableMove();
  }

  function undo() {
    const id = this.getAttribute('id');
    removeEventListenerForUndo();
    if (!checkUndoMove(id)) {
      console.log(this);
      this.classList.add('green');
    }
    else {
      removeBadMoves();
      removeEventListenerForUndo();
      removeEventListenerForMove();
      removeEventListenerForBadMove();

      this.classList.add('clickable');
      //console.log(id);
      const x = parseInt(id.substring(1, 2));
      const y = parseInt(id.substring(3, 4));
      const arrayId = [
        ('x' + x + 'y' + (y + 1)),
        ('x' + (x + 1) + 'y' + y),
        ('x' + x + 'y' + (y - 1)),
        ('x' + (x - 1) + 'y' + y),
      ];
      for (let id of arrayId) {
        for (let gameBlock of gameBlocks) {
          if (gameBlock.id === id) {
            gameBlock.classList.remove('clickable');
          }
        }
      }
      addEventListenerForMove();
      addEventListenerForBadMove();
    }
    fuu.length = 0;
    fuu2.length = 0;
    addEventListenerForUndo();
  }

  const resetDraw = () => {
    for (let gameBlock of gameBlocks) {
      gameBlock.classList.remove('green', 'red', 'clickable');
    }
    removeEventListenerForBadMove();
    removeEventListenerForUndo();
    removeEventListenerForMove();
    game();
  };

  function badMove() {
    const clickedElement = this;
    clickedElement.classList.add('red');
  }

  const addEventListenerForBadMove = () => {
    for (let gameBlock of gameBlocks) {
      if (!gameBlock.classList.contains('green') && !gameBlock.classList.contains('clickable')) {
        gameBlock.addEventListener('click', badMove);
      }
    }
  };

  const removeEventListenerForBadMove = () => {
    for (let gameBlock of gameBlocks) {
      gameBlock.removeEventListener('click', badMove);
    }
  };

  const addEventListenerForResetDraw = () => {
    document.querySelector('#reset').addEventListener('click', resetDraw);
  };

  addEventListenerForResetDraw();

  const addEventListenerForUndo = () => {
    for (let gameBlock of gameBlocks) {
      gameBlock.classList.remove('checked');
      if (gameBlock.classList.contains('green')) {
        gameBlock.addEventListener('click', undo);
      }
    }
  };
  const removeEventListenerForUndo = () => {
    for (let gameBlock of gameBlocks) {
      gameBlock.removeEventListener('click', undo);
    }
  };
  addEventListenerForUndo();

  const addEventListenerForMove = () => {
    for (let gameBlock of gameBlocks) {
      if (!gameBlock.classList.contains('green') && gameBlock.classList.contains('clickable')) {
        gameBlock.addEventListener('click', move);
      }
    }
  };
  const removeEventListenerForMove = () => {
    for (let gameBlock of gameBlocks) {
      {
        gameBlock.removeEventListener('click', move);
      }
    }
  };

};

const startDraw = () => {
  document.querySelector('#start').addEventListener('click', game);
};
startDraw();
