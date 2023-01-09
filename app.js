// changeble states
let currenTrack;
let isPlaying;

// list of tracks
const TRACKS = [
  {
    id: 0,
    title: 'Babylon Rule Dem',
    subtitle: 'Groundation',
    src: './assets/songs/groundation.mp3',
    thumbnail: './assets/albums/groundation.jpg',
  },
  {
    id: 1,
    title: 'Take Ten',
    subtitle: 'Black Alien',
    src: './assets/songs/blackA.mp3',
    thumbnail: './assets/albums/blackallien.jpg',
  },
  {
    id: 2,
    title: 'Sky is the limit',
    subtitle: 'Rebelution',
    src: './assets/songs/rebelution.mp3',
    thumbnail: './assets/albums/rebelution.jpg',
  },
  {
    id: 3,
    title: 'Jah Work',
    subtitle: 'Ben Harper',
    src: './assets/songs/jahWork.mp3',
    thumbnail: './assets/albums/benharper.jpg',
  },
  {
    id: 4,
    title: 'Like a Lion',
    subtitle: 'Mato seco',
    src: './assets/songs/likeLion.mp3',
    thumbnail: './assets/albums/matoseco.jpg',
  },
  {
    id: 5,
    title: 'These are my roots',
    subtitle: 'Mike Love',
    src: './assets/songs/mikelove.mp3',
    thumbnail: './assets/albums/mikelove.jpg',
  },

]

// tracks list component
const ul = document.getElementById('list-tracks')

// track player components
const trackInput = document.getElementById('track');
const trackPlayerInputRange = document.getElementById("track-player");
const trackDuration = document.getElementById("track-duration");
const trackCurrentTime = document.getElementById("track-current-time");
const trackAlbum = document.getElementById('track-album-image');
const trackTitle = document.querySelector('.titles > strong');
const trackSubTitle = document.querySelector('.titles > span');

// track player controlls components
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const btnPlayPause = document.getElementById('btnPlay');
const iconPlay = document.querySelector('.icon-play');
const iconPause = document.querySelector('.icon-pause');

// track player fn controllers
const playerControlls = {
  start() {
    TRACKS.forEach((track) => {
      const li = document.createElement('li')
      const button = document.createElement('button')
      const figure = document.createElement('figure')
      const img = document.createElement('img')
      const strong = document.createElement('strong')
      const span = document.createElement('span')

      // setup informations
      li.setAttribute('class', 'list-track-item')
      button.setAttribute('id', track.id)
      img.setAttribute('src', track.thumbnail)
      strong.textContent = track.title
      span.textContent = track.subtitle

      // appends
      figure.append(img)
      button.append(figure)
      button.append(strong)
      button.append(span)
      li.append(button)
      ul.append(li)

      // handle track selected
      button.addEventListener('click', () => {
        playerControlls.select(track)
        playerControlls.play()
      })
    });
  },
  select(track = TRACKS[0]) {
    // setup components track info
    trackInput.src = track.src;
    trackInput.setAttribute('id', track.id)
    trackAlbum.src = track.thumbnail;
    trackTitle.textContent = track.title;
    trackSubTitle.textContent = track.subtitle;

    trackInput.addEventListener("loadedmetadata", setTrackInfo);
    trackInput.addEventListener("timeupdate", setTrackInfo);
    trackPlayerInputRange.addEventListener("change", updateTrackInfo);

    currenTrack = trackInput;

    // find current track index
    const currentTrackId = Math.floor(currenTrack.id);
    const currentTrackIndex = TRACKS.findIndex(track => track.id === currentTrackId);

    // setup active class for current item on list tracks
    const allListTracksItems = document.querySelectorAll('.list-track-item > button');
    allListTracksItems.forEach((lisItem) => {
      lisItem.classList.remove('active')

      if (Math.floor(lisItem.id) === currentTrackId) {
        lisItem.classList.add('active')
      }
    })

    // handle disable next/prev buttons on player component
    if (currentTrackIndex === 0) {
      btnPrev.setAttribute('disabled', true)
    } else {
      btnPrev.removeAttribute('disabled')
    }
    if (currentTrackIndex === (TRACKS.length - 1)) {
      btnNext.setAttribute('disabled', true)
    } else {
      btnNext.removeAttribute('disabled')
    }
  },
  play() {
    if (!currenTrack) {
      currenTrack = TRACKS[0]
    }
    isPlaying = true
    iconPlay.classList.add('hidden')
    iconPause.classList.remove('hidden')
    currenTrack.play()
  },
  pause() {
    isPlaying = false;
    iconPlay.classList.remove('hidden')
    iconPause.classList.add('hidden')
    currenTrack.pause()
  },
  next() {
    const currentTrackId = Math.floor(currenTrack.id)
    const currentTrackIndex = TRACKS.findIndex(track => track.id === currentTrackId)
    const nextTrack = TRACKS[currentTrackIndex + 1];
    if (nextTrack) {
      playerControlls.select(nextTrack)
      playerControlls.play()
    }
  },
  prev() {
    const currentTrackId = Math.floor(currenTrack.id)
    const currentTrackIndex = TRACKS.findIndex(track => track.id === currentTrackId)
    const prevTrack = TRACKS[currentTrackIndex - 1];
    playerControlls.select(prevTrack ? prevTrack : TRACKS[0])
    playerControlls.play()
  },
  volume(direction) {
    const volumeStep = 1 / 10;

    if (direction === 'up') {
      if (currenTrack.volume !== 1) {
        currenTrack.volume = (currenTrack.volume += volumeStep).toFixed(2)
      }
    }

    if (direction === 'down') {
      if (currenTrack.volume !== 0) {
        currenTrack.volume = (currenTrack.volume - volumeStep).toFixed(2)
      }
    }
  },
  formmatTimeAudio(time) {
    return Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);
  }
}

