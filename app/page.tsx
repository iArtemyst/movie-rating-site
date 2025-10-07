'use client'

import React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MovieDatabase } from "./movie-database.json";

const importedMovieList = MovieDatabase;
const recentlyUsedMovies : string[] = [];
const tempMovieTitleArray: string[] = FilterToTitles(importedMovieList);
const minRatingArray = [0, 0, 0];
const maxRatingArray = [10, 100, 100];
const middleRatingArray = [5, 50, 50];
const textStyleTitle = "text-[24px] font-bold";
const textStyleSubtitle = "text-[14px] font-semibold";
const textStyleParagraph = "text-[16px]";
const marginOfError = 5;
const movieRatingHubText = [
  "IMDB (out of 10)",
  "Metascore (out of 100)",
  "Rotten Tomatoes (out of 100%)"
];
const WinningTextArray: string[] = [
  "Perfect Rating!",
  "Pretty Close",
  "Incorrect Rating",
]
const moviePointValues = [500, 300, 0]; //500 = Perfect, 300 = Almost, 0 = Wrong

let currentMovieInfoArray: ISimplifiedMovieInformation[] = [];
let ratingsSelection = 0; // 0 = IMDB, 1 = Metascore, 2 = Rotten Tomatoes
let tempPlayerWinningValue = 2; //0 = Perfect Rating, 1 = Almost Rating, 2 = Incorrect Rating
let dailyPlayerPoints = 0;

interface IFullMovieInformation
{
  Title: string,
  Year:string,
  Rated:string,
  Released:string,
  Runtime:string,
  Genre:string,
  Director:string,
  Writer:string,
  Actors:string,
  Plot:string,
  Language:string,
  Country:string,
  Awards:string,
  Poster:string,
  Ratings:{"Source":string,"Value":string}[],
  Metascore:string,
  imdbRating:string,
  imdbVotes:string,
  imdbID:string,
  Type:string,
  DVD:string,
  BoxOffice:string,
  Production:string,
  Website:string,
  Response:string
};

interface ISimplifiedMovieInformation
{
  movieTitle: string, 
  movieDirector: string, 
  movieReleaseYear: string, 
  movieTopBilled: string, 
  movieSummary: string, 
  moviePosterLink: string,
  movieRatingIMDB: string,
  movieRatingMetascore: string,
  movieRatingRottenTomatoes: string,
  movieRatingOther: string,
};

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

function ShuffleStringArray(array: string[]) 
{
  const shuffled_array = structuredClone(array);
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i - 1));
      [shuffled_array[i], shuffled_array[j]] = [shuffled_array[j], shuffled_array[i]];
  }
  return shuffled_array;
}

