export interface IPlayerStats 
{
    totalGamesPlayed: number;
    totalPerfectGames: number;
    todaysScore: number;
    hasPlayedToday: boolean;
    localGameIndex: number;
    todaysMovieRatings: number[];
    playerTheme: "light" | "dark";
}

export const newPlayerStats: IPlayerStats = {
    totalGamesPlayed: 0,
    totalPerfectGames: 0,
    todaysScore: 0,
    hasPlayedToday: false,
    localGameIndex: 0,
    todaysMovieRatings: [],
    playerTheme: "dark",
};