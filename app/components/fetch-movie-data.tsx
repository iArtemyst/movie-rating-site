'use client'


import { IDailyMovieInformation } from "./movie-interfaces";
import * as constants from "../constants";

export async function FetchMovieData(): Promise<IDailyMovieInformation> {
    const response = await fetch(constants.hostLink("MovieInfo"), {
        method: "GET",
        headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error(`Fetch movie data failed`);

    const data: IDailyMovieInformation = await response.json();
    return data;
}