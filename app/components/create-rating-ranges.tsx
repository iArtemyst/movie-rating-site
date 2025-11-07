import { ISimplifiedMovieInformation, IFullMovieInformation } from "./movie-interfaces";

const marginOfError = 5;


function CreateIMDBRatingRanges({movies}:{movies: ISimplifiedMovieInformation[]}) {
    console.log("Creating IMDB Rating Ranges...");
    console.log("Movies passed in: ", movies);
    const newTrimmedRatingsArray = movies[0].movieRatingIMDB.split("/10");
    const winRangeIMDBMin = (Number(newTrimmedRatingsArray[0]) - (marginOfError/10));
    const winRangeIMDBMax = (Number(newTrimmedRatingsArray[0]) + (marginOfError/10));
    const perfectIMDB = Number(newTrimmedRatingsArray[0]);
    const IMDBScoreRange = [winRangeIMDBMin, winRangeIMDBMax, perfectIMDB];

    console.log("IMDB Rating Ranges: ", IMDBScoreRange);
    return (IMDBScoreRange);
}

function CreateMetaScoreRatingRanges({movies=[]}:{movies?: ISimplifiedMovieInformation[]}) {
    const newTrimmedRatings = movies[0].movieRatingMetascore.split("/100");
    const winRangeMetascoreMin = (Number(newTrimmedRatings[0]) - marginOfError);
    const winRangeMetascoreMax = (Number(newTrimmedRatings[0]) + marginOfError);
    const perfectMetacritic = Number(newTrimmedRatings[0]);
    const MetaScoreScoreRange = [winRangeMetascoreMin, winRangeMetascoreMax, perfectMetacritic];

    console.log("MetaScore Rating Ranges: ", MetaScoreScoreRange);
    return (MetaScoreScoreRange);
}

function CreateRottenTomatoesRatingRanges({movies=[]}:{movies?: ISimplifiedMovieInformation[]}) {
    const newTrimmedRatings = movies[0].movieRatingRottenTomatoes.split("%");
    const winRangeRottenTomatoesMin = (Number(newTrimmedRatings[0]) - marginOfError);
    const winRangeRottenTomatoesMax = (Number(newTrimmedRatings[0]) + marginOfError);
    const perfectRottenTomatoes = Number(newTrimmedRatings[0]);
    const RottenTomatoesScoreRange = [winRangeRottenTomatoesMin, winRangeRottenTomatoesMax, perfectRottenTomatoes];

    console.log("Rotten Tomatoes Rating Ranges: ", RottenTomatoesScoreRange);
    return (RottenTomatoesScoreRange);
}


export function GetRatingSelectionForMovie(ratingIndex: number, movies: ISimplifiedMovieInformation[]) {
    switch (ratingIndex) {
        case 0:
            return CreateIMDBRatingRanges({movies: movies});
        case 1:
            return CreateMetaScoreRatingRanges({movies: movies});
        case 2:
            return CreateRottenTomatoesRatingRanges({movies: movies});
        default:
            return CreateIMDBRatingRanges({movies: movies});
    }
}