export class QuestSystem {
    constructor() {
        this.currentQuest = "Temukan Kunci Berkarat di ruang pemeriksaan.";
        this.step = 1;
    }

    updateQuest(step) {
        this.step = step;
        if (step === 2) {
            this.currentQuest = "Cari petunjuk kode 4 digit di arsip rumah sakit.";
        } else if (step === 3) {
            this.currentQuest = "Menuju ke Pintu Utama dan melarikan diri!";
        }
        const tracker = document.getElementById('quest-tracker');
        if (tracker) tracker.innerText = `Misi: ${this.currentQuest}`;
    }
}