'use client'

import React, { useEffect, useState } from "react";
import { IDailyMovieInformation, IMovieInformation, ratingStringEndings } from "./components/movie-interfaces";
import { IPlayerStats, newPlayerStats } from "./components/player-stats";
import { FetchMovieData } from "./components/fetch-movie-data";
import { MovieInfoDiv } from "./components/movie-info-div";
import { UpdatePlayerScoreBasedOnRating, CheckPlayerPerfectScore } from "./components/compare-movie-scores";
import { IncrementArrayIndex } from "./components/increment-array-index";
import { LoadingPage } from "./components/loading";
import { ScoreComparisonDiv } from "./components/score-comparison-div";
import { TodaysFinalScoreScreen } from "./components/score-graph";
import * as lstorage from "./components/local-data-storage";
import { enableDarkMode, enableLightMode } from "./components/theme-switch-button";
import { GalleryProgressDots } from "./components/gallery-progress-dots";
import { SiteFooter } from "./components/site-footer";
import { MovieTitleAndSourceLogoContainer } from "./components/movie-title-source-logo";
import { PostPlayerScoreData } from "./components/post-player-score-data";
import { IAverageDailyPlayerScore, FetchAverageScoreData } from "./components/average-score-data";
import { pickWiiRLogo } from "./components/movie-source-logos";
import { LazyImageCoreSizer } from "./components/load-asset";

const minRatingArray = [0, 0, 0];
const maxRatingArray = [10, 100, 100];
const middleRatingArray = [5.0, 50, 50];
const stepAmount = [0.1, 1, 1,];

//---------------------------------------------------------

