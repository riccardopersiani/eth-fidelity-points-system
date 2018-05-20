import React, { Component } from 'react';
import { Button, Form, Input, Message, Header } from 'semantic-ui-react';
import Layout from '../components/Layout';
import CreateTokensForm from '../components/CreateTokensForm';
import AddNewShopForm from '../components/AddNewShopForm';
import { Link, Router } from '../routes';
import fidelityPoints from '../ethereum/fido';

// RISPONDERE CON UNA REDIRECT
class ConnectPage extends Component {
    state = {
    };

    render() {
        return(
            <Layout>
                <Header as='h1'>Connect page</Header>
                <br/>
                <p>Connect page.</p>
            </Layout>
        );
    }
}

export default ConnectPage;