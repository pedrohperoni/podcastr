import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}


export function PlayerContextProvider({ children } : PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function toggleLoop(){
      setIsLooping(!isLooping)
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }

  function playNext(){
      const nextEpisodeIndex = currentEpisodeIndex + 1;
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      if (isShuffling){
        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if(nextEpisodeIndex < episodeList.length){
          setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
  }

  function playPrevious(){
    if(currentEpisodeIndex > 0){
       setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
   }

  return(
    <PlayerContext.Provider 
        value={{
            episodeList, 
            currentEpisodeIndex, 
            play, 
            isPlaying, 
            togglePlay, 
            setPlayingState,
            playList,
            playNext,
            playPrevious,
            isLooping,
            toggleLoop,
            toggleShuffle,
            isShuffling,
        }}>
        {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}