import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";
import HeaderTop from "./Header";
import Footer from "./Footer";
import firebase from "firebase";

class Layout extends Component {
  render() {
    return (
      <div>
        <HeaderTop />
        <Container text style={{ marginTop: "7em" }}>
          {this.props.children}
        </Container>
        <Footer />
      </div>
    );
  }
}
export default Layout;
