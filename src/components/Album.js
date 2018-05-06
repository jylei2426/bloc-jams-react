import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
   constructor(props) {
     super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      volume: 0,
      isPlaying: false

    };

     this.audioElement = document.createElement('audio');
     this.audioElement.src = album.songs[0].audioSrc;
   }

   componentDidMount() {
     this.eventListeners = {
     timeupdate: e => {
       this.setState({ currentTime: this.audioElement.currentTime });
     },
     durationchange: e => {
       this.setState({ duration: this.audioElement.duration });
     },
     volumechange: e => {
       this.setState({volume: this.audioElement.volume})
     }
   };

   this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
   this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
   this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
 }

 componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
  }



  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
     this.audioElement.pause();
     this.setState({ isPlaying: false });
   }

   setSong(song) {
     this.audioElement.src = song.audioSrc;
     this.setState({ currentSong: song });
   }

   handleSongClick(song) {
      const isSameSong = this.state.currentSong === song;
      if (this.state.isPlaying && isSameSong) {
      this.pause();
      } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
      }
    }

    handlePrevClick() {
     const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
     const newIndex = Math.max(0, currentIndex - 1);
     const newSong = this.state.album.songs[newIndex];
     this.setSong(newSong);
     this.play();
      }

    handleNextClick(){
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.max(0, currentIndex + 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
    }

    handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  formatTime(timeInSeconds){
    console.log("formatTime", timeInSeconds)
        if (typeof(timeInSeconds) === "number"){
        const min= Math.floor(timeInSeconds / 60);
        const sec= Math.floor(timeInSeconds % 60);
        if(sec < 10){
     			 return min + ":0" + sec;
     		} else{
     			 return min + ":" + sec;
          }
          } else {
     		return "-:--";
     		}

     }

    handleVolumeChange(e) {
     const newVolume = e.target.value;
     this.audioElement.volume = newVolume;
     this.setState({ volume: newVolume });
   }

   render() {
     return (
       <section className="album">
          <section id="album-info">
           <img id="album-cover-art" src={this.state.album.albumCover} alt="album art" />
           <div className="album-details">
           <h1 id="album-title">{this.state.album.title}</h1>
           <h2 className="artist">{this.state.album.artist}</h2>
           <div id="release-info">{this.state.album.releaseInfo}</div>
        </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <thead>
          <tr>
          <th> Track Number </th>
          <th> Title </th>
          <th> Duration </th>
          </tr>
          </thead>
          <tbody>
          {
            this.state.album.songs.map ( (song, index) =>
            <tr className="song" key={index} onClick={() => this.handleSongClick(song)} >
            <td className="song-actions">
               <button>
                  <span className="song-number">{index+1}</span>
                  <span className="ion-play"></span>
                  <span className="ion-pause"></span>
               </button>
            </td>
            <td className="song-title">{song.title}</td>
            <td className="song-duration">{song.duration}</td>
            </tr>
           )}
        </tbody>
      </table>
      <PlayerBar
         isPlaying={this.state.isPlaying}
         currentSong={this.state.currentSong}
         currentTime={this.audioElement.currentTime}
         duration={this.audioElement.duration}
         handleSongClick={() => this.handleSongClick(this.state.currentSong)}
         handlePrevClick={() => this.handlePrevClick()}
         handleNextClick={() => this.handleNextClick()}
         handleTimeChange={(e) => this.handleTimeChange(e)}
         formatTime ={(e) => this.formatTime(e)}
         handleVolumeChange={(e)=> this.handleVolumeChange(e)}

       />
     </section>
     );
   }
 }

export default Album;
