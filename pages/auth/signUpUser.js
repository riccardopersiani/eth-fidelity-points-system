import React, { Component } from 'react';
import { } from "semantic-ui-react";
import Layout from "../../components/Layout";
import UserRegistrationForm from "../../components/UserRegistrationForm";

const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
]

class SignUpUserPage extends Component {
  state = {};

  render() {

    const { value } = this.state

    return(
      <Layout>
        <h1>Sign Up for User</h1>
        <br />
        <p>Welcome to the User Registration Page</p>
        <br />
        <UserRegistrationForm/>
      </Layout>
    );
  }
}

export default SignUpUserPage;