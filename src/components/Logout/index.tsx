import * as React from 'react';

class Logout extends React.Component {
  componentDidMount() {
    window.location.href = '/';
  }

  render() {
    return null;
  }
}

export default Logout;
