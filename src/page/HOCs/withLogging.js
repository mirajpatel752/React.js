// withLogging.js
import React, { Component } from "react";

const withLogging = (WrappedComponent) => {
  class WithLogging extends Component {
    componentDidMount() {
      console.log(`Component ${WrappedComponent.name} is mounted.`);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return WithLogging;
};

export default withLogging;
