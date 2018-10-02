import React, {Component} from 'react';
import { Button, Header, Image, Modal, Icon } from 'semantic-ui-react';
import Qr from './QrReader';

class EPCModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      epc: '',
      address: '',
      errorMessage: '',
      open: 'false'
    }
    this.getEPC = this.props.getEPC.bind(this);
  }
  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });



  readQr(_epc) {
    this.setState({ epc: _epc })
  }
  onSubmitEPC = async event => {
    event.preventDefault();
    try {
      this.getEPC(this.state.epc)
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  }



  render() {
    const { open } = this.state
    return (
      <div>
        <Modal trigger={<Button>QR EPC</Button>}>
          <Modal.Header>QR EPC ID</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='medium' />
            <Modal.Description>
              <Header>Products EPC</Header>
              <p>your EPC</p>
            </Modal.Description>
          </Modal.Content>
          <Qr readQr={this.readQr.bind(this)} />
          <Modal.Actions>
          <Button  onClick={this.onSubmitEPC} floated="right" primary content='Send' />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}



export default EPCModal;
