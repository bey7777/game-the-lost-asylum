import { CONFIG } from './config.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.health = 100;
        this.stamina = 100;
        this.battery = 100;
        this.flashlightOn = true;
        this.isHiding = false;
    }

    update(input, collision, dt) {
        let dx = 0;
        let dy = 0;

        // Deteksi tombol W, A, S, D atau Panah
        if (input.isPressed('KeyW') || input.mobile.y < -0.2) dy = -1;
        if (input.isPressed('KeyS') || input.mobile.y > 0.2) dy = 1;
        if (input.isPressed('KeyA') || input.mobile.x < -0.2) dx = -1;
        if (input.isPressed('KeyD') || input.mobile.x > 0.2) dx = 1;

        const isRunning = (input.isPressed('ShiftLeft') || input.mobile.sprint) && this.stamina > 5 && (dx !== 0 || dy !== 0);

        let speed = CONFIG.PLAYER_SPEED;
        if (isRunning) {
            speed *= CONFIG.PLAYER_SPRINT_MULTIPLIER;
            this.stamina = Math.max(0, this.stamina - 25 * dt);
        } else {
            this.stamina = Math.min(100, this.stamina + 15 * dt);
        }

        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }

        // Pergerakan X & Collision
        if (dx !== 0) {
            const nextX = this.x + dx * speed;
            if (!collision.checkRectCollision(nextX, this.y, this.width, this.height)) {
                this.x = nextX;
            }
        }

        // Pergerakan Y & Collision
        if (dy !== 0) {
            const nextY = this.y + dy * speed;
            if (!collision.checkRectCollision(this.x, nextY, this.width, this.height)) {
                this.y = nextY;
            }
        }

        // Baterai senter
        if (this.flashlightOn) {
            this.battery = Math.max(0, this.battery - CONFIG.BATTERY_DRAIN_RATE);
            if (this.battery <= 0) {
                this.flashlightOn = false;
            }
        }
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.fillStyle = '#b33939';
        ctx.fillRect(screenX, screenY, this.width, this.height);
        ctx.fillStyle = '#ff5252';
        ctx.fillRect(screenX + 4, screenY + 2, 12, 8); // Kepala
    }
}