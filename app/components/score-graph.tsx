'use client'

import React, {useState} from "react";
import { IMovieInformation } from "./movie-interfaces";
import { IPlayerStats } from "./player-stats";
import { SplitMovieRatingStringAndReturnNumber, GetPlayerRatingScoreIndexValue } from "./compare-movie-scores";
import { moviePointValues } from "./movie-interfaces";
import { LazyImageCoreSizer } from "./load-asset";
import "@/app/globals.css";

export function TodaysFinalScoreScreen({movies, visible, playerStats}:{movies:IMovieInformation[], visible:boolean, playerStats:IPlayerStats | null}) {
    function TextWithStats({text, stats}:{text:string, stats:number | undefined}) {
        return (
            <div className={`divCenterHorizontalText`}>
                <p className={`scoreTextSecondary`}>{text}</p>
                <p className={`scoreTextPrimary`}>{stats ?? "No Stats"}</p>
            </div>
        )
    }
    
    function ShareScoreButton() {
        const [shareButtonText, setShareButtonText] = useState("Share Your Score!")
        const playersPointValuesArray = [ 
            moviePointValues[GetPlayerRatingScoreIndexValue({ratingSourceInt:movies[0].RatingInfo.RatingIndex, movieRatingString:movies[0].RatingInfo.RatingValue, playerMovieRating:playerStats ? playerStats.todaysMovieRatings[0] : 0})],
            moviePointValues[GetPlayerRatingScoreIndexValue({ratingSourceInt:movies[1].RatingInfo.RatingIndex, movieRatingString:movies[1].RatingInfo.RatingValue, playerMovieRating:playerStats ? playerStats.todaysMovieRatings[1] : 0})],
            moviePointValues[GetPlayerRatingScoreIndexValue({ratingSourceInt:movies[2].RatingInfo.RatingIndex, movieRatingString:movies[2].RatingInfo.RatingValue, playerMovieRating:playerStats ? playerStats.todaysMovieRatings[2] : 0})],
        ]
        const shareTextExpanded =   "Check out my movie rating score! 🎬🍿\n\n" +
                                    String(movies[0].Title) + ": " + String(playersPointValuesArray[0]) + "\n" +
                                    String(movies[1].Title) + ": " + String(playersPointValuesArray[1]) + "\n" +
                                    String(movies[2].Title) + ": " + String(playersPointValuesArray[2]) + "\n" +
                                    `Total Score: ${playerStats?.todaysScore} points`;
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
            function TextWithStatsSmall({text, stats}:{text:string, stats:number | undefined}) {
                return (
                    <div className={`divCenterHorizontalTextSmall`}>
                        <p className={`scoreTextSecondarySmall`}>{text}</p>
                        <p className={`scoreTextPrimarySmall`}>{stats ?? "No Stats"}</p>
                    </div>
                )
            }
            return (
                <div className="scoreScreenMoviePosterAndRatingDiv">
                    <LazyImageCoreSizer imgLink={movie.Poster} imgAlt={String(movie.Poster)} imgStyle="smallMoviePosterImage" />
                    <TextWithStatsSmall text={"Actual Rating: "} stats={Number(SplitMovieRatingStringAndReturnNumber({ratingSourceInt:movie.RatingInfo.RatingIndex, movieRatingString:movie.RatingInfo.RatingValue}))} />
                    <TextWithStatsSmall text={"Your Rating: "} stats={movie.RatingInfo.RatingIndex === 0 ? playerMovieRating : Number(playerMovieRating.toFixed(1))} />
                </div>
            )
        }
        return (
            <div className="scoreScreenMoviePostersAndRatingsContainer">
                <MoviePosterAndRatings movie={movies[0]} playerMovieRating={playerStats ? playerStats.todaysMovieRatings[0] : 0} />
                <MoviePosterAndRatings movie={movies[1]} playerMovieRating={playerStats ? playerStats.todaysMovieRatings[1] : 0} />
                <MoviePosterAndRatings movie={movies[2]} playerMovieRating={playerStats ? playerStats.todaysMovieRatings[2] : 0} />
            </div>
        )
    }

    return (
        <>
            {   visible &&
                <div className={`fullScreenBlockingDiv`} onClick={e => {e.stopPropagation()}}>
                    <div className="finalScoreBackgroundDiv bg-[#001f1a]">
                        <div className="finalScoreTextContainer">
                            <p className="scoreTitleText">{`Today\'s Final Score: `}{playerStats?.todaysScore}</p>
                            <>
                                { playerStats?.todaysMovieRatings.length === 3 &&
                                    <PlayerVsActualRatingsToday />
                                }
                            </>
                            <div className="w-fit flex flex-row gap-[1em] self-center">
                                <TextWithStats text="Games Played:" stats={playerStats?.totalGamesPlayed } />
                                <TextWithStats text="Perfect Games:" stats={playerStats?.totalPerfectGames } />
                            </div>
                        </div>
                        <ShareScoreButton />
                    </div>
                </div>
            }
        </>
    )
}