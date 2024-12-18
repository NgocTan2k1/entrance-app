export const isNumber = (input: string) => {
    const regex = /^-?\d+(\.\d+)?$/;
    return regex.test(input);
};
