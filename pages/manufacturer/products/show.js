import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import Qr from '../../../components/QrReader'
import { Card, Form, Button, Input } from 'semantic-ui-react';
import manager from '../../../ethereum/manager'
import web3 from '../../../ethereum/web3';


class ProductsShow extends Component {
  state = {
    epc: '',
    errorMessage: '',
    tOaddress: ''
  }

  static async getInitialProps(props) {
    // epcをroutesから受け取る
    const epc = props.query.epc;
    console.log(epc);

    const summary = await manager.methods.getProductSummary(epc).call();

    return {
      owner: summary[0],
      recipient: summary[1],
      manufacturer: summary[2],
      pStatus: summary[3],
      creationTime: summary[4],
      nTransferred: summary[5],
      oldEPC: summary[6],
      epc: epc
    };

  }

  renderCards() {
    console.log(this.state.epc);

    const {
      owner,
      recipient,
      manufacturer,
      pStatus,
      creationTime,
      nTransferred,
      oldEPC
    } = this.props;

    const items=[
      {
        header: owner,
        meta: owner,
        description: 'owner of product'
      },
      {
        header: recipient,
        meta: 'recipient',
        description: 'recipient'
      },
      {
        header: manufacturer,
        meta: 'manufacturer',
        description: 'manufacturer'
      },
      {
        header: pStatus,
        meta: 'pStatus',
        description: 'pStatus'
      },
      {
        header: creationTime,
        meta: 'creationTime',
        description: 'creationTime'
      }
    ]
    return <Card.Group items={items}/>;
  }

  readQr(_epc) {
    this.setState({ epc: _epc })
    console.log(_epc);
  }

  onSubmitSend = async event => {
    console.log('アイウエオ');
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      const epc = this.props.epc;

      await manager.methods.shipProduct(this.state.tOaddress, epc).send({ from: accounts[0] });

    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  }

  render() {
    return (
      <Layout>
        <div>
          {this.renderCards()}
          <Qr readQr={this.readQr.bind(this)} />
          <Form>
            <Form.Field>
              <label>Address</label>
              <Input value={this.state.tOaddress} onChange={event => this.setState({tOaddress: event.target.value})} placeholder='ex. 0x1234...' />
            </Form.Field>
            <Button  onClick={this.onSubmitSend} floated="right" primary>Send</Button>
            <Button  onClick={this.onSubmitRecieve} floated="right" primary>Recieve</Button>
          </Form>
        </div>
      </Layout>
    )
  }


}
export default ProductsShow;
