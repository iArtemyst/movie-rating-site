'use client'

import React, { useEffect, useState } from "react";
import { IDailyMovieInformation, IMovieInformation } from "./components/movie-interfaces";
import { IPlayerStats, newPlayerStats } from "./components/player-stats";
import { FetchMovieData } from "./components/fetch-movie-data";
import { MovieInfoDiv } from "./components/movie-info-div";
import { UpdatePlayerScoreBasedOnRating } from "./components/compare-movie-scores";
import { IncrementArrayIndex } from "./components/increment-array-index";
import { GalleryProgressDots } from "./components/gallery-progress-dots";
import { LoadingPage } from "./components/loading";
import { ScoreComparisonDiv } from "./components/score-comparison-div";
import { TodaysFinalScoreScreen } from "./components/score-graph";
import { moviePointValues } from "./components/movie-interfaces";
import * as lstorage from "./components/local-data-storage";
import { SwitchThemeButton, enableDarkMode, enableLightMode } from "./components/theme-switch-button";

const minRatingArray = [0, 0, 0];
const maxRatingArray = [10, 100, 100];
const middleRatingArray = [5.0, 50, 50];
const stepAmount = [0.1, 1, 1,];
const ratingsSelection: number = 0; // 0 = IMDB, 1 = Metascore, 2 = Rotten Tomatoes
const movieRatingHubText = [
  "IMDB",
  "Rotten Tomatoes",
  "Metacritic",
];

function SiteFooter() {
  function ShowAboutDiv() {
    alert("Daily Movie Rating\n\nA daily game where you rate movies based on their actual ratings from popular movie rating sites!\n\nData provided by the OMDB API.\n\nDesigned and Developed by iArtemyst.");
  }
  
  return (
      <div className="siteFooterDiv" onClick={(() => ShowAboutDiv())}>
        <p>Daily Movie Rating © 2025 | Designed by iArtemyst</p>
        <p>Data Updated Dec. 2025</p>
      </div>
    )
}

export default function Home() {
  const [serverMovieInfoArray, setServerMovieInfoArray] = useState<IMovieInformation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentRating, setCurrentRating] = useState(middleRatingArray[ratingsSelection]);
  const [currentMovieScoreScreenVisibility, setCurrentMovieScoreScreenVisibility] = useState(false);
  const [localPlayerData, setLocalPlayerData] = useState<IPlayerStats | null>(null);
  const [movieDataLoaded, setMovieDataLoaded] = useState(false);

  useEffect(() => {
    const fn = async () => {
      const result: IDailyMovieInformation = await FetchMovieData();

      // Movie info
      setServerMovieInfoArray(result.movies)
      setCurrentRating(middleRatingArray[result.movies[0].RandomRatingInt])

      // Current day
      const tempPlayerStats: IPlayerStats = getLocalPlayerData();
      if (tempPlayerStats.localGameIndex !== result.dailyId) {
        tempPlayerStats.hasPlayedToday = false;
        tempPlayerStats.localGameIndex = result.dailyId;
        tempPlayerStats.todaysScore = 0;
        tempPlayerStats.todaysMovieRatings = [];
        console.log("Resetting Daily Stats")
        console.log(tempPlayerStats)
      }
      if (tempPlayerStats.playerTheme === 'light') {
        enableLightMode({playerStats:tempPlayerStats});
      } else {
        enableDarkMode({playerStats:tempPlayerStats});
      }

      // Check if partially through today's game
      if (tempPlayerStats.todaysMovieRatings.length < result.movies.length) {
        console.log("Partially completed game found for today, resuming...")
        setSelectedIndex(tempPlayerStats.todaysMovieRatings.length);
        setCurrentRating(middleRatingArray[result.movies[tempPlayerStats.todaysMovieRatings.length].RandomRatingInt])
      }

      setLocalPlayerData(tempPlayerStats)
      setMovieDataLoaded(true);
      lstorage.SavePlayerStats(tempPlayerStats)
    }

    if (!movieDataLoaded) {
      fn();
    }
  }, [serverMovieInfoArray, currentRating, localPlayerData, movieDataLoaded]);

  //------------------------------------------------------------------------

  function getLocalPlayerData() {
    const localDataResult = lstorage.loadLocalPlayerStats();
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

  //------------------------------------------------------------------------

  if (!movieDataLoaded) 
  {
    return <LoadingPage text="Could not load movie data from server. Please try again." />
  }
  else
  {
    return (
        <main className="mainPage">
          <div className="mainContainer">
            <div className="contentContainer">
              <div className="mainQuestionDiv">
                <p >What do you think</p>
                <p className={`movieTitleText`}>{serverMovieInfoArray[selectedIndex].Title} ({serverMovieInfoArray[selectedIndex].Year})</p>
                <p >is rated on {movieRatingHubText[serverMovieInfoArray[selectedIndex].RandomRatingInt]}?</p>
              </div>
              <MovieInfoDiv movie={serverMovieInfoArray[selectedIndex]}/>
              <div className="controllerContentContainer">
                <div className="sliderContainer">
                  <input type="range" name="ratingSlider" id="ratingSlider"
                          min={minRatingArray[serverMovieInfoArray[selectedIndex].RandomRatingInt]} 
                          max={maxRatingArray[serverMovieInfoArray[selectedIndex].RandomRatingInt]}
                          step={stepAmount[serverMovieInfoArray[selectedIndex].RandomRatingInt]}
                          value={currentRating}
                          onChange={(e) => setCurrentRating(parseFloat(e.target.value))}
                          className={`ratingSliderStyle`}/>
                  <label htmlFor="ratingSlider" className="sliderLabelText">Your Rating: {(serverMovieInfoArray[selectedIndex].RandomRatingInt === 0) ? Number(currentRating).toFixed(1) : currentRating}</label>
                </div>
                <SubmitRatingButton currentPlayerMovieRating={currentRating} playerStats={localPlayerData}/>
                <GalleryProgressDots selectedIndex={selectedIndex}/>
                </div>
            </div>
            <ScoreComparisonDiv 
              ratingSourceInt={serverMovieInfoArray[selectedIndex].RandomRatingInt} 
              actualMovieRating={serverMovieInfoArray[selectedIndex].RatingValue} 
              playerMovieRating={currentRating} 
              playerStats={localPlayerData}
              visible={currentMovieScoreScreenVisibility}
              onNextMovie={UpdateToNextMovie}
              /> 
            <TodaysFinalScoreScreen movies={serverMovieInfoArray} visible={localPlayerData?.hasPlayedToday ?? false} playerStats={localPlayerData}/>
            <SwitchThemeButton playerStats={localPlayerData ?? newPlayerStats}/>
            <SiteFooter />
          </div>
        </main>
    );
  }
}