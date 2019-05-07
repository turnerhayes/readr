import React, { useCallback, useState } from "react";
import { useMappedState, useDispatch } from "redux-react-hook";
import { Link } from "react-router-dom";
import { IconButton, Badge } from "@material-ui/core";
import IssueIcon from "@material-ui/icons/ReportProblem";
import CommentIcon from "@material-ui/icons/Comment";

import {
  linkURLForNewIssues,
  linkURLForNewComments,
  stateWithDedupedActivity,
  newActivity,
} from "+app/selectors/viewActivity";
import { getNewActivity } from "+app/actions";
import { List, Map } from "immutable";

const NewIssueIndicator = () => {
  const mapStateToProps = useCallback(
    (state) => {
      const deduped = stateWithDedupedActivity(state);
      const activity = newActivity(deduped);

      return {
        newIssues: activity.get("issues", List()),
        newComments: activity.get("issueComments", Map()),
        issuesURL: linkURLForNewIssues(deduped),
        commentsURL: linkURLForNewComments(deduped),
      };
    },
    []
  );

  const [hasFetched, setHasFetched] = useState(false);

  const dispatch = useDispatch();

  if (!hasFetched) {
    dispatch(
      getNewActivity()
    );

    setHasFetched(true);
  }

  const {
    newIssues,
    newComments,
    issuesURL,
    commentsURL,
  } = useMappedState(mapStateToProps);

  let IconComponent;
  let badgeCount;
  let linkURL;
  let title;

  if (!newIssues.isEmpty()) {
    IconComponent = IssueIcon;
    badgeCount = newIssues.size;
    linkURL = issuesURL;
    title = `${badgeCount} new issue${badgeCount === 1 ? "" : "s"}`;
  } else if (!newComments.isEmpty()) {
    IconComponent = CommentIcon;
    badgeCount = newComments.reduce(
      (sum, commentIDs) => sum + commentIDs.size,
      0
    );
    linkURL = commentsURL;
    title = `${badgeCount} new issue comment${badgeCount === 1 ? "" : "s"}`;
  }

  if (IconComponent) {
    return (
      <IconButton
        color="inherit"
        component={Link}
        to={linkURL}
        title={title}
        aria-label={title}
      >
        <Badge
          badgeContent={badgeCount}
        >
          <IconComponent />
        </Badge>
      </IconButton>
    );
  }

  return null;
};

export { NewIssueIndicator };