function GetRandomInt(min:number, max:number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//------------------------------------------------------------------------

function FilterToTitles(data:IFullMovieInformation[]) {
  const movieNames : string[] = [];
  for (let i = data.length - 1; i >= 0; i--) {
    movieNames.push(data[i].Title)
  }

  return movieNames
}

function PickWhichRatingToUse() {
  const rolledRatingNumber = GetRandomInt(0, 3)
  console.log("New Rating Selected: " + movieRatingHubText[rolledRatingNumber])
  ratingsSelection = rolledRatingNumber;
}

function GetMovieInfoFromTitle(title: string) {
    const TitleInfo = MovieDatabase.find(movie => movie.Title === title) || EmptyMovieData;
    const titleRatingsArray = TitleInfo.Ratings
    const imdbRating = titleRatingsArray.find(rating => rating.Source === "Internet Movie Database") || EmptyMovieData.Ratings[0]
    const metascoreRating = titleRatingsArray.find(rating => rating.Source === "Metacritic") || EmptyMovieData.Ratings[1]
    const rottenTomatoesRating = titleRatingsArray.find(rating => rating.Source === "Rotten Tomatoes") || EmptyMovieData.Ratings[2]
    const otherRating = titleRatingsArray?.find(rating => rating.Source !== "Internet Movie Database" && rating.Source !== "Metacritic" && rating.Source !== "Rotten Tomatoes")
    const titleData: ISimplifiedMovieInformation =
    {
        movieTitle: title,
        movieDirector: TitleInfo.Director,
        moviePosterLink: TitleInfo.Poster,
        movieReleaseYear: TitleInfo.Year,
        movieSummary: TitleInfo.Plot,
        movieTopBilled: TitleInfo.Actors,
        movieRatingIMDB: imdbRating.Value,
        movieRatingMetascore: metascoreRating.Value,
        movieRatingRottenTomatoes: rottenTomatoesRating.Value,
        movieRatingOther: otherRating?.Value || "No Other Ratings"
    }
    return(titleData)
  }

function GenerateNewMovieInfo(data:IFullMovieInformation[]) {
  function AddThreeNewMovies(titleArray: string[]) {
    if (currentMovieInfoArray.length > 0)
      {
        currentMovieInfoArray = []
      }

    const tempShuffledList = ShuffleStringArray(FilterToTitles(importedMovieList))

    for (let i = 3; i > 0; i--) 
      {
        const thisMovieData = GetMovieInfoFromTitle(tempShuffledList[i])
        currentMovieInfoArray.push(thisMovieData)
      }
    console.log(currentMovieInfoArray)
  }
}

function SelectThreeMovies() {
  // const tempSlicedArray : string[] = ShuffleStringArray(FilterToTitles(importedMovieList)).slice(0,3);
  const tempMoviesToUseToday : string[] = [];
  
  function AddMoviesToTodays() {
    if (tempMoviesToUseToday.length < 3) {
      const newMovieArray = ShuffleStringArray(FilterToTitles(importedMovieList));
      let oneMovie = newMovieArray.at(0);
      if (recentlyUsedMovies.includes(`${oneMovie}`))
      {
        console.log("already used" + `${oneMovie}` + " recently")
        const newMovie = newMovieArray.at(1);
        oneMovie = newMovie
        AddMoviesToTodays()
      }
      else
      {
        tempMoviesToUseToday.push(`${oneMovie}`)
        console.log("adding " + `${oneMovie}` + " to todays queue")
        console.log(tempMoviesToUseToday)
      }
    }
    else
    {
      console.log("todays movie queue is ready:")
      console.log(tempMoviesToUseToday)
    }
  }

  if (tempMoviesToUseToday.length < 3)
  {
    AddMoviesToTodays()
  }
  else
  {
    console.log("movie list is set already")
    console.log(tempMoviesToUseToday)
  }

}

//------------------------------------------------------------------------


export default function Home() {
  const [currentMovies, setCurrentMovies] = useState([GetMovieInfoFromTitle(MovieDatabase[0].Title), GetMovieInfoFromTitle(MovieDatabase[1].Title), GetMovieInfoFromTitle(MovieDatabase[2].Title)]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentRating, setCurrentRating] = useState(middleRatingArray[ratingsSelection]);
  const [endScreenVisibility, setEndScreenVisibility] = useState(false);
  const [moreMovies, setMoreMovies] = useState(true)
  const [winner, setWinner] = useState(false);
  const [perfect, setPerfect] = useState(false);

  const stepAmount = [
    0.1,
    1,
    1,
  ]


    // function NewMovieTesting() {
    //   return (
    //     <div>
    //     <div className={`bg-gray-50 rounded-2xl mt-[.5em] text-black px-[1em] py-[.25em] hover:scale-[98%] active:scale-[96%]`}>
    //       <button onClick={() => GenerateNewMovieInfo(importedMovieList)}>
    //         NEW MOVIES
    //       </button>
    //     </div>
    //     <div className={`bg-gray-50 rounded-2xl mt-[.5em] text-black px-[1em] py-[.25em] hover:scale-[98%] active:scale-[96%]`}>
    //       <button onClick={() => PickWhichRatingToUse()}>
    //         New Rating
    //       </button>
    //     </div>
    //     </div>
    //   )
    // }

    function MovieInfoDiv() {
      return(
        <div className="grid grid-cols-2 gap-[12px] w-[960px] h-fit self-center">
          <div className="h-fit aspect-[3/4] rounded-[12px] place-content-center flex flex-col self-center">
            <img src={currentMovies[selectedIndex].moviePosterLink}
              alt="movie poster"
              className={`object-cover rounded-[24px]`}
              />
          </div>

          <div className="flex flex-col w-full gap-[.5em]">
            <div className={`w-full h-fit place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]`}>
              <p className={textStyleTitle}>
                {currentMovies[selectedIndex].movieTitle} ({currentMovies[selectedIndex].movieReleaseYear})
              </p>
            </div>

            <div className={`w-full h-fit place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]`}>
              <p className={`${textStyleSubtitle}`}>
                Director:
              </p>
              <p className={`${textStyleParagraph}`}>
                {currentMovies[selectedIndex].movieDirector}
              </p>
            </div>

            <div className={`w-full h-fit place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]`}>
              <p className={`${textStyleSubtitle}`}>
                Top Billed:
              </p>
              <p className={`${textStyleParagraph}`}>
                {currentMovies[selectedIndex].movieTopBilled}
              </p>
            </div>

            <div className=" w-full h-full place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]">
              <p className={`${textStyleSubtitle}`}>
                Summary:
              </p>
              <p className={`${textStyleParagraph}`}>
                {currentMovies[selectedIndex].movieSummary}
              </p>
            </div>
          </div>
        </div>
      )
    }

    function CompareRatings() {
        const currentMovieRatingArray = 
        [
          currentMovies[selectedIndex].movieRatingIMDB,
          currentMovies[selectedIndex].movieRatingMetascore,
          currentMovies[selectedIndex].movieRatingRottenTomatoes,
        ]

        const newTrimmedRatingsArray = [
          currentMovieRatingArray[0].split("/10"),
          currentMovieRatingArray[1].split("/100"),
          currentMovieRatingArray[2].split("%")
        ]

        const winRangeIMDBMin = (Number(newTrimmedRatingsArray[0][0]) - (marginOfError/10));
        const winRangeIMDBMax = (Number(newTrimmedRatingsArray[0][0]) + (marginOfError/10));
        const winRangeMetascoreMin = (Number(newTrimmedRatingsArray[1][0]) - marginOfError);
        const winRangeMetascoreMax = (Number(newTrimmedRatingsArray[1][0]) + marginOfError);
        const winRangeRottenTomatoesMin = (Number(newTrimmedRatingsArray[2][0]) - marginOfError);
        const winRangeRottenTomatoesMax = (Number(newTrimmedRatingsArray[2][0]) + marginOfError);
        const perfectIMDB = Number(newTrimmedRatingsArray[0][0]);
        const perfectRottenTomatoes = Number(newTrimmedRatingsArray[1][0]);
        const perfectMetacritic = Number(newTrimmedRatingsArray[2][0]);


        const minRatingArray = [winRangeIMDBMin, winRangeMetascoreMin, winRangeRottenTomatoesMin];
        const maxRatingArray = [winRangeIMDBMax, winRangeMetascoreMax, winRangeRottenTomatoesMax];
        const perfectScoreArray = [perfectIMDB, perfectRottenTomatoes, perfectMetacritic]

        console.log("user submitted rating: " + currentRating)
        console.log("compared against: " + perfectScoreArray[ratingsSelection])

        if (currentRating >= minRatingArray[ratingsSelection] && currentRating <= maxRatingArray[ratingsSelection]) 
        {
          if (currentRating == perfectScoreArray[ratingsSelection]) 
          {
            dailyPlayerPoints += moviePointValues[0]
            tempPlayerWinningValue = 0
            console.log("Exact Rating!: + " + moviePointValues[0] + " Points")
            setWinner(true)
            setPerfect(true)
            setEndScreenVisibility(true)
          }
          else 
          {
            dailyPlayerPoints += moviePointValues[1]
            tempPlayerWinningValue = 1
            console.log("Close Enough: + " + moviePointValues[1] + " Points")
            setWinner(true)
            setPerfect(false)
            setEndScreenVisibility(true)
          }
        }
        else 
        { 
          dailyPlayerPoints += moviePointValues[2]
          tempPlayerWinningValue = 2
          console.log("Incorrect Rating: + " + moviePointValues[2] + " Points")
          setWinner(false)
          setEndScreenVisibility(true)
        };
    }

    function SubmitRatingButton() {    
      function CompareRatingText() {
        const currentMovieRatingArray = 
        [
          currentMovies[selectedIndex].movieRatingIMDB,
          currentMovies[selectedIndex].movieRatingMetascore,
          currentMovies[selectedIndex].movieRatingRottenTomatoes,
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
                {currentRating}
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
                {Number(dailyPlayerPoints)}
              </p>
            </div>
          </div>
        )
      }

      function ScoreComparisonDiv() {
        const scoreDivStyle: string[] = [
          "bg-[#00ad5c] text-white",
          "bg-[#02B99E] text-white",
          "bg-[#FF0000] text-white"
        ]
        return (
          <FullBlockerDiv>
            <div className={`${scoreDivStyle[tempPlayerWinningValue]} absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] w-[480px] aspect-[5/3] rounded-[12px] shadow-[2px_2px_12px_#00000060]`}>
              <div className="w-full h-full p-[24px] flex flex-col place-content-center">
                  <p className="self-center text-[24px] font-bold">{WinningTextArray[tempPlayerWinningValue]}</p>
                <CompareRatingText />
                <NextMovieButton />
              </div>
              {/* <ExitThisDivButton/> */}
            </div>
          </FullBlockerDiv>
        )
      }

      // function LosingDiv(){
      //   return (
      //     <FullBlockerDiv>
      //       <div className="absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] w-[480px] aspect-[5/3] bg-[#923f3f] rounded-[12px] shadow-[2px_2px_12px_#00000060]">
      //         <div className="w-full h-full p-[24px] flex flex-col place-content-center">
      //           <p className="self-center text-[24px] font-bold">Incorrect Rating</p>
      //           <CompareRatingText />
      //           <NextMovieButton />
      //         </div>
      //         <ExitThisDivButton/>
      //       </div>
      //     </FullBlockerDiv>
      //   )
      // }
      
      return (
        <>
          <div onClick={() => CompareRatings()} className="w-[196px] h-[64px] my-[12px] self-center place-content-center cursor-pointer bg-[#fafafa] hover:bg-[#dfdfdf] rounded-[1em] hover:scale-[98%] active:scale-[96%]">
              <p className="text-center text-black font-bold">SUBMIT RATING</p>
          </div>
          {
            endScreenVisibility && ( <ScoreComparisonDiv /> )
          }
        </>
      )
    }

    function NoMoreMoviesToday() {
      return (
        <FullBlockerDiv>
          <div className="w-[50%] h-[30%] bg-gray-800 absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] rounded-[1em] justify-center flex flex-col text-[24px] font-bold">
            <p className="self-center">NO MORE MOVIES TODAY</p>
            <p className="self-center">COME BACK TOMORROW!</p>
          </div>
        </FullBlockerDiv>
      )
    }

    function NextMovieButton() {
      function NextMovieIndex() {
        if (selectedIndex < currentMovies.length - 1)
        {
          PickWhichRatingToUse()
          setSelectedIndex(selectedIndex + 1)
          setCurrentRating(middleRatingArray[ratingsSelection])
          setEndScreenVisibility(false)
        }
        else
        {
          // setSelectedIndex(0)
          // setCurrentRating(middleRatingArray[ratingsSelection])
          setEndScreenVisibility(false)
          setMoreMovies(false)
        }
      }
      
      return (
        <>
          <div className="h-[96px] flex flex-row place-content-center">
            <div onClick={() => NextMovieIndex()} className={`w-[128px] h-[48px] bg-[#fafafa] hover:bg-[#dfdfdf] hover:scale-[98%] active:scale-[96%] cursor-pointer rounded-[12px] grid place-content-center my-[.5em] self-end`}>
              <p className="place-self-center h-fit font-bold text-black">NEXT MOVIE</p>
            </div>
          </div>
        </>
      )
    }

  // function ExitThisDivButton() {
  //     return (
  //       <div className="w-fit h-fit text-[12px] text-black font-bold bg-[#fafafa] hover:bg-[#dfdfdf] rounded-full px-[1em] py-[.5em] absolute right-0 top-0 m-[.5em] hover:scale-[98%] cursor-pointer" onClick={() => setEndScreenVisibility(false)}>
  //         <p className="">X</p>
  //       </div>
  //     )
  // }

  function FullBlockerDiv({children}:{children:any}) {
      return (
        <div className={`absolute left-0 top-0 bottom-0 right-0 bg-[#00000050]`}>
          {children}
        </div>
      )
  }

  function ProgressIcons() {
    function CircleIcon({index}:{index:number}) {
      const circleSize = "w-[16px] h-[16px]"
      return (
        <div className={`${index == selectedIndex ? "scale-[125%] bg-[#00ff73]" : index < selectedIndex ? "bg-[#8a8a8a]" : "scale-[100%] bg-[#FAFAFA]"} ${circleSize} rounded-full mt-[12px]`} />
      )
    }

    return (
      <div className="w-fit h-fit flex flex-row self-center gap-[1em] z-[-5]">
        <CircleIcon index={0}/>
        <CircleIcon index={1}/>
        <CircleIcon index={2}/>
      </div>
    )
  }

  return (
    <div className="font-sans grid grid-cols-1 items-center place-items-center h-[100dvh] py-[24px] w-full">
      <main className="flex flex-col items-center self-center">
        <MovieInfoDiv/>
        <div className="flex flex-col items-center w-full my-[16px] gap-[6px]">
          <p className={`text-[20px]`}>
            What do you think this movie is rated on {movieRatingHubText[ratingsSelection]}?
          </p>
          <input type="range" name="ratingSlider" id="ratingSlider" 
                  min={minRatingArray[ratingsSelection]} 
                  max={maxRatingArray[ratingsSelection]}
                  step={stepAmount[ratingsSelection]}
                  value={currentRating}
                  onChange={(e) => setCurrentRating(parseFloat(e.target.value))}
                  className="w-full accent-blue-400 bg-transparent cursor-pointer appearance-none
                                  [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[#ececec] [&::-webkit-slider-runnable-track]:h-auto [&::-webkit-slider-runnable-track]:inset-shadow-[2px_2px_4px_#00000020,-2px_-2px_4px_#00000020]
                                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00ff73] [&::-webkit-slider-thumb]:shadow-[0px_0px_8px_#00000040] [&::-webkit-slider-thumb]:scale-[125%]  [&::-webkit-slider-thumb]:hover:scale-[150%] [&::-webkit-slider-thumb]:active:scale-[170%]"/>
          <label htmlFor="ratingSlider">Rating: {currentRating}</label>
        </div>
        <SubmitRatingButton />
        <ProgressIcons />
        { !moreMovies && <NoMoreMoviesToday/> }
        {/* <NewMovieTesting/> */}
      </main>
    </div>
  );
}