export function IncrementArrayIndex({currentIndex, arrayLength}:{currentIndex:number, arrayLength:number}) {
    if ( currentIndex < arrayLength ) {
        return currentIndex += 1
    }
    else {
        return null
    }
}