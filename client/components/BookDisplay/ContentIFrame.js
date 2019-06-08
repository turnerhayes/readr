import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const serializer = new XMLSerializer();

const useStyles = makeStyles({
  root: {
    width: "100%",
    border: "none",
  },
});

export const ContentIFrame = ({ content, goToFile, getFiles }) => {
  const ref = React.useRef(null);

  const classes = useStyles();

  const anchorClickHandler = React.useCallback(
    (event) => {
      event.preventDefault();

      const href = event.target.getAttribute("href");

      goToFile(href);
    },
    [goToFile]
  );

  const effectCallback = React.useCallback(
    () => {
      if (ref.current) {
        const contentString = serializer.serializeToString(content);
        if (ref.current.srcdoc !== contentString) {
          ref.current.srcdoc = contentString;
          const onLoad = () => {
            ref.current.contentDocument.addEventListener(
              "click",
              (event) => {
                if (event.target.nodeName.toLowerCase() === "a") {
                  return anchorClickHandler(event);
                }
              },
              false
            );

            Array.from(ref.current.contentDocument.getElementsByTagName("link"))
              .forEach(
                async (linkNode) => {
                  const type = linkNode.getAttribute("type") || "text/css";

                  const path = linkNode.getAttribute("href");

                  if (!/^\w+:\/\//.test(path)) {
                    const [contents] = await getFiles([path]);

                    linkNode.setAttribute("href", `data:${type},${contents}`);
                  }
                }
              );

            ref.current.removeEventListener(
              "load",
              onLoad
            );
          };

          ref.current.addEventListener(
            "load",
            onLoad
          );
        }
      }
    },
    [anchorClickHandler, content]
  );

  React.useEffect(effectCallback);

  return (
    <iframe
      className={classes.root}
      sandbox="allow-scripts allow-same-origin"
      ref={ref}
    />
  );
};

ContentIFrame.propTypes = {
  content: PropTypes.instanceOf(Document).isRequired,
  goToFile: PropTypes.func.isRequired,
  getFiles: PropTypes.func.isRequired,
};
