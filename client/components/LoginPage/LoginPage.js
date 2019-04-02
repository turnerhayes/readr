import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";


const handleFacebookLinkClick = () => {
  window.location.assign("/auth/facebook");
};

export const LoginPage = () => {
  return (
    <Grid container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <Typography
          variant="h2"
        >Login</Typography>
      </Grid>
      <Grid item container
        direction="row"
        wrap="wrap"
      >
        <Button
          onClick={handleFacebookLinkClick}
        >
          Login with Facebook
        </Button>
      </Grid>
    </Grid>
  );
};
