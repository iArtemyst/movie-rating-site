export interface IFullMovieInformation
{
    Title: string,
    Year:string,
    Rated:string,
    Released:string,
    Runtime:string,
    Genre:string,
    Director:string,
    Writer:string,
    Actors:string,
    Plot:string,
    Language:string,
    Country:string,
    Awards:string,
    Poster:string,
    Ratings:{"Source":string,"Value":string}[],
    Metascore:string,
    imdbRating:string,
    imdbVotes:string,
    imdbID:string,
    Type:string,
    DVD:string,
    BoxOffice:string,
    Production:string,
    Website:string,
    Response:string
};

export interface ISimplifiedMovieInformation
{
    movieTitle: string, 
    movieDirector: string, 
    movieReleaseYear: string, 
    movieTopBilled: string, 
    movieSummary: string, 
    moviePosterLink: string,
    movieRatingIMDB: string,
    movieRatingMetascore: string,
    movieRatingRottenTomatoes: string,
    movieRatingOther: string,
};