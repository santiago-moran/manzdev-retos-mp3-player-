let playBtn = document.getElementById('playBtn');
let pauseBtn = document.getElementById('pauseBtn');
let bckBtn = document.getElementById('bckBtn');
let fwdBtn = document.getElementById('fwdBtn');
let progressBar = document.getElementById('progressBar');
let slider = document.getElementById('slider');
let playlist = document.getElementById('playlist');
let playlistSongs = document.getElementById('playlistSongs');
let index = 0;
let fwdBtnClicked = false;
let bckBtnClicked = false;
let showingPlaylist = false;
let songSelected = false;
let mediaQueryList = window.matchMedia('(max-width: 1230px)');

const getData = async () => {
    let request = await fetch ('jsonFile/mp3Songs.txt');
    let data = await request.json();
    return data;
}
const printData = (playList) => {
    let cover = document.getElementById('cover');
    let songInfo = document.getElementById('songInfo');
    cover.style.backgroundImage = `url(${playList[index].image})`;
    songInfo.innerHTML = `<h1>${playList[index].title}</h1>
    <h5>${playList[index].artist}</h5>`;
    checkBckBtnAllowed(playList);
}
const changeData = (audio, playList) => {
    if (fwdBtnClicked == false && bckBtnClicked == false) {
        audio.src = `${playList[index].url}`;
        if (playBtn.style.display == 'none') audio.play();
        songSelected = false;
        printData(playList);
    }
    else {
        if (fwdBtnClicked == true) {
            if (fwdBtn.classList.contains('notAllowed') == false) {
                index+=1;
                updateSongData(audio, playList);
            }
            fwdBtnClicked = false;
        }
        if (bckBtnClicked == true) {
                if (bckBtn.classList.contains('notAllowed') == false) {
                    index-=1;
                    updateSongData(audio, playList);
                }
                bckBtnClicked = false;
        }
    }
}

const getSong = (playList) => {
    let audio = document.createElement('audio');
    audio.src = playList[index].url;
    selectSong(audio, playList);
    playSong(audio);
    stopSong(audio);
    nextSong(audio, playList);
    prevSong(audio, playList);
    updateSliderValue(audio);
    updateSongTime(audio);
}
const playSong = (audio) => {
    playBtn.addEventListener('click', ()=> {
        audio.play();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
    })
}
const stopSong = (audio) => {
    pauseBtn.addEventListener('click', ()=> {
        audio.pause();
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'block';
    })
}
const nextSong = (audio, playList) => {
    if (songSelected == true) {
        changeData(audio, playList);
    }
    else {
        audio.addEventListener('timeupdate', () => {
            if (audio.ended) {
                fwdBtnClicked = true;
                changeData(audio, playList);
            }
        })
        fwdBtn.addEventListener('click', () => {
            fwdBtnClicked = true;
            changeData(audio, playList);
        })
    }
}
const prevSong = (audio, playList) => {
    bckBtn.addEventListener('click', () => {
        bckBtnClicked = true;
        changeData(audio, playList);
    })
}
const selectSong = (audio, playList) => {
    playlistSongs.innerHTML = '';
    for (let song in playList) {
        let playlistSong = document.createElement('li');
        playlistSong.innerHTML = `${parseInt(song)+1}. ${playList[song].artist} - ${playList[song].title}`;
        playlistSongs.appendChild(playlistSong);
        playlistSong.addEventListener('click', () => {
            songSelected = true;
            index = parseInt(song);
            nextSong(audio, playList);
        })
    }
}
const updateSongData = (audio, playList) => {
    audio.pause();
    audio.src = `${playList[index].url}`;
    if (playBtn.style.display == 'none') audio.play();
    printData(playList);
}

const updateSliderValue = (audio) => {
    audio.addEventListener('timeupdate', () => {
        let getPer = Math.trunc((audio.currentTime)/(audio.duration)*100);
        progressBar.style.width = `${getPer}%`;
    })
}
const updateSongTime = (audio) => {
    audio.addEventListener('timeupdate', () => {
        let duration = document.getElementById('duration');
        let currentTime = document.getElementById('currentTime');
        let getSeconds = Math.trunc(audio.duration);
        let getMinutes = 0;
        let seconds = Math.trunc(audio.currentTime);
        let minutes = 0;
        while (seconds >= 60) {
            seconds -= 60;
            minutes+=1;
        }
        while (getSeconds > 60) {
            getSeconds-=60;
            getMinutes++;
        }
        isNaN(getSeconds) ? duration.innerHTML = '--:--' : getSeconds >=10 ? duration.innerHTML = `${getMinutes}:${getSeconds}` : duration.innerHTML = `${getMinutes}:0${getSeconds}`;
        seconds >= 10 ? currentTime.innerHTML = `${minutes}:${seconds}` : currentTime.innerHTML = `${minutes}:0${seconds}`;
        if (fwdBtn.classList.contains('notAllowed')) if (audio.ended) {
            audio.currentTime = 0;
            playBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        }
        slider.addEventListener('change', () => {
            progressBar.style.width = `${slider.value}%`;
            audio.currentTime = slider.value*audio.duration/100;
        })
    })
}
const checkBckBtnAllowed = (playList) => {
    playList[index-1] == undefined ? bckBtn.classList.add('notAllowed') : bckBtn.classList.remove('notAllowed');
    playList[index+1] == undefined ? fwdBtn.classList.add('notAllowed') : fwdBtn.classList.remove('notAllowed');
}
const showPlaylist = () => {
    playlist.addEventListener('click', () => {
        if (mediaQueryList.matches) {
            showingPlaylist == false ? (
                playlistSongs.classList.remove('hidden'),
                playlistSongs.classList.remove('show'),
                playlistSongs.classList.remove('hidden-mediaQuery'),
                playlistSongs.classList.add('show-mediaQuery'),
                playlistSongs.style.zIndex = '0',
                showingPlaylist = true
            ) 
            : (
                playlistSongs.classList.remove('hidden'),
                playlistSongs.classList.remove('show'),
                playlistSongs.classList.remove('show-mediaQuery'),
                playlistSongs.classList.add('hidden-mediaQuery'),
                setTimeout(() => {
                    playlistSongs.style.zIndex = '-10';
                    showingPlaylist = false;
                }, 200)
            )
        }
        else {
            showingPlaylist == false ? (
                playlistSongs.classList.remove('hidden-mediaQuery'),
                playlistSongs.classList.remove('show-mediaQuery'),
                playlistSongs.classList.remove('hidden'),
                playlistSongs.classList.add('show'),
                setTimeout(() => {   
                    playlistSongs.style.zIndex = '0';
                    showingPlaylist = true;
                }, 600)
            ) 
            : (
                playlistSongs.classList.remove('hidden-mediaQuery'),
                playlistSongs.classList.remove('show-mediaQuery'),
                playlistSongs.classList.remove('show'),
                playlistSongs.classList.add('hidden'),
                playlistSongs.style.zIndex = '-10',
                showingPlaylist = false
            )
        }
    })
}

const startMp3 = async () => {
    printData(await getData());
    getSong(await getData());
    showPlaylist();
}
startMp3();