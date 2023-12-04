let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_artist = document.querySelector('.track-artist');
let track_title = document.querySelector('.track-title');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let curr_track = document.createElement('audio');
let cover_cd = document.querySelector('.cover-cd');
let wave = document.getElementById('wave');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
    {
        img : 'https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages126/v4/ea/c1/e8/eac1e88f-a515-f679-c2e3-ae6cae2c4303/3b7fdb91-3d2e-4b53-9b7a-ef1c39f18cea_ami-identity-f6e441ca8bf36b9a475ea669b4b87be7-2023-04-14T22-56-21.301Z_cropped.png/375x375bb.jpg',
        artist : 'Post Malone',
        title : 'Enough Is Enough',
        music : 'https://drive.google.com/uc?export=download&id=1x8Fotw3sy0dzp_PEa7P0t40Vd5e2HuLY'
    },
    {
        img : 'https://schmusa.de/wp-content/uploads/2023/07/Calvin-Harris-Sam-Smith-Desire.jpg',
        artist : 'Calvin Harris, Sam Smith',
        title : 'Desire',
        music : 'https://drive.google.com/uc?export=download&id=1bGBYCdoO2HJ7s2d1eNK4nNsGU6CG0FaD'
    },
    {
        img : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxvurTm4UgHlnBF8lvonPlcOWTky1yKUBTw&usqp=CAU',
        artist : 'Taylor Swift',
        title : 'Anti-Hero',
        music : 'https://drive.google.com/uc?export=download&id=19LoRBPxJOSUa6a43sz03N28yBMIN4wlH'
    },
    {
        img : 'https://static.wikia.nocookie.net/taylorswifts/images/c/c4/Cruel_Summer.jpg',
        artist : 'Taylor Swift',
        title : 'Cruel Summer',
        music : 'https://drive.google.com/uc?export=download&id=1gfCSCxU_eMabaqj5tfCJghAx2h48rQWn'
    },
    {
        img : 'https://i.discogs.com/vYTMIzdBOUegnf7GG9d_wDNYZvPuBU_HZdIb60NZMDs/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE5NTc1/OTI4LTE2MjY4OTQ4/MDktMzQ2NS5wbmc.jpeg',
        artist : 'STAY',
        title : 'The Kid LAROI, Justin Bieber',
        music : 'https://drive.google.com/uc?export=download&id=1uhF0AO0iiokCm9nDKsy0_6MF3HeXgP9x'
    }
];

loadTrack(track_index);

