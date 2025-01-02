class Piano {
    constructor() {
        this.baseKeys = [
            { note: 'C', type: 'white' },
            { note: 'C#', type: 'black' },
            { note: 'D', type: 'white' },
            { note: 'D#', type: 'black' },
            { note: 'E', type: 'white' },
            { note: 'F', type: 'white' },
            { note: 'F#', type: 'black' },
            { note: 'G', type: 'white' },
            { note: 'G#', type: 'black' },
            { note: 'A', type: 'white' },
            { note: 'A#', type: 'black' },
            { note: 'B', type: 'white' }
        ];
        this.noteLabelsVisible = true;
        this.recordedNotes = [];
        this.isRecording = false;
        this.canvas = document.getElementById('piano');
        this.ctx = this.canvas.getContext('2d');
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.octaves = 4;
        this.keys = [];
        this.soundSet = 'sound-set-1';
    }

    init() {
        this.resizeCanvas();
        this.renderKeys();
        this.canvas.addEventListener('click', this.handleCanvasClick);
        this.canvas.addEventListener('touchstart', this.handleCanvasClick);
    }

    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth * dpr;
        this.canvas.height = this.canvas.clientHeight * dpr;
        this.ctx.scale(dpr, dpr);
        this.renderKeys();
    }

    renderKeys() {
        const whiteKeyWidth = this.canvas.clientWidth / (this.octaves * 7);
        const blackKeyWidth = whiteKeyWidth * 0.6;
        const whiteKeyHeight = this.canvas.clientHeight;
        const blackKeyHeight = whiteKeyHeight * 0.6;

        this.keys = [];
        let whiteKeyIndex = 0;

        for (let octave = 0; octave < this.octaves; octave++) {
            this.baseKeys.forEach((key, index) => {
                const x = whiteKeyIndex * whiteKeyWidth;
                if (key.type === 'white') {
                    this.keys.push({ ...key, x, width: whiteKeyWidth, height: whiteKeyHeight });
                    whiteKeyIndex++;
                } else {
                    this.keys.push({ ...key, x: x - blackKeyWidth / 2, width: blackKeyWidth, height: blackKeyHeight });
                }
            });
        }

        this.drawKeys();
    }

    drawKeys() {
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        // Draw white keys
        this.keys.filter(key => key.type === 'white').forEach(key => {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(key.x, 0, key.width, key.height);
            this.ctx.strokeRect(key.x, 0, key.width, key.height);
            if (this.noteLabelsVisible) {
                this.ctx.fillStyle = 'black';
                this.ctx.fillText(key.note, key.x + key.width / 2, key.height - 10);
            }
        });

        // Draw black keys
        this.keys.filter(key => key.type === 'black').forEach(key => {
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(key.x, 0, key.width, key.height);
            this.ctx.strokeRect(key.x, 0, key.width, key.height);
            if (this.noteLabelsVisible) {
                this.ctx.fillStyle = 'white';
                this.ctx.fillText(key.note, key.x + key.width / 2, key.height - 10);
            }
        });
    }

    handleCanvasClick = async (event) => {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = (event.clientX || event.touches[0].clientX) - rect.left;
        const y = (event.clientY || event.touches[0].clientY) - rect.top;

        // Check black keys first
        const blackKey = this.keys.find(key => key.type === 'black' && x >= key.x && x <= key.x + key.width && y >= 0 && y <= key.height);
        if (blackKey) {
            this.playNoteWithOctave(blackKey.note, Math.floor(blackKey.x / (this.canvas.clientWidth / this.octaves)));
            return;
        }

        // Check white keys if no black key was clicked
        const whiteKey = this.keys.find(key => key.type === 'white' && x >= key.x && x <= key.x + key.width && y >= 0 && y <= key.height);
        if (whiteKey) {
            this.playNoteWithOctave(whiteKey.note, Math.floor(whiteKey.x / (this.canvas.clientWidth / this.octaves)));
        }
    };

    playNoteWithOctave = (note, octave) => {
        const baseFrequencies = {
            'C': 130.81,
            'C#': 138.59,
            'D': 146.83,
            'D#': 155.56,
            'E': 164.81,
            'F': 174.61,
            'F#': 185.00,
            'G': 196.00,
            'G#': 207.65,
            'A': 220.00,
            'A#': 233.08,
            'B': 246.94
        };
        const frequency = baseFrequencies[note] * Math.pow(2, octave - 1); // Adjusted octave base
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        switch (this.soundSet) {
            case 'sound-set-1':
                oscillator.type = 'sine';
                break;
            case 'sound-set-2':
                oscillator.type = 'square';
                break;
            case 'sound-set-3':
                oscillator.type = 'triangle';
                break;
            case 'sound-set-4':
                oscillator.type = 'sawtooth';
                break;
            default:
                oscillator.type = 'sine';
        }

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(1, this.audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
        oscillator.stop(this.audioContext.currentTime + 1);

        if (this.isRecording) {
            this.recordedNotes.push({ note, octave });
        }
    };

    changeSoundSet(newSoundSet) {
        this.soundSet = newSoundSet;
    }

    toggleNoteLabels() {
        this.noteLabelsVisible = !this.noteLabelsVisible;
        this.drawKeys();
    }

    toggleRecording(isRecording) {
        this.isRecording = isRecording;
        if (!isRecording) {
            console.log('Recorded Notes:', this.recordedNotes);
        }
    }

    playRecordedNotes() {
        let delay = 0;
        this.recordedNotes.forEach(({ note, octave }) => {
            setTimeout(() => this.playNoteWithOctave(note, octave), delay);
            delay += 500; // Adjust delay as needed
        });
    }

    setOctaves(octaves) {
        this.octaves = octaves;
        this.renderKeys();
    }
}