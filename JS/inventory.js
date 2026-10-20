export class InventorySystem {
    constructor() {
        this.items = [];
        this.maxSlots = 8;
        this.selectedSlot = 0;
    }

    addItem(item) {
        if (this.items.length < this.maxSlots) {
            this.items.push(item);
            this.updateUI();
            return true;
        }
        alert('Inventori penuh!');
        return false;
    }

    hasItem(id) {
        return this.items.some(item => item.id === id);
    }

    removeItem(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.updateUI();
            return true;
        }
        return false;
    }

    updateUI() {
        const grid = document.getElementById('inventory-grid');
        if (!grid) return;

        grid.innerHTML = '';
        for (let i = 0; i < this.maxSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            if (i === this.selectedSlot) slot.classList.add('selected');

            if (this.items[i]) {
                slot.innerHTML = this.items[i].icon;
                slot.title = this.items[i].name;
                slot.onclick = () => {
                    const desc = document.getElementById('item-description');
                    if (desc) desc.innerText = `${this.items[i].name}: ${this.items[i].desc}`;
                };
            }
            grid.appendChild(slot);
        }
    }
}