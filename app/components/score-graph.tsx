'use client'

import "@/app/globals.css";
import React, {useState} from "react";
import { IMovieInformation, ratingStringEndings } from "./movie-interfaces";
import { IPlayerStats } from "./player-stats";
import { SplitMovieRatingStringAndReturnNumber, GetPlayerRatingScoreIndexValue } from "./compare-movie-scores";
import { moviePointValues } from "./movie-interfaces";
import { LazyImageCoreSizer } from "./load-asset";
import { pickLogoNoTheme } from "./movie-source-logos";
import { IAverageDailyPlayerScore } from "./average-score-data";
import { pickWiiRLogo } from "../components/movie-source-logos";

export function TodaysFinalScoreScreen({movies, visible, playerStats, averageCommunityScores}:{movies:IMovieInformation[], visible:boolean, playerStats:IPlayerStats, averageCommunityScores:IAverageDailyPlayerScore | null}) {
    function TextWithStatsStyle({text, stats, divstyle, textAStyle, textBStyle}:{text:string, stats:string, divstyle:string, textAStyle:string, textBStyle:string}) {
        return (
            <div className={`${divstyle}`}>
                <p className={`${textBStyle}`}>{text}</p>
                <p className={`${textAStyle}`}>{stats ?? "No Stats"}</p>
            </div>
        )
    }

    function TextWithCommStatsStyle({textA, textB, statsA, statsB, divstyle1, textAStyle, textBStyle}:{textA:string, textB:string, statsA:string, statsB:string, divstyle1:string, textAStyle:string, textBStyle:string}) {
        return (
            <div className={`${divstyle1}`}>
                    <p className={`${textBStyle}`}>{textA}</p>
                    <p className={`${textAStyle}`}>{statsA ?? "No Stats"}</p>
                    <p> | </p>
                    <p className={`${textAStyle}`}>{statsB ?? "No Data"}</p>
                    <p className={`${textBStyle}`}>{textB}</p>
            </div>
        )
    }
    
    function ShareScoreButton() {
        const [shareButtonText, setShareButtonText] = useState("Share Your Score!")
        const playersPointValuesArray = [ 
            moviePointValues[GetPlayerRatingScoreIndexValue({ratingSourceInt:movies[0].RatingInfo.RatingIndex, movieRatingString:movies[0].RatingInfo.RatingValue, playerMovieRating:playerStats.todaysMovieRatings[0].MovieRating})],
            moviePointValues[GetPlayerRatingScoreIndexValue({ratingSourceInt:movies[1].RatingInfo.RatingIndex, movieRatingString:movies[1].RatingInfo.RatingValue, playerMovieRating:playerStats.todaysMovieRatings[1].MovieRating})],
            moviePointValues[GetPlayerRatingScoreIndexValue({ratingSourceInt:movies[2].RatingInfo.RatingIndex, movieRatingString:movies[2].RatingInfo.RatingValue, playerMovieRating:playerStats.todaysMovieRatings[2].MovieRating})],
        ]
        const shareTextExpanded =   "Check out my score on WhatIsItRated.com! 🎬🍿\n\n" +
                                    String(movies[0].Title) + ": " + String(playersPointValuesArray[0]) + "\n" +
                                    String(movies[1].Title) + ": " + String(playersPointValuesArray[1]) + "\n" +
                                    String(movies[2].Title) + ": " + String(playersPointValuesArray[2]) + "\n" +
                                    `Today's Score: ${playerStats?.todaysScore} points`;
        function CopyScoreToClipboard() {
            navigator.clipboard.writeText(shareTextExpanded).then(() => {
                // Clipboard successfully set
            }).catch(err => {
                console.error('Could not copy text: ', err);
            }
            );
            console.log("Score copied to clipboard: ");
            console.log(shareTextExpanded);
            setShareButtonText("Score Copied!");
        }

        return (
            <div className="shareScoreButtonDiv" onClick={CopyScoreToClipboard}>
                <p className="shareScoreButtonText">{shareButtonText}</p>
            </div>
        )
    }

    function PlayerVsActualRatingsToday() {
        function MoviePosterAndRatings({movie, playerMovieRating, avgCommunityRating}:{movie:IMovieInformation, playerMovieRating:number, avgCommunityRating:number}) {
            function SourceLogoWithRating({stats}:{stats:string | undefined}) {
                return (
                    <div className={`divCenterHorizontalTextLogo`}>
                        <LazyImageCoreSizer imgLink={pickLogoNoTheme({source:movie.RatingInfo.RatingIndex})} imgAlt={`${movie.RatingInfo.RatingIndex} logo`} imgStyle="smallMovieSourceLogoImage" />
                        <p className={`scoreTextPrimarySmall`}>{stats ?? "No Stats"}</p>
                    </div>
                )
            }

            return (
                <div className="scoreScreenMoviePosterAndRatingDiv">
                    <LazyImageCoreSizer imgLink={movie.Poster} imgAlt={String(movie.Poster)} imgStyle="smallMoviePosterImage" />
                    {/* <p className="scoreTextPrimarySmall mb-[.25em]">{movie.Title} ({movie.Year})</p> */}
                    <div className="flex flex-col gap-[.5em] w-full">
                        <SourceLogoWithRating stats={String(SplitMovieRatingStringAndReturnNumber({ratingSourceInt:movie.RatingInfo.RatingIndex, movieRatingString:movie.RatingInfo.RatingValue})) + ratingStringEndings[movie.RatingInfo.RatingIndex]}/>
                        <TextWithStatsStyle 
                            text="Yours:"
                            stats={movie.RatingInfo.RatingIndex === 0 ? playerMovieRating.toFixed(1) + ratingStringEndings[movie.RatingInfo.RatingIndex] : Number(playerMovieRating) + ratingStringEndings[movie.RatingInfo.RatingIndex]} 
                            divstyle="divCenterHorizontalTextSmall"
                            textAStyle="scoreTextPrimarySmall"
                            textBStyle="scoreTextSecondarySmall"/>
                        <TextWithStatsStyle
                            text="Community:"
                            stats={movie.RatingInfo.RatingIndex === 0 ? String(avgCommunityRating.toFixed(1)) + ratingStringEndings[movie.RatingInfo.RatingIndex] : avgCommunityRating.toFixed(0) + ratingStringEndings[movie.RatingInfo.RatingIndex]}
                            divstyle="divCenterHorizontalTextTiny"
                            textAStyle="scoreTextPrimaryTiny"
                            textBStyle="scoreTextSecondaryTiny"
                            />
                    </div>
                </div>
            )
        }
        return (
            <div className="scoreScreenMoviePostersAndRatingsContainer">
                <MoviePosterAndRatings movie={movies[0]} playerMovieRating={playerStats.todaysMovieRatings[0].MovieRating} avgCommunityRating={averageCommunityScores? averageCommunityScores.averageMovieScores[0].averageRating : playerStats.todaysMovieRatings[0].MovieRating}/>
                <MoviePosterAndRatings movie={movies[1]} playerMovieRating={playerStats.todaysMovieRatings[1].MovieRating} avgCommunityRating={averageCommunityScores? averageCommunityScores.averageMovieScores[1].averageRating : playerStats.todaysMovieRatings[1].MovieRating}/>
                <MoviePosterAndRatings movie={movies[2]} playerMovieRating={playerStats.todaysMovieRatings[2].MovieRating} avgCommunityRating={averageCommunityScores? averageCommunityScores.averageMovieScores[2].averageRating : playerStats.todaysMovieRatings[2].MovieRating}/>
            </div>
        )
    }

    return (
        <>
            {   visible &&
                <div className={`fullScreenBlockingDiv`} onClick={e => {e.stopPropagation()}}>
                    <div className="finalScoreBackgroundDiv">
                        <LazyImageCoreSizer imgAlt="What Is It Rated Logo" imgLink={pickWiiRLogo({theme:playerStats.playerTheme})} imgStyle="finalScreenWiirLogo"/>
                        <div className="finalScoreTextContainer">
                            <div className="scoreTitleText">
                                <TextWithStatsStyle 
                                    text="Your Final Score:" 
                                    stats={String(playerStats?.todaysScore)} 
                                    divstyle="finalScoreDivContainer" 
                                    textAStyle="" 
                                    textBStyle=""/>
                                <TextWithCommStatsStyle 
                                    textA="Community Average:" 
                                    statsA={averageCommunityScores? String(averageCommunityScores.averageOverallScore.toFixed(0)) : String(playerStats.todaysScore)}
                                    statsB={String(averageCommunityScores?.totalDailyPlayers)}
                                    textB={averageCommunityScores?.totalDailyPlayers === 1 ? "Player Today" : "Players Today"}
                                    divstyle1="finalAvgScoreDivContainer"
                                    textAStyle="" 
                                    textBStyle=""/>
                            </div>
                            <>
                                { playerStats?.todaysMovieRatings.length === 3 &&
                                    <PlayerVsActualRatingsToday />
                                }
                            </>
                            <div className="w-fit flex flex-row gap-[1em] self-center">
                                <TextWithStatsStyle 
                                    text="Games played:" 
                                    stats={String(playerStats?.totalGamesPlayed)} 
                                    divstyle="divCenterHorizontalText"
                                    textAStyle="finalScoreTextPrimary"
                                    textBStyle="finalScoreTextSecondary"/>
                                <TextWithStatsStyle 
                                    text="Perfect games:" 
                                    stats={String(playerStats?.totalPerfectGames)} 
                                    divstyle="divCenterHorizontalText"
                                    textAStyle="finalScoreTextPrimary"
                                    textBStyle="finalScoreTextSecondary"/>
                            </div>
                        </div>
                        <ShareScoreButton />
                    </div>
                </div>
            }
        </>
    )
}