import React, { Component } from 'react';

class Iframe extends Component {
  constructor(props) {
    super(props);
    this.iframe = React.createRef();
  }
  /**
   * Called after mounting the component. Triggers initial update of
   * the iframe
   */
  componentDidMount() {
    this._updateIframe();
  }

  /**
   * Called each time the props changes. Triggers an update of the iframe to
   * pass the new content
   */
  componentDidUpdate() {
    this._updateIframe();
  }

  /**
   * Updates the iframes content and inserts stylesheets.
   * TODO: Currently stylesheets are just added for proof of concept. Implement
   * and algorithm which updates the stylesheets properly.
   */
  _updateIframe() {
    const iframe = this.refs.iframe;
    const document = iframe.contentDocument;
    document.body.innerHTML = this.props.content;
  }

  /**
   * This component renders just and iframe
   */
  render() {
    return <iframe ref="iframe" title={this.props.title} {...this.props} />;
  }
}

export default Iframe;
