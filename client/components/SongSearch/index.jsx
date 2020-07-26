import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import SongOption from '../SongOption';
import './index.css';
import { useSelector } from 'react-redux';

const SongSearch = props => {
  const [songName, setSongName] = useState('');
  const [songResults, setSongResults] = useState([]);
  const songQueue = useSelector(state => state.songQueue);

  // useEffect to pass songs down to SongOption component
  useEffect(() => {}, [songResults]);

  function handleChange(e) {
    setSongName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Functionality to search for song
    const accessToken = Cookies.get('accessToken');
    const data = { token: accessToken, searchQuery: songName };

    fetch('/api/v1/spotify/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(response => {
        const songOptions = [];
        for (let i = 0; i < response.length; i += 1) {
          const track = response[i].name;
          const artist = response[i].artists[0].name;
          const length = Math.floor(response[i].duration_ms / 1000);
          const thumbnail = response[i].album.images[0].url;
          const uri = response[i].uri;
          songOptions.push(
            <SongOption
              roomId={props.roomId}
              track={track}
              artist={artist}
              length={length}
              thumbnail={thumbnail}
              uri={uri}
              key={`songOption${i}`}
            />
          );
        }
        setSongResults(songOptions);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  return (
    <div className="songSearch-container">
      <div className="songSearch-container-dummy-X">
        <span>X</span>
      </div>
      <div className="songSearch-results-container">
        <h2 className="songSearch-header">Browse Music</h2>
        <form className="songSearch-form" onSubmit={handleSubmit}>
          <input
            type="text"
            id="searchbar"
            placeholder="Enter Song"
            value={songName}
            onChange={handleChange}
            className="songSearch-bar"
          />
          <input className="songSearch-submit" type="submit" value="SEARCH" />
        </form>
        {songResults}
      </div>
      <div className="songSearch-queue-container">
        <h3 className="songSearch-queue-header">Queue</h3>
        <p className="songSearch-queue-linebreak"></p>
        {songQueue.data.map(song => {
          return <p className="songSearch-queue-item">{song.track}</p>;
        })}
      </div>
    </div>
  );
};

export default SongSearch;
