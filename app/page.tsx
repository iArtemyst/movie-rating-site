'use client'

import React, { useEffect, useState } from "react";
import { MovieDatabase } from "./movie-database.json";
import { Scores } from "./scores.json";
import { LazyImageSizer } from "./components/load-asset";
import { FetchMovieData } from "./components/fetch-movie-data";
import { GetSimplifiedMovieInfo } from "./components/simplify-movie-data";
import { GetRandomInt } from "./components/get-random-int";
import { MovieInfoDiv } from "./components/movie-info-div";
import { ButtonWithClickHandler } from "./components/button-with-click-function";
import { CompareIfNumbersAreEqual } from "./components/compare-numbers-equal";
import { ShuffleStringArray } from "./components/shuffle-array";
import { CompareMovieRatings, UpdatePlayerScoreBasedOnRating } from "./components/compare-movie-scores";
import { GalleryProgressDots } from "./components/gallery-progress-dots";
import { ISimplifiedMovieInformation, IFullMovieInformation } from "./components/movie-interfaces";
import { ChooseRatingsToCreate } from "./components/create-rating-ranges";
import { GenerateThreeTrulyRandomNumbersWithinMovieDatabase } from "./components/generate-numbers-no-dupes";
import * as lstorage from "./components/local-data-storage";
import { IPlayerStats } from "./components/player-stats";


//------------------------------------------------------------------------

const minRatingArray = [0, 0, 0];
const maxRatingArray = [10, 100, 100];
const middleRatingArray = [5, 50, 50];
const moviePointValues = [500, 300, 0]; //500 = Perfect, 300 = Almost, 0 = Wrong
const stepAmount = [0.1, 1, 1,];
const checkLocalPlayed = lstorage.LoadDatalocally({keyName: 'playedToday'})
const checkPlayedToday = lstorage.CheckPlayedToday(checkLocalPlayed || 'false')
let playedTodayBool = checkLocalPlayed === 'true' ? true : false
let ratingsSelection = 0; // 0 = IMDB, 1 = Metascore, 2 = Rotten Tomatoes
const movieRatingHubText = [
  "IMDB (out of 10)",
  "Metascore (out of 100)",
  "Rotten Tomatoes (out of 100%)"
];
const WinningTextArray: string[] = [
  "Perfect Rating!",
  "Pretty Close",
  "Incorrect Rating",
];

const playerStats: IPlayerStats = {
  totalGamesPlayed: 0,
  totalGamesWon: 0,
  totalPerfectGames: 0,
  highestScore: 0,
  todaysScore: 0,
};

const testMovies: ISimplifiedMovieInformation[] = [GetSimplifiedMovieInfo(MovieDatabase, 0), GetSimplifiedMovieInfo(MovieDatabase, 1), GetSimplifiedMovieInfo(MovieDatabase, 2)]

const EmptyMovieData: IFullMovieInformation = {
  Title: "",
  Year:"",
  Rated:"",
  Released:"",
  Runtime:"",
  Genre:"",
  Director:"",
  Writer:"",
  Actors:"",
  Plot:"",
  Language:"",
  Country:"",
  Awards:"",
  Poster:"",
  Ratings:[{"Source":"Internet Movie Database","Value":"0/10"},{"Source":"Rotten Tomatoes","Value":"0%"},{"Source":"Metacritic","Value":"0/100"}],
  Metascore:"",
  imdbRating:"",
  imdbVotes:"",
  imdbID:"",
  Type:"",
  DVD:"",
  BoxOffice:"",
  Production:"",
  Website:"",
  Response:""
};


//------------------------------------------------------------------------
//TESTING FUNCTIONS

function TestButton() {
  function HandleClick() {
    lstorage.ClearLocalStorage()
    window.location.reload()
  }
  
  return (
    <div className={`w-fit h-fit absolute top-0 left-0 m-[3em] px-[1em] py-[.5em] bg-blue-800 rounded-full hover:scale-[95%] active:scale-[90%] font-semibold z-200`}>
      <button onClick={() => HandleClick()}>RESET LOCAL</button>
    </div>
  )
}

function TestLocalScore() {
  console.log("check played today: " + checkPlayedToday)
  return (
    <div className={`absolute left-[50%] -translate-x-[50%] bottom-0 mb-[1em] flex flex-row gap-[1em]`}>
      <div className={`flex flex-col items-center`}>
        <p>Today's Score:</p>
        <p>{playerStats.todaysScore}</p>
      </div>
      <div className={`flex flex-col items-center`}>
        <p>Has Played Today?</p>
        <p>{`${checkPlayedToday}`}</p>
      </div>
      <div className={`flex flex-col items-center`}>
        <p>Perfect Games:</p>
        <p>{playerStats.totalPerfectGames}</p>
      </div>
    </div>
  )
}

