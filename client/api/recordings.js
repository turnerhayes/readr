export const fetchSample = async ({ sampleName }) => {
  const response = await fetch(`/samples/${sampleName}`);

  if (!response.ok || response.status > 299) {
    throw new Error(
      `Error fetching sample ${sampleName}: ${response.statusText}`
    );
  }

  const buffer = await response.arrayBuffer();

  return {
    buffer,
    contentType: response.headers.get("Content-type"),
  };
};
