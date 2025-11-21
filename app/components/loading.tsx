'use client'


export function LoadingPage({text}:{text:string}) {
    return (
        <div className={`w-dvw h-dvh flex self-center content-center justify-self-center text-center`}>
            <p className={`self-center place-self-center w-full`}>{text}</p>
        </div>
    )
}

export function LoadingAsset({text}:{text:string}) {
    return (
        <div className={`w-full h-full flex self-center content-center justify-self-center text-center`}>
            <p className={`self-center place-self-center`}>{text}</p>
        </div>
    )
}