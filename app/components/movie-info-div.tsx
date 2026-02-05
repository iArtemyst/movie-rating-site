'use client'

import React, { useState, useLayoutEffect } from "react";
import { LazyImageCoreSizer } from "./load-asset";
import { IMovieInformation } from "./movie-interfaces";
import "@/app/globals.css";

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
    const [shownReview, setShownReview] = useState<string | null>(null)

    useLayoutEffect(() => {
        if (movie.Reviews) {
            setShownReview(SelectMovieReview(movie)!)
        }
    }, [movie]);

    function SelectMovieReview(movie:IMovieInformation) {
        if (movie.Reviews && movie.Reviews.length > 0) {
            for (let i=0; i < movie.Reviews.length; i++){
                const reviewLength = movie.Reviews[i].length
                if (reviewLength >= 100 && reviewLength <= 1250) {
                    console.log("within review length")
                    return movie.Reviews[i];
                }
                else {
                    console.log("movie review outside length preference");
                }
                if (movie.Reviews.length === 1 || i === movie.Reviews.length) {
                    console.log("only remaining review for this movie, showing it no matter what length")
                    setShownReview(movie.Reviews[i])
                    return null;
                }
            }
        }
        else {
            console.log("no reviews in our database for this film")
        }
    }

    return (
        <>
        { 
            shownReview &&
            <div className="movieInfoReviewTextDiv h-full w-full">
                <p className="movieInfoSecondaryText">Movie Review:</p>
                <div className="flex flex-col h-[95%] w-full relative">
                    <p className={`movieInfoReviewText h-full`} id="movieInfoReviewText">{shownReview}</p>
                </div>
            </div>
        }
        </>
    )
}

//---------------------------------

export function MovieInfoDiv({movie}:{movie: IMovieInformation}) {
    const splitActors = movie.Actors.split(",");
    const splitDirectors = movie.Director.split(",");

    return (
        <>
            <div className={`mainMovieInfoDiv`}>
                <div className={`secMovieInfoDiv`}>
                    <div className="moviePosterImage">
                        <LazyImageCoreSizer imgLink={movie.Poster} imgAlt={`${movie.Title} Poster`} imgStyle="w-full h-full rounded-[1em]"/>
                    </div>
                    <div className="movieInfoDivCol2">
                        {
                            movie.BoxOffice != "N/A" || !movie.BoxOffice ?
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-[.5em] w-full self-center place-items-center">
                                        <div className="movieInfoTextDiv h-fit w-full">
                                            <p className="movieInfoSecondaryText">Director:</p>
                                            <div className="movieActorBulletPoints">
                                                <MapInfoToBullets count={splitDirectors.length} array={splitDirectors} />
                                            </div>
                                        </div>

                                        <div className="movieInfoTextDiv h-fit w-full">
                                            <p className="movieInfoSecondaryText">Box Office:</p>
                                            <p className="movieInfoPrimaryText">{movie.BoxOffice}</p>
                                        </div>

                                    <div className="movieInfoTextDiv h-fit w-full md:w-fit col-span-2 md:col-span-1 ">
                                        <p className="movieInfoSecondaryText">Top Billed:</p>
                                        <div className="movieActorBulletPoints">
                                            <MapInfoToBullets count={splitActors.length} array={splitActors} />
                                        </div>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[.5em] w-full self-center place-items-center">
                                        <div className="movieInfoTextDiv h-fit w-full">
                                            <p className="movieInfoSecondaryText">Director:</p>
                                            <div className="movieActorBulletPoints">
                                                <MapInfoToBullets count={splitDirectors.length} array={splitDirectors} />
                                            </div>
                                        </div>

                                    <div className="movieInfoTextDiv h-fit w-full md:w-fit col-span-2 md:col-span-1 ">
                                        <p className="movieInfoSecondaryText">Top Billed:</p>
                                        <div className="movieActorBulletPoints">
                                            <MapInfoToBullets count={splitActors.length} array={splitActors} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        }



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