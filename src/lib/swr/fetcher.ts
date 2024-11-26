export const fetcher = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`An error occurred: ${res.statusText}`);
  }

  return res.json();
};


export const postFetcher = async (url: string, { arg }: { arg: any }) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  if (!res.ok) {
    throw new Error(`An error occurred: ${res.statusText}`);
  }
  return res.json();
};
