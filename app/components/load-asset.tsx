'use client'

import { useState, useEffect } from "react";
import { LoadingAsset } from "./loading";

//------------------------------------------------------------------------

export function LazyImageCoreSizer({imgLink, imgAlt, imgStyle}: {imgLink: string, imgAlt: string, imgStyle:string,}) {
    const [loadedSrc, setLoadedSrc] = useState('');

    useEffect(() => {
        async function loadImage() { 
            const source = await LoadAsset(imgLink);
            setLoadedSrc(source);
        }
        loadImage();
    }, [imgLink]);

    return (
        loadedSrc === '' ?
            <LoadingAsset text="Loading Movie Poster..."/> 
            :
            <img src={loadedSrc} alt={imgAlt} className={`${imgStyle}`}/>
    )
}

//------------------------------------------------------------------------

export async function LoadAsset(path: string): Promise<string>
{
    if (process.env.NODE_ENV === "development") { return `${path}`; }
    else { return `${path}`; }
}
