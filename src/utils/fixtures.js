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
    date: '3 sec ago',
    likes: 3,
    images: [<Icon name={'bitcoin'} size="large"/>],
  }
];
