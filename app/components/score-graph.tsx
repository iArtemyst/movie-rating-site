import { IPlayerStats } from "./player-stats";

function PlayerInfoOnScoreScreen({playerStats}:{playerStats:IPlayerStats}) {
    return (
        <div className="text-black place-self-center w-full text-center place-content-center bg-red-200 flex flex-row gap-[1em]">
            <p>Today's Score: {playerStats.todaysScore}</p>
            <p>Number of Perfect Games: {playerStats.totalPerfectGames}</p>
            <p>Number of Games Played: {playerStats.totalGamesPlayed}</p>
        </div>
    )
}


export function ScoreGraph({visible, playerStats}:{visible:boolean, playerStats:IPlayerStats}) {
    return (
        <>
            {   visible &&
                <div className={`absolute left-0 top-0 bottom-0 right-0 bg-[#000000DD] z-10 flex justify-center flex-col`}>
                    <div className="bg-purple-700 w-[720px] h-[480px] text-white py-[2em] px-[2em] rounded-[24px] self-center flex flex-col gap-[1em]">
                    <div className={`w-full h-full place-self-center bg-white rounded-[12px] flex flex-row justify-items-center`}>
                        <div className="text-black place-self-center place-content-between w-full h-full text-center flex flex-col bg-blue-200">
                            <p className="text-[24px] align-top">Thanks for Playing Today!</p>
                            <PlayerInfoOnScoreScreen playerStats={playerStats}/>
                        </div>
                    </div>
                    <p className="font-bold text-balance text-[24px] text-center place-self-center justify-self-end">Today's Scores</p>
                    </div>
                </div>
            }
        </>
    )
}