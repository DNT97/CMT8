document.addEventListener('DOMContentLoaded', () => {
    const riveCanvas = document.getElementById('riveCanvas');
    const riveInstance = new rive.Rive({
        src: 'quockhanh.riv',
        canvas: riveCanvas,
        autoplay: true,
        artboard: 'Main',
        stateMachines: ['State Machine 1'],
        layout: new rive.Layout({
            fit: rive.Fit.FitWidth, // Responsive to page width
            alignment: rive.Alignment.Center
        }),
        onLoad: () => {
            riveInstance.resizeDrawingSurfaceToCanvas();
            riveInstance.on(rive.EventType.RiveEvent, onRiveEventReceived);
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        riveInstance.resizeDrawingSurfaceToCanvas();
    });
});

let audio; // For Rive event audio (tuyenngon.mp3)
let musicAudio; // For 198.mp3 music
let backgroundMusic; // For background music (background.mp3)
let isMusicPlaying = false;

// Initialize background music
function initBackgroundMusic() {
    backgroundMusic = new Audio('./background.mp3');
    backgroundMusic.loop = true; // Loop the background music
    backgroundMusic.volume = 0.5; // Set volume to 50%
    
    // Add event listeners for debugging
    backgroundMusic.addEventListener('loadstart', () => console.log('Background music loading started'));
    backgroundMusic.addEventListener('canplaythrough', () => {
        console.log('Background music ready to play');
        // Auto-play when ready
        attemptAutoPlay();
    });
    backgroundMusic.addEventListener('error', (e) => console.error('Background music error:', e));
}

// Auto-play background music
function attemptAutoPlay() {
    if (!isMusicPlaying) {
        backgroundMusic.play().then(() => {
            // Auto-play successful
            const audioIcon = document.getElementById('audioIcon');
            const audioButton = document.getElementById('audioToggle');
            
            audioIcon.textContent = '🔊';
            audioButton.classList.remove('muted');
            isMusicPlaying = true;
            console.log('Background music auto-started successfully');
        }).catch(error => {
            // Auto-play failed (browser restriction)
            console.log('Auto-play prevented by browser:', error);
            console.log('User will need to click the audio button to start music');
        });
    }
}

// Toggle background music
function toggleBackgroundMusic() {
    const audioButton = document.getElementById('audioToggle');
    const audioIcon = document.getElementById('audioIcon');
    
    if (!backgroundMusic) {
        initBackgroundMusic();
    }
    
    if (isMusicPlaying) {
        // Stop music
        backgroundMusic.pause();
        audioIcon.textContent = '🔇';
        audioButton.classList.add('muted');
        isMusicPlaying = false;
        console.log('Background music stopped');
    } else {
        // Start music
        backgroundMusic.play().catch(error => {
            console.error('Error playing background music:', error);
        });
        audioIcon.textContent = '🔊';
        audioButton.classList.remove('muted');
        isMusicPlaying = true;
        console.log('Background music started');
    }
}

// Initialize video background
function initVideoBackground() {
    const video = document.getElementById('videoBackground');
    if (video) {
        video.addEventListener('loadstart', () => console.log('Video background loading started'));
        video.addEventListener('canplaythrough', () => console.log('Video background ready to play'));
        video.addEventListener('error', (e) => console.error('Video background error:', e));
        
        // Ensure video plays (some browsers require explicit play call)
        video.play().catch(error => {
            console.log('Video autoplay prevented:', error);
        });
    }
}

// Auto-play on first user interaction (fallback for browser restrictions)
function enableAutoPlayOnInteraction() {
    const startMusicOnInteraction = () => {
        if (!isMusicPlaying && backgroundMusic) {
            attemptAutoPlay();
        }
        // Remove listeners after first attempt
        document.removeEventListener('click', startMusicOnInteraction);
        document.removeEventListener('touchstart', startMusicOnInteraction);
        document.removeEventListener('keydown', startMusicOnInteraction);
    };
    
    document.addEventListener('click', startMusicOnInteraction);
    document.addEventListener('touchstart', startMusicOnInteraction);
    document.addEventListener('keydown', startMusicOnInteraction);
}

// Add event listener for the toggle button
document.addEventListener('DOMContentLoaded', () => {
    const audioToggleButton = document.getElementById('audioToggle');
    audioToggleButton.addEventListener('click', toggleBackgroundMusic);
    
    // Initialize background music with auto-play
    initBackgroundMusic();
    
    // Initialize video background
    initVideoBackground();
    
    // Enable auto-play fallback on user interaction
    enableAutoPlayOnInteraction();
});

function onRiveEventReceived(riveEvent) {
    const eventData = riveEvent.data;
    console.log(eventData);

    switch (eventData.name) {
        case "tuyenngon":
            if (!audio) {
                audio = new Audio('./tuyenngon.mp3');
                audio.preload = 'auto';

                audio.addEventListener('loadstart', () => console.log('Audio loading started'));
                audio.addEventListener('canplaythrough', () => console.log('Audio can play through'));
                audio.addEventListener('error', (e) => console.error('Audio error:', e));
            }

            audio.play().catch(error => {
                console.error('Error playing audio:', error);
                console.log('Audio readyState:', audio.readyState);
                console.log('Audio networkState:', audio.networkState);
            });
            break;

        case "tuyenngonstop":
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
                console.log('Audio stopped and reset');
            }
            break;

        case "musicon":
            // Stop background music when 198.mp3 starts
            if (backgroundMusic && isMusicPlaying) {
                backgroundMusic.pause();
                const audioIcon = document.getElementById('audioIcon');
                const audioButton = document.getElementById('audioToggle');
                if (audioIcon) audioIcon.textContent = '🔇';
                if (audioButton) audioButton.classList.add('muted');
                isMusicPlaying = false;
                console.log('Background music stopped for 198.mp3');
            }

            if (!musicAudio) {
                musicAudio = new Audio('./198.mp3');
                musicAudio.preload = 'auto';

                musicAudio.addEventListener('loadstart', () => console.log('198.mp3 loading started'));
                musicAudio.addEventListener('canplaythrough', () => console.log('198.mp3 can play through'));
                musicAudio.addEventListener('error', (e) => console.error('198.mp3 error:', e));
            }

            musicAudio.play().catch(error => {
                console.error('Error playing 198.mp3:', error);
                console.log('198.mp3 readyState:', musicAudio.readyState);
                console.log('198.mp3 networkState:', musicAudio.networkState);
            });
            break;

        case "musicoff":
            if (musicAudio) {
                musicAudio.pause();
                musicAudio.currentTime = 0;
                console.log('198.mp3 stopped and reset');
            }

            // Resume background music when 198.mp3 stops
            if (backgroundMusic && !isMusicPlaying) {
                backgroundMusic.play().catch(error => {
                    console.error('Error resuming background music:', error);
                });
                const audioIcon = document.getElementById('audioIcon');
                const audioButton = document.getElementById('audioToggle');
                if (audioIcon) audioIcon.textContent = '🔊';
                if (audioButton) audioButton.classList.remove('muted');
                isMusicPlaying = true;
                console.log('Background music resumed after 198.mp3 stopped');
            }
            break;

        case "OpenURL":
            if (eventData.url) {
                window.open(eventData.url);
            } else {
                alert('No URL provided for this event!');
            }
            break;

        default:
            console.log('Unhandled event name:', eventData.name);
    }
}