import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Form, Button, Input } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import manager from '../../../ethereum/manager';
import Router from '../../../routes';
import Qr from '../../../components/QrReader';



class ProductsNew extends Component {
  state = {
    errorMessage: '',
    owner: '',
    recipient: '',
    pStatus: '',
    creationTime: '',
    nTransferred: '',
    oldEPC: '',
    epc: '',
    qRresult: ''
  }

  onSubmit = async event => {
    event.preventDefault();
    this.setState({ errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await manager.methods.enrollProduct(this.state.epc).send({ from: accounts[0] });
      Router.pushRoute('/manufacturer');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

  }

  readQr(_epc) {
    this.setState({ epc: _epc });
  }


  render() {
    return (
      <Layout>
      <Qr readQr={this.readQr.bind(this)} />
        <Form onSubmit={this.onSubmit}>
        <Form.Field>
          <label>EPC</label>
          <Input value={this.state.epc} onChange={event => this.setState({epc: event.target.value})} placeholder='ex. 12345...' />
        </Form.Field>
          <Button primary>Submit</Button>
        </Form>
      </Layout>
    );
  }


}
export default ProductsNew;
