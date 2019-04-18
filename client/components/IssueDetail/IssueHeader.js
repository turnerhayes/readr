import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import CardHeader from "@material-ui/core/CardHeader";
import formatRelative from "date-fns/formatRelative";

import { IssueUserDisplayName } from "+app/components/IssueUserDisplayName";

export const IssueHeader = ({
  issueOrComment,
  titleTypographyProps,
  subheaderTypographyProps,
  ...props
}) => (
  <CardHeader
    title={
      <IssueUserDisplayName
        issue={issueOrComment}
        component={null}
      />
    }
    titleTypographyProps={{
      variant: "subtitle1",
      ...titleTypographyProps,
    }}
    subheader={
      formatRelative(
        issueOrComment.get("updatedAt"),
        new Date()
      )
    }
    subheaderTypographyProps={{
      variant: "subtitle2",
      ...subheaderTypographyProps,
    }}
    {...props}
  />
);

IssueHeader.propTypes = {
  issueOrComment: ImmutablePropTypes.map.isRequired,
  titleTypographyProps: PropTypes.object,
  subheaderTypographyProps: PropTypes.object,
};
