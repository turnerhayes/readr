import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ReactMarkdown from "react-markdown";

import { IssueHeader } from "+app/components/IssueDetail/IssueHeader";

export const IssueComment = ({ className, comment }) => {
  return (
    <Card
      className={className}
    >
      <IssueHeader
        issueOrComment={comment}
      />
      <CardContent>
        <ReactMarkdown
          source={comment.get("body")}
        />
      </CardContent>
    </Card>
  );
};

IssueComment.propTypes = {
  className: PropTypes.string,
  comment: ImmutablePropTypes.map.isRequired,
};
