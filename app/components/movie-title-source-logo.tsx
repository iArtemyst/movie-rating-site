'use client'

import React from "react";
import { LazyImageCoreSizer } from "./load-asset";
import {pickLogo} from "./movie-source-logos"

export function MovieTitleAndSourceLogoContainer({title, year, source, theme}:{title:string, year:string, source:number, theme:string}) {
    return (
        <div className="mainQuestionDiv">
            <p className="movieTitleAndYearText">{title} {`\(${year}\)`}</p>
            <div className="flex flex-col place-items-center mt-[.125em] sm:mt-[.25em] md:mt-[.5em] lg:mt-[.75em]">
                <p className="textBesideSourceLogo">on</p>
                <LazyImageCoreSizer imgLink={pickLogo({source:source, theme:theme})} imgAlt={`${source} logo`} imgStyle="sourceLogo" />
            </div>
        </div>
    )
}