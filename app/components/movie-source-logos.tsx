'use-client'

import { RatingIndex } from "./movie-interfaces";

export const IMDBLogo = "https://eevee-feywild.art/__other/source_IMDB-logo-cropping.png";
export const MCLogoDark = "https://eevee-feywild.art/__other/source_MC-logo-cropping_dark.png";
export const MCLogoLight = "https://eevee-feywild.art/__other/source_MC-logo-cropping_light.png";
export const RTLogo = "https://eevee-feywild.art/__other/source_RT-logo-cropping.png";

export function pickLogo({source, theme}:{source:number, theme:string}) {
    const sourceLogos = [
        IMDBLogo,
        RTLogo,
        [MCLogoDark, MCLogoLight], //the dark is actually the light, don't think about it too hard
    ]
    
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