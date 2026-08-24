import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('DGroup runtime recovery', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <section className="discovery-error-boundary"><span className="section-kicker">DGroup / recovery</span><h2>The platform is recalibrating.</h2><p>We protected the session. Refresh the page to restore the operating view.</p><button type="button" className="primary-button" onClick={() => window.location.reload()}>Reload platform</button></section>;
  }
}
