import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import manager from '../../../ethereum/manager';
import web3 from '../../../ethereum/web3';
import { Router } from '../../../routes';


class ManufacturerNew extends Component {
  state = {
    errorMessage: '',
    companyAddress: '',
    companyPrefix: '',
    companyName: ''
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);
      await manager.methods.enrollManufacturer(
        this.state.companyAddress,
        this.state.companyPrefix,
        this.state.companyName
      ).send({
        from: accounts[0]
      });
      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

  }

  render() {
    return (
      <Layout>
        <Form onSubmit={this.onSubmit}>
        <Form.Field>
          <label>companyAddress</label>
          <Input value={this.state.companyAddress} onChange={event => this.setState({companyAddress: event.target.value})} />
        </Form.Field>
        <Form.Field>
          <label>companyPrefix</label>
          <Input value={this.state.companyPrefix} onChange={event => this.setState({companyPrefix: event.target.value})} />
        </Form.Field>
          <Form.Field>
            <label>companyName</label>
            <Input value={this.state.companyName} onChange={event => this.setState({companyName: event.target.value})} />
          </Form.Field>
          <Button primary>Submit</Button>
        </Form>
      </Layout>
    );
  }
}

export default ManufacturerNew;
