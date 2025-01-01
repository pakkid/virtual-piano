class PlaybackButton {
    constructor(piano) {
        this.piano = piano;
        this.button = document.getElementById('playback-button');
    }

    init() {
        this.button.addEventListener('click', () => {
            this.piano.playRecordedNotes();
        });
    }
}