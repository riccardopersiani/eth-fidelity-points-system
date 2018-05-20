import React, { Component } from 'react';
import { Button, Image, Header, Card } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import fidelityPoints from '../../ethereum/fido';
import { Link } from '../../routes';
import BuyProduct from '../../components/BuyProduct';


class ProductIndex extends Component {

    state = {
        receiver: '0x56919f42CcA6B41a0c29E43Cd934b60038092fFF'
    }

    render() {
        return(
            <Layout>
                <Header as='h1'>Clothes Shop page</Header>
                <br/>
                <p>Here you can select your favorite shop.</p>
                <br/>
                <Card.Group>
                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                            <Card.Header>
                                Tee Shirt
                            </Card.Header>
                            <Card.Meta>
                                100% cotton
                            </Card.Meta>
                            <Card.Description>
                                10 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProduct receiver={this.state.receiver} tokens="10"/>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                            <Card.Header>
                                Red Tee Shirt
                            </Card.Header>
                            <Card.Meta>
                                100% silk
                            </Card.Meta>
                            <Card.Description>
                                30 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProduct receiver={this.state.receiver} tokens="30"/>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                            <Card.Header>
                                Black Tee Shirt
                            </Card.Header>
                            <Card.Meta>
                                100% silk
                            </Card.Meta>
                            <Card.Description>
                                30 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProduct receiver={this.state.receiver} tokens="30"/>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                            <Card.Header>
                                Black Shorts
                            </Card.Header>
                            <Card.Meta>
                                100% cotton
                            </Card.Meta>
                            <Card.Description>
                                20 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProduct receiver={this.state.receiver} tokens="20"/>
                        </Card.Content>
                    </Card>

                </Card.Group>
                <br/>
            </Layout>
        );
    }
}

export default ProductIndex;
