import React from "react";
import { GetPlayerRatingScoreIndexValue } from "./compare-movie-scores";
import { IPlayerStats } from "./player-stats";

//------------------------------------------------------------------------

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

//------------------------------------------------------------------------

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


function CompareRatingTextDiv({playerScoreComparisonValue, currentPlayerMovieRating, actualMovieRating, playerStats}:{playerScoreComparisonValue:number, currentPlayerMovieRating:number, actualMovieRating:string, playerStats:IPlayerStats}) {    
    return (
        <div className="w-fit h-fit self-center flex flex-col">
            <p className={`self-center text-[24px] font-bold`}>{WinningTextArray[playerScoreComparisonValue]}</p>
            <TextAndScoreDiv titleText="Your Rating" secondaryText={`${currentPlayerMovieRating}`} />
            <TextAndScoreDiv titleText="Actual Rating" secondaryText={`${actualMovieRating}`} />
            <TextAndScoreDiv titleText="Your Score Today" secondaryText={`${playerStats.todaysScore}`} />
        </div>
    )
}


function NextMovieButton({onNextMovie}:{onNextMovie?:()=>void}) {
    return (
        <div className="h-[96px] flex flex-row place-content-center">
            <div onClick={() => onNextMovie?.()} className={`w-[128px] h-[48px] bg-[#fafafa] hover:bg-[#dfdfdf] hover:scale-[98%] active:scale-[96%] cursor-pointer rounded-[12px] grid place-content-center my-[.5em] self-end`}>
                <p className="place-self-center h-fit font-bold text-black">NEXT MOVIE</p>
            </div>
        </div>
    )
}

//------------------------------------------------------------------------

export function ScoreComparisonDiv({ratingSourceInt, actualMovieRating, playerMovieRating, playerStats, onNextMovie}:{ratingSourceInt:number, actualMovieRating:string, playerMovieRating:number, playerStats:IPlayerStats, onNextMovie:()=>void}) {
    const playerScoreRatingValue = GetPlayerRatingScoreIndexValue({ratingSourceInt:ratingSourceInt, movieRatingString:actualMovieRating, playerMovieRating:playerMovieRating})
    return (
        <div className={`absolute left-0 top-0 bottom-0 right-0 bg-[#000000DD] z-10`}>
            <div className={`${scoreDivStyle[playerScoreRatingValue]} absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] w-[480px] aspect-[5/3] rounded-[12px] shadow-[2px_2px_12px_#00000060] flex flex-col place-content-center`}>
                <CompareRatingTextDiv playerScoreComparisonValue={playerScoreRatingValue} currentPlayerMovieRating={playerMovieRating} actualMovieRating={actualMovieRating} playerStats={playerStats}/>
                <NextMovieButton onNextMovie={onNextMovie}/>
            </div>
        </div>
    )
}