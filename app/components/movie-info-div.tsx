'use client'

import React, { useState, useEffect } from "react";
import { LazyImageCoreSizer } from "./load-asset";
import { IMovieInformation } from "./movie-interfaces";
import "@/app/globals.css";

export function MovieInfoDiv({movie}:{movie: IMovieInformation}) {
    const splitActors = movie.Actors.split(",");
    const splitDirectors = movie.Director.split(",");

    function InfoBulletPoint({data}:{data:string}) {
        return(
            <li className="movieInfoPrimaryText">
                {data}
            </li>
        )
    }
    
    function MapInfoToBullets({count, array}:{count:number, array:string[]}) {
        const Array = []
        for (let i=0; i < count; i++) {
            Array.push(<InfoBulletPoint data={array[i]} key={i}/>)
        };
        return Array;
    }

    function MovieReviews({movie}:{movie:IMovieInformation}) {
        // const [index, setIndex] = useState(0)
        const [shownReview, setShownReview] = useState<string | null>(null)

        // function onClickA() {
        //     const reviewTextDiv = document.getElementById("movieInfoReviewText");
        //     if (index < (movie.Reviews!.length - 1)) {
        //         setIndex(index + 1)}
        //     else setIndex(0)
        //     reviewTextDiv!.scrollTop = 0
        // }

        // function onClickB() {
        //     const reviewTextDiv = document.getElementById("movieInfoReviewText");
        //     if (index > 0) {
        //         setIndex(index - 1)}
        //     else setIndex(movie.Reviews!.length - 1)
        //     reviewTextDiv!.scrollTop = 0
        // }

        // function GalleryButtonForward() {
        //     return (
        //         <div className={`bg-[#FFFFFF20] px-[.75em] py-[.25em] text-center rounded-[1em] h-fit`} onClick={onClickA}>
        //             <p className="align-middle self-center text-center font-semibold text-[10px] sm:text-[10px] md:text-[12px]">
        //                 NEXT
        //             </p>
        //         </div>
        //     )
        // }

        // function GalleryButtonPrevious() {
        //     return (
        //         <div className={`bg-[#FFFFFF20] px-[.75em] py-[.25em] text-center rounded-[1em] h-fit`} onClick={onClickB}>
        //             <p className="align-middle self-center text-center font-semibold text-[10px] sm:text-[10px] md:text-[12px]">
        //                 PREV
        //             </p>
        //         </div>
        //     )
        // }

        // function CircleIcon({currentIndex}:{currentIndex:number}) {
        //     return (
        //         <div className={`${currentIndex == index ? "reviewDotSelected" : "reviewDotInactive"}`} />
        //     )
        // }

        // function MapCirclesAmount({count}:{count:number}) {
        //     const iconArray = [];
        //     for (let i = 0; i < count; i++ ) {
        //         iconArray.push(<CircleIcon currentIndex={i} key={i}/>);
        //     }
        //     return iconArray;
        // }

    useEffect(() => {
        if (movie.Reviews && movie.Reviews.length > 0) {
            for (let i=0; i < movie.Reviews.length; i++){
                const reviewLength = movie.Reviews[i].length
                if (reviewLength >= 100 && reviewLength <= 1250) {
                    console.log("within review length")
                    setShownReview(movie.Reviews[i]);
                }
                else {
                    console.log("movie review outside length preference");
                }
                if (movie.Reviews.length === 1 || i === movie.Reviews.length) {
                    console.log("only remaining review for this movie, showing it no matter what length")
                    setShownReview(movie.Reviews[i])
                }
            }
        }
        else {
            console.log("no reviews in our database for this film")
        }
    }, [movie.Reviews]);

    console.log(movie.Reviews)
            return (
                <>
                { 
                    shownReview &&

                    <div className="movieInfoReviewTextDiv h-full w-full">
                        <p className="movieInfoSecondaryText">Movie Review:</p>
                        <div className="flex flex-col h-[95%] w-full relative">
                            <p className={`movieInfoReviewText h-full`} id="movieInfoReviewText">{shownReview}</p>

                            {/* { movie.Reviews.length > 1 &&
                                <div className="flex flex-row w-full h-fit justify-around place-self-end mt-[.5em]">
                                    <GalleryButtonPrevious/>
                                    <div className="flex flex-row gap-[.75em] self-end mb-[.125em]">
                                        <MapCirclesAmount count={movie.Reviews.length} />
                                    </div>
                                    <GalleryButtonForward/>
                                </div>
                            } */}
                        </div>
                    </div>
                }
                </>
            )
    }

    return (
        <>
            <div className={`mainMovieInfoDiv`}>
                <div className={`secMovieInfoDiv`}>
                    <div className="moviePosterImage">
                        <LazyImageCoreSizer imgLink={movie.Poster} imgAlt={`${movie.Title} Poster`} imgStyle="w-full h-full rounded-[1em]"/>
                    </div>
                    <div className="movieInfoDivCol2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-[.5em] w-fit md:w-full self-center place-items-center">
                                <div className="movieInfoTextDiv h-fit w-fit">
                                    <p className="movieInfoSecondaryText">Director:</p>
                                    <div className="movieActorBulletPoints">
                                        <MapInfoToBullets count={splitDirectors.length} array={splitDirectors} />
                                    </div>
                                </div>

                                <div className="movieInfoTextDiv h-fit w-fit">
                                    <p className="movieInfoSecondaryText">Box Office:</p>
                                    <p className="movieInfoPrimaryText">{movie.BoxOffice}</p>
                                </div>

                            <div className="movieInfoTextDiv h-fit w-fit col-span-2 md:col-span-1 ">
                                <p className="movieInfoSecondaryText">Top Billed:</p>
                                <div className="movieActorBulletPoints">
                                    <MapInfoToBullets count={splitActors.length} array={splitActors} />
                                </div>
                            </div>
                        </div>

                        <div className="movieInfoLongTextDiv h-fit w-full">
                            <p className="movieInfoSecondaryText">Movie Summary:</p>
                            <p className="movieInfoPrimaryText text-balance">{movie.Plot}</p>
                        </div>

                        <MovieReviews movie={movie}/>
                    </div>
                </div>
            </div>
        </>
    )
}