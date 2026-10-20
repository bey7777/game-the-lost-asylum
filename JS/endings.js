export const EndingSystem = {
    triggerEnding(type) {
        const screen = document.getElementById('ending-screen');
        const title = document.getElementById('ending-title');
        const text = document.getElementById('ending-text');
        
        screen.classList.add('active');

        if (type === 'escape') {
            title.innerText = "ENDING 1: KEBEBASAN";
            text.innerText = "Anda berhasil keluar dari rumah sakit jiwa terbengkalai. Malam terasa sangat dingin, namun Anda selamat dari mimpi buruk itu.";
        } else if (type === 'death') {
            title.innerText = "ENDING 2: KEGELAPAN ABADI";
            text.innerText = "Makhluk itu menyeret Anda ke dalam kegelapan bangsal. Tidak ada lagi yang tersisa.";
        }
    }
};