
'use client'

import { ISimplifiedMovieInformation } from "./movie-interfaces";
import { GetCurrentMovieRatingsRangeArray } from "./create-rating-ranges";
import { IPlayerStats } from "./player-stats";

const moviePointValues = [500, 300, 0]; //500 = Perfect, 300 = Almost, 0 = Wrong

export function GetPlayerRatingScoreIndexValue({movie, movieRatingSiteIndex, playerMovieRatingScore}:{movie: ISimplifiedMovieInformation, movieRatingSiteIndex: number, playerMovieRatingScore: number}) {
    const movieRatingArray = GetCurrentMovieRatingsRangeArray({movieRatingSiteIndex:movieRatingSiteIndex, movie:movie});
    if (playerMovieRatingScore == movieRatingArray[2]) {
        console.log("perfect movie rating from player")
        return 0; //perfect score
    }
    if (playerMovieRatingScore >= movieRatingArray[0] && playerMovieRatingScore <= movieRatingArray[1]) {
        console.log("movie rating from player within range")
        return 1; //within range
    }
    else {
        console.log("movie rating from player outside range")
        return 2; //out of range
    }
}

export function UpdatePlayerScoreBasedOnRating({movie, movieRatingSiteIndex, playerMovieRatingScore, playerStats}:{movie: ISimplifiedMovieInformation, movieRatingSiteIndex: number, playerMovieRatingScore: number, playerStats: IPlayerStats}) {
    const playersMovieRatingIndex = GetPlayerRatingScoreIndexValue({movie:movie, movieRatingSiteIndex:movieRatingSiteIndex, playerMovieRatingScore:playerMovieRatingScore})
    const getPlayerScoreValue = moviePointValues[playersMovieRatingIndex];
    playerStats.todaysScore += getPlayerScoreValue;
    console.log("Total Points: " + playerStats.todaysScore);
}