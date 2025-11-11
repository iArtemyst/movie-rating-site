import { IPlayerStats } from "./player-stats";

const moviePointValues = [500, 300, 0]; //500 = Perfect, 300 = Almost, 0 = Wrong
const scoreErrorMargin = [.5, 5, 5]

function SplitMovieRatingStringAndReturnNumber({ratingSourceInt, movieRatingString}:{ratingSourceInt:number, movieRatingString:string}) {
    //parse the string into a float
    const parsed = parseFloat(movieRatingString);
    if (Number.isFinite(parsed) && !Number.isNaN(parsed)) {
        return parsed
    }

    // Fallback: if parseFloat didn't work, split the string apart from the secondary text
    const splitScoreArray = [
        movieRatingString.split("/10"),
        movieRatingString.split("/100"),
        movieRatingString.split("%")
    ]
    const splitScore = splitScoreArray[ratingSourceInt] ? splitScoreArray[ratingSourceInt][0] : ""
    const movieScoreAsNumber = Number(splitScore)
    return movieScoreAsNumber

}


export function GetPlayerRatingScoreIndexValue({ratingSourceInt, movieRatingString, playerMovieRating}:{ratingSourceInt:number, movieRatingString: string, playerMovieRating: number}) {
    const actualRatingNumber = SplitMovieRatingStringAndReturnNumber({ratingSourceInt:ratingSourceInt, movieRatingString:movieRatingString});
    const scoreRange = [(actualRatingNumber-scoreErrorMargin[ratingSourceInt]), (actualRatingNumber+scoreErrorMargin[ratingSourceInt]), actualRatingNumber]

    if (playerMovieRating === scoreRange[2]) {
        return 0; //perfect score
    }
    if (playerMovieRating >= scoreRange[0] && playerMovieRating <= scoreRange[1]) {
        return 1; //within range
    }
    else {
        return 2; //out of range
    }
}

export function UpdatePlayerScoreBasedOnRating({ratingSourceInt, movieRatingString, playerMovieRating, playerStats}:{ratingSourceInt: number, movieRatingString: string, playerMovieRating: number, playerStats: IPlayerStats}) {
    const playersMovieRatingIndex = GetPlayerRatingScoreIndexValue({ratingSourceInt:ratingSourceInt, movieRatingString:movieRatingString, playerMovieRating:playerMovieRating})
    const getPlayerScoreValue = moviePointValues[playersMovieRatingIndex];
    playerStats.todaysScore += getPlayerScoreValue;
}