function playSound(button) {
    const sound = new Audio();
    if (button === 'play') {
        sound.src = 'assets/audio/button-click.mp3';
    } else if (button === 'settings') {
        sound.src = 'assets/audio/button-click.mp3';
    }
    sound.play();
}

function showGame() {
    document.getElementById('game-container').style.display = 'block';
    // Add any additional game initialization code here
}

function toggleBGM() {
    var bgm = document.getElementById("bgm");
    if (bgm.paused) {
        bgm.play();
    } else {
        bgm.pause();
    }
}


