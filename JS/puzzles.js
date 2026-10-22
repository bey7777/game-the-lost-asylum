export class PuzzleSystem {
    constructor() {
        this.puzzlesSolved = {
            mainDoor: false
        };
    }

    openPuzzle(puzzleId, onSolve) {
        const modal = document.getElementById('puzzle-modal');
        const box = document.getElementById('puzzle-content-box');
        
        // Pastikan elemen modal puzzle ada di index.html
        if (!modal || !box) {
            console.error("Elemen #puzzle-modal atau #puzzle-content-box tidak ditemukan di HTML!");
            return;
        }

        modal.style.display = 'flex';

        if (puzzleId === 'mainDoor') {
            box.innerHTML = `
                <h2>Gembok Pintu Utama</h2>
                <p>Masukkan 4 digit kode rahasia (7492):</p>
                <input type="password" id="puzzle-code-input" maxlength="4" autocomplete="off" style="font-size:24px; text-align:center; width:120px; margin:15px 0; background:#222; color:#fff; border:1px solid #555; border-radius:4px; padding:5px;">
                <br>
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                    <button id="btn-submit-code" style="padding: 8px 15px; cursor: pointer; background: #800; color: #fff; border: none; border-radius: 4px;">Buka</button>
                    <button id="btn-close-puzzle" style="padding: 8px 15px; cursor: pointer; background: #333; color: #fff; border: none; border-radius: 4px;">Batal</button>
                </div>
            `;

            const inputField = document.getElementById('puzzle-code-input');
            const submitBtn = document.getElementById('btn-submit-code');
            const closeBtn = document.getElementById('btn-close-puzzle');

            // Fokus otomatis ke kotak input saat puzzle dibuka
            if (inputField) inputField.focus();

            // Tombol Submit / Buka
            if (submitBtn) {
                submitBtn.onclick = () => {
                    const val = inputField ? inputField.value.trim() : '';
                    if (val === '7492') {
                        this.puzzlesSolved.mainDoor = true;
                        alert('Gembok terbuka!');
                        modal.style.display = 'none';
                        if (onSolve) onSolve();
                    } else {
                        alert('Kode salah!');
                        if (inputField) {
                            inputField.value = '';
                            inputField.focus();
                        }
                    }
                };
            }

            // Tombol Batal / Tutup
            if (closeBtn) {
                closeBtn.onclick = () => {
                    modal.style.display = 'none';
                };
            }
        }
    }
}