import React, {Component} from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends Component{
    constructor(props){
        super(props);
    }

    render() {
        return(
            <div className="SearchResults">
            <h2>Results</h2>
            {/*<!-- Add a TrackList component -->*/}
            <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} isRemoval={false}/>
            </div>
        );
    }
}

export default SearchResults;