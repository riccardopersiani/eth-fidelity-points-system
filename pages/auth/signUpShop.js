import React, { Component } from 'react';
import { } from "semantic-ui-react";
import Layout from "../../components/Layout";
import ShopRegistrationForm from "../../components/ShopRegistrationForm";

const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
]

class SignUpShopPage extends Component {
  state = {};

  render() {

    const { value } = this.state

    return(
      <Layout>
        <h1>Request for a new Shop</h1>
        <br />
        <p>Welcome to the Shop Registration Page.</p>
        <p>Here you can ask the operator for your shop to be added to the list.</p>
        <p>After completing the form your must wait for the request to be examinated.</p>
        <br />
        <ShopRegistrationForm/>
      </Layout>
    );
  }
}

export default SignUpShopPage;