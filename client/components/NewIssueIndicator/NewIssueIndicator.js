import React, { useCallback } from "react";
import { useMappedState } from "redux-react-hook";
import { Link } from "react-router-dom";
import { IconButton, Badge } from "@material-ui/core";
import IssueIcon from "@material-ui/icons/ReportProblem";
import CommentIcon from "@material-ui/icons/Comment";

import {
  newActivity,
  linkURLForNewIssues,
  linkURLForNewComments,
} from "+app/selectors/activity";

const NewIssueIndicator = () => {
  const mapStateToProps = useCallback(
    (state) => {
      const activity = newActivity(state);

      return {
        newIssues: activity.issues,
        newComments: activity.comments,
        issuesURL: linkURLForNewIssues(state),
        commentsURL: linkURLForNewComments(state),
      };
    },
    []
  );

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
