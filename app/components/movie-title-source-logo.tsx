'use client'

import React from "react";
import { LazyImageCoreSizer } from "./load-asset";
import { RatingIndex } from "./movie-interfaces";

const IMDBLogo = "https://eevee-feywild.art/__other/source_IMDB-logo-cropping.png";
const MCLogoDark = "https://eevee-feywild.art/__other/source_MC-logo-cropping_dark.png";
const MCLogoLight = "https://eevee-feywild.art/__other/source_MC-logo-cropping_light.png";
const RTLogo = "https://eevee-feywild.art/__other/source_RT-logo-cropping.png";

export function MovieTitleAndSourceLogoContainer({title, year, source, theme}:{title:string, year:string, source:number, theme:string}) {
    const sourceLogos = [
        IMDBLogo,
        RTLogo,
        [MCLogoDark, MCLogoLight], //the dark is actually the light, don't think about it too hard
    ]

    function pickLogo() {
        if (source === RatingIndex.Metacritic) {
            if (theme === `dark`) {
                return String(sourceLogos[RatingIndex.Metacritic][1])
            }
            else { 
                return String(sourceLogos[RatingIndex.Metacritic][0])
            }
        }
        
        return String(sourceLogos[source])
    }

    return (
        <div className="mainQuestionDiv">
            <p className="movieTitleAndYearText">{title} {`\(${year}\)`}</p>
            <div className="flex flex-row place-items-center mt-[.25em] sm:mt-[.5em] md:mt-[.75em] lg:mt-[1em]">
                <p className="textBesideSourceLogo">on</p>
                <LazyImageCoreSizer imgLink={pickLogo()} imgAlt={`${source} logo`} imgStyle="sourceLogo" />
            </div>
        </div>
    )
}