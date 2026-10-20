export class PuzzleSystem {
    constructor() {
        this.puzzlesSolved = {
            mainDoor: false
        };
    }

    openPuzzle(puzzleId, onSolve) {
        const modal = document.getElementById('puzzle-modal');
        const box = document.getElementById('puzzle-content-box');
        modal.style.display = 'flex';

        if (puzzleId === 'mainDoor') {
            box.innerHTML = `
                <h2>Gembok Pintu Utama</h2>
                <p>Masukkan 4 digit kode rahasia yang ditemukan di catatan.</p>
                <input type="password" id="puzzle-code-input" maxlength="4" style="font-size:24px; text-align:center; width:120px; margin:15px 0; background:#222; color:#fff; border:1px solid #555;">
                <br>
                <button id="btn-submit-code" class="btn-primary">Buka</button>
                <button id="btn-close-puzzle" class="btn-secondary" style="margin-top:10px;">Batal</button>
            `;

            document.getElementById('btn-submit-code').onclick = () => {
                const val = document.getElementById('puzzle-code-input').value;
                if (val === '7492') {
                    this.puzzlesSolved.mainDoor = true;
                    alert('Gembok terbuka!');
                    modal.style.display = 'none';
                    if (onSolve) onSolve();
                } else {
                    alert('Kode salah!');
                }
            };
        }

        document.getElementById('btn-close-puzzle').onclick = () => {
            modal.style.display = 'none';
        };
    }
}