import { IMovieInformation } from "./movie-interfaces";

export async function FetchMovieData() {
    const response = await fetch("https://localhost:7090/MovieInfo", {
        method: "GET",
        headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error(`Fetch movie data failed`);

    const data: IMovieInformation[] = await response.json();
    return data;
}

export async function FetchDateData() {
    const response = await fetch("https://localhost:7090/MovieInfo/DayCount", {
        method: "GET",
        headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error(`Fetch date data failed`);

    const data: number = await response.json();
    return data;
}