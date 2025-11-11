import React from "react";
import * as lstorage from "./local-data-storage";
import { IPlayerStats } from "./player-stats";

//TESTING FUNCTIONS
export function TestButtonResetLocalStorageAndReloadPage() {
    function HandleClick() {
        lstorage.ClearLocalStorage()
        window.location.reload()
    }
    
    return (
        <div className={`w-fit h-fit absolute top-0 left-0 m-[3em] px-[1em] py-[.5em] bg-blue-800 rounded-full hover:scale-[95%] active:scale-[90%] font-semibold z-200`}>
        <button onClick={() => HandleClick()}>RESET LOCAL</button>
        </div>
    )
}

export function TestDivWithPlayerStatInformation({playerStats}:{playerStats:IPlayerStats}) {
    return (
        <div className={`absolute left-[50%] -translate-x-[50%] bottom-0 mb-[1em] flex flex-row gap-[1em]`}>
        <div className={`flex flex-col items-center`}>
            <p>Today's Score:</p>
            <p>{playerStats.todaysScore}</p>
        </div>
        <div className={`flex flex-col items-center`}>
            <p>Has Played Today?</p>
            <p>{`${playerStats.hasPlayedToday}`}</p>
        </div>
        <div className={`flex flex-col items-center`}>
            <p>Perfect Games:</p>
            <p>{playerStats.totalPerfectGames}</p>
        </div>
        </div>
    )
}