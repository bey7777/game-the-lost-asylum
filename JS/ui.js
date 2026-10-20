import { SaveSystem } from './save.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.setupListeners();
    }

    setupListeners() {
        document.getElementById('btn-new-game').onclick = () => this.game.startNewGame();
        
        const btnContinue = document.getElementById('btn-continue');
        if (btnContinue) {
            btnContinue.onclick = () => this.game.loadGameData();
        }

        document.getElementById('btn-settings').onclick = () => this.openModal('settings-modal');
        document.getElementById('btn-close-settings').onclick = () => this.closeModal('settings-modal');

        document.getElementById('btn-controls').onclick = () => this.openModal('controls-modal');
        document.getElementById('btn-close-controls').onclick = () => this.closeModal('controls-modal');

        document.getElementById('btn-credits').onclick = () => this.openModal('credits-modal');
        document.getElementById('btn-close-credits').onclick = () => this.closeModal('credits-modal');

        const btnPause = document.getElementById('btn-pause-mobile');
        if (btnPause) btnPause.onclick = () => this.game.pauseGame();

        document.getElementById('btn-resume').onclick = () => this.game.resumeGame();
        document.getElementById('btn-restart').onclick = () => this.game.restartGame();
        document.getElementById('btn-quit').onclick = () => this.game.returnToMenu();

        document.getElementById('btn-try-again').onclick = () => this.game.startNewGame();
        document.getElementById('btn-menu-from-over').onclick = () => this.game.returnToMenu();
        document.getElementById('btn-menu-from-ending').onclick = () => this.game.returnToMenu();

        if (SaveSystem.hasSave() && btnContinue) {
            btnContinue.removeAttribute('disabled');
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'flex';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    }

    updateHUD(player) {
        const hp = document.getElementById('health-fill');
        const st = document.getElementById('stamina-fill');
        const bat = document.getElementById('battery-fill');

        if (hp) hp.style.width = `${Math.max(0, player.health)}%`;
        if (st) st.style.width = `${Math.max(0, player.stamina)}%`;
        if (bat) bat.style.width = `${Math.max(0, player.battery)}%`;
    }
}