class LyricSync {
  constructor(
    lrcContainerSelector,
    audio,
    lyricsText,
    style = {
      fontSize: 40,
      ifBlur: true,
      ifTrainsion: true,
      scale: 1.2,
      interval: 10,
      ifInner: false,
      animateionOffsetTime: 5,
    }
  ) {
    this.lrcContainer = document.querySelector(lrcContainerSelector);
    this.audio = audio;
    this.lyricsText = lyricsText;
    this.lrcList = [];
    this.offsetH = 90;
    this.lastLrc = -1;
    this.style = style;
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);
    this.init();
  }

  init() {
    this.lrcList = this.parseLrc(this.lyricsText);
    for (let i = 0; i < this.lrcList.length; i++) {
      this.lrcContainer.appendChild(this.lrcList[i].dom);
    }
    this.nextLrc(0, this.lrcList, true);

    this.audio.addEventListener("timeupdate", () => this.updateLrc());
  }

  parseLrc(text) {
    let arr = text.split("\n");
    let res = [];
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].substring(1);
      let arrTL = arr[i].split("]");
      let arrTime = arrTL[0].split(":");
      let doTime = arrTime[1].split(".");
      const p = document.createElement("p");
      p.innerText = arrTL[1];
      p.style.fontSize = this.style.fontSize + "px";
      p.style.paddingBottom = this.style.interval + "px";
      res.push({
        time:
          Number(arrTime[0]) * 60 * 1000 +
          Number(doTime[0]) * 1000 +
          Number(doTime[1]),
        lrc: arrTL[1],
        index: i,
        dom: p,
      });
    }
    return res;
  }

  nextLrc(i = 0, data, isinit = false) {
    if (isinit) {
      for (let j = 0; j < data.length; j++) {
        data[j].dom.style.top = this.getTopHeight(i, j, data) + "px";
      }
      return;
    }
    for (let j = 0; j < data.length; j++) {
      if (this.style.ifBlur) {
        data[j].dom.style.filter = `blur(${Math.abs(j - i)}px)`;
      }
      data[j].dom.style.color =
        i === j ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, .25)";
      data[j].dom.style.transform =
        i === j ? "scale(" + this.style.scale + ")" : "scale(1)";
      const n = Math.abs(j - i);
      const ah = n * 70 - n * this.style.animateionOffsetTime;
      if (i < j && this.style.ifTrainsion) {
        if (this.style.ifInner) {
          if (this.isElementVisible(data[j].dom)) {
            setTimeout(() => {
              window.requestAnimationFrame(() => {
                data[j].dom.style.top = this.getTopHeight(i, j, data) + "px";
              });
            }, ah);
          } else {
            data[j].dom.style.top = this.getTopHeight(i, j, data) + "px";
          }
        } else {
          setTimeout(() => {
            window.requestAnimationFrame(() => {
              data[j].dom.style.top = this.getTopHeight(i, j, data) + "px";
            });
          }, ah);
        }
      } else {
        data[j].dom.style.top = this.getTopHeight(i, j, data) + "px";
      }
    }
  }

  getTopHeight(now, to, data) {
    let res = 0;
    for (let i = now; i < to; i++) {
      res += data[i].dom.offsetHeight;
    }
    for (let i = now; i > to; i--) {
      res -= data[i].dom.offsetHeight;
    }
    return res + this.offsetH;
  }

  updateLrc() {
    const cTime = this.audio.currentTime * 1000;
    let lList = [];
    for (let i = 0; i < this.lrcList.length; i++) {
      if (cTime >= this.lrcList[i].time) {
        lList.push(this.lrcList[i]);
      }
    }
    if (lList.length === 0) return;
    if (this.lastLrc !== lList[lList.length - 1].index) {
      this.nextLrc(lList[lList.length - 1].index, this.lrcList);
      this.lastLrc = lList[lList.length - 1].index;
    }
  }

  isElementVisible(el) {
    const rect = el.getBoundingClientRect();
    const vWidth = window.innerWidth || document.documentElement.clientWidth;
    const vHeight = window.innerHeight || document.documentElement.clientHeight;

    if (
      rect.right < 0 ||
      rect.bottom < 0 ||
      rect.left > vWidth ||
      rect.top > vHeight
    ) {
      return false;
    }
    return true;
  }

  handleResize() {
    // Recalculate positions after resize
    this.nextLrc(this.lastLrc, this.lrcList, true);

    // Adjust font size based on container width
    const containerWidth = this.lrcContainer.offsetWidth;
    const baseFontSize = this.style.fontSize;
    const scaleFactor = Math.min(containerWidth / 800, 1);
    const newFontSize = Math.max(baseFontSize * scaleFactor, 16); // minimum 16px

    this.lrcList.forEach((item) => {
      item.dom.style.fontSize = `${newFontSize}px`;
    });
  }
}

