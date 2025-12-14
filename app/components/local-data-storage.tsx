'use client'

import { IPlayerScoreInfo, IPlayerStats } from "./player-stats";

export function getLocalData(keyName: string): string | null {
    const data = localStorage.getItem(keyName)
    return data;
}

export function SaveDataLocally(keyName: string, valueToSave: string) {
    localStorage.setItem(keyName, valueToSave);
}

export function loadLocalPlayerStats(prefix = ''): IPlayerStats | null {
    const keys = (s: string) => `${prefix}${s}`;
    const totalGamesPlayed = getLocalData(keys('totalGamesPlayed'));
    const totalPerfectGames = getLocalData(keys('totalPerfectGames'));
    const todaysScore = getLocalData(keys('todaysScore'));
    const hasPlayedToday = getLocalData(keys('hasPlayedToday'));
    const localDailyIndex = getLocalData(keys(`localGameIndex`));
    const todaysMovieRatings = getLocalData(keys(`todaysMovieRatings`));
    const playerTheme = getLocalData(keys(`playerTheme`));
    const anyLoaded = [
        totalGamesPlayed,
        totalPerfectGames,
        todaysScore,
        hasPlayedToday,
        localDailyIndex,
        todaysMovieRatings,
        playerTheme,
    ].some(v => v !== null);
    if (!anyLoaded) return null;
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
        localGameIndex: parseNumber(localDailyIndex, 0),
        todaysMovieRatings: todaysMovieRatings ? JSON.parse(todaysMovieRatings) as IPlayerScoreInfo[] : [],
        playerTheme: (playerTheme === "light" || playerTheme === "dark") ? playerTheme : "dark",
    } as IPlayerStats;
}

export function SavePlayerStats(stats: IPlayerStats, prefix = ''): void {
    const keys = (s: string) => `${prefix}${s}`;
    try {
        SaveDataLocally(keys('totalGamesPlayed'), String(stats.totalGamesPlayed));
        SaveDataLocally(keys('totalPerfectGames'), String(stats.totalPerfectGames));
        SaveDataLocally(keys('todaysScore'), String(stats.todaysScore));
        SaveDataLocally(keys('hasPlayedToday'), stats.hasPlayedToday ? 'true' : 'false');
        SaveDataLocally(keys(`localGameIndex`), String(stats.localGameIndex));
        SaveDataLocally(keys(`todaysMovieRatings`), JSON.stringify(stats.todaysMovieRatings));
        SaveDataLocally(keys(`playerTheme`), stats.playerTheme);
    } catch (err) {
        console.error('Error saving player stats to localStorage', err);
    }
    console.log("SAVING LOCAL PLAYER STATS:")
    console.log(stats)
}

export function ClearLocalStorage() {
    console.log("clearing the local storage")
    localStorage.clear()
}