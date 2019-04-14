import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    smoothscroll.polyfill();
    if (this.props.location !== prevProps.location) {
      document.body.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)