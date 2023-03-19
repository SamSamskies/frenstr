export const makeUrlWithParams = (
  url: string,
  params: Record<string, string | undefined>
) => {
  const urlObj = new URL(url);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      urlObj.searchParams.append(key, value);
    }
  });

  return urlObj.toString();
};
