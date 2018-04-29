import React, { Component } from 'react'
import { Header, Menu, Grid, Segment, Button, Icon, Image, Label, Progress, Modal} from 'semantic-ui-react'

import FeedEvents from './FeedEvents'
import {initialEvents} from './utils/fixtures'
import ReactPlayer from 'react-player'

import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.fundsDeducted = 1;
    this.state = {
      active: 'home',
      storageValue: 30,
      countdownInterval: -1, // id of interval
      aiBetting: false,
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
    })
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
    // TODO: call addFunds from contract
    this.setState({
      storageValue: this.state.storageValue >= 100 ? 0 : this.state.storageValue + 20,
    })
  };

  onPlay = () => {
    console.log('playing');
    this.startDeductingFunds();
    this.setState({isPlaying: true});

    setTimeout(() => {
    // after timeout 20s
      this.onPause();
      // TODO: pause deducting funds

      this.setState({
        aiBetting: true
      })
      // popup: AI places bet popup

      // prompt user to place bet

    }, 1000)

  };

  startDeductingFunds() {
    const intervalId = setInterval(() => {
      this.setState({
        storageValue: this.state.storageValue - this.fundsDeducted,
      })
    }, 3000);

    this.setState({
      countdownInterval: intervalId
    });
  }

  onPause = () => {
    console.log('stop')
    clearInterval(this.state.countdownInterval);
    this.setState({
      isPlaying: false
    })
  };

  onBet = (amount) => {
    // TODO: send bet to contract
    // continue playing video
    // TODO: continue deducting funds
  };


  onTip = (e) => {
    // TODO: deduct funds

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
              <Header as='h1'>EG vs EHOME</Header>
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
              <Header as='h2'>Stream Funds &nbsp;
                { this.state.isPlaying &&
                  <span className="countdown-funds">-{this.fundsDeducted}</span>
                }
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
            <Segment>
              <ReactPlayer url='https://www.youtube.com/watch?v=sOz9a6rFNQA'
                           playing={this.state.isPlaying}
                           onPlay={this.onPlay}
                           onPause={this.onPause}
              />
            </Segment>
          </Grid.Column>

          {/* EVENT STREAM */}
          <Grid.Column width={4}>
            <FeedEvents data={initialEvents} />
          </Grid.Column>
        </Grid.Row>

    </Grid>

    {/* BET BOT */}
    <Modal
      className='bet-bot-container'
      open={this.state.aiBetting}>
      <Modal.Header>Bot has increased the prize pool!</Modal.Header>
      <Modal.Content image>
        <Image wrapped size='small' src='/bet-bot.png' />
        <Modal.Description>
          <Header>Do you want to place a bet?</Header>
          <small>Limit: $40 = 0.0004 ETH</small>
          <Segment circular style={{height: 100, width: 100}}>
            <Header as='h2'>
              30%
              <Header.Subheader>
                5 ETH
              </Header.Subheader>
            </Header>
          </Segment>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button negative>
          No
        </Button>
        <Button positive icon='checkmark' labelPosition='right' content='Yes' />
      </Modal.Actions>

    </Modal>

    </div>);
  }
}

export default App
