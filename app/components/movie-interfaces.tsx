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
    RatingInfo: IRatingInfo,
    BoxOffice: string,
    WatchProviders?: IWatchProvider[],
    Reviews?: string[]
};

export interface IWatchProvider
{
    logo_path: string,
    provider_id: number,
    provider_name: string,
    display_priority: number,
}

export interface IRatingInfo
{
    RatingIndex: RatingIndex,
    RatingValue: string,
}

export enum RatingIndex {
    IMDB = 0,
    RottenTomatoes = 1,
    Metacritic = 2
}


export const ratingStringEndings = ["/10","%","/100",]

export const moviePointValues = [500, 350, 200, 100, 0]; //500 = Perfect, 350 = Really Close, 200 = Fair, 100 = Within Reason, 0 = Wrong
export const scoreErrorMargin = [.5, 5, 5]