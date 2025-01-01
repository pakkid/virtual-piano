document.addEventListener('DOMContentLoaded', () => {
    const piano = new Piano();
    const dropdownMenu = new DropdownMenu(piano);
    const recordButton = new RecordButton(piano);
    const playbackButton = new PlaybackButton(piano);
    const toggleNoteLabels = new ToggleNoteLabels(piano);

    // Initialize the piano
    piano.init();

    // Set up event listeners
    dropdownMenu.init();
    recordButton.init();
    playbackButton.init();
    toggleNoteLabels.init();

    // Set up octave slider
    const octaveSlider = document.getElementById('octave-slider');
    const octaveValue = document.getElementById('octave-value');
    octaveSlider.addEventListener('input', (event) => {
        const octave = event.target.value;
        octaveValue.textContent = octave;
        piano.setOctaves(octave);
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        piano.resizeCanvas();
    });

    // Resume AudioContext on user interaction
    document.body.addEventListener('click', () => {
        if (piano.audioContext.state === 'suspended') {
            piano.audioContext.resume().then(() => {
                console.log('AudioContext resumed');
            });
        }
    });
});