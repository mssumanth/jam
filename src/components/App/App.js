import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import '../SearchBar/SearchBar.css';
import SearchResults from '../SearchResults/SearchResults';
import '../SearchResults/SearchResults.css';
import Playlist from '../Playlist/Playlist';
import '../Playlist/Playlist.css';
import Spotify from '../../util/Spotify'

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchResults : [],
            playlistName : '',
            playlistTracks : []
        }
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack(track){
        if(this.state.playlistTracks.find(savedTrack =>
            savedTrack.id === track.id)){
                return;
        } else {
            let tracks=this.state.playlistTracks;
            tracks.push(track);
            this.setState({
                playlistTracks : tracks
            })
        }
    }

    removeTrack(track){
        let tracks = this.state.playlistTracks.filter(savedTrack => {
            return savedTrack.id !== track.id
        });
        this.setState({
            playlistTracks: tracks
        })
    }

    updatePlaylistName(name){
        this.setState({
            playlistName: name
        })
    }

    savePlaylist(){
        let trackURIs = this.state.playlistTracks.map(track => {
            return track.uri
        });
        Spotify.savePlaylist(this.state.playlistName, trackURIs);
        this.updatePlaylistName('New Playlist');
        this.setState({
            playlistTracks: []
        })
    }

    search(term){
        Spotify.search(term).then(tracks => {
            this.setState({
                searchResults: tracks
            })
          });
    }


    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    {/*<!-- Add a SearchBar component -->*/}
                    <SearchBar onSearch={this.search}/>
                    <div className="App-playlist">
                    {/*<!-- Add a SearchResults component -->*/}
                    <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
                    {/*<!-- Add a Playlist component -->*/}
                    <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} 
                    onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/> 
                    </div>
                </div>
            </div>
        );
    }
}

export default App;