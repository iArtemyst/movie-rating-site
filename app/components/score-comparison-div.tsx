'use client'

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

function TextAndScoreDiv({titleText, statsText}:{titleText:string, statsText:string}) {
    return (
        <div className="divCenterHorizontalText">
            <p className="scoreTextSecondary">{titleText}</p>
            <p className={`scoreTextPrimary`}>{statsText}</p>
        </div>
    )
}

//------------------------------------------------------------------------

export function ScoreComparisonDiv({visible, ratingSourceInt, actualMovieRating, playerMovieRating, playerStats, onNextMovie}:{visible:boolean, ratingSourceInt:number, actualMovieRating:string, playerMovieRating:number, playerStats:IPlayerStats | null, onNextMovie:()=>void}) {
    const playerScoreRatingValue = GetPlayerRatingScoreIndexValue({ratingSourceInt:ratingSourceInt, movieRatingString:actualMovieRating, playerMovieRating:playerMovieRating})
    return (
        <>
        { 
            visible &&
            <div className={`fullScreenBlockingDiv`}>
                <div className={`${scoreDivStyle[playerScoreRatingValue]} popupBackgroundDiv`}>
                    <p className={`popupTitleText`}>{WinningTextArray[playerScoreRatingValue]}</p>
                    <TextAndScoreDiv titleText="Your Rating:" statsText={`${playerMovieRating}`} />
                    <TextAndScoreDiv titleText="Actual Rating:" statsText={`${actualMovieRating}`} />
                    <TextAndScoreDiv titleText="Your Score Today:" statsText={playerStats ? `${playerStats.todaysScore}` : "No Stats"} />                    
                    <div onClick={() => onNextMovie?.()} className={`submitButton`}>
                        <p>NEXT MOVIE</p>
                    </div>
                </div>
            </div>
        }
        </>
    )
}