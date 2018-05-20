import React, { Component } from 'react';
import { Button, Image, Header, Card } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import fidelityPoints from '../../ethereum/fido';
import { Link } from '../../routes';
import BuyProductForm from '../../components/BuyProductForm';

class ProductIndex extends Component {

    state = {
        receiver: '0x340595e0C76230D49fcf3a7c1dC317378BC929a3'
    }

    render() {
        return(
            <Layout>
                <Header as='h1'>Tech Shop page</Header>
                <br/>
                <p>Here you can select your favorite shop.</p>
                <br/>
                <Card.Group>
                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                            <Card.Header>
                                Smartpthone
                            </Card.Header>
                            <Card.Meta>
                                Last model
                            </Card.Meta>
                            <Card.Description>
                                1000 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProductForm shopName="Tech Shop" product="smartphone1" receiver={this.state.receiver} tokens="1000"/>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                            <Card.Header>
                                Smartpthone
                            </Card.Header>
                            <Card.Meta>
                                Version 1
                            </Card.Meta>
                            <Card.Description>
                                1000 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProductForm shopName="Tech Shop" product="smartphone1" receiver={this.state.receiver} tokens="1000"/>
                        </Card.Content>
                    </Card>

                </Card.Group>
                <br/>
            </Layout>
        );
    }
}

export default ProductIndex;
