'use-client'

import "@/app/globals.css";
import { IPlayerStats } from "./player-stats";
import { SavePlayerStats } from "./local-data-storage";

export function enableDarkMode({playerStats}:{playerStats:IPlayerStats}) {
    const tempStats = playerStats;
    document.body.classList.remove("lightmode")
    document.body.classList.add('darkmode')
    tempStats.playerTheme = ('dark')
    SavePlayerStats(tempStats)
}

export function enableLightMode({playerStats}:{playerStats:IPlayerStats}) {
    const tempStats = playerStats;    
    document.body.classList.remove('darkmode')
    document.body.classList.add('lightmode')
    tempStats.playerTheme = ('light')
    SavePlayerStats(tempStats)
}

export function SwitchThemeButton({playerStats}:{playerStats:IPlayerStats}) {
    function toggleTheme({playerStats}:{playerStats:IPlayerStats}) {
        if (playerStats?.playerTheme === 'light') {
            enableDarkMode({playerStats:playerStats});
        } else {
            enableLightMode({playerStats:playerStats});
        }
    }

    return (
        <div className="switchThemeButton" onClick={() => toggleTheme({playerStats:playerStats})}>
            <p>SWITCH THEME</p>
        </div>
    )
}