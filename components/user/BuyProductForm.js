import React, { Component } from 'react';
import { Form, Input, Button, Message, Icon } from 'semantic-ui-react';
import fidelityPoints from '../../ethereum/fido';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import * as firebase from "firebase";


class BuyProductForm extends Component {
    state = {
        receiver: this.props.receiver,
        value: this.props.tokens,
        product: this.props.product,
        shopName: this.props.shopName,
        userId: '',
        errorMessage: '',
        loading: false
    }

    componentDidMount() {
        var self = this;
        console.log("componentDidMount.");
        firebase.auth().onAuthStateChanged(function(user) {
            // User is signed in.
            console.log("onAuthStateChanged.");
            if (user) {
                console.log("user.");
                // If data are not take, take it
                if (!self.state.userId) {
                    console.log("get userId.");
                    var userId = firebase.auth().currentUser.uid;
                    self.setState({ userId });
                    console.log("userId: ",userId);
                }
            // No user is signed in.
            } else {
                console.log("User not logged.");
            }
        });
    }

    onSubmit = async event => {
        event.preventDefault();
        console.log("onSubmit.");
        const { value, receiver, product, shopName, userId } = this.state;
        this.setState({ loading: true });

        try {
            const accounts = await web3.eth.getAccounts();
            await fidelityPoints.methods.createBuyingRequest(
                product,
                shopName,
                receiver,
                value,
                userId
            ).send({
                from: accounts[0],
                gas: '5000000'
            });
            console.log("product: ", product);
            console.log("shopName: ", shopName);
            console.log("receiver: ", receiver);
            console.log("userId: ", userId);
            console.log("value: ", value);

        } catch (err) {
            var trimmedString = err.message.substring(0, 90);
            this.setState({ errorMessage: trimmedString });
        }
        this.setState({ loading: false });
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Button loading={this.state.loading} floated='right' basic color='green'>Exchange for {this.state.value} tokens</Button>
                <Message error size='mini'>
                    <Message.Content>
                        <Message.Header><Icon size="big" name='warning sign'/>Oops!</Message.Header>
                        {this.state.errorMessage}
                    </Message.Content>
                </Message>
            </Form>
        );
    }
}

export default BuyProductForm;