import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
import { Form, Button, Input, Icon, Modal } from 'semantic-ui-react';


class Qr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 300,
      result: 'No result'

    }
    this.handleScan = this.handleScan.bind(this);
    this.readQr = this.props.readQr.bind(this);
  }
  handleScan(data) {
    if (data) {
      this.setState({result: data})
      this.readQr(data)
    }
  }
  handleError(err) {
    console.error(err);
  }

  render(){
    return(
      <div>
      <QrReader
        delay={this.state.delay}
        onError={this.handleError}
        onScan={this.handleScan}
        style={ { width: '10%' } }
      />
      <p>{this.state.result}</p>
      </div>
    )
  }
}
export default Qr;
