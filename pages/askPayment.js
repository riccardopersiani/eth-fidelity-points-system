import React, { Component } from 'react';
import { Button, Form, Input, Message, Header } from 'semantic-ui-react';
import Layout from '../components/Layout';
import TransferTokensForm from '../components/TransferTokensForm';
import { Link, Router } from '../routes';
import ShopAskPaymentForm from '../components/ShopAskPaymentForm';


class AskPaymentPage extends Component {

    render() {
        return(
            <Layout>
                <Header as='h1'>Ask Payment</Header>
                <br/>
                <p>Ask to the ISP for a real payment for the products delivered to the customers.</p>
                <br/>
                <p>You can ask for a payment with ETH.</p>
                <p>You can ask for a payment in euro via PSD2.</p>
                <p><b>Remeber!</b> Select between the two options.</p>
                <br />
                <ShopAskPaymentForm />
            </Layout>

        );
    }
}

export default AskPaymentPage;