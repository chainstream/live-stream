/**
 * Created by leonmak on 28/4/18.
 */
import {getAvatar} from './images'
import React from 'react'
import { Icon } from 'semantic-ui-react'

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
    username: 'PDP',
    action: 'has joined the stream.',
    date: '10 sec ago',
    likes: 20,
    text: 'The king is in the house..'
  }, {
    avatar: getAvatar({"gender":"female"}),
    username: 'Alice',
    action: 'has tipped 0.02 bitcoins.',
    date: '10 sec ago',
    likes: 15,
    images: [<Icon name={'bitcoin'} size="large"/>],
  }, {
    avatar: getAvatar({"gender":"female"}),
    username: 'Sarah',
    action: ': GO EG!!!!',
    date: '9 sec ago',
    likes: 23,
    images: [<Icon name={'fire'} size="large"/>],
  },{
    avatar: getAvatar({"gender":"female"}),
    username: 'Alice',
    action: ': GO EHOME!!!!!!111',
    date: '5 sec ago',
    likes: 15,
    images: [<Icon name={'fire'} size="large"/>, <Icon name={'fire'} size="large"/>],
  },{
    avatar: getAvatar({"gender":"male"}),
    username: 'John',
    action: 'has tipped 0.02 viacoins.',
    date: '3 sec ago',
    likes: 6,
    images: [<Icon name={'viacoin'} size="large"/>],
  }, {
    avatar: getAvatar({"gender":"male"}),
    username: 'Steve',
    action: ': EG IS TRASH!!',
    date: '2 sec ago',
    likes: 1,
    images: [<Icon name={'trash'} size="large"/>],
  }
];
