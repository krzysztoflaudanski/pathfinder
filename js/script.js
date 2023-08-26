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
              gameBlock.classList.add('green');
              start = false;
              availableMove();
              addEventListenerForBadMove();
              return;
            }
            else {
              gameBlock.classList.add('red');
            }
          }
        }
      });
  };

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

  const nextMoves = (x, y) => {
    addEventListenerForBadMove();
    for (let gameBlock of gameBlocks) {
      const arrayId = [
        ('x' + (x + 1) + 'y' + (y + 1)),
        ('x' + x + 'y' + (y + 1)),
        ('x' + (x + 1) + 'y' + y),
        ('x' + (x - 1) + 'y' + (y - 1)),
        ('x' + x + 'y' + (y - 1)),
        ('x' + (x - 1) + 'y' + y),
        ('x' + (x + 1) + 'y' + (y - 1)),
        ('x' + (x - 1) + 'y' + (y + 1)),
      ];
      for (let id of arrayId) {
        if (!gameBlock.classList.contains('green') && gameBlock.id === id && !gameBlock.classList.contains('clickable')) {
          removeEventListenerForBadMove();
          gameBlock.classList.add('clickable');
          gameBlock.addEventListener('click', function (e) {
            e.preventDefault();
            removeBadMoves();
            gameBlock.classList.add('green');
            gameBlock.classList.remove('clickable');
            availableMove();
          });
        }
      }
    }
  };

  function badMove() {
    const clickedElement = this;
    console.log(clickedElement);
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
  firstMove();
};
game();
