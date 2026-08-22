import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <section className="discovery-error-boundary"><span className="section-kicker">Private desk / recovery</span><h2>The curation loop is recalibrating.</h2><p>We protected your private session. Refresh the feed to continue exploring current allocations.</p><button type="button" className="primary-button" onClick={() => window.location.reload()}>Reload private feed</button></section>;
  }
}
