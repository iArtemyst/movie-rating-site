
'use client'

import { ISimplifiedMovieInformation, IFullMovieInformation } from "./movie-interfaces";
import { ChooseRatingsToCreate } from "./create-rating-ranges";

const moviePointValues = [500, 300, 0]; //500 = Perfect, 300 = Almost, 0 = Wrong

export function CompareMovieRatings(movies: ISimplifiedMovieInformation[], selectedRating: number, playerScore: number) {
    const movieRatingArray = ChooseRatingsToCreate(selectedRating, movies);
    console.log(movieRatingArray);
    console.log("player score: " + playerScore);
    if (playerScore == movieRatingArray[2])
        return 0; //perfect score
    if (playerScore >= movieRatingArray[0] && playerScore <= movieRatingArray[1])
        return 1; //within range
    else
        return 2; //out of range
}

export function UpdatePlayerScoreBasedOnRating(movies: ISimplifiedMovieInformation[], selectedRating: number, playerScore: number, currentDailyPoints: number) {
    let tempPoints = currentDailyPoints;
    const movieRatingReturn = CompareMovieRatings(movies, selectedRating, playerScore)
    const givePlayerScore = moviePointValues[movieRatingReturn];
    const textPlayerScore = [
        "Perfect Rating! +" + moviePointValues[0] + " Points", 
        "Close Enough! +" + moviePointValues[1] + " Points", 
        "Incorrect Rating! +" + moviePointValues[2] + " Points"
    ];
    tempPoints += givePlayerScore;
    console.log(textPlayerScore[movieRatingReturn]);
    console.log("Total Points: " + tempPoints);
    currentDailyPoints = tempPoints;
}