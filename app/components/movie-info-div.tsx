import React from "react";
import { LazyImageSizer } from "./load-asset";
import { IMovieInformation } from "./movie-interfaces";

const textStyleTitle = "text-[24px] font-bold";
const textStyleSubtitle = "text-[14px] font-semibold";
const textStyleParagraph = "text-[18px]";

export function MovieInfoDiv({movies, selectedIndex}:{movies: IMovieInformation[], selectedIndex: number}) {
    return (
        <div className="grid grid-cols-2 gap-[12px] w-[960px] h-fit self-center">
            <div className="h-fit aspect-[3/4] rounded-[12px] place-content-center flex flex-col self-center">
                <LazyImageSizer imgLink={movies[selectedIndex].Poster} imgAlt="movie poster" imgSize="w-full h-full object-cover rounded-[24px]"/>
            </div>

            <div className="flex flex-col w-full gap-[.5em]">
                <div className={`w-full h-fit place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]`}>
                <p className={textStyleTitle}>
                    {movies[selectedIndex].Title} ({movies[selectedIndex].Year})
                </p>
                </div>

                <div className={`w-full h-fit place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]`}>
                <p className={`${textStyleSubtitle}`}>
                    Director:
                </p>
                <p className={`${textStyleParagraph}`}>
                    {movies[selectedIndex].Director}
                </p>
                </div>

                <div className={`w-full h-fit place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]`}>
                <p className={`${textStyleSubtitle}`}>
                    Top Billed:
                </p>
                <p className={`${textStyleParagraph}`}>
                    {movies[selectedIndex].Actors}
                </p>
                </div>

                <div className=" w-full h-full place-self-center px-[1em] py-[.5em] bg-[#FFFFFF10] rounded-[1em]">
                <p className={`${textStyleSubtitle}`}>
                    Summary:
                </p>
                <p className={`${textStyleParagraph}`}>
                    {movies[selectedIndex].Plot}
                </p>
                </div>
            </div>
        </div>
    )
}