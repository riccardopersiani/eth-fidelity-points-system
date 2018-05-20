import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { Link, Router } from '../../routes';
import Layout from '../../components/Layout';
import ShopRequestTable from '../../components/ShopRequestTable';

class ApproveShopPage extends Component {

    render () {
        return(
            <Layout>
                <Header as='h1'>Approve Shop page</Header>
                <br/>
                <p>Hello admin, here you can approve the shop request to become official.</p>
                <ShopRequestTable/>
            </Layout>
        );
    }
}

export default ApproveShopPage;