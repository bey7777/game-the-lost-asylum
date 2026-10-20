export class InputManager {
    constructor() {
        this.keys = {};
        this.mobile = { x: 0, y: 0, active: false, interact: false, flash: false, sprint: false };
        
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.key) {
                this.keys[e.key.toLowerCase()] = true;
            }
            console.log("Tombol ditekan:", e.code, e.key); // Cek di Console browser (Option+Cmd+C)
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            if (e.key) {
                this.keys[e.key.toLowerCase()] = false;
            }
        });

        this.setupTouchListeners();
    }

    isPressed(code) {
        // Cek berdasarkan e.code ('KeyW', 'ArrowUp') atau huruf kecil ('w')
        const upper = code;
        const lower = code.toLowerCase();
        const letter = code.replace('Key', '').toLowerCase();

        return !!(
            this.keys[upper] || 
            this.keys[lower] || 
            this.keys[letter] || 
            this.keys[`Key${letter.toUpperCase()}`] ||
            (upper === 'KeyW' && this.keys['ArrowUp']) ||
            (upper === 'KeyS' && this.keys['ArrowDown']) ||
            (upper === 'KeyA' && this.keys['ArrowLeft']) ||
            (upper === 'KeyD' && this.keys['ArrowRight'])
        );
    }

    setupTouchListeners() {
        const joystickBase = document.getElementById('joystick-base');
        const joystickStick = document.getElementById('joystick-stick');

        if (!joystickBase) return;

        let touchId = null;
        let baseRect = null;

        joystickBase.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            touchId = touch.identifier;
            baseRect = joystickBase.getBoundingClientRect();
            this.mobile.active = true;
            this.updateJoystick(touch, baseRect, joystickStick);
        });

        joystickBase.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === touchId) {
                    this.updateJoystick(touch, baseRect, joystickStick);
                }
            }
        });

        const endTouch = (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === touchId) {
                    this.mobile.active = false;
                    this.mobile.x = 0;
                    this.mobile.y = 0;
                    if (joystickStick) joystickStick.style.transform = `translate(0px, 0px)`;
                    touchId = null;
                }
            }
        };

        joystickBase.addEventListener('touchend', endTouch);
        joystickBase.addEventListener('touchcancel', endTouch);

        const bindBtn = (id, prop) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.mobile[prop] = true;
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.mobile[prop] = false;
            });
        };

        bindBtn('m-btn-interact', 'interact');
        bindBtn('m-btn-flash', 'flash');
        bindBtn('m-btn-sprint', 'sprint');
    }

    updateJoystick(touch, rect, stick) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 35;

        if (dist > maxDist) {
            dx = (dx / dist) * maxDist;
            dy = (dy / dist) * maxDist;
        }

        if (stick) stick.style.transform = `translate(${dx}px, ${dy}px)`;
        this.mobile.x = dx / maxDist;
        this.mobile.y = dy / maxDist;
    }
}