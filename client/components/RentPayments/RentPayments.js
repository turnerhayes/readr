import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";

import {
  AddRentPaymentFormContainer,
} from "+app/components/AddRentPaymentForm";
import {
  RentPaymentGridContainer,
} from "+app/components/RentPaymentGrid";


/**
 * Rent payments page component
 */
export class RentPayments extends React.PureComponent {
  /**
   * Renders the component.
   *
   * @return {React.ReactElement} the component
   */
  render() {
    return (
      <Grid container
        direction="column"
        alignItems="center"
        spacing={8}
      >
        <Grid item>
          <Typography
            variant="h2"
            align="center"
          >
            Rent Payments
          </Typography>
        </Grid>
        <Grid item>
          <RentPaymentGridContainer
          />
        </Grid>
        <Grid item>
          <AddRentPaymentFormContainer
          />
        </Grid>
      </Grid>
    );
  }
}
