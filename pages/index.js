import React, { Component } from 'react';
import manager from '../ethereum/manager';
import Layout from '../components/Layout';
import { Card, Button, Grid, Segment } from 'semantic-ui-react';
import { Link } from '../routes';



class ManagerIndex extends Component {

  // Initialization ( call manufacturer from Contract)
  static async getInitialProps() {

      const manufacturersIds = await manager.methods.getManufacturer().call();

      return { manufacturersIds };
    }



  render() {
    return (
      <Layout>
        <div>
        <h3>Home</h3>
        <h4>This is Block Chain system for Supply Chain</h4>
        <Grid columns={9} divided>
            <Grid.Column>
              <Segment>
                <Link route="/admin">
                  <a>
                    <Button primary>Admin</Button>
                  </a>
                </Link>
              </Segment>
              <Segment>
                <Link route="/manufacturer">
                  <a>
                    <Button primary>Manu.</Button>
                  </a>
                </Link>
              </Segment>
            </Grid.Column>
        </Grid>
      </div>
      </Layout>
    );
  }
}

export default ManagerIndex;
