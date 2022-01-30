const APIController = (function() {

    const clientId = 'd23df6ac090f487eac0d41530d6db8b7';
    const clientSecret = '741d0ba47cb5411ba427965bc971e5f4';

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const _getPlaylists = async (token, playlistId) => {
        const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists;
    }

    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {/////////
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getPlaylists(token, playlistId) {
            return _getPlaylists(token, playlistId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();


// UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        // selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                //genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail),
            }
        },

        // need methods to create select list option
        createPlaylist(id) {
            const html =
            `
            <div class="row col-sm-12 px-0">
                <iframe style="border-radius:12px;margin:50px;" src="https://open.spotify.com/embed/playlist/${id}?utm_source=generator" width="78%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
            </div>
            `;

            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create a track list group item
        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create the song detail
        createTrackDetail(id) {

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            console.log(id);
            detailDiv.innerHTML = '';

            const html =
            `
            <div class="row col-sm-12 px-0">
                <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${id}?utm_source=generator" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
            </div>
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },

        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    const countryIds = [
        '37i9dQZEVXbK4fwx2r07XW', '37i9dQZEVXbM1EaZ0igDlz', '37i9dQZEVXbND4ZYa46PaA',
        '37i9dQZEVXbKzoK95AbRy9', '37i9dQZEVXbMda2apknTqH', '37i9dQZEVXbLJ0paT1JkgZ',
        '37i9dQZEVXbL1Fl8vdBUba', '37i9dQZEVXbLKI6MPixefZ', '37i9dQZEVXbMw2iUtFR5Eq',
        '37i9dQZEVXbMPoK06pe7d6']; //choose 10
        //37i9dQZEVXbLJ0paT1JkgZ
    const countryNames = [
        'Top Songs - Australia', 'Top Songs - Austria',  'Top Songs - Belgium','Top Songs - Brazil','Top Songs - Canada', 'Top Songs - Chile','Top Songs - Colombia',
        'Top Songs - Czech Republic','Top Songs - Denmark','Top Songs - Dominican'];




    // get genres on page load
    const loadPlaylists = async () => {
        //get the token
        const token = await APICtrl.getToken();
        //store the token onto the page
        UICtrl.storeToken(token);
        //get the genres

        //const playlists = await APICtrl.getPlaylist(token,countryIds);

        const playlistSelect = document.getElementById('select_playlist');
        for(let i = 0; i < countryNames.length; i++){
            let opt = document.createElement("option");
            opt.value = countryIds[i];
            opt.text = countryNames[i];
            playlistSelect.add(opt,playlistSelect.options[i]);
        }
    }

    // create submit button click event listener
    DOMInputs.submit.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // clear tracks
        UICtrl.resetTracks();
        //get the token
        const token = UICtrl.getStoredToken().token;
        // get the playlist field
        const playlistField = UICtrl.inputField().playlist;
        // get track endpoint based on the selected playlist
        const playlistId = playlistField.options[playlistField.selectedIndex].value;
        //const currentPlaylist = await APICtrl.getPlaylists(token, tracksEndPoint);
        // get the list of tracks
        const plays = await APICtrl.getPlaylists(token, playlistId);
        console.log("************* hi" + playlistId);

        UICtrl.createPlaylist(playlistId);

        console.log("************* hi" + playlistId);

    });

    return {
        init() {
            console.log('App is starting');
            loadPlaylists();
        }
    }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();
