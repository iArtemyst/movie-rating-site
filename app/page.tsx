'use client'

import React, { useEffect, useState } from "react";
import { MovieDatabase } from "./movie-database.json";
import { FetchMovieData } from "./components/fetch-movie-data";
import { GetSimplifiedMovieInfo } from "./components/simplify-movie-data";
import { GetRandomInt } from "./components/get-random-int";
import { MovieInfoDiv } from "./components/movie-info-div";
import { UpdatePlayerScoreBasedOnRating, GetPlayerRatingScoreIndexValue } from "./components/compare-movie-scores";
import { IncrementArrayIndex } from "./components/increment-array-index";
import { GalleryProgressDots } from "./components/gallery-progress-dots";
import { IMovieInformation, IFullMovieInformation } from "./components/movie-interfaces";
import { ScoreGraph } from "./components/score-graph";
import { TestButtonResetLocalStorageAndReloadPage, TestDivWithPlayerStatInformation } from "./components/testing-functions";
import { IPlayerStats } from "./components/player-stats";
import { Loading } from "./components/loading";

//------------------------------------------------------------------------

const minRatingArray = [0, 0, 0];
const maxRatingArray = [10, 100, 100];
const middleRatingArray = [5, 50, 50];
const stepAmount = [0.1, 1, 1,];
const ratingsSelection: number = 0; // 0 = IMDB, 1 = Metascore, 2 = Rotten Tomatoes
const movieRatingHubText = [
  "IMDB (out of 10)",
  "Rotten Tomatoes (out of 100%)",
  "Metacritic (out of 100)",
];
const testingPlayerStats: IPlayerStats = {
  totalGamesPlayed: 0,
  totalGamesWon: 0,
  totalPerfectGames: 0,
  highestScore: 0,
  todaysScore: 0,
  hasPlayedToday: false,
};


//------------------------------------------------------------------------


