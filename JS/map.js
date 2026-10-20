import { CONFIG } from './config.js';

export class MapSystem {
    constructor() {
        this.tileSize = CONFIG.TILE_SIZE;
        // 0: Lantai, 1: Dinding, 2: Pintu Terkunci, 3: Jalan Keluar/Pintu Utama, 4: Kunci Berkarat, 5: P3K
        this.data = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,1,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,3,1],
            [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
            [1,0,0,0,1,0,0,0,0,1,0,0,5,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
            [1,1,1,0,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,0,1,1,1,1,0,1,2,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
            [1,1,1,1,1,1,0,1,1,0,2,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
            [1,0,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1],
            [1,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1],
            [1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
            [1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
    }

    draw(ctx, camera) {
        const startCol = Math.floor(camera.x / this.tileSize);
        const endCol = startCol + Math.ceil(ctx.canvas.width / this.tileSize) + 1;
        const startRow = Math.floor(camera.y / this.tileSize);
        const endRow = startRow + Math.ceil(ctx.canvas.height / this.tileSize) + 1;

        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                if (r >= 0 && r < this.data.length && c >= 0 && c < this.data[0].length) {
                    const tile = this.data[r][c];
                    const screenX = c * this.tileSize - camera.x;
                    const screenY = r * this.tileSize - camera.y;

                    if (tile === 1) {
                        ctx.fillStyle = '#1b1b1b';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.strokeStyle = '#282828';
                        ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
                    } else if (tile === 2) {
                        ctx.fillStyle = '#4a1515';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#ffcc00';
                        ctx.font = '14px Courier New';
                        ctx.fillText('🔒', screenX + 6, screenY + 22);
                    } else if (tile === 3) {
                        ctx.fillStyle = '#004a4a';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#00ffff';
                        ctx.font = '10px Courier New';
                        ctx.fillText('EXIT', screenX + 3, screenY + 20);
                    } else if (tile === 4) {
                        // Kunci Berkarat di lantai
                        ctx.fillStyle = '#0d0d0d';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#ffcc00';
                        ctx.font = '14px Courier New';
                        ctx.fillText('🗝️', screenX + 6, screenY + 22);
                    } else if (tile === 5) {
                        // P3K di lantai
                        ctx.fillStyle = '#0d0d0d';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#ff3333';
                        ctx.font = '14px Courier New';
                        ctx.fillText('💊', screenX + 6, screenY + 22);
                    } else {
                        ctx.fillStyle = '#0d0d0d';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.strokeStyle = '#151515';
                        ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
                    }
                }
            }
        }
    }
}