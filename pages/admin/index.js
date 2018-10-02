import React, { Component } from 'react';
import manager from '../../ethereum/manager';
import Layout from '../../components/Layout';
import { Card, Button } from 'semantic-ui-react';
import { Link } from '../../routes';



class ManagerIndex extends Component {

  // Initialization ( call manufacturer from Contract)
  static async getInitialProps() {

      const manufacturersIds = await manager.methods.getManufacturer().call();

      return { manufacturersIds };
    }


  renderManufacturers() {


    const items = this.props.manufacturersIds.map(manufacturerId => {
      let companySummary = manager.methods.getManufacuturerSummary(0).call();
      return {
        header : manufacturerId,
        description: <Link route={`/admin/manufacturers/${manufacturerId}`}><a>manufacturerId</a></Link>,
        fluid: true
      }
    });
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
        <h3>Open Campaigns</h3>
        <Link route="/admin/manufacturers/new">
          <a>
            <Button floated="right" primary>New</Button>
          </a>
        </Link>
        {this.renderManufacturers()}
        </div>
      </Layout>
    );
  }
}

export default ManagerIndex;
