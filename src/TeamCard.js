/**
 * Created by leonmak on 29/4/18.
 */
import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

export const Teams = [
  {
    name: 'EG',
    image: 'EG.jpg',
    year: 1999,
    description: "Evil Geniuses is an eSports organization based in San Francisco. Founded in 1999, the organization has fielded players in various fighting games, Dota 2, League of Legends, StarCraft II, World of Warcraft, Halo, Call of Duty, Rocket League, and Tom Clancy's Rainbow Six Siege.",
    bets: 23,
    amount: 0.2,
  }, {
    name: 'EHOME',
    image: 'EHOME.png',
    year: 2005,
    description: 'EHOME.cn is a Chinese Dota 2 team. The team was founded in 2004 which consist of Warcraft III and Counter-Strike teams. The Dota division was started in 2007. EHOME is one of the most successful Dota teams of all time.',
    bets: 26,
    amount: 0.22,
  }
];

const TeamCard = ({name, image, year, description, bets, amount, style}) => (
  <Card style={style}>
    <Image height={210} src={`/${image}`} />
    <Card.Content>
      <Card.Header>
        {name}
      </Card.Header>
      <Card.Meta>
        <span className='date'>
          Founded in {year}
        </span>
      </Card.Meta>
      <Card.Description>
        {description}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <div><Icon name='user' />{bets} Bets</div>
      <div><Icon color='yellow' name='bitcoin' />{amount} BTC</div>
    </Card.Content>
  </Card>
);

const TeamCards = () => (
  <Card.Group centered>
    <TeamCard {...Teams[0]} color='green' />
    <div style={{padding: '120px 30px'}}>vs</div>
    <TeamCard {...Teams[1]} color='red'/>
  </Card.Group>
);

export default TeamCards
