const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const play = document.getElementById('play');
const cover = document.getElementById('cover');
const likeButton = document.getElementById('like');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

const change = {
    songName: 'Change',
    artist: 'Viland Saga',
    cover: 'cover-1',
    file: 'CHANGE',
    liked: true
};
const hereWithoutYou = {
    songName: 'Here Without You',
    artist: 'Three Doors Down',
    cover: 'cover-2',
    file: 'Here Without You',
    liked: false
};
const royalty = {
    songName: 'Royalty',
    artist: 'Zgod',
    cover: 'cover-3',
    file: 'Royalty',
    liked: false
};

let isPlayng = false;
let isShuffled = false;
let repeatOn = false;
const playlist = JSON.parse(localStorage.getItem('playlist')) ?? [change, hereWithoutYou, royalty];
let sortedPlaylist = [...playlist];

let index = 0;

function playSong (){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');  
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');  
    song.play();
    isPlayng = true;
}
function pauseSong (){
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    play.querySelector('.bi').classList.add('bi-play-circle-fill');      
    song.pause();
    isPlayng = false;
}

function playPauseDecider(){
    if (isPlayng === true) {
        pauseSong();
    }
    else {
        playSong();
    }
}

function incializeSong(){
    cover.src = `images/${sortedPlaylist[index].cover}.jpg`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function previousSong(){
    if(index === 0) {
        index = sortedPlaylist.length -1;
    }
    else{
        index -=1;
    }
    incializeSong();
    playSong();
}

function nextSong(){
    if(index === sortedPlaylist.length) {
        index = 0;
    }
    else{
        index +=1;
    }
    incializeSong();
    playSong();
}

function updateProgress (){
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty(`--progress`,`${barWidth}%`);
}
    

function jumpTo(){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const JumpToTime = (clickPosition/width)*song.duration;
    song.currentTime = JumpToTime;
}

function shuffleArray(preShuffleArray){
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0){
        let randomIndex = Math.floor(Math.random()*size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -=1;
    }
}

function shuffleButtonClicked(){
    if(isShuffled == false){
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    }
    else{
        isShuffled = false;
        shuffleArray(...playlist);
        shuffleButton.classList.remove('button-active');
    }
}

function repeatButtonClicked() {
    if (repeatOn === false) {
        repeatOn = true;
        repeatButton.querySelector('.bi').classList.remove('bi-repeat');
        repeatButton.querySelector('.bi').classList.add('bi-repeat-1');
        repeatButton.querySelector('.bi').classList.add('button-active');
    } else {
        repeatOn = false;
        repeatButton.querySelector('.bi').classList.add('bi-repeat');
        repeatButton.querySelector('.bi').classList.remove('bi-repeat-1');
       
        repeatButton.querySelector('.bi').classList.remove('button-active');
    } 
}

function nextOrRepeat () {
    if(repeatOn == false){
        nextSong ();
    } else {
        playSong ();

    }
}

function toHHMMSS(originalNumber){
    let hours = Math.floor(originalNumber/3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

    return `${hours.toString().padStart(2, '0')}:${min.toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, "0")}`;
}

function updateCurrentProgress () {
    songTime.innerText = toHHMMSS(song.currentTime);
}

function updateTotalTime () {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonRender() {
    if (sortedPlaylist[index].liked === true) {
      likeButton.querySelector('.bi').classList.remove('bi-heart');
      likeButton.querySelector('.bi').classList.add('bi-heart-fill');
      likeButton.classList.add('button-active');
    } else {
      likeButton.querySelector('.bi').classList.add('bi-heart');
      likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
      likeButton.classList.remove('button-active');
    }
  }

function likeButtonClicked () {
    if (sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true;
    } else {
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist',JSON.stringify(playlist));
}

incializeSong();

play.addEventListener('click',playPauseDecider);
previous.addEventListener('click',previousSong);
next.addEventListener('click',nextSong);
song.addEventListener('timeupdate',updateProgress);
song.addEventListener('ended',nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
song.addEventListener('timeupdate',updateCurrentProgress);
progressContainer.addEventListener('click',jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click',repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);

