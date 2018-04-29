import React, { Component } from 'react'
import { Header, Menu, Grid, Segment, Button, Icon, Image, Label, Progress, Modal, Form } from 'semantic-ui-react'

import FeedEvents from './FeedEvents'
import {initialEvents} from './utils/fixtures'
import ReactPlayer from 'react-player'

import ChainstreamContract from '../build/contracts/Chainstream.json'
import getWeb3 from './utils/getWeb3'
import TruffleContract from 'truffle-contract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const hardcodedAccounts = ['c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
  ,'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f'
  , '0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1'
  , 'c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c'
  , '388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418'
  , '659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63'
  , '82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8'
  , 'aa3680d5d48a8283413f7a108367c7299ca73f553735860a87b08f39395618b7'
  , '0f62d96d6675f32685bbdb8ac13cda7c23436f63efbb9d07700d8669ff12b7c4'
  , '8d5366123cb560bb606379f90a0bfd4769eecc0557f1b362dcae9012b548b1e5']

class App extends Component {
  constructor(props) {
    super(props)

    this.fundsDeducted = 3;
    this.state = {
      active: 'home',
      storageValue: 90,
      countdownInterval: -1,  // id of interval
      aiBetting: false,
      betHomeTeam: null,      // team index null/0/1
      gameEnded: false,
      wonBet: false,
      betValue: 0,
      timeoutId: null,
      web3: null,
      contract: null,
      accounts: null,
    };
    this.onTip = this.onTip.bind(this)
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

    const chainstream = TruffleContract(ChainstreamContract)
    chainstream.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      chainstream.deployed().then((instance) => {
        this.setState({
          chainstreamInstance: instance,
          accounts: hardcodedAccounts,
        })
      })
    })
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
    if (!!this.state.timeoutId) {
      return
    }
    const timeoutId = setTimeout(() => {
    // after timeout 20s
      this.onPause();
      // TODO: pause deducting funds

      // popup: AI places bet popup
      // prompt user to place bet
      this.setState({ aiBetting: true });
    }, 20000);

    this.setState({
      isPlaying: true,
      timeoutId
    });
  };

  startDeductingFunds() {
    const intervalId = setInterval(() => {
      this.setState({
        storageValue: this.state.storageValue - this.fundsDeducted,
      })
    }, 1000);

    this.setState({
      countdownInterval: intervalId
    });
  }

  onPause = () => {
    clearInterval(this.state.countdownInterval);
    this.setState({
      isPlaying: false
    })
  };

  handleEditBetValue = (e) => {
    this.setState({betValue: e.target.value});
  };

  handleEditBetTeam = (isHomeTeam) => () => {
    this.setState({betHomeTeam: isHomeTeam});
  };

  handleSubmitBet = () => {
    // TODO: send bet to contract
    // continue playing video
    // TODO: continue deducting funds

    this.setState({isPlaying: true, aiBetting: false});
    setTimeout(() => {
      console.log('f')
      const wonBet = Math.random() > 0.5;
      this.setState({ isPlaying: false,  gameEnded: true, wonBet })
    }, 30000)
  };


  onTip = (e) => {
    // TODO: deduct funds

    // add tip event

    this.state.chainstreamInstance.streamPrice().then((resp) => {
      console.log(resp);
    })
    this.state.chainstreamInstance.sendTip(this.state.accounts[2],
      {value: 1})
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
                <Button onClick={this.onTip} size='tiny' color='red'><Icon name='bitcoin' />Tip</Button>
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
                           width='100%'
                           height="500px"
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
      open={this.state.aiBetting}
      onClose={() => this.setState({isPlaying: true})}>
      <Modal.Header>Bot has increased the prize pool!</Modal.Header>
      <Modal.Content image>
        <Image wrapped size='small' src='/bet-bot.png' />
        <Modal.Description>
          <Segment>Bot has placed a <b>0.4 ETH</b> bet on TEAM <b>EG</b> with <b>66.75%</b> confidence</Segment>
          <Header>Do you want to place a bet?</Header>
          <Segment.Group horizontal>
            <Segment color={this.state.betHomeTeam === null ? 'black' : this.state.betHomeTeam ? 'green' : 'black'}
                     onClick={this.handleEditBetTeam(true)}>
              <Header as='h2'>EG<Header.Subheader>2.13<span style={{color: 'green'}}> (+0.4) </span>ETH</Header.Subheader></Header>
            </Segment>
            <Segment color={this.state.betHomeTeam === null ? 'black' : !this.state.betHomeTeam ? 'green' : 'black'}
                     onClick={this.handleEditBetTeam(false)}>
              <Header as='h2'>EHOME<Header.Subheader>3.25 ETH</Header.Subheader></Header>
            </Segment>
          </Segment.Group>
          <Form>
            <Form.Group>
            <Form.Field
              width="3"
              label='Amount' control='input' type='number' name='betValue'
              min={0} max={5}
              onChange={this.handleEditBetValue}
            />
            </Form.Group>
            <small>Limit: <b>$3500 = 5 ETH</b></small>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button onClick={() => this.setState({aiBetting: false})}>Skip</Button>
          <Button.Or />
          <Button onClick={this.handleSubmitBet} positive>Save Bet</Button>
        </Button.Group>
      </Modal.Actions>
    </Modal>

    {/* WIN/LOSE POPUP */}
    <Modal
      size="tiny"
      dimmer="blurring"
      closeIcon={true}
      className='bet-bot-container'
      open={this.state.gameEnded}>

      <Modal.Header>{this.state.wonBet ? 'Congratulations! You Won the bet' : 'Sorry! Better Luck next time'}</Modal.Header>
      <Modal.Content image>
        <Image wrapped size='small' src={this.state.wonBet ? '/win.png' : '/lost.png'} />
        <Modal.Description>
          <Header>{`You have ${this.state.wonBet? 'won' : 'lost'} ${this.state.betValue * 2} ETH`}</Header>
          <Segment.Group horizontal>
            <Segment color={this.state.betHomeTeam ? (this.state.wonBet ? 'green' : 'red') : 'black'} inverted>
              {this.state.betHomeTeam ? <Header as='h2'>EG<Header.Subheader>WON </Header.Subheader></Header>
                : <Header inverted as='h2'>EHOME<Header.Subheader>LOST</Header.Subheader></Header>
              }
            </Segment>
            <Segment color={this.state.betHomeTeam ? (!this.state.wonBet ? 'green' : 'red') : 'black'} inverted>
              {this.state.betHomeTeam ? <Header inverted as='h2'>EHOME<Header.Subheader>LOST </Header.Subheader></Header>
                : <Header as='h2'>EG<Header.Subheader>WON </Header.Subheader></Header>
              }
            </Segment>
          </Segment.Group>
          <Segment>You have <b>{this.state.wonBet ? 'won': 'lost'}</b> the bet!</Segment>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button onClick={()=> this.setState({gameEnded: false})}>Done</Button>
        </Button.Group>
      </Modal.Actions>
    </Modal>

    </div>);
  }
}

export default App
