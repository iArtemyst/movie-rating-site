'use client'

import React, { useEffect, useState, useMemo } from "react";
import { IDailyMovieInformation, IMovieInformation } from "./components/movie-interfaces";
import { IPlayerStats, newPlayerStats } from "./components/player-stats";
import { FetchMovieData } from "./components/fetch-movie-data";
import { MovieInfoDiv } from "./components/movie-info-div";
import { UpdatePlayerScoreBasedOnRating } from "./components/compare-movie-scores";
import { IncrementArrayIndex } from "./components/increment-array-index";
import { GalleryProgressDots } from "./components/gallery-progress-dots";
import { LoadingAsset, LoadingPage } from "./components/loading";
import { ScoreComparisonDiv } from "./components/score-comparison-div";
import { TodaysFinalScoreScreen } from "./components/score-graph";
import { moviePointValues } from "./components/movie-interfaces";
import * as testing from "./components/testing-functions"
import * as lstorage from "./components/local-data-storage";

//------------------------------------------------------------------------

const minRatingArray = [0, 0, 0];
const maxRatingArray = [10, 100, 100];
const middleRatingArray = [5, 50, 50];
const stepAmount = [0.1, 1, 1,];
const ratingsSelection: number = 0; // 0 = IMDB, 1 = Metascore, 2 = Rotten Tomatoes
const movieRatingHubText = [
  "IMDB",
  "Rotten Tomatoes",
  "Metacritic",
];

//------------------------------------------------------------------------

