'use client'

import Image from "next/image";
import { useState } from "react";
import InputSlider from "react-input-slider";
import { MovieDatabase } from "./movie-database.json";

const importedMovieList = MovieDatabase

interface IMovieInformation
{
  movieTitle: string, 
  movieDirector: string, 
  movieReleaseYear: string, 
  movieTopBilled: string, 
  movieSummary: string, 
  moviePosterLink: string,
  movieRating: number,
}


const textStyleTitle = "text-[24px] font-bold";
const textStyleSubtitle = "text-[14px] font-semibold"
const textStyleParagraph = "text-[16px]"

const minRating = 0;
const maxRating = 10;
const middleRating = ((maxRating-minRating)/2);


export default function Home() {
  let [selectedIndex, setSelectedIndex] = useState(0);
  let [currentRating, setCurrentRating] = useState(middleRating)
  let [endScreenVisibility, setEndScreenVisibility] = useState(false)
  let [winner, setWinner] = useState(false)
  let [perfect, setPerfect] = useState(false)

  const handleRatingChange = (e:any) => {
    console.log("rating value " + e.target.value)
    setCurrentRating(e.target.value);
  };
  
  // function SelectMovieToDisplay({index}:{index:number}) {
  //   if (index < testingMovieInfo.length)
  //     {
  //       setSelectedIndex(selectedIndex += 1)
  //     }
  //   else
  //     {
  //       setSelectedIndex(0)
  //     }
  //   return selectedIndex
  // };

  function MovieInfoDiv() {
    return(
      <div className="grid grid-cols-2 gap-[12px] w-[960px] h-fit self-center">
        <div className="h-fit aspect-[3/4] rounded-[12px] place-content-center flex flex-col self-center">
          {/* <p className=" w-fit h-fit place-self-center px-[1em] py-[.5em]">
            poster spot
          </p> */}
          <img src={importedMovieList[selectedIndex].Poster}
            alt="movie poster"
            className={`object-cover rounded-[24px]`}/>
        </div>

        <div className="flex flex-col w-full gap-[.5em]">
          <div className={`w-full h-fit place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]`}>
            <p className={`${textStyleTitle}`}>
              {importedMovieList[selectedIndex].Title} ({importedMovieList[selectedIndex].Year})
            </p>
          </div>

          <div className={`w-full h-fit place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]`}>
            <p className={`${textStyleSubtitle}`}>
              Director:
            </p>
            <p className={`${textStyleParagraph}`}>
              {importedMovieList[selectedIndex].Director}
            </p>
          </div>

          <div className={`w-full h-fit place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]`}>
            <p className={`${textStyleSubtitle}`}>
              Top Billed:
            </p>
            <p className={`${textStyleParagraph}`}>
              {importedMovieList[selectedIndex].Actors}
            </p>
          </div>

          <div className=" w-full h-full place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]">
            <p className={`${textStyleSubtitle}`}>
              Summary:
            </p>
            <p className={`${textStyleParagraph}`}>
              {importedMovieList[selectedIndex].Plot}
            </p>
          </div>
        </div>
      </div>
    )
  }

  function RatingSliderDiv() {
    return (
      <div className="flex flex-col items-center my-[16px] gap-[6px]">
        <p className={`text-[20px]`}>
          What do you think this movie is rated?
        </p>
        <input name="ratingSlider" id="ratingSlider" type="range" min={minRating} max={maxRating} value={currentRating} step={.1} onChange={handleRatingChange} className="w-[960px]"/>
        <label htmlFor="ratingSlider">Rating: {currentRating}</label>
      </div>
    )
  }

  function CompareRatings() {
      console.log(currentRating)
      console.log(importedMovieList[selectedIndex].imdbRating)

      const winRangeMin = (Number(importedMovieList[selectedIndex].imdbRating) - 0.3)
      const winRangeMax = (Number(importedMovieList[selectedIndex].imdbRating) + 0.3)

      if (currentRating >= winRangeMin && currentRating <= winRangeMax) 
      {
        if (currentRating == Number(importedMovieList[selectedIndex].imdbRating)) 
          {
            console.log("Perfectly Rated!")
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
      if (selectedIndex < importedMovieList.length-1)
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
            {Number(importedMovieList[selectedIndex].imdbRating)}
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

  return (
    <div className="font-sans grid grid-cols-1 items-center place-items-center h-[100dvh] py-[24px] w-full">
      <main className="flex flex-col items-center self-center">
        <MovieInfoDiv/>
        <RatingSliderDiv />
        <SubmitRatingButton />
        <ProgressIcons />
      </main>
    </div>
  );
}