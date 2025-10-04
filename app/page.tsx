/* eslint-disable @next/next/no-img-element */
'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import InputSlider from "react-input-slider";
import { MovieDatabase } from "./movie-database.json";

const importedMovieList = MovieDatabase
let currentMovieInfoArray: ISimplifiedMovieInformation[] = [];

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
}

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
}

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
}

const recentlyUsedMovies : string[] = [];
const tempMovieTitleArray = FilterToTitles(importedMovieList);

const textStyleTitle = "text-[24px] font-bold";
const textStyleSubtitle = "text-[14px] font-semibold"
const textStyleParagraph = "text-[16px]"

const minRating = 0;
const maxRating = 10;
const middleRating = ((maxRating-minRating)/2);

let ratingsSelection = 0 // 0 = IMDB, 1 = Metascore, 2 = Rotten Tomatoes
const minRatingArray = [0, 0, 0]
const maxRatingArray = [10, 100, 100]
const middleRatingArray = [5, 50, 50]


function ShuffleStringArray(array: string[]) 
  {
    const shuffled_array = structuredClone(array);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i - 1));
        [shuffled_array[i], shuffled_array[j]] = [shuffled_array[j], shuffled_array[i]];
    }
    return shuffled_array;
  }


function FilterToTitles(data:IFullMovieInformation[]) {
  const movieNames : string[] = [];
    for (let i = data.length - 1; i >= 0; i--) {
      movieNames.push(data[i].Title)
    }
    return movieNames
  }



