import manager from '../../../ethereum/manager';
import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Card, Grid } from 'semantic-ui-react';

class manufacturersShow extends Component {
  // props has manufacturerId property from routes.js
  static async getInitialProps(props) {
    const  manufacturerId = props.query.manufacturerId;

    const summary = await manager.methods.getManufacuturerSummary(manufacturerId).call();
    console.log(summary);
    return {
      id: summary[0],
      companyPrefix: summary[1],
      companyName: summary[2],
      companyAddress: summary[3]
    };
  }

  renderCards() {

    const {
      id,
      companyPrefix,
      companyName,
      companyAddress
    } = this.props;

    const items = [
      {
        header: id,
        meta: 'companyID',
        description: 'This is compnay ID on POMS'
      },
      {
        header: companyPrefix,
        meta: 'Prefix',
        description: 'This is companyPrefix on Tag'
      },
      {
        header: companyName,
        meta: 'companyName',
        description: 'This is companyName'
      },
      {
        header: companyAddress,
        meta: 'companyAddress',
        description: 'This is companyAddress',
        style: { overflowWrap: 'break-word' }
      }
    ]
    return<Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>compnay</h3>
        <Grid>
          <Grid.Column>
            {this.renderCards()}
          </Grid.Column>
        </Grid>

      </Layout>
    )
  }
}

export default manufacturersShow;
