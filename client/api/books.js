export const getBookNames = async () => {
  const response = await fetch("/api/epub");

  if (!response.ok || response.status > 299) {
    throw new Error(
      `Error fetching eBooks: ${response.statusText}`
    );
  }

  const books = await response.json();

  return books;
};