//------------------------------------------------------------------------

function LandingDiv(ratingSelection:number = 0) {
  //button has no functionality yet, add onClick later
  return(
    <div className={`absolute left-0 top-0 bottom-0 right-0 bg-[#00000040] z-10 flex justify-center flex-col`}>
        <button className="bg-blue-700 w-fit max-w-[360px] h-fit text-white py-[2em] px-[3em] rounded-full hover:scale-[95%] active:scale-[90%] self-center cursor-pointer">
          <p className="font-bold text-balance text-[24px]">CLICK TO BEGIN RATING MOVIES</p>
        </button>
    </div>
  )
}

function AlreadyPlayedTodayDiv() {
  return(
    <div className={`absolute left-0 top-0 bottom-0 right-0 bg-[#000000DD] z-10 flex justify-center flex-col`}>
        <div className="bg-purple-700 w-fit max-w-[360px] h-fit text-white py-[2em] px-[3em] rounded-full self-center">
          <p className="font-bold text-balance text-[24px] text-center">Sorry, You've Already Played Today!</p>
        </div>
    </div>
  )
}

function PickWhichRatingToUse() {
  const rolledRatingNumber = GetRandomInt(0, 3)
  console.log("New Rating Selected: " + movieRatingHubText[rolledRatingNumber])
  ratingsSelection = rolledRatingNumber;
}

function ResetPlayerDailyScore(tempPlayerStats: IPlayerStats) {
  console.log("reset todays score")
  tempPlayerStats.todaysScore = 0
  localStorage.setItem('todaysScore', `0`)
}

function SubmitScoresToServer(todaysScore:number) {
  playedTodayBool = true
  console.log("thanks for playing, you got a score of:")
  console.log(todaysScore + " today!")
  localStorage.setItem('playedToday', `true`)
}

function NoMoreMoviesToday({playerStats}:{playerStats: IPlayerStats}) {
  return (
    <div className={`absolute left-0 top-0 bottom-0 right-0 bg-[#000000DD] z-10`}>
      <div className="w-[50%] h-[30%] bg-gray-800 absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] rounded-[1em] justify-center flex flex-col text-[16px] font-bold shadow-[0px_0px_24px_#FFFFFF30]">
        <p className="self-center">NO MORE MOVIES TODAY, COME BACK TOMORROW!</p>
        <div className="w-fit h-fit self-center flex flex-row items-center gap-[.25em] text-[24px]">
          <p>
            {`Your Score Today:`}
          </p>
          <p>
            {Number(playerStats.todaysScore)}
          </p>
        </div>
        <div className={`self-center flex flex-row gap-[.5em]`}>
          <p>Perfect Games:</p>
          <p>{playerStats.totalPerfectGames}</p>
        </div>
        <ButtonWithClickHandler buttonText="See Scores" onClickFunction={() => SubmitScoresToServer(playerStats.todaysScore)}/>
      </div>
    </div>
  )
}

function ScoreGraph() {
  return (
    <div className={`absolute left-0 top-0 bottom-0 right-0 bg-[#00000011] z-10 flex justify-center flex-col`}>
      <div className="bg-purple-700 w-[720px] h-[480px] text-white py-[2em] px-[2em] rounded-[24px] self-center flex flex-col gap-[1em]">
        <div className={`w-full h-full place-self-center bg-white rounded-[12px] flex`}>
          <p className="text-black place-self-center w-full text-center">This is where i would put my chart, if i had one</p>
        </div>
        <p className="font-bold text-balance text-[24px] text-center place-self-center justify-self-end">Today's Scores</p>
      </div>
    </div>
  )
}

function SetPerfectGames(playerStatsLocal: IPlayerStats) {
  if (playerStatsLocal.todaysScore == (1500)) {
    playerStatsLocal.totalPerfectGames += 1
    console.log("perfect games: " + `${playerStatsLocal.totalPerfectGames}`)
    localStorage.setItem('perfectGames', `${playerStatsLocal.totalPerfectGames}`)}
};


//------------------------------------------------------------------------

