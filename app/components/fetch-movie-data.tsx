'use client'


import { IDailyMovieInformation, IMovieInformation } from "./movie-interfaces";

const localhost = `localhost:7090`;
const ip = `192.168.86.90:7090`;
const hostLink = `https://` + ip + `/MovieInfo`;

export async function FetchMovieData(): Promise<IDailyMovieInformation> {
    const response = await fetch(hostLink, {
        method: "GET",
        headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error(`Fetch movie data failed`);

    const data: IDailyMovieInformation = await response.json();
    return data;
}