import { fromJS, Map } from "immutable";

const issueArrayToMap = (issues) => {
  return Map().withMutations(
    (issueMap) => {
      for (const issue of issues) {
        issueMap.set(
          issue.id,
          fromJS(issue)
        );
      }
    }
  );
};

export const getIssues = async () => {
  const response = await fetch("/api/issues");

  if (!response.ok) {
    throw new Error("Error getting issues");
  }

  if (response.status < 300) {
    const issues = await response.json();

    const issueMap = issueArrayToMap(issues);

    return issueMap;
  }

  throw new Error(
    `GET Request to /api/issues/ returned with status ${response.status}`
  );
};
