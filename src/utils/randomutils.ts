export function getRandomInt(min: number, max: number) {
    if (max == min) {
        return max;
    }
    min = Math.ceil(min);
    max = Math.floor(max) + 1;
    return Math.floor(Math.random() * (max - min) + min); //The maximum is inclusive and the minimum is inclusive
}
