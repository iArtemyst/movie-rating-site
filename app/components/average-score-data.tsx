'use client'

import * as constants from "../constants";

export const tempAverageDailyStats: IAverageDailyPlayerScore = {
    averageMovieScores:
    [
        {
            movieIndex: 0,
            averageScore: 0,
            averageRating: 0,
        },
        {
            movieIndex: 1,
            averageScore: 0,
            averageRating: 0,
        },
        {
            movieIndex: 2,
            averageScore: 0,
            averageRating: 0,
        },
    ],
    averageOverallScore: 0
}


export interface IAverageDailyPlayerScore
{
    averageMovieScores: IMovieScoreInfo[],
    averageOverallScore: number
}

export interface IMovieScoreInfo 
{
    movieIndex: number,
    averageScore: number,
    averageRating: number
}

export async function FetchAverageScoreData(): Promise<IAverageDailyPlayerScore> {
    const response = await fetch(constants.hostLink("AverageScoreInfo"), {
        method: "GET",
        headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error(`Fetch average score data failed`);

    const data: IAverageDailyPlayerScore = await response.json();
    console.log(data)
    return data;
}