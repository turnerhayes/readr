import React from "react";
import { Card, CardHeader, CardContent, Grid, Button } from "@material-ui/core";

/**
 * Account dropdown content component
 */
export class AccountDropDown extends React.PureComponent {
  /**
   * Handles a click of the Logout button
   */
  handleLogoutClick() {
    document.location.assign("/auth/logout");
  }

  /**
   * Renders the component
   *
   * @return {JSX.Element}
   */
  render() {
    return (
      <Card>
        <CardHeader>
          Account
        </CardHeader>
        <CardContent>
          <Grid container>
            <Button
              onClick={this.handleLogoutClick}
            >
              Log out
            </Button>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