const lyricsText = `[00:01.80]The best of romances
[00:03.95]Deserve second chances
[00:06.90]I'll get to you somehow
[00:08.95]Cause I promise now
[00:11.90]If ever you're in my arms again
[00:16.50]This time I'll love you much better
[00:21.30]If ever you're in my arms again
[00:26.30]This time I'll hold you forever
[00:31.01]This time we'll never end
[00:34.90]If ever you're in my arms again
[00:39.90]This time I'll love you much better
[00:44.90]If ever you're in my arms again
[00:49.90]This time I'll hold you forever
[00:53.98]This time we'll never end`;

class MusicPlayer {
  constructor(audioSrc, songData) {
    this.audio = new Audio(audioSrc);
    this.songData = songData;
    this.isPlaying = false;
    this.isShuffle = false;
    this.isRepeat = false;
    this.volume = 1;

    // UI Elements
    this.elements = {
      playPauseBtn: document.querySelector(".play-pause"),
      albumArt: document.querySelector(".album-art"),
      soundWaves: document.querySelector(".sound-waves"),
      progress: document.querySelector(".progress"),
      progressBar: document.querySelector(".progress-bar"),
      currentTime: document.querySelector(".current-time"),
      duration: document.querySelector(".duration"),
      volumeProgress: document.querySelector(".volume-progress"),
      volumeSlider: document.querySelector(".volume-slider"),
      shuffleBtn: document.querySelector(".shuffle"),
      repeatBtn: document.querySelector(".repeat"),
      trackTitle: document.querySelector(".track-info h2"),
      trackArtist: document.querySelector(".track-info p"),
    };

    this.initializePlayer();
    this.setupEventListeners();
  }

  initializePlayer() {
    // Set initial song data
    this.elements.trackTitle.textContent = this.songData.title;
    this.elements.trackArtist.textContent = this.songData.artist;
    this.elements.volumeProgress.style.width = "100%";

    // Set initial time
    this.audio.addEventListener("loadedmetadata", () => {
      this.elements.duration.textContent = this.formatTime(this.audio.duration);
      this.elements.currentTime.textContent = this.formatTime(0);
    });
  }

  setupEventListeners() {
    // Play/Pause
    this.elements.playPauseBtn.addEventListener("click", () =>
      this.togglePlay()
    );

    // Progress bar
    this.elements.progressBar.addEventListener("click", (e) =>
      this.setProgress(e)
    );
    this.audio.addEventListener("timeupdate", () => this.updateProgress());

    // Volume
    this.elements.volumeSlider.addEventListener("click", (e) =>
      this.setVolume(e)
    );

    // Shuffle & Repeat
    this.elements.shuffleBtn.addEventListener("click", () =>
      this.toggleShuffle()
    );
    this.elements.repeatBtn.addEventListener("click", () =>
      this.toggleRepeat()
    );

    // Audio ended
    this.audio.addEventListener("ended", () => this.handleEnded());
  }

  togglePlay() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    this.audio.play();
    this.isPlaying = true;
    this.updatePlayPauseUI(true);
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayPauseUI(false);
  }

  updatePlayPauseUI(isPlaying) {
    const icon = this.elements.playPauseBtn.querySelector("i");
    if (isPlaying) {
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
      this.elements.albumArt.classList.add("playing");
      this.elements.soundWaves.classList.add("playing");
    } else {
      icon.classList.add("fa-play");
      icon.classList.remove("fa-pause");
      this.elements.albumArt.classList.remove("playing");
      this.elements.soundWaves.classList.remove("playing");
    }
  }

  setProgress(e) {
    const width = this.elements.progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = this.audio.duration;
    this.audio.currentTime = (clickX / width) * duration;
  }

  updateProgress() {
    const duration = this.audio.duration;
    const currentTime = this.audio.currentTime;
    const progressPercent = (currentTime / duration) * 100;
    this.elements.progress.style.width = `${progressPercent}%`;
    this.elements.currentTime.textContent = this.formatTime(currentTime);
  }

  setVolume(e) {
    const width = this.elements.volumeSlider.clientWidth;
    const clickX = e.offsetX;
    const volumePercent = clickX / width;
    this.volume = volumePercent;
    this.audio.volume = volumePercent;
    this.elements.volumeProgress.style.width = `${volumePercent * 100}%`;
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    this.elements.shuffleBtn.classList.toggle("active");
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.elements.repeatBtn.classList.toggle("active");
  }

  handleEnded() {
    if (this.isRepeat) {
      this.audio.currentTime = 0;
      this.play();
    } else {
      this.pause();
      this.audio.currentTime = 0;
    }
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
}

// Data lagu
const songData = {
  title: "If Ever You're In My Arms Again",
  artist: "Peabo Bryson",
  lyrics: lyricsText,
};

// Inisialisasi player
const musicPlayer = new MusicPlayer("if-ever-you.mp3", songData);

// Gunakan audio instance dari musicPlayer untuk LyricSync
const lyricSync = new LyricSync(".lrc", musicPlayer.audio, songData.lyrics, {
  ifTrainsion: true,
  ifBlur: true,
  scale: 1.1,
  fontSize: 24,
  interval: 20,
  ifInner: false,
  animateionOffsetTime: 50,
});
