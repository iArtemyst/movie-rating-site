'use client'


import { IPlayerScoreInfo, IPlayerStats } from "./player-stats";
import { moviePointValues, scoreErrorMargin, ratingStringEndings } from "./movie-interfaces";

export function SplitMovieRatingStringAndReturnNumber({ratingSourceInt, movieRatingString}:{ratingSourceInt:number, movieRatingString:string}) {
    //parse the string into a float
    const parsed = parseFloat(movieRatingString);
    if (Number.isFinite(parsed) && !Number.isNaN(parsed)) 
    { 
        return parsed 
    }
    // Fallback: if parseFloat didn't work, split the string apart from the secondary text
    const splitScoreArray = 
    [
        movieRatingString.split(ratingStringEndings[0]),
        movieRatingString.split(ratingStringEndings[1]),
        movieRatingString.split(ratingStringEndings[2]),
    ]
    const splitScore = splitScoreArray[ratingSourceInt] ? splitScoreArray[ratingSourceInt][0] : ""
    const movieScoreAsNumber = Number(splitScore)
    return movieScoreAsNumber
}

export function GetPlayerRatingScoreIndexValue({ratingSourceInt, movieRatingString, playerMovieRating}:{ratingSourceInt:number, movieRatingString: string, playerMovieRating: number}) {
    const actualRatingNumber = SplitMovieRatingStringAndReturnNumber({ratingSourceInt:ratingSourceInt, movieRatingString:movieRatingString});
    const ratingDifference = (playerMovieRating <= actualRatingNumber ? actualRatingNumber - playerMovieRating : playerMovieRating - actualRatingNumber);
    if (ratingDifference === 0) {
        return 0; //perfect score
    }
    if (ratingDifference <= scoreErrorMargin[ratingSourceInt]) {
        return 1; //within range 1
    }
    if (ratingDifference >= scoreErrorMargin[ratingSourceInt] && ratingDifference <= (scoreErrorMargin[ratingSourceInt] * 2)) {
        return 2; //within range 2
    }
    if (ratingDifference >= (scoreErrorMargin[ratingSourceInt] * 2) && ratingDifference <= (scoreErrorMargin[ratingSourceInt] * 3)) {
        return 3; //within range 3
    }
    else {
        return 4; //out of range
    }
}

export function CheckPlayerPerfectScore({playerStats, arrayLength}:{playerStats:IPlayerStats, arrayLength:number}) {
    const maxIndvMovieScore = moviePointValues[0];
    const perfectScoreValue = ( maxIndvMovieScore * arrayLength );
    if ( playerStats.todaysScore === perfectScoreValue ) {
        playerStats.totalPerfectGames += 1
    }
}

export function UpdatePlayerScoreBasedOnRating({ratingSourceInt, movieRatingString, playerMovieRating, playerStats, selectedIndex}:{ratingSourceInt: number, movieRatingString: string, playerMovieRating: number, playerStats: IPlayerStats, selectedIndex:number}) {
    const playersMovieRatingIndex = GetPlayerRatingScoreIndexValue({ratingSourceInt:ratingSourceInt, movieRatingString:movieRatingString, playerMovieRating:playerMovieRating})
    const playerScoreValue = moviePointValues[playersMovieRatingIndex];
    playerStats.todaysScore += playerScoreValue;
    const newPlayerScoreData: IPlayerScoreInfo = {MovieIndex:selectedIndex, MovieRating:playerMovieRating, MovieScore:playerScoreValue};
    playerStats.todaysMovieRatings.push(newPlayerScoreData);
    console.log("TODAYS SCORE: " + playerStats.todaysScore)
}