import Image from "next/image";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css'
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import { convertDurationToTimeString } from "../../utils/convertDurationtoTimeString";
import styles from "./styles.module.scss";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const { 
    episodeList, 
    currentEpisodeIndex,
    isPlaying, 
    isLooping,
    toggleLoop,
    togglePlay,
    setPlayingState,
    playNext,
    toggleShuffle,
    isShuffling,
    playPrevious} = usePlayer();
  const episode = episodeList[currentEpisodeIndex]

  useEffect(() => {
    if (!audioRef.current){
      return;
    }
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressListener(){
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando Agora" />
        <strong>Tocando Agora </strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361'}}
                railStyle={{ backgroundColor: '#9f75ff'}} 
                handleStyle={{borderColor: '#04d361', borderWidth: 4 }} />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio 
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        ) } 


        <div className={styles.buttons}>
          <button type="button" disabled={!episode} onClick={toggleShuffle} className={isShuffling? styles.isActive : ''}  >
            <img src="/shuffle.svg" alt="Shuffle" />
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode}>
            <img src="/play-previous.svg" alt="Prev" />
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            { isPlaying 
            ? <img src="/pause.svg" alt="Pause" />
            : <img src="/play.svg" alt="Play" />
            }
          </button>
          <button type="button" onClick={playNext} disabled={!episode}>
            <img src="/play-next.svg" alt="Next" />
          </button>
          <button type="button" onClick={toggleLoop} className={isLooping? styles.isActive : ''} disabled={!episode}>
            <img src="/repeat.svg" alt="Repeat" />
          </button>
        </div>
      </footer>
    </div>
  );
}