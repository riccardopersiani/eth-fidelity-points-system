import React, { Component } from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";
import { Router } from "../routes";
import * as firebase from "firebase";

class LoginForm extends Component {
  state = {
    email: "",
    password: "",
    errorMessage: ""
  };

  onSubmit = async event => {
    event.preventDefault();

    var self = this;

    // SingIn on firebase with username and password inserted in the form
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        // Detect state change
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            window.location.replace("http://localhost:3000/index");
          } else {
            // TODO Remove?
            console.log("No user logged");
          }
        });
      })
      .catch(function(error) {
        self.setState({ errorMessage: error.message });
      });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field
          control={Input}
          label="Email"
          placeholder="Email"
          onChange={event => this.setState({ email: event.target.value })}
          value={this.state.email}
          required
        />
        <Form.Field
          control={Input}
          label="Password"
          placeholder="Password"
          type="password"
          onChange={event => this.setState({ password: event.target.value })}
          value={this.state.password}
          required
        />
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Form.Field control={Button}>Login</Form.Field>
      </Form>
    );
  }
}

export default LoginForm;
