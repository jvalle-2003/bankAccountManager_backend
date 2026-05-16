exports.calculateSimilarity = (
    text1 = '',
    text2 = ''
) => {

    text1 = text1.toUpperCase();
    text2 = text2.toUpperCase();

    if (text1 === text2)
        return 1;

    const words1 = text1.split(' ');
    const words2 = text2.split(' ');

    const matches =
        words1.filter(w =>
            words2.includes(w)
        ).length;

    return matches /
        Math.max(words1.length, words2.length);
};