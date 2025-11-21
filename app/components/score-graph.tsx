'use client'

import { IPlayerStats } from "./player-stats";
import "@/app/globals.css";

export function TodaysFinalScoreScreen({visible, playerStats}:{visible:boolean, playerStats:IPlayerStats | null}) {
    function TextWithStats({text, stats}:{text:string, stats:number | undefined}) {
        return (
            <div className={`divCenterHorizontalText`}>
                <p className={`scoreTextSecondary`}>{text}</p>
                <p className={`scoreTextPrimary`}>{stats ?? "No Stats"}</p>
            </div>
        )
    }
    
    return (
        <>
            {   visible &&
                <div className={`fullScreenBlockingDiv`} onClick={e => {e.stopPropagation()}}>
                    <div className="popupBackgroundDiv bg-[#001f1a]">
                        <p className="popupTitleText">Thank you for playing today!</p>
                            <TextWithStats text="Today's Score:" stats={playerStats?.todaysScore } />
                            <TextWithStats text="Total Games Played:" stats={playerStats?.totalGamesPlayed } />
                            <TextWithStats text="Number of Perfect Games:" stats={playerStats?.totalPerfectGames } />
                    </div>
                </div>
            }
        </>
    )
}