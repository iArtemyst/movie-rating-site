'use client'

import * as constants from "../constants";

export const tempAverageDailyStats: IAverageDailyPlayerScore = {
    averageMovieScores:
    [
        {
            movieIndex: 0,
            averageScore: 200,
            averageRating: 50,
        },
        {
            movieIndex: 1,
            averageScore: 100,
            averageRating: 30,
        },
        {
            movieIndex: 2,
            averageScore: 350,
            averageRating: 70,
        },
    ],
    averageOverallScore: 450
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