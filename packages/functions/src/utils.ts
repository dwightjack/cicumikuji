export const camelCase = (str: string) =>
  str.replace(/[-_]([a-z])/g, (m) => m[1].toUpperCase());