function GenerateNewMovieInfo(data:IFullMovieInformation[]) {
  function GetMovieInfoFromTitle(title: string) {
    const TitleInfo = data.find(movie => movie.Title === title) || EmptyMovieData;
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

  function ClearCurrentMovieArray() {
    if (currentMovieInfoArray.length > 0)
      {
        currentMovieInfoArray = []
      }
  }

  function AddThreeNewMovies(titleArray: string[]) {
    ClearCurrentMovieArray()
    for (let i = 3; i > 0; i--) 
      {
        const thisMovieData = GetMovieInfoFromTitle(titleArray[i])
        currentMovieInfoArray.push(thisMovieData)
      }
  }

  AddThreeNewMovies(ShuffleStringArray(tempMovieTitleArray))
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

function GetRandomInt(min:number, max:number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


function PickWhichRatingToUse(data:ISimplifiedMovieInformation) {
  // let [selectedRating, setSelectedRating] = useState(0)
  const RatingsArray = 
  [
    data.movieRatingIMDB,
    data.movieRatingMetascore,
    data.movieRatingRottenTomatoes,
  ]

  const rolledRatingNumber = GetRandomInt(0, RatingsArray.length)
  console.log(data.movieTitle)
  console.log("rolled number: " + rolledRatingNumber)
  console.log("picked rating: " + RatingsArray[rolledRatingNumber])
  ratingsSelection = rolledRatingNumber;
  return RatingsArray[rolledRatingNumber]
}



export default function Home() {
  let [selectedIndex, setSelectedIndex] = useState(0);
  const [currentRating, setCurrentRating] = useState(middleRatingArray[ratingsSelection]);
  const [endScreenVisibility, setEndScreenVisibility] = useState(false);
  const [winner, setWinner] = useState(false);
  const [perfect, setPerfect] = useState(false);


  function NewMovieTesting() {
    return (
      <div>
      <div className={`bg-gray-50 rounded-2xl mt-[.5em] text-black px-[1em] py-[.25em] hover:scale-[98%] active:scale-[96%]`}>
        <button onClick={() => GenerateNewMovieInfo(importedMovieList)}>
          NEW MOVIES
        </button>
      </div>
      <div className={`bg-gray-50 rounded-2xl mt-[.5em] text-black px-[1em] py-[.25em] hover:scale-[98%] active:scale-[96%]`}>
        <button onClick={() => PickWhichRatingToUse(currentMovieInfoArray[selectedIndex])}>
          New Rating
        </button>
      </div>
      </div>
    )
  }

  function MovieInfoDiv() {
    return(
      <div className="grid grid-cols-2 gap-[12px] w-[960px] h-fit self-center">
        <div className="h-fit aspect-[3/4] rounded-[12px] place-content-center flex flex-col self-center">
          <img src={currentMovieInfoArray[selectedIndex].moviePosterLink}
            alt="movie poster"
            className={`object-cover rounded-[24px]`}
            />
        </div>

        <div className="flex flex-col w-full gap-[.5em]">
          <div className={`w-full h-fit place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]`}>
            <p className={`${textStyleTitle}`}>
              {currentMovieInfoArray[selectedIndex].movieTitle} ({currentMovieInfoArray[selectedIndex].movieReleaseYear})
            </p>
          </div>

          <div className={`w-full h-fit place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]`}>
            <p className={`${textStyleSubtitle}`}>
              Director:
            </p>
            <p className={`${textStyleParagraph}`}>
              {currentMovieInfoArray[selectedIndex].movieDirector}
            </p>
          </div>

          <div className={`w-full h-fit place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]`}>
            <p className={`${textStyleSubtitle}`}>
              Top Billed:
            </p>
            <p className={`${textStyleParagraph}`}>
              {currentMovieInfoArray[selectedIndex].movieTopBilled}
            </p>
          </div>

          <div className=" w-full h-full place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]">
            <p className={`${textStyleSubtitle}`}>
              Summary:
            </p>
            <p className={`${textStyleParagraph}`}>
              {currentMovieInfoArray[selectedIndex].movieSummary}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // function RatingSliderDiv2() {
  //   const [state, setState] = useState({ x: 10 });
    
  //   return (
  //     <div className="flex flex-col items-center my-[16px] gap-[6px]">
  //       <p className={`text-[20px]`}>
  //         What do you think this movie is rated?
  //       </p>
  //       <div>
  //         ({state.x})
  //           <InputSlider axis="x" x={state.x} onChange={setState} />
  //           <InputSlider
  //               axis="x"
  //               x={state.x}
  //               onChange={
  //                   ({ x }) =>
  //                       setState(state => ({ ...state, x }))}/>
  //       </div>
  //     </div>
  //   )
  // }

  function RatingSliderDiv() {
  const handleRatingChange = (e:any) => {
    console.log("rating value " + e.target.value)
    setCurrentRating(e.target.value);
  };
  const movieRatingHubText = [
    "IMDB (out of 10)",
    "Metascore (out of 100)",
    "Rotten Tomatoes (out of 100%)"
  ]

    return (
      <div className="flex flex-col items-center my-[16px] gap-[6px]">
        <p className={`text-[20px]`}>
          What do you think this movie is rated on {movieRatingHubText[ratingsSelection]}?
        </p>
        <input type="range" name="ratingSlider" id="ratingSlider" min={minRatingArray[ratingsSelection]} max={maxRatingArray[ratingsSelection]} defaultValue={currentRating} step={0.1} onChange={handleRatingChange} className="w-[960px]"/>
        <label htmlFor="ratingSlider">Rating: {currentRating}</label>
      </div>
    )
  }

  function CompareRatings() {
      console.log(currentRating)
      console.log(currentMovieInfoArray[selectedIndex].movieRatingIMDB)

      const winRangeIMDBMin = (Number(currentMovieInfoArray[selectedIndex].movieRatingIMDB) - 0.4)
      const winRangeIMDBMax = (Number(currentMovieInfoArray[selectedIndex].movieRatingIMDB) + 0.4)
      const winRangeMetascoreMin = (Number(currentMovieInfoArray[selectedIndex].movieRatingMetascore) - 4)
      const winRangeMetascoreMax = (Number(currentMovieInfoArray[selectedIndex].movieRatingMetascore) + 4)
      const winRangeRottenTomatoesMin = (Number(currentMovieInfoArray[selectedIndex].movieRatingRottenTomatoes) - 4)
      const winRangeRottenTomatoesMax = (Number(currentMovieInfoArray[selectedIndex].movieRatingRottenTomatoes) + 4)

      const minRatingArray = [winRangeIMDBMin, winRangeMetascoreMin, winRangeRottenTomatoesMin];
      const maxRatingArray = [winRangeIMDBMax, winRangeMetascoreMax, winRangeRottenTomatoesMax];

      if (currentRating >= minRatingArray[ratingsSelection] && currentRating <= maxRatingArray[ratingsSelection]) 
      {
        if (currentRating == Number(currentMovieInfoArray[selectedIndex].movieRatingIMDB || currentMovieInfoArray[selectedIndex].movieRatingMetascore || currentMovieInfoArray[selectedIndex].movieRatingRottenTomatoes)) 
          {
            console.log("Exact Rating!")
            setWinner(true)
            setPerfect(true)
            setEndScreenVisibility(true)
          }
        else 
          {
            console.log("Close Enough")
            setWinner(true)
            setPerfect(false)
            setEndScreenVisibility(true)
          }
      }
      else 
      { 
        console.log("Not Close Enough!")
        setWinner(false)
        setEndScreenVisibility(true)
      };
  }

  function SubmitRatingButton() {    
    return (
      <>
        <div onClick={() => CompareRatings()} className="w-[196px] h-[64px] my-[12px] self-center place-content-center cursor-pointer bg-[#fafafa] hover:bg-[#dfdfdf] rounded-[1em] hover:scale-[98%] active:scale-[96%]">
            <p className="text-center text-black font-bold">SUBMIT RATING</p>
        </div>
        {
          endScreenVisibility && winner && ( <CloseEnoughDiv /> )
        }
        {
          endScreenVisibility && !winner && ( <LosingDiv /> )
        }
      </>
    )
  }

  function NextMovieButton() {
    function NextMovieIndex() {
      if (selectedIndex < currentMovieInfoArray.length-1)
      {
        setSelectedIndex(selectedIndex += 1)
        setEndScreenVisibility(false)
      }
      else
      {
        setSelectedIndex(selectedIndex = 0)
        setEndScreenVisibility(false)
      }
    }
    
    return (
      <div className="h-[96px] flex flex-row place-content-center">
        <div onClick={() => NextMovieIndex()} className={`w-[128px] h-[48px] bg-[#fafafa] hover:bg-[#dfdfdf] hover:scale-[98%] active:scale-[96%] cursor-pointer rounded-[12px] grid place-content-center my-[.5em] self-end`}>
          <p className="place-self-center h-fit font-bold text-black">NEXT MOVIE</p>
        </div>
      </div>
    )
  }


  function ExitThisDivButton() {
    return (
      <div className="w-fit h-fit text-[12px] text-black font-bold bg-[#fafafa] hover:bg-[#dfdfdf] rounded-full px-[1em] py-[.5em] absolute right-0 top-0 m-[.5em] hover:scale-[98%] cursor-pointer" onClick={() => setEndScreenVisibility(false)}>
        <p className="">X</p>
      </div>
    )
  }

  function FullBlockerDiv({children}:{children:any}) {
    return (
      <div className={`absolute left-0 top-0 bottom-0 right-0 bg-[#00000050]`}>
        {children}
      </div>
    )
  }

  function CompareRatingText() {
    const currentMovieRatingArray = 
    [
      currentMovieInfoArray[selectedIndex].movieRatingIMDB,
      currentMovieInfoArray[selectedIndex].movieRatingMetascore,
      currentMovieInfoArray[selectedIndex].movieRatingRottenTomatoes,
    ]
    
    return (
      <div className="w-fit h-fit self-center flex flex-col">
        <div className="w-fit h-fit self-center flex flex-row items-center gap-[.25em]">
          <p className="text-[14px] align-middle">
            {`Your Rating:`}
          </p>
          <p className={`${perfect ? "text-[#FFFFFF]" : "text-[#FFFF00]"} text-[18px] font-bold align-middle`}>
            {currentRating}
          </p>
        </div>
        <div className="w-fit h-fit self-center flex flex-row items-center gap-[.25em]">
          <p className="text-[14px] align-middle">
            {`Actual Rating:`}
          </p>
          <p className={`${perfect ? "text-[#FFFFFF]" : "text-[#00ff6a]"} text-[18px] font-bold align-middle `}>
            {Number(currentMovieRatingArray[ratingsSelection])}
          </p>
        </div>
      </div>
    )
  }


  function CloseEnoughDiv() {
    return (
      <FullBlockerDiv>
        <div className={`${perfect ? "bg-[#00ad5c] text-white" : "bg-[#62656b]"} absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] w-[480px] aspect-[5/3] rounded-[12px] shadow-[2px_2px_12px_#00000060]`}>
          <div className="w-full h-full p-[24px] flex flex-col place-content-center">
            {
              perfect ?
              <p className="self-center text-[24px] font-bold">BRILLIANTLY DONE!</p>
              :
              <p className="self-center text-[24px] font-bold">CLOSE ENOUGH, I GUESS</p>
            }
            <CompareRatingText />
            <NextMovieButton />
          </div>
          <ExitThisDivButton/>
        </div>
      </FullBlockerDiv>
    )
  }

  function LosingDiv(){
    return (
      <FullBlockerDiv>
        <div className="absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] w-[480px] aspect-[5/3] bg-[#923f3f] rounded-[12px] shadow-[2px_2px_12px_#00000060]">
          <div className="w-full h-full p-[24px] flex flex-col place-content-center">
            <p className="self-center text-[24px] font-bold">NO THAT IS WRONG</p>
            <CompareRatingText />
            <NextMovieButton />
          </div>
          <ExitThisDivButton/>
        </div>
      </FullBlockerDiv>
    )
  }


  function ProgressIcons() {
    function CircleIcon({index}:{index:number}) {
      return (
        <div onClick={() => setSelectedIndex(index)} className="w-[24px] h-[24px] bg-[#FAFAFA] hover:bg-[#DADADA] rounded-full mt-[12px] cursor-pointer hover:scale-[95%] active:scale-[90%]" />
      )
    }

    return (
      <div className="w-fit h-fit flex flex-row self-center gap-[1em]">
        <CircleIcon index={0}/>
        <CircleIcon index={1}/>
        <CircleIcon index={2}/>
      </div>
    )
  }


  GenerateNewMovieInfo(importedMovieList)

  return (
    <div className="font-sans grid grid-cols-1 items-center place-items-center h-[100dvh] py-[24px] w-full">
      <main className="flex flex-col items-center self-center">
        <MovieInfoDiv/>
        <RatingSliderDiv />
        <SubmitRatingButton />
        <ProgressIcons />
        <NewMovieTesting/>
      </main>
    </div>
  );
}