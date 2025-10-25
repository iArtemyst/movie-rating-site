'use client'

import { useState, useEffect } from "react";
import { Loading } from "./loading";


//------------------------------------------------------------------------

function LazyImageCoreSizer({imgLink, imgAlt = "Default Image", imgSize="w-fit max-h-[960px]"}: {imgLink: string, imgAlt: string, imgSize:string,}) {
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
        <Loading/> :
        <img src={loadedSrc}
            alt={imgAlt}
            className={`${imgSize} place-self-center object-cover`}
        />
    )
}

//------------------------------------------------------------------------

export async function LoadAsset(path: string): Promise<string>
{
    if (process.env.NODE_ENV === "development") { return `${path}`; }
    else { return `${path}`; }
}

export function LazyImageSizer({imgLink, imgAlt="Default Image", imgSize="w-fit max-h-[960px]"}: {imgLink: string, imgAlt: string, imgSize:string})
{
    return <LazyImageCoreSizer imgLink={imgLink} imgAlt={imgAlt} imgSize={imgSize}/>
}
