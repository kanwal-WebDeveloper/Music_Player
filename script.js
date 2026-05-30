const ctrlIcon = document.getElementById("ctrlIcon");
const song = document.getElementById("song");
const progressEl = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");
const volumeEl = document.getElementById("volume");
const ringProgress = document.getElementById("ringProgress");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");

const CIRCUMFERENCE = 2 * Math.PI * 75; // 471.24

song.volume = 0.8;

function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
}

function updateRing(percent) {
    const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
    ringProgress.style.strokeDashoffset = offset;
}

function updateProgressGradient(val) {
    progressEl.style.background = `linear-gradient(to right, #1a5c30 0%, #1a5c30 ${val}%, #d0e3d6 ${val}%, #d0e3d6 100%)`;
}

function updateVolumeGradient(val) {
    volumeEl.style.background = `linear-gradient(to right, #1a5c30 0%, #1a5c30 ${val}%, #d0e3d6 ${val}%, #d0e3d6 100%)`;
}

updateRing(0);
updateProgressGradient(0);
updateVolumeGradient(80);

song.addEventListener("canplay", function () {
    song.play().then(() => {
        ctrlIcon.className = "fa-solid fa-pause";
    }).catch(() => {});
}, { once: true });

song.addEventListener("loadedmetadata", function () {
    totalTimeEl.textContent = formatTime(song.duration);
    progressEl.max = Math.floor(song.duration);
});

playBtn.addEventListener("click", function () {
    if (song.paused) {
        song.play().then(() => {
            ctrlIcon.className = "fa-solid fa-pause";
        }).catch(e => console.log(e));
    } else {
        song.pause();
        ctrlIcon.className = "fa-solid fa-play";
    }
});

song.addEventListener("timeupdate", function () {
    const percent = song.duration ? (song.currentTime / song.duration) * 100 : 0;
    progressEl.value = song.currentTime;
    currentTimeEl.textContent = formatTime(song.currentTime);
    updateRing(percent);
    updateProgressGradient(percent);
});

progressEl.addEventListener("input", function () {
    song.currentTime = this.value;
    const percent = song.duration ? (this.value / song.duration) * 100 : 0;
    updateProgressGradient(percent);
    updateRing(percent);
});

volumeEl.addEventListener("input", function () {
    song.volume = this.value / 100;
    updateVolumeGradient(this.value);
});

song.addEventListener("ended", function () {
    ctrlIcon.className = "fa-solid fa-play";
    updateRing(0);
    updateProgressGradient(0);
});

let shuffleOn = false;
document.getElementById("shuffleBtn").addEventListener("click", function () {
    shuffleOn = !shuffleOn;
    this.style.color = shuffleOn ? "#1a5c30" : "#2a6b3e";
    this.style.background = shuffleOn ? "#d4ead9" : "";
});

let repeatOn = false;
document.getElementById("repeatBtn").addEventListener("click", function () {
    repeatOn = !repeatOn;
    this.style.color = repeatOn ? "#1a5c30" : "#2a6b3e";
    this.style.background = repeatOn ? "#d4ead9" : "";
});