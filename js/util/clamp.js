const clamp = (min, value, max) => {
    if (min !== null && min !== undefined && value < min)
        return min;
    if (max !== null && max !== undefined && value > max)
        return max;
    return value;
};
export { clamp };
//# sourceMappingURL=clamp.js.map