'use client'

import React from "react";
import { GetPlayerRatingScoreIndexValue, SplitMovieRatingStringAndReturnNumber } from "./compare-movie-scores";
import { IPlayerStats } from "./player-stats";


const WinningTextArray: string[] = [
    "Perfect!",
    "Excellent!",
    "Pretty Good!",
    "Close Enough!",
    "Sorry, That's Incorrect!",
];
const scoreDivStyle: string[] = [
    "bg-[#005731]",
    "bg-[#00362a]",
    "bg-[#2a337a]",
    "bg-[#432a5e]",
    "bg-[#612323]"
];


function DisplayErrorOnGuess({correctRating, playerRating, sourceIndex}:{correctRating:number, playerRating:number, sourceIndex:number}) {
    return (
        <div className="ratingBarComparisonContainer">
            <div className="w-full h-fit relative">
                <p 
                    className={`ratingBarCorrectScoreText`}
                    style={{ left: `${sourceIndex === 0 ? correctRating*10 : correctRating}%` }}>
                Actual Rating: {correctRating}</p>
            </div>

            <div className={`fullRatingBarBG bg-slate-50`}>
                <div 
                    className={`closeEnoughRatingBar bg-[#a8bfff99]`}
                    style={{ left: `${sourceIndex === 0 ? correctRating*10 : correctRating}%` }}>
                    <div className={`greatRatingBar bg-[#6a90f899]`}>
                        <div className={`excellentRatingBar bg-[#4073ff99]`}>
                            <div className={`perfectRatingBar bg-[#2f00ff]`} />
                        </div>
                    </div>
                </div>
                <div 
                    className={`playerRatingBar bg-[#00a558]`}
                    style={{ left: `${sourceIndex === 0 ? playerRating*10 : playerRating}%` }}
                />
            </div>

            <div className="w-full h-fit relative">
                <p 
                    className={`ratingBarPlayerText`}
                    style={{ left: `${sourceIndex === 0 ? playerRating*10 : playerRating}%` }}>
                    Your Rating: {playerRating}
                </p>
            </div>
        </div>
    )
}

export function ScoreComparisonDiv({visible, ratingIndex: ratingSourceInt, actualMovieRating, playerMovieRating, playerStats, selectedIndex, onNextMovie}:{visible:boolean, ratingIndex:number, actualMovieRating:string, playerMovieRating:number, playerStats:IPlayerStats | null, selectedIndex:number, onNextMovie:()=>void}) {
    const playerScoreRatingValue = GetPlayerRatingScoreIndexValue({ratingSourceInt:ratingSourceInt, movieRatingString:actualMovieRating, playerMovieRating:playerMovieRating});
    const movieRatingAsNumber = SplitMovieRatingStringAndReturnNumber({ratingSourceInt:ratingSourceInt, movieRatingString:actualMovieRating});
    const buttonTextArray = [
        "NEXT MOVIE",
        "VIEW STATS"
    ]

    function TextAndScoreDiv({titleText, statsText}:{titleText:string, statsText:string}) {
        return (
            <div className="divCenterHorizontalText">
                <p className="scoreTextSecondary">{titleText}</p>
                <p className={`scoreTextPrimary`}>{statsText}</p>
            </div>
        )
    }

    return (
        <>
        { 
            visible &&
            <div className={`fullScreenBlockingDiv`}>
                <div className={`${scoreDivStyle[playerScoreRatingValue]} popupBackgroundDiv`}>
                    <p className={`popupTitleText`}>{WinningTextArray[playerScoreRatingValue]}</p>
                    <DisplayErrorOnGuess playerRating={playerMovieRating} correctRating={movieRatingAsNumber} sourceIndex={ratingSourceInt}/>
                    <TextAndScoreDiv titleText="Today's Score:" statsText={playerStats ? `${playerStats.todaysScore}` : "No Stats"} />
                    <div onClick={() => onNextMovie?.()} className={`submitButton`}>
                        <p>
                            { 
                                selectedIndex < 2 ?
                                buttonTextArray[0]
                                :
                                buttonTextArray[1]
                            }
                        </p>
                    </div>
                </div>
            </div>
        }
        </>
    )
}