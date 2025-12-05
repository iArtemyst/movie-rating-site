'use client'

import React from "react";
import { LazyImageCoreSizer } from "./load-asset";

const IMDBLogo = "https://eevee-feywild.art/__other/source_IMDB-logo-cropping.png";
const MCLogoDark = "https://eevee-feywild.art/__other/source_MC-logo-cropping_dark.png";
const MCLogoLight = "https://eevee-feywild.art/__other/source_MC-logo-cropping_light.png";
const RTLogo = "https://eevee-feywild.art/__other/source_RT-logo-cropping.png";

export function MovieTitleAndSourceLogoContainer({title, year, source, theme}:{title:string, year:string, source:number, theme:string}) {
    const sourceLogos = [
        IMDBLogo,
        [MCLogoDark, MCLogoLight],
        RTLogo,
    ]

    function pickLogo() {
        if (source === 1) {
        if (theme === `dark`) {
            return String(sourceLogos[1][1])
        }
        else { 
            return String(sourceLogos[1][0])
        }
        }
        else return String(sourceLogos[source])
    }

    return (
        <div className="mainQuestionDiv">
            <div className="flex flex-col place-items-center gap-[.5em] text-[16px] sm:text-[16px] md:text-[20px] lg:text-[24px]">
            <p className="pr-[.25em] font-bold text-[1.5]">{title} {`\(${year}\)`}</p>
            <div className="flex flex-row place-items-center">
                <p className="pr-[.25em] text-[.75em]">on</p>
                <LazyImageCoreSizer imgLink={pickLogo()} imgAlt={`${source} logo`} imgStyle="h-[1.5em]" />
            </div>
            </div>
        </div>
    )
}