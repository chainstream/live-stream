import React, {Component} from 'react'
import {
  Button,
  Dropdown,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Label,
  Menu,
  Modal,
  Progress,
  Segment
} from 'semantic-ui-react'

import FeedEvents from './FeedEvents'
import {initialEvents} from './utils/fixtures'
import ReactPlayer from 'react-player'
import TeamCards from './TeamCard'

import ChainstreamContract from '../build/contracts/Chainstream.json'
import getWeb3 from './utils/getWeb3'
import TruffleContract from 'truffle-contract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import {getAvatar} from "./utils/images";

class App extends Component {
  constructor(props) {
    super(props)

    this.fundsDeducted = 1;
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
      feedEvents: [],
      betsHome: 0.03,
      betsAway: 0.05,
    };
    this.onTip = this.onTip.bind(this)
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      }, this.instantiateContract)
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  addFeedEvent = (event, timeLag, nextTime=3000) => {
    setTimeout(() => {
      this.setState({ feedEvents: [event, ...this.state.feedEvents] })
    }, nextTime * timeLag * Math.random() * 3)
  };

  componentDidMount() {
    initialEvents.forEach((event, i) => {
      this.addFeedEvent(event, i);
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
      console.log('accounts', accounts)
      chainstream.deployed().then((instance) => {
        console.log('contract at', instance.address)
        console.log(window.web3.currentProvider)
        this.setState({
          chainstreamInstance: instance,
          accounts,
        })
      })
    })
  }

  handleItemClick = (e) => {
    console.log('click menu')
  };

  addFunds = (e) => {

    this.state.chainstreamInstance.sendTip('0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef',
      {from: this.state.accounts[0], value: 1e16}).then(
      () => this.setState({
        storageValue: Math.min(100, this.state.storageValue + 100)
      })
    )
  };

  onPlay = () => {
    if (!!this.state.timeoutId) {
    console.log('playing');
      return
    }
    this.startDeductingFunds();
    const timeoutId = setTimeout(() => {
    // after timeout 20s
      this.onPause();

      // popup: AI places bet popup
      // prompt user to place bet
      this.setState({ aiBetting: true });
    }, 60000);

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
    }, 2000);

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
    this.setState({isPlaying: true, aiBetting: false, storageValue: this.state.storageValue - 10});

    // TODO: send bet to contract
    this.state.chainstreamInstance.bet(
      {from: this.state.accounts[0], value: 1e+15}).then(
      res => console.log(res)
    )
    // continue playing video

    setTimeout(() => {
      const wonBet = Math.random() > 0.5;
      // until bug's fixed
      if (wonBet) {
        this.state.chainstreamInstance.decideBet(this.state.accounts[0],
          {from: this.state.accounts[0]}).then(
          res => console.log(res)
        )
      }
      this.setState({ isPlaying: false,  gameEnded: true, wonBet })
    }, 30000)
  };


  onTip = (e) => {
    // add tip event
    this.state.chainstreamInstance.streamPrice().then((resp) => {
      console.log(resp);
    })
    this.state.chainstreamInstance.sendTip('0xf17f52151ebef6c7334fad080c5704d77216b732',
      {from: this.state.accounts[0], value: 1e+15}).then(
        res => {
          this.setState({feedEvents: [{
              avatar: getAvatar({"gender":"male"}),
              username: 'You',
              action: 'have tipped 0.0002 bitcoins.',
              date: '1 sec ago',
              likes: 1,
              images: [<Label as='a' image><Icon color='yellow' name={'bitcoin'} size="large"/>0.0002 BTC</Label>],
            }, ...this.state.feedEvents]})
          console.log(res)
        }
    )
  };

  render() {
    return (<div>

      <Menu
        inverted
        style={{marginBottom: 30}}>
        <Menu.Item active={this.state.active === 'home'}
                   content='ChainStream' name='ChainStream' onClick={this.handleItemClick} />
        <Menu.Item active={this.state.active === 'messages'}
                   content='Messages' name='messages' onClick={this.handleItemClick} />

        <Menu.Menu position='right'>
          <Menu.Item content='Logout' name='messages' onClick={this.handleItemClick} />

        </Menu.Menu>
      </Menu>

      <Grid centered >

        {/* HEADER */}
        <Grid.Row>

          {/* TITLE */}
          <Grid.Column width={8}>
            <Grid.Row>
              <Header as='h1'>Ti6 UB Semifinals 2016 | EHOME vs Evil Geniuses</Header>
            </Grid.Row>
            <Grid.Row verticalAlign="middle">
              <Header as='h4'>Hosted By <a>Valve</a> &nbsp;&nbsp;&nbsp;</Header>
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
            <ReactPlayer url='https://youtu.be/CFyNbVyUS-k?t=1h23m20s'
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
          {this.state.betValue > 0
            ? <Segment>{this.state.betValue} ETH bet on {this.state.betHomeTeam ? 'EG' : 'EHOME'}</Segment>
            : <Segment>You have not bet on any team</Segment>}
          <Segment style={{height: 510, overflowY: 'scroll'}}>
            <FeedEvents data={this.state.feedEvents} />
          </Segment>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={8}>
          <TeamCards />
        </Grid.Column>
        <Grid.Column width={4}>
          <Input fluid placeholder='Comment' />

        </Grid.Column>
      </Grid.Row>
    </Grid>

    {/* BET BOT */}
    <Modal
      size="small"
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
          <Input
            type="number"
            label={<Dropdown defaultValue='ETH' options={[
              { key: 'ETH', text: 'ETH', value: 'ETH' },
              { key: 'BTC', text: 'BTC', value: 'BTC' },
              { key: 'EOS', text: 'EOS', value: 'EOS' },
            ]} />}
            min={0} max={5} fluid
            onChange={this.handleEditBetValue}
            labelPosition='right'
            placeholder='Amount'
          />
          <div><small>&nbsp;  Limit: <b>$3500 = 5 ETH</b></small></div>
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
      open={this.state.gameEnded}
      onClose={()=> this.setState({gameEnded: false, storageValue: this.state.wonBet ? this.state.storageValue + 50 : this.state.storageValue - 50})}
    >

      <Modal.Header>{this.state.wonBet ? 'Congratulations!' : 'Better Luck Next Time!'}</Modal.Header>
      <Modal.Content image>
        <Image wrapped size='small' src={this.state.wonBet ? '/win.png' : '/lost.png'} />
        <Modal.Description>
          <Header>{`You have ${this.state.wonBet? 'won' : 'lost'} ${this.state.betValue * 2} ETH`}</Header>
          <Segment.Group horizontal>
            <Segment color={this.state.betHomeTeam === this.state.wonBet ? 'green' : 'red'} inverted>
              {this.state.betHomeTeam === this.state.wonBet
                ? <Header inverted as='h2'>EG<Header.Subheader>WON </Header.Subheader></Header>
                : <Header inverted as='h2'>EHOME<Header.Subheader>LOST</Header.Subheader></Header>
              }
            </Segment>
            <Segment color={this.state.betHomeTeam !== this.state.wonBet ? 'green' : 'red'} inverted>
              {this.state.betHomeTeam !== this.state.wonBet
                ? <Header inverted as='h2'>EG<Header.Subheader>WON </Header.Subheader></Header>
                : <Header inverted as='h2'>EHOME<Header.Subheader>LOST</Header.Subheader></Header>
              }
            </Segment>
          </Segment.Group>
          <Segment>You have <b>{this.state.wonBet ? 'won': 'lost'}</b> the bet!</Segment>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button onClick={()=> this.setState({gameEnded: false, storageValue: this.state.wonBet ? this.state.storageValue + 50 : this.state.storageValue - 50})}>Done</Button>
        </Button.Group>
      </Modal.Actions>
    </Modal>

    </div>);
  }
}

export default App
