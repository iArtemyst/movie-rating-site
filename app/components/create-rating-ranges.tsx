import { ISimplifiedMovieInformation } from "./movie-interfaces";

const marginOfError = 5;

function CreateIMDBRatingRanges({movie}:{movie: ISimplifiedMovieInformation}) {
    console.log("Creating IMDB Rating Ranges for " + movie.movieTitle);
    const newTrimmedRatingsArray = movie.movieRatingIMDB.split("/10");
    const winRangeIMDBMin = (Number(newTrimmedRatingsArray[0]) - (marginOfError/10));
    const winRangeIMDBMax = (Number(newTrimmedRatingsArray[0]) + (marginOfError/10));
    const perfectIMDB = Number(newTrimmedRatingsArray[0]);
    const IMDBScoreRange = [winRangeIMDBMin, winRangeIMDBMax, perfectIMDB];
    console.log("IMDB Rating Ranges: ", IMDBScoreRange);
    return (IMDBScoreRange);
}

function CreateMetaScoreRatingRanges({movie}:{movie: ISimplifiedMovieInformation}) {
    console.log("Creating MetaScore Rating Ranges for " + movie.movieTitle);
    const newTrimmedRatings = movie.movieRatingMetascore.split("/100");
    const winRangeMetascoreMin = (Number(newTrimmedRatings[0]) - marginOfError);
    const winRangeMetascoreMax = (Number(newTrimmedRatings[0]) + marginOfError);
    const perfectMetacritic = Number(newTrimmedRatings[0]);
    const MetaScoreScoreRange = [winRangeMetascoreMin, winRangeMetascoreMax, perfectMetacritic];
    console.log("MetaScore Rating Ranges: ", MetaScoreScoreRange);
    return (MetaScoreScoreRange);
}

function CreateRottenTomatoesRatingRanges({movie}:{movie: ISimplifiedMovieInformation}) {
    console.log("Creating Rotten Tomatoes Rating Ranges for " + movie.movieTitle);
    const newTrimmedRatings = movie.movieRatingRottenTomatoes.split("%");
    const winRangeRottenTomatoesMin = (Number(newTrimmedRatings[0]) - marginOfError);
    const winRangeRottenTomatoesMax = (Number(newTrimmedRatings[0]) + marginOfError);
    const perfectRottenTomatoes = Number(newTrimmedRatings[0]);
    const RottenTomatoesScoreRange = [winRangeRottenTomatoesMin, winRangeRottenTomatoesMax, perfectRottenTomatoes];
    console.log("Rotten Tomatoes Rating Ranges: ", RottenTomatoesScoreRange);
    return (RottenTomatoesScoreRange);
}


export function GetCurrentMovieRatingsRangeArray({movieRatingSiteIndex, movie}:{movieRatingSiteIndex: number, movie:ISimplifiedMovieInformation}) {
    switch (movieRatingSiteIndex) {
        case 0:
            return CreateIMDBRatingRanges({movie: movie});
        case 1:
            return CreateMetaScoreRatingRanges({movie: movie});
        case 2:
            return CreateRottenTomatoesRatingRanges({movie: movie});
        default:
            return CreateIMDBRatingRanges({movie: movie});
    }
}