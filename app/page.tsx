'use client'

import React, { useEffect, useState } from "react";
import { IMovieInformation } from "./components/movie-interfaces";
import { IPlayerStats } from "./components/player-stats";

import { FetchMovieData } from "./components/fetch-movie-data";
import { MovieInfoDiv } from "./components/movie-info-div";
import { UpdatePlayerScoreBasedOnRating } from "./components/compare-movie-scores";
import { IncrementArrayIndex } from "./components/increment-array-index";
import { GalleryProgressDots } from "./components/gallery-progress-dots";
import { Loading } from "./components/loading";
import { ScoreComparisonDiv } from "./components/score-comparison-div";

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

  function UpdateToNextMovie() {
      const newIndex: number = IncrementArrayIndex({ currentIndex: selectedIndex, arrayLength: serverMovieInfoArray.length - 1 })
      setSelectedIndex(newIndex)
      setCurrentRating(middleRatingArray[serverMovieInfoArray[newIndex].RandomRatingInt])
      setCurrentMovieScoreScreenVisibility(false)
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
          { 
            currentMovieScoreScreenVisibility && 
            <ScoreComparisonDiv 
              ratingSourceInt={serverMovieInfoArray[selectedIndex].RandomRatingInt} 
              actualMovieRating={serverMovieInfoArray[selectedIndex].RatingValue} 
              playerMovieRating={currentRating} 
              playerStats={testingPlayerStats} 
              onNextMovie={UpdateToNextMovie}
            /> 
          }
          <GalleryProgressDots index1={0} index2={1} index3={2} selectedIndex={selectedIndex}/>
        </main>
      </div>
    );
  }
}