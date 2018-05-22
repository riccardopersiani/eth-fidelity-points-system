import React, { Component } from "react";
import { Form, Input, Button, Message, Select } from "semantic-ui-react";
import { Router } from "../routes";
import * as firebase from "firebase";
import { paymentOptions } from "../others/common";
import fidelityPoints from "../ethereum/fido";
import web3 from "../ethereum/web3";
import guid from "../components/utils/guidGenerator"

class ShopAskPaymentForm extends Component {
  state = {
    method: '',
    value: '',
    note: '',
    owner: '',
    loading: false,
    errorMessage: '',
    okMessage: ''
  };

  handleChangePaymentMethod = (e, { value }) => this.setState({ method: value });

  onSubmit = async event => {
    event.preventDefault();
    var self = this;
    try {
      console.log("method: ", self.state.method);
      if(self.state.method == 'eth'){
        console.log("okMessafe prima 1: ", self.state.okMessage);
        // Get from the blockchain the summary of information.
        const summary = await fidelityPoints.methods.getSummary().call();
        // Get the shop id which is asking for payment.
        var shop = firebase.auth().currentUser;
        // get the shop info from db to get the eth account
        console.log("guid(): ", guid());
        // Save the owner address in the state variable.
        this.setState({ owner: summary[3], loading: true, okMessage: '', errorMessage: '' });
        // Perform the tokens transfer to the owner.
        const accounts = await web3.eth.getAccounts();
        // valore, nota, metodo
        await fidelityPoints.methods.createEthereumPaymentRequest(self.state.value, self.state.note, shop.uid)
        .send({
          from: accounts[0],
          gas: '1000000'
        });
        console.log("okMessafe prima 2: ", self.state.okMessage);
        this.setState({ okMessage: self.state.method });
        console.log("okMessafe dopo: ", self.state.okMessage);
      } else {
          console.log("okMessafe prima 1: ", self.state.okMessage);
          // Get from the blockchain the summary of information.
          const summary = await fidelityPoints.methods.getSummary().call();
          // Get the shop id which is asking for payment.
          var shop = firebase.auth().currentUser;
          // get the shop info from db to get the eth account
          console.log("guid(): ", guid());
          // Save the owner address in the state variable.
          this.setState({ owner: summary[3], loading: true, okMessage: '', errorMessage: '' });
          // Perform the tokens transfer to the owner.
          const accounts = await web3.eth.getAccounts();
          // valore, nota, metodo
          // TODO 
          // INVIARE ANCHE I TOKEN TRAMITE ETHEREUM
          // After the trasfer in the blockchain, register the payment in the db with paymentid = timestamp.
          firebase.app().database().ref("pending_payments_psd2/" +  guid() )
                    .set({
                      shop: shop.uid, // in the blockchain is memorized the eth address, here avoid because we need a query to the database
                      tokenAmount: self.state.value,
                      method: self.state.method,
                      note: self.state.note,
                      timestamp: Math.floor(Date.now()),
                      completed: false
                    });
      }
    } catch (err) {
      // Print the first part of error message to the user.
      var trimmedString = err.message.substring(0, 90);
      this.setState({ errorMessage: trimmedString });
    }
    // Operation completed, reset the input values.
    this.setState({ loading: false, value: '', note: '' });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} loading={this.state.loading} success={!!this.state.okMessage}>
        <Form.Field required>
          <label>Token amount to send</label>
          <Input
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            label="token"
            labelPosition="right"
            required
          />
        </Form.Field>

        <Form.Field
          control={Select}
          label="Payment Method"
          options={paymentOptions}
          placeholder="Payment Method"
          onChange={this.handleChangePaymentMethod}
          value={this.state.method}
          required
        />

        Note
        <Form.TextArea
          onChange={event => this.setState({ note: event.target.value })}
          value={this.state.note}
          placeholder="Give us additional information..."
        />
        <Message success header="Ok!" content={"Request registered, points transfer completed and stored on the blockchain"} />
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Form.Field control={Button}>Ask</Form.Field>
      </Form>
    );
  }
}

export default ShopAskPaymentForm;
