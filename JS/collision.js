export class CollisionSystem {
    constructor(mapData, tileSize) {
        this.mapData = mapData;
        this.tileSize = tileSize;
    }

    isSolid(tileX, tileY) {
        if (tileX < 0 || tileY < 0 || tileY >= this.mapData.length || tileX >= this.mapData[0].length) {
            return true;
        }
        const tile = this.mapData[tileY][tileX];
        return tile === 1 || tile === 2; // 1: Dinding, 2: Pintu terkunci
    }

    checkRectCollision(x, y, width, height) {
        const left = Math.floor(x / this.tileSize);
        const right = Math.floor((x + width - 1) / this.tileSize);
        const top = Math.floor(y / this.tileSize);
        const bottom = Math.floor((y + height - 1) / this.tileSize);

        for (let r = top; r <= bottom; r++) {
            for (let c = left; c <= right; c++) {
                if (this.isSolid(c, r)) {
                    return true;
                }
            }
        }
        return false;
    }
}