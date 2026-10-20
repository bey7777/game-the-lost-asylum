export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 1.4;
    }

    update(player, collision, dt) {
        // Selalu bergerak mengejar pemain tanpa syarat jarak
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);

        // Pergerakan X dengan pengecekan kolisi yang lebih fleksibel
        const nextX = this.x + dx * this.speed;
        if (!collision.checkRectCollision(nextX, this.y, this.width, this.height)) {
            this.x = nextX;
        } else {
            this.x += dy * 0.8; // Sedikit menggeser jika terhalang tembok
        }

        // Pergerakan Y
        const nextY = this.y + dy * this.speed;
        if (!collision.checkRectCollision(this.x, nextY, this.width, this.height)) {
            this.y = nextY;
        } else {
            this.y -= dx * 0.8;
        }
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Gambar Makhluk (Kotak Ungu dengan Mata Menyala)
        ctx.fillStyle = '#4a0080';
        ctx.fillRect(screenX, screenY, this.width, this.height);
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(screenX + 4, screenY + 4, 12, 6); 
    }
}