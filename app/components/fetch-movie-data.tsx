import { IMovieInformation } from "./movie-interfaces";

export async function FetchMovieData() {
    const response = await fetch("https://localhost:7090/MovieInfo", {
        method: "GET",
        headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error(`Fetch failed`);

    const data: IMovieInformation[] = await response.json();
    return data;
}