export default function Home() {
  const [serverMovieInfoArray, setServerMovieInfoArray] = useState<IMovieInformation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentRating, setCurrentRating] = useState(middleRatingArray[ratingsSelection]);
  const [currentMovieScoreScreenVisibility, setCurrentMovieScoreScreenVisibility] = useState(false);
  const [localPlayerData, setLocalPlayerData] = useState<IPlayerStats | null>(null);
  const [movieDataLoaded, setMovieDataLoaded] = useState(false);

  function getLocalPlayerData() {
    let localDataResult = lstorage.loadLocalPlayerStats();
    if (!localDataResult) {
      console.log("no current local stats: saving new player stats")
      lstorage.SavePlayerStats(newPlayerStats)
      setLocalPlayerData(newPlayerStats)
      return newPlayerStats
    } else {
      console.log("local data found:");
      console.log(localDataResult);
      setLocalPlayerData(localDataResult)
      return localDataResult;
    }
  }

  useEffect(() => {
    let fn = async () => {
      let result: IDailyMovieInformation = await FetchMovieData();

      // Movie info
      setServerMovieInfoArray(result.movies)
      setCurrentRating(middleRatingArray[result.movies[0].RandomRatingInt])

      // Current day
      let tempPlayerStats: IPlayerStats = getLocalPlayerData();
      if (tempPlayerStats.localGameIndex !== result.dailyId) {
        tempPlayerStats.hasPlayedToday = false;
        tempPlayerStats.localGameIndex = result.dailyId;
        tempPlayerStats.todaysScore = 0
        console.log("Resetting Daily Stats")
        console.log(tempPlayerStats)
      }

      setLocalPlayerData(tempPlayerStats)
      setMovieDataLoaded(true);
      lstorage.SavePlayerStats(tempPlayerStats)
    }

    if (!movieDataLoaded) {
      fn();
    }
  }, [serverMovieInfoArray, currentRating, localPlayerData, movieDataLoaded]);

  function CheckPlayerPerfectScore(playerStats:IPlayerStats) {
    const arrayLength = serverMovieInfoArray.length;
    const maxIndvMovieScore = moviePointValues[0];
    const perfectScoreValue = ( maxIndvMovieScore * arrayLength );
    if ( playerStats.todaysScore === perfectScoreValue ) {
      playerStats.totalPerfectGames += 1
    }
  }

  function SavePlayerStatsUponComplete({playedToday, playerStats}:{playedToday: boolean, playerStats:IPlayerStats}) {
    playerStats.totalGamesPlayed += 1;
    CheckPlayerPerfectScore(playerStats)
    setLocalPlayerData(prev => {
      const updated = prev ? { ...prev, hasPlayedToday: playedToday } : { ...newPlayerStats, hasPlayedToday: playedToday };
      lstorage.SavePlayerStats(updated);
      return updated;
    });
  }


  function SubmitRatingButton({currentPlayerMovieRating, playerStats}:{currentPlayerMovieRating: number, playerStats:IPlayerStats | null}) {    
    function SubmitRatingOnClick() {
      if (playerStats) {
        UpdatePlayerScoreBasedOnRating({ratingSourceInt:serverMovieInfoArray[selectedIndex].RandomRatingInt, movieRatingString:serverMovieInfoArray[selectedIndex].RatingValue, playerMovieRating:currentPlayerMovieRating, playerStats:playerStats})
        lstorage.SavePlayerStats(playerStats)
      }
      setCurrentMovieScoreScreenVisibility(true)
    }
    return (
      <>
        <div onClick={() => SubmitRatingOnClick()} className="submitButton">
            <p>SUBMIT RATING</p>
        </div>
      </>
    )
  }

  function UpdateToNextMovie() {
    const newIndex: number | null = IncrementArrayIndex({ currentIndex: selectedIndex, arrayLength: serverMovieInfoArray.length - 1 })
    if (newIndex) {
      setSelectedIndex(newIndex)
      setCurrentMovieScoreScreenVisibility(false)
      setCurrentRating(middleRatingArray[serverMovieInfoArray[newIndex].RandomRatingInt])
    }
    else {
      setSelectedIndex(0)
      setCurrentMovieScoreScreenVisibility(false)
      setCurrentRating(middleRatingArray[serverMovieInfoArray[0].RandomRatingInt])
      if (localPlayerData) {
        SavePlayerStatsUponComplete({playedToday:true, playerStats:localPlayerData})
      }
    }
  }


  if (!movieDataLoaded) 
  {
    return <LoadingPage text="Trying to load Movie Data From Server..." />
  }
  else
  {
    return (
        <main className="font-sans grid grid-cols-1 items-center place-items-center h-[100dvh] w-[100dvw] touch-none">
          <div className="w-fit h-fit lg:max-w-[840px] md:max-w-[640px] xl:max-w-[960px] flex flex-col p-[24px]">
            <div className="mainQuestionDiv">
              <p >What do you think</p>
              <p className={`movieTitleText`}>{serverMovieInfoArray[selectedIndex].Title} ({serverMovieInfoArray[selectedIndex].Year})</p>
              <p >is rated on {movieRatingHubText[serverMovieInfoArray[selectedIndex].RandomRatingInt]}?</p>
            </div>
            <MovieInfoDiv movie={serverMovieInfoArray[selectedIndex]}/>
            <input type="range" name="ratingSlider" id="ratingSlider"
                    min={minRatingArray[serverMovieInfoArray[selectedIndex].RandomRatingInt]} 
                    max={maxRatingArray[serverMovieInfoArray[selectedIndex].RandomRatingInt]}
                    step={stepAmount[serverMovieInfoArray[selectedIndex].RandomRatingInt]}
                    value={currentRating}
                    onChange={(e) => setCurrentRating(parseFloat(e.target.value))}
                    className={`ratingSliderStyle
                                    [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[#ececec] [&::-webkit-slider-runnable-track]:h-auto [&::-webkit-slider-runnable-track]:inset-shadow-[2px_2px_4px_#00000020,-2px_-2px_4px_#00000020] transition-all duration-500
                                    [&::-moz-range-track]:appearance-none [&::-moz-range-track]:bg-[#ececec] [&::-moz-range-track]:h-[1.5em] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:inset-shadow-[2px_2px_4px_#00000020,-2px_-2px_4px_#00000020]
                                    [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-[#00ff73] [&::-moz-range-thumb]:h-[3em] [&::-moz-range-thumb]:w-[1em] [&::-moz-range-thumb]:scale-[125%] [&::-moz-range-thumb]:hover:scale-[150%] [&::-moz-range-thumb]:active:scale-[175%] [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0px_0px_8px_#00000040]
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00ff73] [&::-webkit-slider-thumb]:shadow-[0px_0px_8px_#00000040] [&::-webkit-slider-thumb]:scale-[125%]  [&::-webkit-slider-thumb]:hover:scale-[150%] [&::-webkit-slider-thumb]:active:scale-[175%]`}/>
            <label htmlFor="ratingSlider" className="sliderLabelText">Your Rating: {currentRating}</label>
            <SubmitRatingButton currentPlayerMovieRating={currentRating} playerStats={localPlayerData}/>
            <GalleryProgressDots selectedIndex={selectedIndex}/>
            <ScoreComparisonDiv 
              ratingSourceInt={serverMovieInfoArray[selectedIndex].RandomRatingInt} 
              actualMovieRating={serverMovieInfoArray[selectedIndex].RatingValue} 
              playerMovieRating={currentRating} 
              playerStats={localPlayerData}
              visible={currentMovieScoreScreenVisibility}
              onNextMovie={UpdateToNextMovie}
              /> 
            <TodaysFinalScoreScreen visible={localPlayerData?.hasPlayedToday ?? false} playerStats={localPlayerData}/>
          </div>
        </main>
    );
  }
}