// fn utils
function setTrackInfo() {
  trackPlayerInputRange.value = currenTrack.currentTime;
  trackPlayerInputRange.setAttribute('max', currenTrack.duration)
  trackDuration.innerHTML = playerControlls.formmatTimeAudio(currenTrack.duration - currenTrack.currentTime)
  trackCurrentTime.innerHTML = playerControlls.formmatTimeAudio(currenTrack.currentTime)

  if (currenTrack.duration === currenTrack.currentTime) {
    playerControlls.next()
  }
}

function updateTrackInfo() {
  currenTrack.currentTime = trackPlayerInputRange.value;
}

// play pause handles
btnNext.addEventListener("click", playerControlls.next);
btnPrev.addEventListener("click", playerControlls.prev);
btnPlayPause.addEventListener("click", handlePlayPauseTrack);

function handlePlayPauseTrack() {
  isPlaying ? playerControlls.pause() : playerControlls.play()
}

// start
playerControlls.start()
playerControlls.select(TRACKS[0])

// view mode
const view = document.querySelector('.player')
const iconMiniPlayerIcon = document.getElementById('viewMiniIcon')
const iconWidePlayerIcon = document.getElementById('viewWideIcon')
const btnViewMode = document.querySelector('.btn-view-mode');

btnViewMode.addEventListener('click', handleViewMode)

const hasViewMode = localStorage.getItem('@MP3player');
if (hasViewMode) {
  view.classList.remove('player-default')
  view.classList.add('player-custom')
  iconWidePlayerIcon.classList.remove('hidden')
  iconMiniPlayerIcon.classList.add('hidden')
}

function handleViewMode() {
  const isDefaultView = view.classList.contains('player-default');
  if (isDefaultView) {
    view.classList.remove('player-default')
    view.classList.add('player-custom')
    iconMiniPlayerIcon.classList.add('hidden')
    iconWidePlayerIcon.classList.remove('hidden')
    window.localStorage.setItem('@MP3player', 'miniView')
  } else {
    window.localStorage.removeItem('@MP3player')
    view.classList.remove('player-custom')
    view.classList.add('player-default')
    iconMiniPlayerIcon.classList.remove('hidden')
    iconWidePlayerIcon.classList.add('hidden')
  }
}

// accessibilities
if (currenTrack) {
  window.addEventListener('keyup', (event) => {
    if (event.code === "Space") {
      if (isPlaying) {
        playerControlls.pause()
      } else {
        playerControlls.play()
      }
    }

    if (event.code === "ArrowRight") {
      playerControlls.next()
    }

    if (event.code === "ArrowLeft") {
      playerControlls.prev()
    }

    if (event.code === "ArrowUp") {
      playerControlls.volume('up')
    }

    if (event.code === "ArrowDown") {
      playerControlls.volume('down')
    }

    if (event.code === "Escape") {
      view.classList.add('player-default')
      view.classList.remove('player-custom')
      iconWidePlayerIcon.classList.add('hidden')
      iconMiniPlayerIcon.classList.remove('hidden')
      localStorage.removeItem('@MP3player')
    }
  })
}

if (!currenTrack) {
  window.removeEventListener('keyup', () => {})
}