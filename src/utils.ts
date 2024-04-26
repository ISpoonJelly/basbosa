
function shuffleArray(unshuffled: any[]) {
    return unshuffled
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

export { 
    shuffleArray
}
