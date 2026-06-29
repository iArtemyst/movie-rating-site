'use client'

import React from "react";
import { GetPlayerRatingScoreIndexValue, SplitMovieRatingStringAndReturnNumber } from "./compare-movie-scores";
import { IPlayerStats } from "./player-stats";
import { ratingStringEndings } from "./movie-interfaces";


const WinningTextArray: string[] = [
    "Perfect!",
    "Nearly Perfect!",
    "Excellent!",
    "Pretty Good!",
    "Close Enough!",
    "Sorry, That's Incorrect!",
];


export function PlayerOverallRatingGraph({communityRating, playerRating}:{communityRating:number, playerRating:number}) {
    const communityOverallScorePercentage = (communityRating/1500)*100;
    const playerOverallScorePercentage = (playerRating/1500)*100;
    
    return (
        <div className="overallScoreBarContainer">

            <div className="w-full h-fit relative">
                <p 
                    className={`bg-[#00ff4c] overallScoreText`}
                    style={{ left: `${playerOverallScorePercentage}%` }}>
                    Your Score: {playerRating}/1500
                </p>
            </div>
            <div className={`fullRatingBarBG bg-[#f5f5f5]`}>
                <div 
                    className={`overallScoreLine bg-[#ffbb00]`}
                    style={{ left: `${communityOverallScorePercentage}%` }}
                />
                <div 
                    className={`overallScoreLine bg-[#00ff4c]`}
                    style={{ left: `${playerOverallScorePercentage}%` }}
                />
            </div>

            <div className="w-full h-fit relative">
                <p 
                    className={`overallScoreText bg-[#ffbb00]`}
                    style={{ left: `${communityOverallScorePercentage}%` }}>
                    Community Avg: {communityRating}/1500
                </p>
            </div>
        </div>
    )
}

function PlayerVsActualRatingsGraph({correctRating, playerRating, sourceIndex}:{correctRating:string, playerRating:number, sourceIndex:number}) {
    return (
        <div className="ratingBarComparisonContainer">
            <div className="w-full h-fit relative">
                <p 
                    className={`ratingBarCorrectScoreText`}
                    style={{ left: `${sourceIndex === 0 ? Number(correctRating)*10 : correctRating}%` }}>
                Actual Rating: {sourceIndex === 0 ? Number(correctRating).toFixed(1) + ratingStringEndings[sourceIndex] : correctRating + ratingStringEndings[sourceIndex] }</p>
            </div>

            <div className={`fullRatingBarBG bg-[#f5f5f5]`}>
                <div 
                    className={`closeEnoughRatingBar bg-[#b13c46]`}
                    style={{ left: `${sourceIndex === 0 ? Number(correctRating)*10 : correctRating}%` }}>
                    <div className={`greatRatingBar bg-[#ff6a56]`}>
                        <div className={`excellentRatingBar bg-[#ff985d]`}>
                            <div className={`nearlyPerfectRatingBar bg-[#ffbb00]`}>
                                <div className={`perfectRatingBar bg-[#fbff00]`} />
                            </div>
                        </div>
                    </div>
                </div>
                <div 
                    className={`playerRatingBar bg-[#00ff4c]`}
                    style={{ left: `${sourceIndex === 0 ? playerRating*10 : playerRating}%` }}
                />
            </div>

            <div className="w-full h-fit relative">
                <p 
                    className={`bg-[#00ff4c] ratingBarPlayerText`}
                    style={{ left: `${sourceIndex === 0 ? playerRating*10 : playerRating}%` }}>
                    Your Rating: {sourceIndex === 0 ? playerRating.toFixed(1) + ratingStringEndings[sourceIndex] : playerRating + ratingStringEndings[sourceIndex]}
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