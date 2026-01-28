'use client'

import React from "react";
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

    function MapMovieReviews({movie}:{movie:IMovieInformation}) {
        const [textExpanded, setTextExpanded] = React.useState(false);
        
        if (movie.Reviews && movie.Reviews.length > 0) {
            if (movie.Reviews.length > 3) {
                movie.Reviews = movie.Reviews.slice(0,3);
            }

            return (
                <div className="movieInfoReviewTextDiv">
                    <p className="movieInfoSecondaryText">Audience Reviews:</p>
                    <div className="flex flex-col gap-[.5em]">
                        {
                            movie.Reviews.map((review, index) => (
                                <p className={`${textExpanded ? "movieInfoReviewTextExpanded" : "movieInfoReviewText"}`} onClick={() => setTextExpanded(!textExpanded)} key={index}>{review}</p>
                            ))
                        }
                    </div>
                </div>
            )
        }
    }
    
    return (
        <>
            <div className={`mainMovieInfoDiv`}>
                <div className={`secMovieInfoDiv`}>
                    <LazyImageCoreSizer imgLink={movie.Poster} imgAlt={`${movie.Title} Poster`} imgStyle="moviePosterImage"/>
                    <div className="movieInfoDivCol2">
                        <div className="flex flex-row gap-[.5em] w-full self-center place-content-center">
                            <div className="movieInfoTextDiv">
                                <p className="movieInfoSecondaryText">Director:</p>
                                <div className="movieActorBulletPoints">
                                    <MapInfoToBullets count={splitDirectors.length} array={splitDirectors} />
                                </div>
                            </div>

                            <div className="movieInfoTextDiv">
                                <p className="movieInfoSecondaryText">Box Office:</p>
                                <p className="movieInfoPrimaryText">{movie.BoxOffice}</p>
                            </div>
                        </div>

                        <div className="movieInfoTextDiv">
                            <p className="movieInfoSecondaryText">Top Billed:</p>
                            <div className="movieActorBulletPoints">
                                <MapInfoToBullets count={splitActors.length} array={splitActors} />
                            </div>
                        </div>

                        <div className="movieInfoLongTextDiv">
                            <p className="movieInfoSecondaryText">Movie Summary:</p>
                            <p className="movieInfoPrimaryText text-balance">{movie.Plot}</p>
                        </div> 
{/* 
                        <MapMovieReviews movie={movie}/> */}
                    </div>
                </div>
            </div>
        </>
    )
}