import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import RecordIcon from "@material-ui/icons/RecordVoiceOver";
import StopIcon from "@material-ui/icons/Stop";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import { useDispatch } from "redux-react-hook";
import { useMappedState } from "redux-react-hook";

import { BookDisplay } from "+app/components/BookDisplay";
import { fetchSample } from "+app/actions";

// eslint-disable-next-line no-undef
const req = require.context("../../samples", false, /\.ogg$/);
const sampleNames = req.keys();

const useStyles = makeStyles({
  recordButtonRecording: {
    color: "red",
  },
});

const RECORDING_MIME_TYPE = "audio/ogg; codecs=opus";

/**
 * Component representing the Recording Page
 *
 * @return {JSX.Element}
 */
export const RecordingPage = () => {
  const [recorder, setRecorder] = React.useState(null);

  const [isRecording, setIsRecording] = React.useState(false);

  const [chunks, setChunks] = React.useState([]);

  const [mimeType, setMimeType] = React.useState(RECORDING_MIME_TYPE);

  const [selectedSample, setSelectedSample] = React.useState(null);

  const classes = useStyles();

  const handleRecordButtonClick = React.useCallback(
    async () => {
      let recorderInstance = recorder;
      if (!recorderInstance) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
            }
          );

          recorderInstance = new MediaRecorder(stream);

          recorderInstance.addEventListener(
            "dataavailable",
            (event) => setChunks(
              (prevChunks) => {
                return [
                  ...prevChunks,
                  event.data,
                ];
              }
            )
          );

          recorderInstance.addEventListener(
            "stop",
            () => setIsRecording(false)
          );

          recorderInstance.addEventListener(
            "start",
            () => setIsRecording(true)
          );

          setRecorder(recorderInstance);
        }
      }

      if (recorderInstance.state === "recording") {
        recorderInstance.stop();
      } else {
        recorderInstance.start();
      }
    },
    [recorder]
  );

  let blobURL;

  if (chunks.length > 0) {
    const blob = new Blob(
      chunks,
      {
        type: mimeType,
      }
    );

    blobURL = URL.createObjectURL(blob);
  }

  const handleDownloadButtonClick = React.useCallback(
    () => {
      const link = document.createElement("a");
      link.href = blobURL;
      link.target = "_blank";
      link.download = "recording.ogg";

      link.click();
    },
    [blobURL]
  );

  const mapStateToProps = React.useCallback(
    (state) => ({
      samples: state.recordings.get("samples"),
    }),
    []
  );

  const { samples } = useMappedState(mapStateToProps);

  const dispatch = useDispatch();

  const handleSampleSelectChange = React.useCallback(
    async (event) => {
      if (!event.target.value) {
        setSelectedSample(null);
        setMimeType(RECORDING_MIME_TYPE);
        setChunks([]);
      } else {
        setSelectedSample(event.target.value);

        if (!samples.has(event.target.value)) {
          const { sample } = await dispatch(
            fetchSample({
              sampleName: event.target.value,
            })
          );

          setMimeType(sample.contentType);
          setChunks([sample.buffer]);
        }
      }
    },
    [dispatch, samples]
  );

  return (
    <Grid container
      direction="column"
    >
      <Grid item>
        <header>
          <Typography
            variant="h1"
          >
            Record a passage
          </Typography>
        </header>
      </Grid>
      <Grid item>
        <BookDisplay />
      </Grid>
      <Grid item container>
        <Grid item>
          <IconButton
            className={
              isRecording ?
                classes.recordButtonRecording :
                undefined
            }
            onClick={handleRecordButtonClick}
          >
            {
              isRecording ? (
                <StopIcon />
              ) : (
                <RecordIcon />
              )
            }
          </IconButton>
        </Grid>
        <Grid item>
          <Select
            value={selectedSample || ""}
            onChange={handleSampleSelectChange}
          >
            {
              sampleNames.map(
                (sampleName) => (
                  <MenuItem
                    key={sampleName}
                    value={sampleName}
                  >
                    {sampleName.replace(/^\.\//, "")}
                  </MenuItem>
                )
              )
            }
          </Select>
        </Grid>
        {
          blobURL && (
            <Grid item>
              <audio
                controls
                src={blobURL}
              />
              <IconButton
                onClick={handleDownloadButtonClick}
              >
                <DownloadIcon />
              </IconButton>
            </Grid>
          )
        }
      </Grid>
    </Grid>
  );
};