export default function Home() {
  const [serverMovieInfoArray, setServerMovieInfoArray] = useState<IMovieInformation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentRating, setCurrentRating] = useState(middleRatingArray[0]);
  const [currentMovieScoreScreenVisibility, setCurrentMovieScoreScreenVisibility] = useState(false);
  const [localPlayerData, setLocalPlayerData] = useState<IPlayerStats | null>(null);
  const [movieDataLoaded, setMovieDataLoaded] = useState(false);
  const [averageCommunityScores, setAverageCommunityScores] = useState<IAverageDailyPlayerScore | null>(null)

  useEffect(() => {
    const fn = async () => {
      const result: IDailyMovieInformation = await FetchMovieData();
      const communityScoresResult: IAverageDailyPlayerScore | null = await FetchAverageScoreData();
      const tempPlayerStats: IPlayerStats = getLocalPlayerData();

      // Movie info
      setServerMovieInfoArray(result.movies)
      setCurrentRating(middleRatingArray[result.movies[0].RatingInfo.RatingIndex])

      // Current day
      if (tempPlayerStats.localGameIndex !== result.dailyId) {
        tempPlayerStats.hasPlayedToday = false;
        tempPlayerStats.localGameIndex = result.dailyId;
        tempPlayerStats.todaysScore = 0;
        tempPlayerStats.todaysMovieRatings = [];
      }
      if (tempPlayerStats.playerTheme === 'light') {
        enableLightMode({playerStats:tempPlayerStats});
      } else {
        enableDarkMode({playerStats:tempPlayerStats});
      }

      // Check if partially through today's game
      if (tempPlayerStats.todaysMovieRatings.length <= result.movies.length) {
        if (tempPlayerStats.todaysMovieRatings.length < result.movies.length) {
          setSelectedIndex(tempPlayerStats.todaysMovieRatings.length);
          setCurrentRating(middleRatingArray[result.movies[tempPlayerStats.todaysMovieRatings.length].RatingInfo.RatingIndex])
        }
        else {
          setSelectedIndex(0);
          setCurrentRating(middleRatingArray[result.movies[0].RatingInfo.RatingIndex])
          tempPlayerStats.hasPlayedToday = true
          setLocalPlayerData(tempPlayerStats)
          setAverageCommunityScores(communityScoresResult)
        }
      }

      setLocalPlayerData(tempPlayerStats)
      setMovieDataLoaded(true);
      lstorage.SavePlayerStats(tempPlayerStats)
    }

    if (!movieDataLoaded) {
      fn();
    }
  }, [serverMovieInfoArray, currentRating, localPlayerData, movieDataLoaded, averageCommunityScores]);

  //------------------------------------------------------------------------

  function getLocalPlayerData() {
    const localDataResult = lstorage.loadLocalPlayerStats();
    if (!localDataResult) {
      lstorage.SavePlayerStats(newPlayerStats)
      setLocalPlayerData(newPlayerStats)
      return newPlayerStats
    } else {
      setLocalPlayerData(localDataResult)
      return localDataResult;
    }
  }

  function SavePlayerStatsUponComplete({playedToday, playerStats}:{playedToday: boolean, playerStats:IPlayerStats}) {
    playerStats.totalGamesPlayed += 1;
    CheckPlayerPerfectScore({playerStats:playerStats, arrayLength:serverMovieInfoArray.length})
    setLocalPlayerData(prev => {
      const updated = prev ? { ...prev, hasPlayedToday: playedToday } : { ...newPlayerStats, hasPlayedToday: playedToday };
      lstorage.SavePlayerStats(updated);
      return updated;
    });
  }

  function SubmitRatingButton({currentPlayerMovieRating, playerStats}:{currentPlayerMovieRating: number, playerStats:IPlayerStats | null}) {    
    function SubmitRatingOnClick() {
      if (playerStats) {
        UpdatePlayerScoreBasedOnRating({
          ratingSourceInt: serverMovieInfoArray[selectedIndex].RatingInfo.RatingIndex, 
          movieRatingString: serverMovieInfoArray[selectedIndex].RatingInfo.RatingValue, 
          playerMovieRating: currentPlayerMovieRating, 
          playerStats: playerStats,
          selectedIndex: selectedIndex})
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

  async function UpdateToNextMovie() {
    const newIndex: number | null = IncrementArrayIndex({ currentIndex: selectedIndex, arrayLength: serverMovieInfoArray.length - 1 })
    if (newIndex) {
      setSelectedIndex(newIndex)
      setCurrentMovieScoreScreenVisibility(false)
      setCurrentRating(middleRatingArray[serverMovieInfoArray[newIndex].RatingInfo.RatingIndex])
      window.scrollTo(0,0)
    }
    else {
      await PostPlayerScoreData({playerScores:localPlayerData!.todaysMovieRatings , playerOverallScore:localPlayerData!.todaysScore})
      const fetchedAverageScores = await FetchAverageScoreData()
      if (fetchedAverageScores) {
        setAverageCommunityScores(fetchedAverageScores)
      }
      setSelectedIndex(0)
      setCurrentMovieScoreScreenVisibility(false)
      setCurrentRating(middleRatingArray[serverMovieInfoArray[0].RatingInfo.RatingIndex])
      if (localPlayerData) {
        SavePlayerStatsUponComplete({playedToday:true, playerStats:localPlayerData})
      }
      window.scrollTo(0,0)
    }
  }

  //------------------------------------------------------------------------

  if (!movieDataLoaded) 
  {
    return <LoadingPage text="Loading Data from Movie Server..." />
  }
  else
  {
    return (
        <main className="mainPage">
          <div className="mainContainer">
            <div className="contentContainer">
              <LazyImageCoreSizer imgAlt="What Is It Rated Logo" imgLink={pickWiiRLogo({theme:localPlayerData!.playerTheme})} imgStyle="mainWiirLogo"/>
              <MovieInfoDiv movie={serverMovieInfoArray[selectedIndex]}/>
              <MovieTitleAndSourceLogoContainer 
                title={serverMovieInfoArray[selectedIndex].Title}
                year={serverMovieInfoArray[selectedIndex].Year}
                source={serverMovieInfoArray[selectedIndex].RatingInfo.RatingIndex}
                theme={localPlayerData ? localPlayerData?.playerTheme : "dark"}
                />
              <div className="controllerContentContainer">
                <div className="sliderContainer">
                  <input type="range" name="ratingSlider" id="ratingSlider"
                          min={minRatingArray[serverMovieInfoArray[selectedIndex].RatingInfo.RatingIndex]} 
                          max={maxRatingArray[serverMovieInfoArray[selectedIndex].RatingInfo.RatingIndex]}
                          step={stepAmount[serverMovieInfoArray[selectedIndex].RatingInfo.RatingIndex]}
                          value={currentRating}
                          onChange={(e) => setCurrentRating(parseFloat(e.target.value))}
                          className={`ratingSliderStyle`}/>
                  <label htmlFor="ratingSlider" className="sliderLabelText">Your Rating: {(serverMovieInfoArray[selectedIndex].RatingInfo.RatingIndex === 0) ? Number(currentRating).toFixed(1) : currentRating}{ratingStringEndings[serverMovieInfoArray[selectedIndex].RatingInfo.RatingIndex]}</label>
                </div>
                <SubmitRatingButton currentPlayerMovieRating={currentRating} playerStats={localPlayerData}/>
                </div>
                <GalleryProgressDots selectedIndex={selectedIndex}/>
            </div>
            <ScoreComparisonDiv 
              ratingIndex={serverMovieInfoArray[selectedIndex].RatingInfo.RatingIndex} 
              actualMovieRating={serverMovieInfoArray[selectedIndex].RatingInfo.RatingValue} 
              playerMovieRating={currentRating} 
              playerStats={localPlayerData}
              visible={currentMovieScoreScreenVisibility}
              selectedIndex={selectedIndex}
              onNextMovie={UpdateToNextMovie}
              /> 
            <TodaysFinalScoreScreen 
              movies={serverMovieInfoArray} 
              visible={localPlayerData!.hasPlayedToday} 
              playerStats={localPlayerData!}
              averageCommunityScores={averageCommunityScores}/>
            <SiteFooter playerStats={localPlayerData ?? newPlayerStats}/>
          </div>
        </main>
    );
  }
}