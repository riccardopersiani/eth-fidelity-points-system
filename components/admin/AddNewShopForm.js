import React, { Component } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import fidelityPoints from '../../ethereum/fido';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';


class AddNewShopForm extends Component {
    state = {
        value: '',
        receiver: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true });

        try {
            const accounts = await web3.eth.getAccounts();
            await fidelityPoints.methods
            .addShop(this.state.value) //account3
            .send({
                from: accounts[0],
                gas: '1000000'
            });
            console.log("shop added: " + this.state.value);
        } catch (err) {
            var trimmedString = err.message.substring(0, 90);
            this.setState({ errorMessage: trimmedString });
        }
        this.setState({ loading: false, value: ''});
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Shop address</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        label="address"
                        labelPosition="right"
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button primary loading={this.state.loading}>
                    Add
                </Button>
            </Form>
        );
    }
}

export default AddNewShopForm;