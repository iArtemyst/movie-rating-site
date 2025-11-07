'use client'

import { IFullMovieInformation } from "./movie-interfaces";

export async function FetchMovieData() {
    const response = await fetch("https://localhost:7090/MovieFullInfo", {
        method: "GET",
        headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error(`Fetch failed`);
    const data: IFullMovieInformation[] = await response.json();
    return data;
}