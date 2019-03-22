import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import { App } from "+app/components/App";

describe("App component", () => {
  it("should render the app with the Home component at the root URL", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={["/"]}
      >
        <App>
        </App>
      </MemoryRouter>
    );

    expect(wrapper.find("Home")).toExist();
  });
});