function CompareRatingTextDiv({currentMovie, ratingsSelection, todaysScore, playerRating}:{currentMovie: ISimplifiedMovieInformation, ratingsSelection: number, todaysScore:number, playerRating:number}) {
  const currentMovieRatingArray = 
  [
    currentMovie.movieRatingIMDB,
    currentMovie.movieRatingMetascore,
    currentMovie.movieRatingRottenTomatoes,
  ]

  const newTrimmedRatingsArray = [
    currentMovieRatingArray[0].split("/10"),
    currentMovieRatingArray[1].split("/100"),
    currentMovieRatingArray[2].split("%")
  ]
  
  return (
    <div className="w-fit h-fit self-center flex flex-col">
      <div className="w-fit h-fit self-center flex flex-row items-center gap-[.25em]">
        <p className="text-[14px] align-middle">
          {`Your Rating:`}
        </p>
        <p className={`text-white text-[18px] font-bold align-middle`}>
          {playerRating}
        </p>
      </div>
      <div className="w-fit h-fit self-center flex flex-row items-center gap-[.25em]">
        <p className="text-[14px] align-middle">
          {`Actual Rating:`}
        </p>
        <p className={`text-white text-[18px] font-bold align-middle `}>
          {Number(newTrimmedRatingsArray[ratingsSelection][0])}
        </p>
      </div>
      <div className="w-fit h-fit self-center flex flex-row items-center gap-[.25em]">
        <p>
          {`Your Score Today:`}
        </p>
        <p>
          {todaysScore}
        </p>
      </div>
    </div>
  )
}

function CycleThroughIndexesPositive({currentIndex, arrayLength}:{currentIndex:number, arrayLength:number}) {
  if (currentIndex < arrayLength - 1) {
    currentIndex += 1
    console.log("test index + 1: " + currentIndex);
  }
  else
    console.log("test index loop to 0: " + currentIndex)
    currentIndex = 0
}

function NextMovieOnClick({selectedIndex, currentMovieArray}:{selectedIndex:number, currentMovieArray:ISimplifiedMovieInformation[]}) {
  CycleThroughIndexesPositive({currentIndex:selectedIndex, arrayLength:currentMovieArray.length })
}

function NextMovieButton({selectedIndex, currentMovieArray}:{selectedIndex:number, currentMovieArray:ISimplifiedMovieInformation[]}) {        
  return (
    <>
      <div className="h-[96px] flex flex-row place-content-center">
        <div onClick={() => NextMovieOnClick({selectedIndex:selectedIndex, currentMovieArray:currentMovieArray})} className={`w-[128px] h-[48px] bg-[#fafafa] hover:bg-[#dfdfdf] hover:scale-[98%] active:scale-[96%] cursor-pointer rounded-[12px] grid place-content-center my-[.5em] self-end`}>
          <p className="place-self-center h-fit font-bold text-black">NEXT MOVIE</p>
        </div>
      </div>
    </>
  )
}

function ScoreComparisonDiv({selectedIndex, currentMovieArray, ratingsSelection, currentRating, playerStats, visible}:{selectedIndex:number, currentMovieArray:ISimplifiedMovieInformation[], ratingsSelection:number, currentRating:number, playerStats:IPlayerStats, visible:boolean}) {
  const scoreDivStyle: string[] = [
    "bg-[#00ad5c] text-white",
    "bg-[#02B99E] text-white",
    "bg-[#FF0000] text-white"
  ]

  lstorage.SaveDataLocally("todaysScore", `${playerStats.todaysScore}`);

  return (
    <>
    { visible && 
      <div className={`absolute left-0 top-0 bottom-0 right-0 bg-[#000000DD] z-10`}>
        <div className={`${scoreDivStyle[playerStats.totalGamesWon]} absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] w-[480px] aspect-[5/3] rounded-[12px] shadow-[2px_2px_12px_#00000060]`}>
          <div className="w-full h-full p-[24px] flex flex-col place-content-center">
              <p className="self-center text-[24px] font-bold">{WinningTextArray[playerStats.totalGamesWon]}</p>
            <CompareRatingTextDiv currentMovie={currentMovieArray[selectedIndex]} ratingsSelection={ratingsSelection} todaysScore={playerStats.todaysScore} playerRating={currentRating}/>
            <NextMovieButton selectedIndex={selectedIndex} currentMovieArray={currentMovieArray}/>
          </div>
        </div>
      </div>
    }
    </>
  )
}

function SubmitRatingOnClick({currentMovieArray, ratingsSelection, currentRating, selectedIndex, playerStats, visible}:{currentMovieArray: ISimplifiedMovieInformation[], ratingsSelection: number, currentRating: number, selectedIndex: number, playerStats: IPlayerStats, visible:boolean}) {
  UpdatePlayerScoreBasedOnRating(currentMovieArray, ratingsSelection, currentRating, playerStats.todaysScore)
  selectedIndex += 1
  visible = true
}

