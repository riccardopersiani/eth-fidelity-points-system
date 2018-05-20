import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";
import HeaderTop from "../../components/Header";
import Footer from "../../components/Footer";
import AdminApprovePaymentForm from "../../components/AdminApprovePaymentForm";
import { Link, Router } from "../../routes";

class ApprovePaymentPage extends Component {
    render() {
        return (
        <div>
            <HeaderTop />
            <Container text style={{ marginTop: "7em" }}>
            <Header as="h1">Approve Payment page</Header>
            <br />
            <p>
                Hello admin, here you can approve the shop request to be payed for the
                produc delivers.
            </p>
            <br />
                {this.props.children}
            </Container>
            <div>
                <AdminApprovePaymentForm />
            </div>
            <Footer />
        </div>
        );
    }
}

export default ApprovePaymentPage;
