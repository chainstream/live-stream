import React, { Component } from 'react'
import { Header, Menu, Grid, Segment, Button, Icon, Label, Progress  } from 'semantic-ui-react'

import FeedEvents from './FeedEvents'
import {initialEvents} from './utils/fixtures'

import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      active: 'home',
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    }).then(_ => console.log('the'))
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   simpleStorage.deployed().then((instance) => {
    //     simpleStorageInstance = instance
    //
    //     // Stores a given value, 5 by default.
    //     return simpleStorageInstance.set(5, {from: accounts[0]})
    //   }).then((result) => {
    //     // Get the value from the contract to prove it worked.
    //     return simpleStorageInstance.get.call(accounts[0])
    //   }).then((result) => {
    //     // Update state with the result.
    //     return this.setState({ storageValue: result.c[0] })
    //   })
    // })
  }

  handleItemClick = (e) => {
    console.log('click menu')
  };

  addFunds = (e) => {
    this.setState({
      // TODO: call addFunds from contract
      storageValue: this.state.storageValue >= 100 ? 0 : this.state.storageValue + 20,
    })
  };

  onPlay = (e) => {
    // start deducting funds

    // after timeout 20s
      // pause video & deducting funds

      // AI places bet popup
      // prompt user to place bet

      // continue playing video
      // start deducting funds
  };

  onTip = (e) => {
    // deduct funds
    // add tip event
  };

  onFinishGame = (e) => {
    // show win / lose popup
    // deduct if lose bet, add if won bet
  };

  render() {
    return (<div>
      <Menu style={{marginBottom: 30}}>
        <Menu.Item active={this.state.active === 'home'}
                   content='ChainStream' name='ChainStream' onClick={this.handleItemClick} />
        <Menu.Item active={this.state.active === 'messages'}
                   content='Messages' name='messages' onClick={this.handleItemClick} />

        <Menu.Menu position='right'>
        </Menu.Menu>
      </Menu>

      <Grid centered >

        {/* HEADER */}
        <Grid.Row>

          {/* TITLE */}
          <Grid.Column width={8}>
            <Grid.Row>
              <Header as='h1'>iGG vs EHOME</Header>
            </Grid.Row>
            <Grid.Row verticalAlign="middle">
              <Header as='h4'>Hosted By <a>Blizzard</a> &nbsp;&nbsp;&nbsp;</Header>
              <Button as='div' size='tiny' labelPosition='right'>
                <Button size='tiny' color='red'><Icon name='bitcoin' />Tip</Button>
                <Label as='a' basic color='red' pointing='left'>0.42</Label>
              </Button>
            </Grid.Row>
          </Grid.Column>

          {/* FUNDS */}
          <Grid.Column width={4}>
            <div className="stream-funds-container">
            <Header as='h2'>Stream Funds
              <Button floated='right' onClick={this.addFunds}>
                <Icon name="add" /><span>Top up</span>
              </Button>
            </Header>
            <Progress percent={this.state.storageValue} indicating />
            </div>
          </Grid.Column>
        </Grid.Row>

        {/* CONTENT */}
        <Grid.Row>

          {/* VIDEO */}
          <Grid.Column width={8}>
            <Segment>Video</Segment>
          </Grid.Column>

          {/* EVENT STREAM */}
          <Grid.Column width={4}>
            {/*<Segment>3</Segment>*/}
            <FeedEvents data={initialEvents} />
          </Grid.Column>
        </Grid.Row>

    </Grid>
    </div>
    );
  }
}

export default App
