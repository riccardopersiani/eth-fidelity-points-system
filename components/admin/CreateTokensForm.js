import React, { Component } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import fidelityPoints from '../../ethereum/fido';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';


class CreateTokensForm extends Component {
    state = {
        value: '',
        errMsg: '',
        okMsg: '',
        tokens: '',
        loading: false,
    }

    onSubmit = async event => {
        event.preventDefault();
        this.setState({ loading: true, errMsg: false, okMsg: false });
        try {
            const accounts = await web3.eth.getAccounts();
            const tokens = this.state.value * 1000000000000000000;
            await fidelityPoints.methods.createTokens()
            .send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            this.setState({ loading: false, okMsg: true, tokens })
        } catch (err) {
            var trimmedString = err.message.substring(0, 101);
            this.setState({ loading: false, errMsg: trimmedString });
        }
        this.setState({ value: ''});
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errMsg} loading={this.state.loading} success={!!this.state.okMsg}>
                <Form.Field>
                    <label>Amount to change in tokens</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        label="ether"
                        labelPosition="right"
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errMsg} />
                <Message success header="Ok!" content={`Successfull creation of ${this.state.tokens} FIDO`} />
                <Button primary>Create</Button>
            </Form>
        );
    }
}

export default CreateTokensForm;