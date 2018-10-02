import React, {Component} from 'react';
import { Button, Header, Image, Modal, Icon } from 'semantic-ui-react';
import Qr from './QrReader';

class AddressModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      epc: '',
      address: '',
      errorMessage: '',
      open: 'false'
    }
    this.getAddress = this.props.getAddress.bind(this);
  }
  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });



  readQr(address) {
    this.setState({ address })
  }
  onSubmitAddress = async event => {
    event.preventDefault();
    try {
      this.getAddress(this.state.address)
      this.close();
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  }



  render() {
    const { open } = this.state
    return (
      <div>
        <Modal trigger={<Button>QR Address</Button>} onOpen={this.open} onClose={this.close} >
          <Modal.Header>QR ethereum address</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='medium' />
            <Modal.Description>
              <Header>Address</Header>
              <p>ethereum address.</p>
            </Modal.Description>
          </Modal.Content>
          <Qr readQr={this.readQr.bind(this)} />
          <Modal.Actions>
          <Button  onClick={this.onSubmitAddress} floated="right" primary content='DONE' />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}




export default AddressModal;
