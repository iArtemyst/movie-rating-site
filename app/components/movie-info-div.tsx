'use client'

import React from "react";
import { LazyImageCoreSizer } from "./load-asset";
import { IMovieInformation } from "./movie-interfaces";
import "@/app/globals.css";

export function MovieInfoDiv({movie}:{movie: IMovieInformation}) {
    const splitActors = movie.Actors.split(",");

    function ActorBulletPoint({actor}:{actor:string}) {
        return(
            <li className="movieInfoPrimaryText">
                {actor}
            </li>
        )
    }
    
    function MapActorsToBullets({count}:{count:number}) {
        const actorArray = []
        for (let i=0; i < count; i++) {
            actorArray.push(<ActorBulletPoint actor={splitActors[i]} key={i}/>)
        };
        return actorArray;
    }
    
    return (
        <div className={`mainMovieInfoDiv`}>
            <LazyImageCoreSizer imgLink={movie.Poster} imgAlt={`${movie.Title} Poster`} imgStyle="moviePosterImage"/>
            <div className="movieInfoDivCol2">
                <div className="movieInfoTextDiv">
                    <p className="movieInfoSecondaryText">Director:</p>
                    <p className="movieInfoPrimaryText">{movie.Director}</p>
                </div>

                <div className="movieInfoTextDiv">
                    <p className="movieInfoSecondaryText">Top Billed:</p>
                    <div className="movieActorBulletPoints">
                        <MapActorsToBullets count={splitActors.length} />
                    </div>
                </div>

                <div className="movieInfoLongTextDiv">
                    <p className="movieInfoSecondaryText">Movie Summary:</p>
                    <p className="movieInfoPrimaryText text-balance">{movie.Plot}</p>
                </div> 
            </div>
        </div>
    )
}