export default function Home() {
  const [serverMovieInfoArray, setServerMovieInfoArray] = useState<IMovieInformation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentRating, setCurrentRating] = useState(middleRatingArray[ratingsSelection]);
  const [currentMovieScoreScreenVisibility, setCurrentMovieScoreScreenVisibility] = useState(false);
  const [ratingSiteIndex, setRatingSiteIndex] = useState(0)
  const [dataLoaded, setDataLoaded] = useState(false)


  useEffect(() => {
    let fn = async () => {
      let result = await FetchMovieData();
      console.log("MOVIE 1 INFO:" + result[0].Title + " | " + result[0].RatingSource + " | " + result[0].RatingValue)
      console.log("MOVIE 2 INFO:" + result[1].Title + " | " + result[1].RatingSource + " | " + result[1].RatingValue)
      console.log("MOVIE 3 INFO:" + result[2].Title + " | " + result[2].RatingSource + " | " + result[2].RatingValue)

      setServerMovieInfoArray(result)
      setCurrentRating(middleRatingArray[result[0].RandomRatingInt])
      setDataLoaded(true);
    }
    if (!dataLoaded) {
      fn();
    }
  }, [serverMovieInfoArray]);


  function ScoreComparisonDiv() {
    const WinningTextArray: string[] = [
      "Perfect Rating!",
      "Pretty Close",
      "Incorrect Rating",
    ];
    const scoreDivStyle: string[] = [
      "bg-[#00ad5c] text-white",
      "bg-[#02B99E] text-white",
      "bg-[#FF0000] text-white"
    ];

    function CompareRatingTextDiv() {    
      function TextAndScoreDiv({titleText, secondaryText}:{titleText:string, secondaryText:string}) {
        return (
          <div className="w-fit h-fit self-center flex flex-row items-center gap-[.25em]">
            <p className="text-[14px] align-middle">
              {titleText}
            </p>
            <p className={`text-white text-[18px] font-bold align-middle`}>
              {secondaryText}
            </p>
          </div>
        )
      }

      return (
        <div className="w-fit h-fit self-center flex flex-col">
          <p className={`self-center text-[24px] font-bold`}>{WinningTextArray[GetPlayerRatingScoreIndexValue({ratingSourceInt:serverMovieInfoArray[selectedIndex].RandomRatingInt, movieRatingString:serverMovieInfoArray[selectedIndex].RatingValue, playerMovieRating:currentRating})]}</p>
          <TextAndScoreDiv titleText="Your Rating" secondaryText={`${currentRating}`} />
          <TextAndScoreDiv titleText="Actual Rating" secondaryText={`${serverMovieInfoArray[selectedIndex].RatingValue}`} />
          <TextAndScoreDiv titleText="Your Score Today" secondaryText={`${testingPlayerStats.todaysScore}`} />
        </div>
      )
    }

    function NextMovieButton() {        
      function NextMovieButtonOnClick() {
        const newIndex: number = IncrementArrayIndex({currentIndex:selectedIndex, arrayLength:serverMovieInfoArray.length-1})
        setSelectedIndex(newIndex)
        setCurrentRating(middleRatingArray[serverMovieInfoArray[newIndex].RandomRatingInt])
        setCurrentMovieScoreScreenVisibility(false)
      }
      
      
      return (
        <div className="h-[96px] flex flex-row place-content-center">
          <div onClick={() => NextMovieButtonOnClick()} className={`w-[128px] h-[48px] bg-[#fafafa] hover:bg-[#dfdfdf] hover:scale-[98%] active:scale-[96%] cursor-pointer rounded-[12px] grid place-content-center my-[.5em] self-end`}>
            <p className="place-self-center h-fit font-bold text-black">NEXT MOVIE</p>
          </div>
        </div>
      )
    }

    return (
      <div className={`absolute left-0 top-0 bottom-0 right-0 bg-[#000000DD] z-10`}>
        <div className={`${scoreDivStyle[0]} absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] w-[480px] aspect-[5/3] rounded-[12px] shadow-[2px_2px_12px_#00000060] flex flex-col place-content-center`}>
          <CompareRatingTextDiv />
          <NextMovieButton />
        </div>
      </div>
    )
  }

  function SubmitRatingButton({currentPlayerMovieRating}:{currentPlayerMovieRating: number}) {    
    function SubmitRatingOnClick() {
      UpdatePlayerScoreBasedOnRating({ratingSourceInt:serverMovieInfoArray[selectedIndex].RandomRatingInt, movieRatingString:serverMovieInfoArray[selectedIndex].RatingValue, playerMovieRating:currentPlayerMovieRating, playerStats:testingPlayerStats})
      setCurrentMovieScoreScreenVisibility(true)
    }

    return (
      <>
        <div onClick={() => SubmitRatingOnClick()} className="w-[196px] h-[64px] my-[12px] self-center place-content-center cursor-pointer bg-[#fafafa] hover:bg-[#dfdfdf] rounded-[1em] hover:scale-[98%] active:scale-[96%]">
            <p className="text-center text-black font-bold">SUBMIT RATING</p>
        </div>
      </>
    )
  }


  if (!dataLoaded) 
  {
    return <Loading />
  }
  else
  {
    return (
      <div className="font-sans grid grid-cols-1 items-center place-items-center h-[100dvh] py-[24px] w-full touch-none">
        <main className="flex flex-col items-center self-center">
          { <MovieInfoDiv movies={serverMovieInfoArray} selectedIndex={selectedIndex}/> }
          <div className="flex flex-col items-center w-full my-[16px] gap-[6px]">
              <p className={`text-[20px]`}>
                What do you think this movie is rated on {movieRatingHubText[serverMovieInfoArray[selectedIndex].RandomRatingInt]}?
              </p>
              <input type="range" name="ratingSlider" id="ratingSlider" 
                      min={minRatingArray[serverMovieInfoArray[selectedIndex].RandomRatingInt]} 
                      max={maxRatingArray[serverMovieInfoArray[selectedIndex].RandomRatingInt]}
                      step={stepAmount[serverMovieInfoArray[selectedIndex].RandomRatingInt]}
                      value={currentRating}
                      onChange={(e) => setCurrentRating(parseFloat(e.target.value))}
                      className={`w-full bg-transparent cursor-pointer appearance-none
                                      [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[#ececec] [&::-webkit-slider-runnable-track]:h-auto [&::-webkit-slider-runnable-track]:inset-shadow-[2px_2px_4px_#00000020,-2px_-2px_4px_#00000020]
                                      [&::-moz-range-track]:appearance-none [&::-moz-range-track]:bg-[#ececec] [&::-moz-range-track]:h-[1em] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:inset-shadow-[2px_2px_4px_#00000020,-2px_-2px_4px_#00000020]
                                      [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-[#00ff73] [&::-moz-range-thumb]:scale-[125%] [&::-moz-range-thumb]:hover:scale-[150%] [&::-moz-range-thumb]:active:scale-[175%] [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0px_0px_8px_#00000040]
                                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00ff73] [&::-webkit-slider-thumb]:shadow-[0px_0px_8px_#00000040] [&::-webkit-slider-thumb]:scale-[125%]  [&::-webkit-slider-thumb]:hover:scale-[150%] [&::-webkit-slider-thumb]:active:scale-[175%]`}/>
              <label htmlFor="ratingSlider">Rating: {currentRating}</label>
          </div>
          <SubmitRatingButton
              currentPlayerMovieRating={currentRating}/>
          { currentMovieScoreScreenVisibility && <ScoreComparisonDiv /> }
          <GalleryProgressDots index1={0} index2={1} index3={2} selectedIndex={selectedIndex}/>
        </main>
      </div>
    );
  }
}