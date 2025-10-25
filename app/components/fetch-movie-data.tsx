'use client'

import React, { useEffect, useState } from "react";
import { ISimplifiedMovieInformation, IFullMovieInformation } from "./movie-interfaces";

export function FetchMovieData() {
    const [serverMovieInfoArray, setServerMovieInfoArray] = useState<string[] | null>(null);
    const [currentMovies, setCurrentMovies] = useState<ISimplifiedMovieInformation[] | null>(null);
    const [loadingServerInfo, setLoadingServerInfo] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // fetch + set currentMovies once data arrives
    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await fetch("https://localhost:7090/MovieFullInfo", {
                method: "GET",
                headers: { Accept: "application/json" }
            });

            if (!response.ok) throw new Error(`Fetch failed`);
            const data: string[] = await response.json();
            setServerMovieInfoArray(data);

            console.log("test fetch data 1: ", data[0]);
            console.log("test fetch data 2: ", data[1]);
            console.log("test fetch data 3: ", data[2]);

            const movies = [
                data[0],
                data[1],
                data[2]
            ];


            setSelectedIndex(0);
            } catch (err) {
            console.error("Failed to fetch movie data:", err);
            console.log(serverMovieInfoArray)
            } finally {
            setLoadingServerInfo(false);
            }
        };
        fetchData();
    }, []);


    console.log("serverMovieInfoArray:", serverMovieInfoArray);
    console.log("currentMovies:", currentMovies);
    console.log("loadingServerInfo:", loadingServerInfo);
    console.log("selectedIndex:", selectedIndex);
    return { serverMovieInfoArray, currentMovies, loadingServerInfo, selectedIndex };
}