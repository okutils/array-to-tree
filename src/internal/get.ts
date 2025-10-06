/**
 * This code is modified from the radash project.
 * @see https://github.com/sodiray/radash
 */
export const get = (value: any, path: string) => {
  const segments = path.split(/[.[\]]/g);
  let current: any = value;
  for (const key of segments) {
    if (current === null) return null;
    if (current === undefined) return null;
    const dequoted = key.replace(/['"]/g, "");
    if (dequoted.trim() === "") continue;
    current = current[dequoted];
  }
  if (current === undefined) return null;
  return current;
};
