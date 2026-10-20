const SAVE_KEY = "the_lost_asylum_save_v1";

export const SaveSystem = {
    saveGame(saveData) {
        try {
            const dataStr = JSON.stringify({
                ...saveData,
                timestamp: Date.now(),
                version: "1.0"
            });
            localStorage.setItem(SAVE_KEY, dataStr);
            return true;
        } catch (e) {
            console.error("Gagal menyimpan game:", e);
            return false;
        }
    },

    loadGame() {
        try {
            const dataStr = localStorage.getItem(SAVE_KEY);
            if (!dataStr) return null;
            const data = JSON.parse(dataStr);
            return data;
        } catch (e) {
            console.error("Gagal memuat save game:", e);
            return null;
        }
    },

    hasSave() {
        return localStorage.getItem(SAVE_KEY) !== null;
    },

    clearSave() {
        localStorage.removeItem(SAVE_KEY);
    }
};