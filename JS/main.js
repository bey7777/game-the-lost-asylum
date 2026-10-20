import Game from './game.js';

window.addEventListener('DOMContentLoaded', () => {
    console.log("THE LOST ASYLUM berhasil dimuat.");
    
    const game = new Game();

    const startBtn = document.getElementById('btn-start');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            game.startNewGame();
        });
    }

    const loadBtn = document.getElementById('btn-load');
    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            game.loadGameData();
        });
    }

    const resumeBtn = document.getElementById('btn-resume');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            game.resumeGame();
        });
    }

    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            game.restartGame();
        });
    }

    const menuBtn = document.getElementById('btn-menu');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            game.returnToMenu();
        });
    }
});