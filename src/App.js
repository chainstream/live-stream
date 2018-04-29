import { getAvatar } from './utils/images'
import React, { Component } from 'react'
import { Header, Menu, Grid, Segment, Button, Icon, Image, Label, Progress, Modal, Form} from 'semantic-ui-react'

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

const nextEvents = [
  {
    avatar: getAvatar({"gender":"male"}),
    username: 'Bob',
    action: ': Hey guys! Hope this will be a great game!',
    date: '1 sec ago',
    likes: 1,
    images: [<Icon name={'hand peace outline'} size="large"/>],
  }, {
    avatar: getAvatar({"gender":"male"}),
    username: 'PDP',
    action: 'has joined the stream.',
    date: '1 sec ago',
    likes: 20,
    text: 'The king is in the house..'
  }, {
    avatar: getAvatar({"gender":"female"}),
    username: 'Alice',
    action: 'has tipped 0.02 bitcoins.',
    date: '1 sec ago',
    likes: 15,
    images: [<Icon name={'bitcoin'} size="large"/>],
  }, {
    avatar: getAvatar({"gender":"female"}),
    username: 'Sarah',
    action: ': GO EG!!!!',
    date: '1 sec ago',
    likes: 23,
    images: [<Icon name={'fire'} size="large"/>],
  },{
    avatar: getAvatar({"gender":"female"}),
    username: 'Alice',
    action: ': GO EHOME!!!!!!111',
    date: '1 sec ago',
    likes: 15,
    images: [<Icon name={'fire'} size="large"/>, <Icon name={'fire'} size="large"/>],
  },{
    avatar: getAvatar({"gender":"male"}),
    username: 'John',
    action: 'has tipped 0.02 viacoins.',
    date: '1 sec ago',
    likes: 6,
    images: [<Icon name={'viacoin'} size="large"/>],
  }, {
    avatar: getAvatar({"gender":"male"}),
    username: 'Steve',
    action: ': EG IS TRASH!!',
    date: '1 sec ago',
    likes: 1,
    images: [<Icon name={'trash'} size="large"/>],
  }
]

class App extends Component {
  constructor(props) {
    super(props)

    this.fundsDeducted = 1;
    this.state = {
      active: 'home',
      storageValue: 30,
      countdownInterval: -1,  // id of interval
      aiBetting: false,
      gameEnded: false,
      wonBet: false,
      betHomeTeam: true,      // team index 0/1
      betValue: 0,
      web3: null,
      contract: null,
      accounts: null,
    }
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

  componentDidMount() {
    var nextTime = 100
    nextEvents.forEach((event) => {
      setTimeout(() => {
        initialEvents.splice(0, 0, event)
      }, nextTime)
      nextTime = nextTime + 100
      console.log(nextTime)
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

  handleEditBetValue = (e, { name, value }) => this.setState({ [name]: value });

  handleEditBetTeam = (isHomeTeam) => () => this.setState({betHomeTeam: isHomeTeam});

  handleSubmitBet = () => {
    // TODO: send bet to contract
    // continue playing video
    // TODO: continue deducting funds
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

  onFinishGame = (e) => {
    // show win / lose popup
    this.setState({gameEnded: true})


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
          <Segment>Bot has placed a <b>0.4 ETH</b> bet on TEAM <b>EG</b> with <b>66.75%</b> confidence</Segment>
          <Header>Do you want to place a bet?</Header>
          <Segment.Group horizontal>
            <Segment onClick={this.handleEditBetTeam(true)}>
              <Header as='h2'>EG<Header.Subheader>2.13<span style={{color: 'green'}}> (+0.4) </span>ETH</Header.Subheader></Header>
            </Segment>
            <Segment onClick={this.handleEditBetTeam(false)}>
              <Header as='h2'>EHOME<Header.Subheader>3.25 ETH</Header.Subheader></Header>
            </Segment>
          </Segment.Group>
          <Form onSubmit={this.handleSubmitBet}>
            <Form.Field
              label='Quantity' control='input' type='number' name='betValue'
              min={0} max={5}
              onChange={this.handleEditBetValue}
            />
            <small>Limit: $3500 = 5 ETH</small>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button>Skip</Button>
          <Button.Or />
          <Button positive>Save Bet</Button>
        </Button.Group>
      </Modal.Actions>
    </Modal>

    {/* WIN/LOSE POPUP */}
    <Modal
      className='bet-bot-container'
      open={this.state.gameEnded}>
      <Modal.Header>The bet is up!</Modal.Header>
      <Modal.Content image>
        <Image wrapped size='small' src='/bet-bot.png' />
        <Modal.Description>
          <Header>Who will win the game?</Header>
          <Segment.Group horizontal>
            <Segment disabled color={this.state.betHomeTeam ? (this.state.wonBet ? 'green' : 'red') : ''} inverted={this.state.betHomeTeam}>
              <Header as='h2'>EG<Header.Subheader>2.13<span style={{color: 'green'}}> (+0.4) </span>ETH</Header.Subheader></Header>
            </Segment>
            <Segment disabled color={!this.state.betHomeTeam ? (this.state.wonBet ? 'green' : 'red') : ''} inverted={!this.state.betHomeTeam}>
              <Header as='h2'>EHOME<Header.Subheader>3.25 ETH</Header.Subheader></Header>
            </Segment>
          </Segment.Group>
          <Segment>You have <b>{this.state.wonBet ? 'won': 'lost'}</b> the bet!</Segment>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button positive>Done</Button>
        </Button.Group>
      </Modal.Actions>
    </Modal>

    </div>);
  }
}

export default App