function loadTrack(track_index){
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_artist.textContent = music_list[track_index].artist;
    track_title.textContent = music_list[track_index].title;
    now_playing.textContent = "Song " + (track_index + 1) + " of " + music_list.length;

    updateTimer = setInterval(setUpdate, 1000);
    curr_track.addEventListener('ended', nextTrack);
}
function reset(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}
function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack(){
    curr_track.play();
    isPlaying = true;
    cover_cd.classList.add('rotate');
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
    cover_cd.classList.remove('rotate');
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
function nextTrack(){
    if(track_index < music_list.length - 1 ){
        track_index += 1;
    }else{
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}
function prevTrack(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    playTrack();
}
function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}
function setUpdate(){
    let seekPosition = 0;
    if(!isNaN(curr_track.duration)){
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

// FETCHING API DATA START
async function fetchLyrics() {
    const geniusApiKey = '03e320bdd9msh8a19d2028156207p15ffaajsn46a0c04bd8ee';
    const geniusUrl = 'https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=2396871';

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': geniusApiKey,
            'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(geniusUrl, options);
        const data = await response.json();
        const lyricsBody = data.lyrics.lyrics.body.html;
        updateLyrics(lyricsBody);
    } catch (error) {
        console.error(error);
    }
}

function updateLyrics(lyricsBody) {
    const lyricsPanel = document.querySelector('.lyrics_pannel');
    lyricsPanel.innerHTML = lyricsBody;
}

async function fetchOtherAlbums() {
    const spotifyApiKey = '03e320bdd9msh8a19d2028156207p15ffaajsn46a0c04bd8ee';
    const artistId = '2w9zwq3AktTeYYMuhMjju8';
    const spotifyUrl = `https://spotify23.p.rapidapi.com/artist_albums/?id=${artistId}&offset=0&limit=100`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': spotifyApiKey,
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(spotifyUrl, options);
        const data = await response.json();
        const albums = data.data.artist.discography.albums.items;
        updateOtherAlbums(albums);
    } catch (error) {
        console.error(error);
    }
}

function updateOtherAlbums(albums) {
    const otherAlbumsPanel = document.querySelector('.album-pannel');
    otherAlbumsPanel.innerHTML = '';

    albums.forEach((album) => {
        const albumContainer = document.createElement('div');
        albumContainer.classList.add('album');

        const albumLink = document.createElement('a');
        albumLink.href = album.releases.items[0].sharingInfo.shareUrl;
        albumLink.target = '_blank';
        albumContainer.appendChild(albumLink);

        const albumImage = document.createElement('img');
        albumImage.src = album.releases.items[0].coverArt.sources[0].url;
        albumLink.appendChild(albumImage);

        const albumName = document.createElement('p');
        albumName.textContent = album.releases.items[0].name;
        albumContainer.appendChild(albumName);

        const albumYear = document.createElement('p');
        albumYear.textContent = album.releases.items[0].date.year;
        albumContainer.appendChild(albumYear);

        otherAlbumsPanel.appendChild(albumContainer);
    });
}

async function fetchRelatedArtists() {
    const spotifyApiKey = '03e320bdd9msh8a19d2028156207p15ffaajsn46a0c04bd8ee';
    const artistId = '2w9zwq3AktTeYYMuhMjju8';
    const spotifyUrl = `https://spotify23.p.rapidapi.com/artist_related/?id=${artistId}`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': spotifyApiKey,
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(spotifyUrl, options);
        const data = await response.json();
        const relatedArtists = data.artists;
        updateRelatedArtists(relatedArtists);
    } catch (error) {
        console.error(error);
    }
}

function updateRelatedArtists(relatedArtists) {
    const relatedArtistsPanel = document.querySelector('.artist-pannel');
    relatedArtistsPanel.innerHTML = '';

    relatedArtists.forEach((artist) => {
        const artistContainer = document.createElement('div');
        artistContainer.classList.add('artist');

        const artistLink = document.createElement('a');
        artistLink.href = artist.external_urls.spotify;
        artistLink.target = '_blank';
        artistContainer.appendChild(artistLink);

        const artistImage = document.createElement('img');
        artistImage.src = artist.images[2].url;
        artistLink.appendChild(artistImage);

        const artistName = document.createElement('p');
        artistName.textContent = artist.name;
        artistContainer.appendChild(artistName);

        relatedArtistsPanel.appendChild(artistContainer);
    });
}


function init() {
    fetchLyrics();
    fetchOtherAlbums();
    fetchRelatedArtists();
}

document.addEventListener('DOMContentLoaded', init);


const show_pannel = (pannel_content) => {
    const pannels = document.getElementsByClassName("pannel");
    for (let i = 0; i < pannels.length; i++) {
        pannels[i].style.display = "none";
    }

    const categoryElement = document.getElementById(pannel_content);
    if (categoryElement) {
        categoryElement.style.display = "block";
    }
};

const sliders = document.querySelectorAll('.album-pannel, .artist-pannel');

let mouseDown = false;
let startX, scrollLeft;

let startDragging = function (e) {
  mouseDown = true;
  startX = e.pageX - this.offsetLeft;
  scrollLeft = this.scrollLeft;
};

let stopDragging = function (event) {
  mouseDown = false;
};

sliders.forEach(slider => {
  slider.addEventListener('mousemove', (e) => {
    e.preventDefault();
    if (!mouseDown) { return; }
    const x = e.pageX - slider.offsetLeft;
    const scroll = x - startX;
    slider.scrollLeft = scrollLeft - scroll;
  });

  slider.addEventListener('mousedown', startDragging, false);
  slider.addEventListener('mouseup', stopDragging, false);
  slider.addEventListener('mouseleave', stopDragging, false);
});
