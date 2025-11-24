'use client'


import { IDailyMovieInformation } from "./movie-interfaces";

const localhost = `localhost:7090`;
const ip = `192.168.86.90:7090`;
const newServer = `movie-rating-server-gpf9arfcesb5hahd.westus3-01.azurewebsites.net:443`;
const hostLink = `https://` + newServer + `/MovieInfo`;

export async function FetchMovieData(): Promise<IDailyMovieInformation> {
    const response = await fetch(hostLink, {
        method: "GET",
        headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error(`Fetch movie data failed`);

    const data: IDailyMovieInformation = await response.json();
    return data;
}