import { IMovieInformation, IFullMovieInformation } from "./movie-interfaces";

export function GetSimplifiedMovieInfo(movieDatabase: IFullMovieInformation[], index: number) {
    const TitleInfo = movieDatabase[index];
    const titleRatingsArray = TitleInfo.Ratings;
    const imdbRating = titleRatingsArray.find(rating => rating.Source === "Internet Movie Database") || {Value: "No IMDB Rating"};
    const metascoreRating = titleRatingsArray.find(rating => rating.Source === "Metacritic") || {Value: "No Metascore Rating"};
    const rottenTomatoesRating = titleRatingsArray.find(rating => rating.Source === "Rotten Tomatoes") || {Value: "No Rotten Tomatoes Rating"};
    const otherRating = titleRatingsArray?.find(rating => rating.Source !== "Internet Movie Database" && rating.Source !== "Metacritic" && rating.Source !== "Rotten Tomatoes");
    const titleData: IMovieInformation =
    {
        movieTitle: TitleInfo.Title,
        movieDirector: TitleInfo.Director,
        moviePosterLink: TitleInfo.Poster,
        movieReleaseYear: TitleInfo.Year,
        movieSummary: TitleInfo.Plot,
        movieTopBilled: TitleInfo.Actors,
        movieRatingIMDB: imdbRating.Value,
        movieRatingMetascore: metascoreRating.Value,
        movieRatingRottenTomatoes: rottenTomatoesRating.Value,
        movieRatingOther: otherRating?.Value || "No Other Ratings"
    };
    return(titleData)
}