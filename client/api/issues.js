import { fromJS, OrderedMap } from "immutable";

const transformResultToIssue = (result) => {
  return fromJS(
    {
      comments: [],
      ...result,
    }
  );
};

const issueArrayToMap = (issues) => {
  return OrderedMap().withMutations(
    (issueMap) => {
      for (const issue of issues) {
        issueMap.set(
          issue.id,
          transformResultToIssue(issue)
        );
      }
    }
  );
};

const issueCommentArrayToList = (issueComments) => {
  return fromJS(issueComments);
};

export const getIssue = async ({ id, includeComments = false } = {}) => {
  let url = `/api/issues/${id}`;

  if (includeComments) {
    url += `?${new URLSearchParams({
      includeComments: 1,
    }).toString()}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Error getting issue");
  }

  if (response.status < 300) {
    const issue = await response.json();

    return transformResultToIssue(issue);
  }

  throw new Error(
    `GET Request to /api/issues/${id} returned with status ${response.status}`
  );
};

export const getIssues = async ({ ids } = {}) => {
  let url = "/api/issues";

  if (ids && ids.length > 0) {
    const qs = new URLSearchParams();

    for (const id of ids) {
      qs.append("id", id);
    }

    url += `?${qs.toString()}`;
  }

  const response = await fetch(url);

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

export const createIssue = async (issueData) => {
  const response = await fetch(
    "/api/issues",
    {
      method: "POST",
      body: JSON.stringify(issueData),
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error creating issue");
  }

  if (response.status < 300) {
    const issue = await response.json();

    return fromJS(issue);
  }

  throw new Error(
    `POST Request to /api/issues/ returned with status ${
      response.status
    }`
  );
};

export const updateIssue = async ({ issueID, updates }) => {
  const response = await fetch(
    `/api/issues/${issueID}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error updating issue");
  }

  if (response.status < 300) {
    const issue = await response.json();

    return fromJS(issue);
  }

  throw new Error(
    `PATCH Request to /api/issues/${issueID} returned with status ${
      response.status
    }`
  );
};

export const getIssueComments = async ({ issueID }) => {
  const response = await fetch(`/api/issues/${issueID}/comments`);

  if (!response.ok) {
    throw new Error("Error getting issue comments");
  }

  if (response.status < 300) {
    const issueComments = await response.json();

    const issueCommentMap = issueCommentArrayToList(issueComments);

    return issueCommentMap;
  }

  throw new Error(
    `GET Request to /api/issues/${issueID}/comments returned with status ${
      response.status
    }`
  );
};


export const createIssueComment = async ({ issueID, commentData }) => {
  const response = await fetch(
    `/api/issues/${issueID}/comments`,
    {
      method: "POST",
      body: JSON.stringify(
        commentData
      ),
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error creating issue comment");
  }

  if (response.status < 300) {
    const issueComment = await response.json();

    return fromJS(issueComment);
  }

  throw new Error(
    `POST Request to /api/issues/${issueID}/comments returned with status ${
      response.status
    }`
  );
};

