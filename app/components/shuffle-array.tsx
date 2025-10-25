export function ShuffleStringArray(array: string[]) {
    const shuffled_array = structuredClone(array);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i - 1));
        [shuffled_array[i], shuffled_array[j]] = [shuffled_array[j], shuffled_array[i]];
    }
    return shuffled_array;
}