import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';

const ScrollToTop = (props) => {
  useEffect(() => {
    smoothscroll.polyfill();
    document.body.scrollTo(0, 0);
  }, [props.location]);

  return <> {props.children} </>;
}

export default withRouter(ScrollToTop)