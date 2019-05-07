import { fromJS, OrderedMap, Set, Map } from "immutable";

const transformResultToComment = (result) => {
  return fromJS({
    ...result,
    createdAt: new Date(result.createdAt),
    updatedAt: new Date(result.updatedAt),
  });
};

const transformResultToIssue = (result) => {
  return fromJS({
    ...result,
    comments: (result.comments || []).map(
      transformResultToComment
    ),
    createdAt: new Date(result.createdAt),
    updatedAt: new Date(result.updatedAt),
  });
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
  return fromJS(
    issueComments.map(transformResultToComment)
  );
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

export const getIssues = async ({ ids, includeClosed = false } = {}) => {
  let url = "/api/issues";

  const qs = new URLSearchParams();

  let hasQs = false;

  if (ids && ids.length > 0) {
    for (const id of ids) {
      qs.append("id", id);
    }

    hasQs = true;
  }

  if (includeClosed) {
    qs.append("includeClosed", 1);
    hasQs = true;
  }

  if (hasQs) {
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

    return transformResultToIssue(issue);
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

    return transformResultToComment(issueComment);
  }

  throw new Error(
    `POST Request to /api/issues/${issueID}/comments returned with status ${
      response.status
    }`
  );
};

export const searchIssues = async ({ searchQuery, statuses, activityBy }) => {
  let url = "/api/issues/search";

  const qs = new URLSearchParams();

  if (searchQuery) {
    qs.set("query", searchQuery);
  }

  if (statuses && statuses.length > 0) {
    for (const status of statuses) {
      qs.append("status", status);
    }
  }

  if (activityBy && activityBy.length > 0) {
    for (const user of activityBy) {
      qs.append("activityBy", JSON.stringify(user));
    }
  }

  url += `?${qs}`;

  const response = await fetch(
    url,
    {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error searching issues");
  }

  if (response.status < 300) {
    const results = await response.json();

    return issueArrayToMap(results);
  }

  throw new Error(
    `GET Request to /api/issues/search returned with status ${
      response.status
    }`
  );
};

export const getIssueUsers = async ({ nameFilter }) => {
  let url = "/api/issues/issueUsers";

  if (nameFilter) {
    const qs = new URLSearchParams();

    qs.set("nameFilter", nameFilter);

    url += `?${qs}`;
  }

  const response = await fetch(
    url,
    {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error getting issue users");
  }

  if (response.status < 300) {
    const results = await response.json();

    return Set(
      results.map(Map)
    );
  }

  throw new Error(
    `GET Request to /api/issues/issueUsers returned with status ${
      response.status
    }`
  );
};

