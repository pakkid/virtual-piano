class DropdownMenu {
    constructor(piano) {
        this.piano = piano;
        this.soundSets = ['sound-set-1', 'sound-set-2', 'sound-set-3', 'sound-set-4'];
        this.dropdown = document.getElementById('sound-set-dropdown');
    }

    init() {
        this.soundSets.forEach(set => {
            const option = document.createElement('option');
            option.value = set;
            option.textContent = set.replace('-', ' ').toUpperCase();
            this.dropdown.appendChild(option);
        });

        this.dropdown.addEventListener('change', (event) => {
            this.piano.changeSoundSet(event.target.value);
        });
    }
}