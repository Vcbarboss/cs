import React from 'react';


export default class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { type: props.screenType };
  }

  // sendErrorToFirebase = async (error, errorInfo) => {
  //   !__DEV__ && await analytics().logEvent('unhandledError', {
  //     error_label: error + errorInfo?.componentStack
  //   });
  // };
  //
  // componentDidCatch(error, errorInfo) {
  //   this.sendErrorToFirebase(error, errorInfo);
  // }

  render() { return this.props.children;}
}
