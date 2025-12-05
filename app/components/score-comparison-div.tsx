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
    "bg-[#228f4f]",
    "bg-[#086e60]",
    "bg-[#25318a]",
    "bg-[#752061]",
    "bg-[#54040f]"
];


function DisplayErrorOnGuess({correctRating, playerRating, sourceIndex}:{correctRating:number, playerRating:number, sourceIndex:number}) {
    function GetPositionOfDivA() {
        if (sourceIndex === 0) {
            return (correctRating * 10)
        }
        else {
            return (correctRating)
        }
    }

    function GetPositionOfPlayerScoreDiv() {
        if (sourceIndex === 0) {
            return (playerRating * 10)
        }
        else {
            return (playerRating)
        }
    }

    const closeEnoughDivPosition = "left-[" + String(correctRating) + "%] ";
    const playerScoreDivPosition = "left-[" + String(playerRating) + "%] ";
    const closeEnoughDivPosition2 = "left-[" + String(correctRating * 10) + "%] ";
    const playerScoreDivPosition2 = "left-[" + String(playerRating * 10) + "%] ";

    const div1pos = ( sourceIndex === 0 ? closeEnoughDivPosition2 : closeEnoughDivPosition )
    const div2pos = ( sourceIndex === 0 ? playerScoreDivPosition2 : playerScoreDivPosition )

    const textStyle: string = "w-fit h-fit text-[12px] sm:text-[12px] md:text-[16px] lg:text-[18px] px-[.75em] py-[.5em] text-nowrap rounded-full bg-[#00000099]";

    return (
        <div className="w-full h-fit relative flex flex-col place-items-center gap-[.5em]">
            <div className="w-fit h-fit relative">
                <p className={`${textStyle}`}>Actual Rating: {correctRating}</p>
            </div>

            {/* <div className={`relative w-full h-[16px] rounded-full overflow-clip bg-slate-50`}>
                <div className={`absolute ${div1pos} w-[20%] h-full bg-purple-400 z-0 -translate-x-[50%]`} />
                <div className={`absolute ${div1pos} w-[10%] h-full bg-blue-400 z-5 -translate-x-[50%]`} />
                <div className={`absolute ${div1pos} w-[1%] h-full bg-green-400 z-10 -translate-x-[50%]`} />
                <div className={`absolute ${div2pos} w-[1%] h-full bg-yellow-400 -translate-x-[50%]`} />
            </div> */}

            <div className="w-fit h-fit relative">
                <p className={`${textStyle}`}>Your Rating: {playerRating}</p>
            </div>

            {/* <p>{div1pos} {div2pos}</p> */}
        </div>
    )
}

export function ScoreComparisonDiv({visible, ratingSourceInt, actualMovieRating, playerMovieRating, playerStats, selectedIndex, onNextMovie}:{visible:boolean, ratingSourceInt:number, actualMovieRating:string, playerMovieRating:number, playerStats:IPlayerStats | null, selectedIndex:number, onNextMovie:()=>void}) {
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
                    <TextAndScoreDiv titleText="Your Total Score Today:" statsText={playerStats ? `${playerStats.todaysScore}` : "No Stats"} />
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