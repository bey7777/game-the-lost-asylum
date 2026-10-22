import { CONFIG } from './config.js';
import { InputManager } from './input.js';
import { MapSystem } from './map.js';
import { CollisionSystem } from './collision.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { InventorySystem } from './inventory.js';
import { PuzzleSystem } from './puzzles.js';
import { QuestSystem } from './quests.js';
import { UIManager } from './ui.js';
import { audioManager } from './audio.js';
import { SaveSystem } from './save.js';
import { EndingSystem } from './endings.js';

export default class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = new InputManager();
        this.map = new MapSystem();
        this.collision = new CollisionSystem(this.map.data, CONFIG.TILE_SIZE);
        this.player = new Player(100, 100);
        
        this.enemies = [
            new Enemy(180, 120),
            new Enemy(600, 450)
        ];

        this.inventory = new InventorySystem();
        this.puzzles = new PuzzleSystem();
        this.quests = new QuestSystem();
        this.ui = new UIManager(this);

        this.lastTime = 0;
        this.isRunning = false;
        this.isPaused = false;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Toggle inventori yang aman dan mulus
        window.addEventListener('keydown', (e) => {
            if ((e.code === 'KeyI' || e.key.toLowerCase() === 'i') && this.isRunning && !this.isPaused) {
                const invModal = document.getElementById('inventory-modal');
                if (invModal) {
                    const isOpen = invModal.style.display === 'flex';
                    invModal.style.display = isOpen ? 'none' : 'flex';
                    if (!isOpen) {
                        this.inventory.updateUI();
                    }
                }
            }
        });
    }

    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    startNewGame() {
        audioManager.init();

        // 1. Sembunyikan semua layar & modal
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');

        // 2. Tampilkan Layar Game Utama
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.classList.add('active');
            gameScreen.style.display = 'block';
        }

        // 3. Reset Posisi Pemain & Musuh
        this.player = new Player(64, 40);
        this.enemies = [
            new Enemy(250, 150),
            new Enemy(650, 400)
        ];

        this.isRunning = true;
        this.isPaused = false;
        this.lastTime = performance.now();

        if (this.canvas) {
            this.canvas.focus();
        }

        requestAnimationFrame((t) => this.loop(t));
    }

    loadGameData() {
        const data = SaveSystem.loadGame();
        if (data) {
            this.startNewGame();
            this.player.x = data.x;
            this.player.y = data.y;
            this.player.health = data.health;
        }
    }

    pauseGame() {
        if (!this.isRunning) return;
        this.isPaused = true;
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu) pauseMenu.style.display = 'flex';
    }

    resumeGame() {
        this.isPaused = false;
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu) pauseMenu.style.display = 'none';
        
        if (this.canvas) {
            this.canvas.focus();
        }

        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    restartGame() {
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu) pauseMenu.style.display = 'none';
        this.startNewGame();
    }

    returnToMenu() {
        this.isRunning = false;
        this.isPaused = false;

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');

        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.classList.add('active');
    }

    gameOver() {
        this.isRunning = false;
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const gameOverScreen = document.getElementById('gameover-screen');
        if (gameOverScreen) gameOverScreen.classList.add('active');
        audioManager.playJumpscare();
    }

    loop(timestamp) {
        if (!this.isRunning || this.isPaused) return;

        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    // Menghitung tile yang sedang didekati pemain
    getNearbyTile() {
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;

        const checkPositions = [
            { x: Math.floor(playerCenterX / CONFIG.TILE_SIZE), y: Math.floor(playerCenterY / CONFIG.TILE_SIZE) },
            { x: Math.floor((playerCenterX + 24) / CONFIG.TILE_SIZE), y: Math.floor(playerCenterY / CONFIG.TILE_SIZE) },
            { x: Math.floor((playerCenterX - 24) / CONFIG.TILE_SIZE), y: Math.floor(playerCenterY / CONFIG.TILE_SIZE) },
            { x: Math.floor(playerCenterX / CONFIG.TILE_SIZE), y: Math.floor((playerCenterY + 24) / CONFIG.TILE_SIZE) },
            { x: Math.floor(playerCenterX / CONFIG.TILE_SIZE), y: Math.floor((playerCenterY - 24) / CONFIG.TILE_SIZE) }
        ];

        for (let pos of checkPositions) {
            const tileY = pos.y;
            const tileX = pos.x;

            if (this.map.data[tileY] && this.map.data[tileY][tileX] !== undefined) {
                const type = this.map.data[tileY][tileX];
                if (type !== 0 && type !== 1) { // 0: lantai, 1: dinding biasa
                    return { type, tileX, tileY };
                }
            }
        }
        return null;
    }

    update(dt) {
        // 1. Update Pergerakan Pemain
        this.player.update(this.input, this.collision, dt);

        // 2. Update Musuh & Deteksi Kematian
        for (let enemy of this.enemies) {
            enemy.update(this.player, this.collision, dt);

            const dist = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
            if (dist < 20) {
                this.player.health -= 50 * dt;
                if (this.player.health <= 0) {
                    this.gameOver();
                    return;
                }
            }
        }

        // 3. Interaksi Tombol E
        if (this.input.isPressed('KeyE') || this.input.mobile.interact) {
            const tileData = this.getNearbyTile();

            if (tileData) {
                const { type, tileX, tileY } = tileData;

                // Ambil Kunci Berkarat (Tile 4)
                if (type === 4) {
                    this.inventory.addItem({ id: 'key_rusty', name: 'Kunci Berkarat', icon: '🗝️', desc: 'Membuka pintu bangsal utama.' });
                    this.map.data[tileY][tileX] = 0;
                    audioManager.playItemPick();
                    this.quests.updateQuest(2);
                    alert('Anda mendapatkan Kunci Berkarat!');
                } 
                // Ambil P3K (Tile 5)
                else if (type === 5) {
                    this.player.health = Math.min(100, this.player.health + 30);
                    this.map.data[tileY][tileX] = 0;
                    audioManager.playItemPick();
                    alert('Kesehatan dipulihkan!');
                } 
                // Ambil Catatan Kode Gembok (Tile 6)
                else if (type === 6) {
                    alert('Kamu menemukan catatan berdarah di lantai: "Kode pintu utama adalah 7492"');
                    this.inventory.addItem({ id: 'note_code', name: 'Catatan Misterius', icon: '📜', desc: 'Kode gembok pintu utama: 7492' });
                    this.map.data[tileY][tileX] = 0;
                    audioManager.playItemPick();
                }
                // Buka Pintu Terkunci (Tile 2)
                else if (type === 2) {
                    if (this.inventory.hasItem('key_rusty')) {
                        this.map.data[tileY][tileX] = 0; // Ubah ke lantai/jalan terbuka
                        audioManager.playDoorOpen();
                        alert('Pintu berhasil dibuka dengan Kunci Berkarat!');
                    } else {
                        alert('Pintu terkunci! Anda membutuhkan Kunci Berkarat.');
                    }
                } 
                // Pintu Keluar Utama / Puzzle (Tile 3)
                else if (type === 3) {
                    if (this.puzzles.puzzlesSolved.mainDoor) {
                        this.isRunning = false;
                        EndingSystem.triggerEnding('escape');
                    } else {
                        this.puzzles.openPuzzle('mainDoor', () => {
                            this.quests.updateQuest(3);
                        });
                    }
                }
            }

            // Reset status input interaksi agar tidak ke-trigger berkali-kali
            if (this.input.mobile) this.input.mobile.interact = false;
        }

        this.ui.updateHUD(this.player);

        SaveSystem.saveGame({
            x: this.player.x,
            y: this.player.y,
            health: this.player.health
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const camera = {
            x: Math.floor(this.player.x - this.canvas.width / 2 + this.player.width / 2),
            y: Math.floor(this.player.y - this.canvas.height / 2 + this.player.height / 2)
        };

        this.map.draw(this.ctx, camera);
        this.player.draw(this.ctx, camera);

        for (let enemy of this.enemies) {
            enemy.draw(this.ctx, camera);
        }

        // Tampilkan Teks Petunjuk "Tekan E" di atas kepala pemain
        const nearby = this.getNearbyTile();
        if (nearby) {
            let promptText = '';
            if (nearby.type === 2) promptText = '[ Tekan E untuk Buka Pintu ]';
            else if (nearby.type === 3) promptText = '[ Tekan E untuk Pintu Utama ]';
            else if (nearby.type === 4) promptText = '[ Tekan E untuk Ambil Kunci ]';
            else if (nearby.type === 5) promptText = '[ Tekan E untuk Ambil P3K ]';
            else if (nearby.type === 6) promptText = '[ Tekan E untuk Baca Catatan ]';

            if (promptText) {
                this.ctx.save();
                this.ctx.font = 'bold 14px monospace';
                this.ctx.fillStyle = '#ff3333';
                this.ctx.textAlign = 'center';
                this.ctx.shadowColor = '#000000';
                this.ctx.shadowBlur = 5;

                const screenX = this.player.x - camera.x + this.player.width / 2;
                const screenY = this.player.y - camera.y - 12;

                this.ctx.fillText(promptText, screenX, screenY);
                this.ctx.restore();
            }
        }

        // Senter & Pencahayaan
        if (this.player.flashlightOn) {
            const screenX = this.player.x - camera.x + this.player.width / 2;
            const screenY = this.player.y - camera.y + this.player.height / 2;

            const gradient = this.ctx.createRadialGradient(screenX, screenY, 20, screenX, screenY, 140);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.98)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}