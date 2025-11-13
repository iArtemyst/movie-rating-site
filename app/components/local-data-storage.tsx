import { IPlayerStats } from "./player-stats";


export function useLocalData(keyName: string): string | null {
    const data = localStorage.getItem(keyName)
    return data;
}


export function loadLocalPlayerStats(prefix = ''): IPlayerStats | null {
    const keys = (s: string) => `${prefix}${s}`;
    const totalGamesPlayed = useLocalData(keys('totalGamesPlayed'));
    const totalPerfectGames = useLocalData(keys('totalPerfectGames'));
    const todaysScore = useLocalData(keys('todaysScore'));
    const hasPlayedToday = useLocalData(keys('hasPlayedToday'));

    const anyLoaded = [
        totalGamesPlayed,
        totalPerfectGames,
        todaysScore,
        hasPlayedToday,
    ].some(v => v !== null);

    if (!anyLoaded) return null;

    // Parse numbers/booleans with safe fallbacks
    const parseNumber = (s: string | null, fallback = 0) => {
        if (s === null) return fallback;
        const n = Number(s);
        return Number.isFinite(n) ? n : fallback;
    };
    const parseBool = (s: string | null, fallback = false) => {
        if (s === null) return fallback;
        return s === 'true' || s === '1';
    };

    return {
        totalGamesPlayed: parseNumber(totalGamesPlayed, 0),
        totalPerfectGames: parseNumber(totalPerfectGames, 0),
        todaysScore: parseNumber(todaysScore, 0),
        hasPlayedToday: parseBool(hasPlayedToday, false),
    } as IPlayerStats;
}

export function SaveDataLocally(keyName: string, valueToSave: string) {
    console.log(`Saving Data Locally: Key - ${keyName}, Value - ${valueToSave}`)
    localStorage.setItem(keyName, valueToSave);
}

export function SavePlayerStats(stats: IPlayerStats, prefix = ''): void {
    const keys = (s: string) => `${prefix}${s}`;

    try {
        SaveDataLocally(keys('totalGamesPlayed'), String(stats.totalGamesPlayed));
        SaveDataLocally(keys('totalPerfectGames'), String(stats.totalPerfectGames));
        SaveDataLocally(keys('todaysScore'), String(stats.todaysScore));
        SaveDataLocally(keys('hasPlayedToday'), stats.hasPlayedToday ? 'true' : 'false');
    } catch (err) {
        console.error('Error saving player stats to localStorage', err);
    }
}

export function ClearLocalStorage() {
    console.log("clearing the local storage")
    localStorage.clear()
}

export function CheckPlayedToday(localCheck: string): boolean {
    if (localCheck === 'true') {
        return true
    }
    else {
        return false
    }
}