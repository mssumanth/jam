const clientID = 'bd9c09679b03459a87b3829062646f10';
const redirectURI = "http://jamming.sumanth.surge.sh/";
let accessToken='';
let expiresIn='';

let Spotify = {

    getAccessToken(){
        if(accessToken.length>0) {
            return accessToken;
        } else {
            let url = window.location.href;
            var token = url.match(/access_token=([^&]*)/);
            if(token !== null) {
                accessToken = token[0].split('=')[1];
                expiresIn = url.match(/expires_in=([^&]*)/)[0].split('=')[1];
                window.setTimeout(() => accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
            } else {
                let url = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
                window.location.assign(url);
            } 
        }
    },

    search(term) {
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {   
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => response.json()).then(jsonResponse => {
            if(jsonResponse.tracks){
                return jsonResponse.tracks.items.map(track => {
                    return {
                        id : track.id,
                        name : track.name,
                        artist : track.artists[0].name,
                        album : track.album.name,
                        uri : track.uri,
                        //PreviewUrl for the feature addition.
                        preview_url : track.preview_url
                    };
                });
            } else {
                return [];
            }
        });
    },

    savePlaylist(playlistName, trackURIs){
        if(playlistName === "" || playlistName === null || trackURIs.length === 0 || trackURIs === null){
            return;
        } 
        let headers = {'Authorization': `Bearer ${accessToken}`  };
        let userID = '';
        let playlistID = '';
        fetch("https://api.spotify.com/v1/me", {headers : headers}).then(
            response => response.json()).then(jsonResponse => {
                if(jsonResponse.id){
                    userID = jsonResponse.id;
                }
            }).then(() => {
                    fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
                    method: 'POST',
                    headers : {'Content-type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
                    body: JSON.stringify(
                        {'name': playlistName
                        }
                    )}).then(response => {
                        if(response.ok){
                            return response.json();
                        }
                        throw new Error("Request failed!");
                    }, networkError => {
                    }).then(jsonResponse => {
                        if(jsonResponse.id){
                            playlistID = jsonResponse.id;
                        }
                    }).then( () => {    
                        fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,{
                        method: 'POST',
                        headers : {'Content-type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
                        body: JSON.stringify(
                            {'uris': trackURIs
                            }
                        )}).then(response => {
                            if(response.ok){
                                return response.json();
                            }
                            throw new Error("Request failed!"+response.json());
                        }, networkError => {
                        }).then(jsonResponse => {
                            if(jsonResponse.id){
                                playlistID = jsonResponse.id;
                            }
                        })

                    })
                });
        
    }


}

Spotify.getAccessToken();


export default Spotify;