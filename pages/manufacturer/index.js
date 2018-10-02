import React, { Component } from 'react';
import manager from '../../ethereum/manager';
import Layout from '../../components/Layout';
import EPCModal from '../../components/EPCModal';
import AddressModal from '../../components/AddressModal';
import Qr from '../../components/QrReader';
import { Card, Button, Form, Input  } from 'semantic-ui-react';
import { Link } from '../../routes';
import web3 from '../../ethereum/web3';



class ProductIndex extends Component {
  state = {
    epc: '',
    errorMessage: '',
    address: ''
  }
  // Initialization ( call manufacturer from Contract)
  static async getInitialProps() {

      const accounts = await web3.eth.getAccounts();
      const _ownedProducts = await manager.methods.getOwndProduct(accounts[0]).call();
      const _recieveProducts = await manager.methods.getRecieveProduct(accounts[0]).call();

      let ownedProducts = [];
      let recieveProducts = [];

      // 0を取り除く
      for (var i = 0; i < _ownedProducts.length; i++) {
        if (_ownedProducts[i] != 0) {
          ownedProducts[i] = _ownedProducts[i];
        }
        if (_recieveProducts[i] != 0) {
          recieveProducts[i] = _recieveProducts[i];
        }

      }
      return { ownedProducts, recieveProducts };
    }

    getEPC(epc) {this.setState({ epc });}
    getAddress(address) {this.setState({ address });}
    checkState = event => {
      event.preventDefault();
      try {
        console.log(this.state.epc);
        console.log(this.state.address);
        console.log('あああああ');
      } catch(err)  {
        this.setState({ errorMessage: err.message })
      }

    }




  renderProducts() {

    const items = this.props.ownedProducts.map(epc => {
      return {
        header : epc,
        description: <Link route={`/manufacturer/products/${epc}`}><a>epc</a></Link>,
        fluid: true
      }
    });
    return <Card.Group items={items} />;
  }
  renderRecieveProducts() {
    const items = this.props.recieveProducts.map(epc => {
      return {
        header: epc,
        description: <Link route={`/manufacturer/products/${epc}`}><a>epc</a></Link>,
        fluid: true
      }
    });
    return (

      <Card.Group items={items}>
      </Card.Group>
    );
  }

  onSubmitSend = async event => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      await manager.methods.shipProduct(this.state.address, this.state.epc).send({ from: accounts[0] });

    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  }
  onSubmitRecieve = async event => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      await manager.methods.receiveProduct(this.state.epc).send({ from: accounts[0] });
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }
  }

  readQr(_epc) {
    this.setState({ epc: _epc })
    console.log(_epc);
  }


  render() {
    return (
      <Layout>
        <div>
          <h3>Owned Products</h3>
          <Link route="/manufacturer/products/new">
            <a>
              <Button floated="right" primary>New</Button>
            </a>
          </Link>
          {this.renderProducts()}
          <h3>Need Recieve</h3>
          {this.renderRecieveProducts()}
          <EPCModal getEPC={this.getEPC.bind(this)}/>
          <AddressModal getAddress={this.getAddress.bind(this)}/>
          <Button onClick={this.checkState} content='check'/>
          <Button onClick={this.onSubmitSend} positive floated="right" primary>Send</Button>
          <Button onClick={this.onSubmitRecieve} negative floated="right" primary>Recieve</Button>
        </div>
      </Layout>
    );
  }
}

export default ProductIndex;
