'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IDailyMovieInformation, IMovieInformation } from "./components/movie-interfaces";
import { IPlayerStats, newPlayerStats } from "./components/player-stats";
import { FetchMovieData } from "./components/fetch-movie-data";
import { MovieInfoDiv } from "./components/movie-info-div";
import { UpdatePlayerScoreBasedOnRating } from "./components/compare-movie-scores";
import { IncrementArrayIndex } from "./components/increment-array-index";
import { LoadingPage } from "./components/loading";
import { ScoreComparisonDiv } from "./components/score-comparison-div";
import { TodaysFinalScoreScreen } from "./components/score-graph";
import { moviePointValues } from "./components/movie-interfaces";
import * as lstorage from "./components/local-data-storage";
import { SwitchThemeButton, enableDarkMode, enableLightMode } from "./components/theme-switch-button";
import * as testing from "./components/testing-functions";
import { LazyImageCoreSizer } from "./components/load-asset";

const IMDBLogo = "https://eevee-feywild.art/__other/source_IMDB-logo-cropping.png";
const MCLogoDark = "https://eevee-feywild.art/__other/source_MC-logo-cropping_dark.png";
const MCLogoLight = "https://eevee-feywild.art/__other/source_MC-logo-cropping_light.png";
const RTLogo = "https://eevee-feywild.art/__other/source_RT-logo-cropping.png";


const minRatingArray = [0, 0, 0];
const maxRatingArray = [10, 100, 100];
const middleRatingArray = [5.0, 50, 50];
const stepAmount = [0.1, 1, 1,];
const ratingsSelection: number = 0; // 0 = IMDB, 1 = Metacritic, 2 = Rotten Tomatoes

function SiteFooter() {
  const [visible, setVisible] = useState(false)

  function FooterOnClick() {
    setVisible(true)
  }

  function ShowAboutDiv() {
    return (
      <>
        {
          visible &&
          <div className="fullScreenBlockingDiv" onClick={() => setVisible(false)}>
            <div className="footerAboutDiv">
                <div className="w-fit flex flex-col place-items-center">
                  <p className="my-[.5em] font-semibold mb-[1em]">Thanks for playing my Daily Movie Rating Site!</p>
                  <div className="w-fit flex flex-col place-items-center text-[16px]">
                    <div className="w-fit flex flex-row gap-[.375em]">
                      <p>Data obtained from</p>
                        <Link href="https://www.omdbapi.com/" rel="noopener noreferrer" target="_blank">
                          <p className="font-bold">OMDB</p>
                        </Link>
                    </div>
                    <div className="w-fit flex flex-row gap-[.375em]">
                      <p>Most recent update:</p>
                      <p>December 2025</p>
                    </div>
                  </div>
                </div>
                <div className="w-fit flex flex-col place-items-center text-[16px] mb-[1em]">
                  <div className="w-fit flex flex-row gap-[.25em]">
                    <p>Designed by</p>
                    <Link href="https://github.com/iartemyst" rel="noopener noreferrer" target="_blank">
                        <p className="font-bold">iArtemyst,</p>
                    </Link>
                    <p> with special thanks to </p>
                    {/* <Link href="https://github.com/asundheim" rel="noopener noreferrer" target="_blank">
                        <p className="font-bold">Ders</p>
                    </Link> */}
                    <p className="font-bold">Ders</p>
                    <p>for support</p>
                  </div>
                  <div className="w-fit flex flex-row gap-[.375em]">
                    <p>Please check out my</p>
                    <Link href="https://eevee-feywild.com/" rel="noopener noreferrer" target="_blank">
                        <p className="font-bold">portfolio</p>
                    </Link>
                    <p>for more of my work</p>
                  </div>
                </div>
                <p className="hideMeText">click anywhere to close</p>
            </div>
          </div>
        }
      </>
    )
  }
  
  return (
      <>
        <div className="siteFooterDiv" onClick={(() => FooterOnClick())}>
          <p>Daily Movie Rating © 2025 | Designed by iArtemyst</p>
        </div>
        <ShowAboutDiv/>
      </>
    )
}

function MainQuestionContainer({source, theme}:{source:number, theme:string}) {
  const sourceLogos = [
    IMDBLogo,
    [MCLogoDark, MCLogoLight],
    RTLogo,
  ]
  
  function pickLogo() {
    if (source === 1) {
      if (theme === `dark`) {
        return String(sourceLogos[1][1])
      }
      else { 
        return String(sourceLogos[1][0])
      }
    }
    else return String(sourceLogos[source])
  }
  
  return (
      <div className="mainQuestionDiv">
        <div className="flex flex-row place-items-center text-[16px] sm:text-[16px] md:text-[20px] lg:text-[24px]">
          <p className="pr-[.25em]">What is it rated on</p>
          <LazyImageCoreSizer imgLink={pickLogo()} imgAlt={`${source} logo`} imgStyle="h-[1.5em]" />
        </div>
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
    return <LoadingPage text="Loading Data from Movie Server..." />
  }
  else
  {
    return (
        <main className="mainPage">
          <div className="mainContainer">
            <div className="contentContainer">
              <MovieInfoDiv movie={serverMovieInfoArray[selectedIndex]} index={selectedIndex}/>
              <MainQuestionContainer 
                source={serverMovieInfoArray[selectedIndex].RandomRatingInt}
                theme={localPlayerData ? localPlayerData?.playerTheme : "dark"}
                />
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
            {/* <testing.TestButtonResetLocalStorageAndReloadPage /> */}
          </div>
        </main>
    );
  }
}