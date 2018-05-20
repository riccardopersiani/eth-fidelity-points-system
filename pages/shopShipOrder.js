import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";
import HeaderTop from "../components/Header";
import Footer from "../components/Footer";
import ShopShipOrderForm from "../components/shop/ShopShipOrderForm";
import { Link, Router } from "../routes";

class ShopShipOrderPage extends Component {
    render() {
        return (
        <div>
            <HeaderTop />
            <Container text style={{ marginTop: "7em" }}>
            <Header as="h1">Shipping Order page</Header>
            <br />
            <p>
                Hello shop, here you can mark as shipped the product request by a user  with an order.
            </p>
            <br />
                {this.props.children}
            </Container>
            <div>
                <ShopShipOrderForm />
            </div>
            <Footer />
        </div>
        );
    }
}

export default ShopShipOrderPage;
