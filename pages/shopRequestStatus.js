import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";
import Layout from "../components/Layout";
import ShopRequestStatusTable from "../components/ShopRequestStatusTable";
import { Link, Router } from "../routes";

class ShopRequestStatusPage extends Component {
    render() {
        return (
            <Layout>
                <Header as='h1'>Request Status page</Header>
                <br/>
                <p>Hello shop, here you can check your pending, approved and denied requests.</p>
                <ShopRequestStatusTable />
            </Layout>
        );
    }
}

export default ShopRequestStatusPage;