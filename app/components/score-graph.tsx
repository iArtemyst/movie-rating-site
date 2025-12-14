'use client'

import React, {useState} from "react";
import { IMovieInformation, ratingStringEndings } from "./movie-interfaces";
import { IPlayerStats } from "./player-stats";
import { SplitMovieRatingStringAndReturnNumber, GetPlayerRatingScoreIndexValue } from "./compare-movie-scores";
import { moviePointValues } from "./movie-interfaces";
import { LazyImageCoreSizer } from "./load-asset";
import { pickLogoNoTheme } from "./movie-source-logos";
import "@/app/globals.css";

export function TodaysFinalScoreScreen({movies, visible, playerStats}:{movies:IMovieInformation[], visible:boolean, playerStats:IPlayerStats}) {
    function TextWithStats({text, stats}:{text:string, stats:number | undefined}) {
        return (
            <div className={`divCenterHorizontalText`}>
                <p className={`finalScoreTextSecondary`}>{text}</p>
                <p className={`finalScoreTextPrimary`}>{stats ?? "No Stats"}</p>
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
        function MoviePosterAndRatings({movie, playerMovieRating}:{movie:IMovieInformation, playerMovieRating:number}) {
            function TextWithStatsSmall({text, stats}:{text:string, stats:string | undefined}) {
                return (
                    <div className={`divCenterHorizontalTextSmall`}>
                        <p className={`scoreTextSecondarySmall`}>{text}</p>
                        <p className={`scoreTextPrimarySmall`}>{stats ?? "No Stats"}</p>
                    </div>
                )
            }

            function SourceLogoWithRating({stats}:{stats:string | undefined}) {
                return (
                    <div className={`divCenterHorizontalTextSmall`}>
                        <LazyImageCoreSizer imgLink={pickLogoNoTheme({source:movie.RatingInfo.RatingIndex})} imgAlt={`${movie.RatingInfo.RatingIndex} logo`} imgStyle="smallMovieSourceLogoImage" />
                        <p className={`scoreTextPrimarySmall`}>{stats ?? "No Stats"}</p>
                    </div>
                )
            }

            return (
                <div className="scoreScreenMoviePosterAndRatingDiv">
                    <LazyImageCoreSizer imgLink={movie.Poster} imgAlt={String(movie.Poster)} imgStyle="smallMoviePosterImage" />
                    {/* <p className="scoreTextPrimarySmall mb-[.25em]">{movie.Title} ({movie.Year})</p> */}
                    <div className="flex flex-col gap-[.25em] w-fit">
                        <SourceLogoWithRating stats={String(SplitMovieRatingStringAndReturnNumber({ratingSourceInt:movie.RatingInfo.RatingIndex, movieRatingString:movie.RatingInfo.RatingValue})) + ratingStringEndings[movie.RatingInfo.RatingIndex]}/>
                        <TextWithStatsSmall text={"Yours:"} stats={movie.RatingInfo.RatingIndex === 0 ? playerMovieRating + ratingStringEndings[movie.RatingInfo.RatingIndex] : Number(playerMovieRating.toFixed(1)) + ratingStringEndings[movie.RatingInfo.RatingIndex]} />
                    </div>
                </div>
            )
        }
        return (
            <div className="scoreScreenMoviePostersAndRatingsContainer">
                <MoviePosterAndRatings movie={movies[0]} playerMovieRating={playerStats.todaysMovieRatings[0].MovieRating} />
                <MoviePosterAndRatings movie={movies[1]} playerMovieRating={playerStats.todaysMovieRatings[1].MovieRating} />
                <MoviePosterAndRatings movie={movies[2]} playerMovieRating={playerStats.todaysMovieRatings[2].MovieRating} />
            </div>
        )
    }

    return (
        <>
            {   visible &&
                <div className={`fullScreenBlockingDiv`} onClick={e => {e.stopPropagation()}}>
                    <div className="finalScoreBackgroundDiv">
                        <div className="finalScoreTextContainer">
                            <p className="scoreTitleText">{`Today\'s final score: `}{playerStats?.todaysScore} points</p>
                            <>
                                { playerStats?.todaysMovieRatings.length === 3 &&
                                    <PlayerVsActualRatingsToday />
                                }
                            </>
                            <div className="w-fit flex flex-row gap-[1em] self-center">
                                <TextWithStats text="Games played:" stats={playerStats?.totalGamesPlayed } />
                                <TextWithStats text="Perfect games:" stats={playerStats?.totalPerfectGames } />
                            </div>
                        </div>
                        <ShareScoreButton />
                    </div>
                </div>
            }
        </>
    )
}