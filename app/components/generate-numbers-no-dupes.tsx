import { GetRandomInt } from "./get-random-int";
import { CompareIfNumbersAreEqual } from "./compare-numbers-equal";
import { IFullMovieInformation } from "./movie-interfaces";


export function GenerateThreeTrulyRandomNumbersWithinMovieDatabase(movieDatabase: IFullMovieInformation[]): number[] {
    const randomlyGeneratedNumbers: number[] = [];
    
    for (let i = 0; i < 3; i++) {
        let newRandomNumber = GetRandomInt(0, movieDatabase.length);
        let newRandomNumber2 = GetRandomInt(0, movieDatabase.length);
        let newRandomNumber3 = GetRandomInt(0, movieDatabase.length);

        if (CompareIfNumbersAreEqual({number1: newRandomNumber, number2: newRandomNumber2})) {
        newRandomNumber2 =+ 1;
        if (newRandomNumber2 > movieDatabase.length) {
            newRandomNumber2 = 0;
        };
        };
        if (CompareIfNumbersAreEqual({number1: newRandomNumber, number2: newRandomNumber3})) {
        newRandomNumber3 =+ 1;
        if (newRandomNumber3 > movieDatabase.length) {
            newRandomNumber3 = 0;
        }
        };
        if (CompareIfNumbersAreEqual({number1: newRandomNumber2, number2: newRandomNumber3})) {
        newRandomNumber3 =+ 1;
        if (newRandomNumber3 > movieDatabase.length) {
            newRandomNumber3 = 0;
        }
        };
        if (newRandomNumber3 == newRandomNumber || newRandomNumber3 == newRandomNumber2) {
        newRandomNumber3 =+ 1;
        if (newRandomNumber3 == 0 && newRandomNumber == 0 || newRandomNumber3 == 0 && newRandomNumber2 == 0) {
            newRandomNumber3 =+ 1;
        }
        if (newRandomNumber3 > movieDatabase.length) {
            newRandomNumber3 = 0;
        }
        };

        randomlyGeneratedNumbers.push(newRandomNumber);
        randomlyGeneratedNumbers.push(newRandomNumber2);
        randomlyGeneratedNumbers.push(newRandomNumber3);
    }

    return(randomlyGeneratedNumbers);
}