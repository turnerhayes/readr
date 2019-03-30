import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";

import {
  AddRentPaymentFormContainer,
} from "+app/components/AddRentPaymentForm";
import {
  RentPaymentGridContainer,
} from "+app/components/RentPaymentGrid";
import {
  AddRentDatesFormContainer,
} from "+app/components/AddRentDatesForm";


const FORM_TABS = [
  {
    value: "AddRentPayment",
    label: "Add Rent Payment",
  },
  {
    value: "AddRentDates",
    label: "Add Rent Dates",
  },
];

/**
 * Rent payments page component
 */
export class RentPayments extends React.PureComponent {
  state = {
    selectedFormTabIndex: 0,
  }

  /**
   * Handles changing form tabs
   *
   * @param {object} event
   * @param {string} value the value that was selected
   */
  handleFormTabChange = (event, value) => {
    this.setState({
      selectedFormTabIndex: value,
    });
  }

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
          <Tabs
            value={this.state.selectedFormTabIndex}
            onChange={this.handleFormTabChange}
          >
            {
              FORM_TABS.map(
                ({ value, label }, index) => (
                  <Tab
                    key={value}
                    value={index}
                    label={label}
                  />
                )
              )
            }
          </Tabs>
          {
            this.state.selectedFormTabIndex === 0 ?
              (
                <AddRentPaymentFormContainer
                />
              ) :
              (
                <AddRentDatesFormContainer
                />
              )
          }
        </Grid>
      </Grid>
    );
  }
}
