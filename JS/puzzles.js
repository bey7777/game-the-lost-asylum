export class PuzzleSystem {
    constructor() {
        this.puzzlesSolved = {
            mainDoor: false
        };
    }

    openPuzzle(puzzleId, onSolve) {
        const modal = document.getElementById('puzzle-modal');
        const box = document.getElementById('puzzle-content-box');
        
        if (!modal || !box) {
            console.error("Elemen #puzzle-modal atau #puzzle-content-box tidak ditemukan di HTML!");
            return;
        }

        modal.style.display = 'flex';
        modal.style.pointerEvents = 'auto'; // Memastikan modal bisa diklik & diketik

        if (puzzleId === 'mainDoor') {
            box.innerHTML = `
                <h2>Gembok Pintu Utama</h2>
                <p>Masukkan 4 digit kode rahasia:</p>
                <input type="text" id="puzzle-code-input" maxlength="4" autocomplete="off" 
                       style="font-size:28px; text-align:center; width:140px; letter-spacing:5px; margin:15px 0; background:#111; color:#0f0; border:2px solid #555; border-radius:4px; padding:5px; outline:none;">
                <br>
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                    <button id="btn-submit-code" style="padding: 8px 18px; cursor: pointer; background: #800; color: #fff; border: none; border-radius: 4px; font-weight: bold;">Buka</button>
                    <button id="btn-close-puzzle" style="padding: 8px 18px; cursor: pointer; background: #333; color: #fff; border: none; border-radius: 4px;">Batal</button>
                </div>
            `;

            const inputField = document.getElementById('puzzle-code-input');
            const submitBtn = document.getElementById('btn-submit-code');
            const closeBtn = document.getElementById('btn-close-puzzle');

            if (inputField) {
                // Hentikan penyerapan tombol panah/WASD oleh game saat mengetik kode
                inputField.addEventListener('keydown', (e) => {
                    e.stopPropagation(); 
                    if (e.key === 'Enter') {
                        if (submitBtn) submitBtn.click();
                    }
                });

                // Fokus otomatis ke kotak input
                setTimeout(() => inputField.focus(), 100);
            }

            // Tombol Buka / Submit
            if (submitBtn) {
                submitBtn.onclick = () => {
                    const val = inputField ? inputField.value.trim() : '';
                    if (val === '7492') {
                        this.puzzlesSolved.mainDoor = true;
                        alert('Gembok berhasil terbuka!');
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

            // Tombol Batal
            if (closeBtn) {
                closeBtn.onclick = () => {
                    modal.style.display = 'none';
                };
            }
        }
    }
}