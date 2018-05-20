import React, { Component } from 'react';
import { Message, Form, Button, Input } from 'semantic-ui-react';
import fidelityPoints from '../ethereum/fido';
import web3 from '../ethereum/web3';


class TransferTokenForm extends Component {
    state = {
        value: '',
        receiver: '',
        errorMessage: '',
        okMessage: '',
        loading: false
    };

    onSubmit = async event => {
        event.preventDefault();
        console.log("receiver: " + receiver);

        const { value, receiver } = this.state;

        this.setState({ loading: true });

        try{
            const accounts = await web3.eth.getAccounts();
            console.log("receiver: " + receiver);
            console.log("value: " + value);
            await fidelityPoints.methods.transfer(
                receiver,
                value
            ).send({
                from: accounts[0],
                gas: '1000000'
            });
        } catch (err) {
            var trimmedString = err.message.substring(0, 90);
            this.setState({ errorMessage: trimmedString });
        }
        this.setState({ loading: false, value: '', okMessage: true });
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} loading={this.state.loading} success={!!this.state.okMessage}>
                <Form.Field>
                    <label>Token amount to send</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        label="token"
                        labelPosition="right"
                    />
                </Form.Field>
                <Form.Field>
                    <label>Receiver address</label>
                    <Input
                        value={this.state.receiver}
                        onChange={event => this.setState({ receiver: event.target.value })}
                        label="address"
                        labelPosition="right"
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Message success header="Ok!" content="Points transfer completed and stored on the blockchain" />
                <Button primary>
                    Transfer
                </Button>
            </Form>
        );
    }
}

export default TransferTokenForm;
