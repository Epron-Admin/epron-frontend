import { Component } from "react";
import ErrorComponent from "./ErrorComponent";

class DashboardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ErrorComponent />;
    }

    return this.props.children;
  }
}

export default DashboardErrorBoundary;
