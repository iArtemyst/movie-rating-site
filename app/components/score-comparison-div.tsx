'use client'

import React from "react";
import { GetPlayerRatingScoreIndexValue, SplitMovieRatingStringAndReturnNumber } from "./compare-movie-scores";
import { IPlayerStats } from "./player-stats";
import { ratingStringEndings } from "./movie-interfaces";
import { IMovieScoreInfo } from "./average-score-data";


const WinningTextArray: string[] = [
    "Perfect!",
    "Excellent!",
    "Pretty Good!",
    "Close Enough!",
    "Sorry, That's Incorrect!",
];
const scoreDivStyle: string[] = [
    "bg-[#18a045]",
    "bg-[#388863]",
    "bg-[#5c3fa0]",
    "bg-[#296392]",
    "bg-[#612323]"
];


function PlayerVsActualRatingsGraph({correctRating, playerRating, sourceIndex}:{correctRating:string, playerRating:number, sourceIndex:number}) {
    const playerScoreRatingValue = GetPlayerRatingScoreIndexValue({ratingSourceInt:sourceIndex, movieRatingString:correctRating, playerMovieRating:playerRating});

    return (
        <div className="ratingBarComparisonContainer">
            <div className="w-full h-fit relative">
                <p 
                    className={`ratingBarCorrectScoreText`}
                    style={{ left: `${sourceIndex === 0 ? Number(correctRating)*10 : correctRating}%` }}>
                Actual Rating: {correctRating}{ratingStringEndings[sourceIndex]}</p>
            </div>

            <div className={`fullRatingBarBG bg-slate-50`}>
                <div 
                    className={`closeEnoughRatingBar bg-[#b13c46]`}
                    style={{ left: `${sourceIndex === 0 ? Number(correctRating)*10 : correctRating}%` }}>
                    <div className={`greatRatingBar bg-[#ff6a56]`}>
                        <div className={`excellentRatingBar bg-[#ff985d]`}>
                            <div className={`perfectRatingBar bg-[#ffbb00]`} />
                        </div>
                    </div>
                </div>
                <div 
                    className={`playerRatingBar ${scoreDivStyle[playerScoreRatingValue]}`}
                    style={{ left: `${sourceIndex === 0 ? playerRating*10 : playerRating}%` }}
                />
            </div>

            <div className="w-full h-fit relative">
                <p 
                    className={`${scoreDivStyle[playerScoreRatingValue]} ratingBarPlayerText`}
                    style={{ left: `${sourceIndex === 0 ? playerRating*10 : playerRating}%` }}>
                    Your Rating: {playerRating}{ratingStringEndings[sourceIndex]}
                </p>
            </div>
        </div>
    )
}

export function ScoreComparisonDiv({visible, ratingIndex: ratingSourceInt, actualMovieRating, playerMovieRating, playerStats, selectedIndex, onNextMovie}:{visible:boolean, ratingIndex:number, actualMovieRating:string, playerMovieRating:number, playerStats:IPlayerStats | null, selectedIndex:number, onNextMovie:()=>Promise<void>}) {
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
                <div className={` popupBackgroundDiv`}>
                    <p className={`popupTitleText`}>{WinningTextArray[playerScoreRatingValue]}</p>
                    <PlayerVsActualRatingsGraph playerRating={playerMovieRating} correctRating={String(movieRatingAsNumber)} sourceIndex={ratingSourceInt}/>
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