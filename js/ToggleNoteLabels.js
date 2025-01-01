class ToggleNoteLabels {
    constructor(piano) {
        this.piano = piano;
        this.button = document.getElementById('toggle-note-labels');
    }

    init() {
        this.button.addEventListener('click', () => {
            this.piano.toggleNoteLabels();
        });
    }
}