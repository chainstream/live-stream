/**
 * Created by leonmak on 28/4/18.
 */
import React from 'react'
import { Icon, Label } from 'semantic-ui-react'
import { getAvatar } from './images'

/**
 * props => [{
 *  avatar: str,    // getAvatar()
 *  username: str,  // Elliot
 *  action: str,    // added you as a friend
 *  date: str,      // 1 hour ago
 *  likes: num,
 *  images: [str],  // bitcoin
 *  text: str,      // has betted on 'Efsd' to win
 * }]
 * @param props
 * @constructor
 */

export const initialEvents = [
  {
    avatar: getAvatar({"gender":"male"}),
    username: 'Bob',
    action: ': Hey guys! Hope this will be a great game!',
    date: '1 sec ago',
    likes: 1,
    images: [<Icon name={'hand peace'} size="large"/>],
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
    images: [<Label as='a' image><Icon color='yellow' name={'bitcoin'} size="large"/>0.02 BTC</Label>],
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
];
