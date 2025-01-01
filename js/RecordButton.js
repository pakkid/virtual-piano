class RecordButton {
    constructor(piano) {
        this.piano = piano;
        this.button = document.getElementById('record-button');
        this.isRecording = false;
    }

    init() {
        this.button.addEventListener('click', () => {
            this.isRecording = !this.isRecording;
            this.button.textContent = this.isRecording ? 'Stop Recording' : 'Start Recording';
            this.piano.toggleRecording(this.isRecording);
        });
    }
}