export interface IDailyMovieInformation
{
    movies: IMovieInformation[],
    dailyId: number
}

export interface IMovieInformation
{
    Title: string, 
    Director: string, 
    Year: string, 
    Actors: string, 
    Plot: string, 
    Poster: string,
    RatingSource: string,
    RatingValue: string,
    RandomRatingInt: number,
};

export const moviePointValues = [500, 350, 200, 100, 0]; //500 = Perfect, 350 = Really Close, 200 = Fair, 100 = Within Reason, 0 = Wrong
export const scoreErrorMargin = [.5, 5, 5]