function SubmitRatingButton2({currentMovieArray, ratingsSelection, currentRating, selectedIndex, playerStats, scoreDivVisible}:{currentMovieArray: ISimplifiedMovieInformation[], ratingsSelection: number, currentRating: number, selectedIndex: number, playerStats: IPlayerStats, scoreDivVisible:boolean}) {    
  return (
    <>
      <div onClick={() => SubmitRatingOnClick({currentMovieArray:currentMovieArray, ratingsSelection:ratingsSelection, currentRating:currentRating, selectedIndex:selectedIndex, playerStats:playerStats, visible:scoreDivVisible})} className="w-[196px] h-[64px] my-[12px] self-center place-content-center cursor-pointer bg-[#fafafa] hover:bg-[#dfdfdf] rounded-[1em] hover:scale-[98%] active:scale-[96%]">
          <p className="text-center text-black font-bold">SUBMIT RATING</p>
      </div>
      <ScoreComparisonDiv selectedIndex={selectedIndex} currentMovieArray={currentMovieArray} ratingsSelection={ratingsSelection} currentRating={currentRating} playerStats={playerStats} visible={scoreDivVisible}/>
    </>
  )
}


export default function Home() {
  const [serverMovieInfoArray, setServerMovieInfoArray] = useState<string[] | null>(null);
  const [currentMovies, setCurrentMovies] = useState(testMovies);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentRating, setCurrentRating] = useState(middleRatingArray[ratingsSelection]);
  const [endScreenVisibility, setEndScreenVisibility] = useState(false);
  const [moreMovies, setMoreMovies] = useState(true);
  const [winner, setWinner] = useState(false);
  const [perfect, setPerfect] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [cantPlay, setCantPlay] = useState(playedTodayBool) || false;
  const [showScore, setShowScore] = useState(false);

  // function SubmitRatingButton() {    
  //   function CompareRatingText() {
  //     const currentMovieRatingArray = 
  //     [
  //       currentMovies[selectedIndex].movieRatingIMDB,
  //       currentMovies[selectedIndex].movieRatingMetascore,
  //       currentMovies[selectedIndex].movieRatingRottenTomatoes,
  //     ]

  //     const newTrimmedRatingsArray = [
  //       currentMovieRatingArray[0].split("/10"),
  //       currentMovieRatingArray[1].split("/100"),
  //       currentMovieRatingArray[2].split("%")
  //     ]
      
  //     return (
  //       <div className="w-fit h-fit self-center flex flex-col">
  //         <div className="w-fit h-fit self-center flex flex-row items-center gap-[.25em]">
  //           <p className="text-[14px] align-middle">
  //             {`Your Rating:`}
  //           </p>
  //           <p className={`text-white text-[18px] font-bold align-middle`}>
  //             {currentRating}
  //           </p>
  //         </div>
  //         <div className="w-fit h-fit self-center flex flex-row items-center gap-[.25em]">
  //           <p className="text-[14px] align-middle">
  //             {`Actual Rating:`}
  //           </p>
  //           <p className={`text-white text-[18px] font-bold align-middle `}>
  //             {Number(newTrimmedRatingsArray[ratingsSelection][0])}
  //           </p>
  //         </div>
  //         <div className="w-fit h-fit self-center flex flex-row items-center gap-[.25em]">
  //           <p>
  //             {`Your Score Today:`}
  //           </p>
  //           <p>
  //             {Number(playerStats.todaysScore)}
  //           </p>
  //         </div>
  //       </div>
  //     )
  //   }

  //   function ScoreComparisonDiv() {
  //     const scoreDivStyle: string[] = [
  //       "bg-[#00ad5c] text-white",
  //       "bg-[#02B99E] text-white",
  //       "bg-[#FF0000] text-white"
  //     ]

  //     function NextMovieIndex() {
  //         if (selectedIndex < currentMovies.length - 1)
  //         {
  //           setSelectedIndex(selectedIndex + 1)
  //           setCurrentRating(middleRatingArray[ratingsSelection])
  //           setEndScreenVisibility(false)
  //         }
  //         else
  //         {
  //           SetPerfectGames(playerStats)
  //           setEndScreenVisibility(false)
  //           setMoreMovies(false)
  //         }
  //       }

  //     function NextMovieButton() {        
  //       return (
  //         <>
  //           <div className="h-[96px] flex flex-row place-content-center">
  //             <div onClick={() => NextMovieIndex()} className={`w-[128px] h-[48px] bg-[#fafafa] hover:bg-[#dfdfdf] hover:scale-[98%] active:scale-[96%] cursor-pointer rounded-[12px] grid place-content-center my-[.5em] self-end`}>
  //               <p className="place-self-center h-fit font-bold text-black">NEXT MOVIE</p>
  //             </div>
  //           </div>
  //         </>
  //       )
  //     }

  //     lstorage.SaveDataLocally("todaysScore", `${playerStats.todaysScore}`);

  //     return (
  //       <div className={`absolute left-0 top-0 bottom-0 right-0 bg-[#000000DD] z-10`}>
  //         <div className={`${scoreDivStyle[playerStats.totalGamesWon]} absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] w-[480px] aspect-[5/3] rounded-[12px] shadow-[2px_2px_12px_#00000060]`}>
  //           <div className="w-full h-full p-[24px] flex flex-col place-content-center">
  //               <p className="self-center text-[24px] font-bold">{WinningTextArray[playerStats.totalGamesWon]}</p>
  //             <CompareRatingText />
  //             <NextMovieButton />
  //           </div>
  //         </div>
  //       </div>
  //     )
  //   }
    

  //   function handleScoreSubmission(movies: ISimplifiedMovieInformation[], ratingsSelection: number, currentRating: number) {
  //     UpdatePlayerScoreBasedOnRating(movies, ratingsSelection, currentRating, playerStats.todaysScore);;
  //     setEndScreenVisibility(true);
  //   }

  //   return (
  //     <>
  //       <div onClick={() => handleScoreSubmission(testMovies, ratingsSelection, currentRating)} className="w-[196px] h-[64px] my-[12px] self-center place-content-center cursor-pointer bg-[#fafafa] hover:bg-[#dfdfdf] rounded-[1em] hover:scale-[98%] active:scale-[96%]">
  //           <p className="text-center text-black font-bold">SUBMIT RATING</p>
  //       </div>
  //       {
  //         endScreenVisibility && ( <ScoreComparisonDiv /> )
  //       }
  //     </>
  //   )
  // }


  FetchMovieData();

  return (
    <div className="font-sans grid grid-cols-1 items-center place-items-center h-[100dvh] py-[24px] w-full touch-none">
      <main className="flex flex-col items-center self-center">
        {/* {cantPlay && <AlreadyPlayedTodayDiv />} */}
        {/* {showIntro && <LandingDiv />} */}
        { <MovieInfoDiv movies={currentMovies} selectedIndex={selectedIndex}/> }
        { <div className="flex flex-col items-center w-full my-[16px] gap-[6px]">
            <p className={`text-[20px]`}>
              What do you think this movie is rated on {movieRatingHubText[ratingsSelection]}?
            </p>
            <input type="range" name="ratingSlider" id="ratingSlider" 
                    min={minRatingArray[ratingsSelection]} 
                    max={maxRatingArray[ratingsSelection]}
                    step={stepAmount[ratingsSelection]}
                    value={currentRating}
                    onChange={(e) => setCurrentRating(parseFloat(e.target.value))}
                    className={`w-full bg-transparent cursor-pointer appearance-none
                                    [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[#ececec] [&::-webkit-slider-runnable-track]:h-auto [&::-webkit-slider-runnable-track]:inset-shadow-[2px_2px_4px_#00000020,-2px_-2px_4px_#00000020]
                                    [&::-moz-range-track]:appearance-none [&::-moz-range-track]:bg-[#ececec] [&::-moz-range-track]:h-[1em] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:inset-shadow-[2px_2px_4px_#00000020,-2px_-2px_4px_#00000020]
                                    [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-[#00ff73] [&::-moz-range-thumb]:scale-[125%] [&::-moz-range-thumb]:hover:scale-[150%] [&::-moz-range-thumb]:active:scale-[175%] [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0px_0px_8px_#00000040]
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00ff73] [&::-webkit-slider-thumb]:shadow-[0px_0px_8px_#00000040] [&::-webkit-slider-thumb]:scale-[125%]  [&::-webkit-slider-thumb]:hover:scale-[150%] [&::-webkit-slider-thumb]:active:scale-[175%]`}/>
            <label htmlFor="ratingSlider">Rating: {currentRating}</label>
          </div> }
        {/* { <SubmitRatingButton /> } */}
        { <SubmitRatingButton2 
            currentRating={currentRating} 
            ratingsSelection={ratingsSelection}
            currentMovieArray={currentMovies} 
            selectedIndex={selectedIndex} 
            playerStats={playerStats}
            scoreDivVisible={endScreenVisibility}/> 
            }
        { <GalleryProgressDots index1={0} index2={1} index3={2} selectedIndex={selectedIndex}/> }
        { !moreMovies && <NoMoreMoviesToday playerStats={playerStats}/> }
        { showScore && <ScoreGraph/> }
        <TestButton />
        <TestLocalScore />
      </main>
    </div>
  );
}