/**
 * Created by leonmak on 28/4/18.
 */
import React from 'react'
import { Feed, Icon, Transition } from 'semantic-ui-react'


const FeedEvent = ({data}) => (
  <Feed.Event>
    <Feed.Label image={data.avatar} />

    <Feed.Content>
      <Feed.Summary>
        <a>{data.username}</a> {data.action}
        <Feed.Date>{data.date}</Feed.Date>
      </Feed.Summary>

      {data.images && data.images.map((image, i) => (
        <Feed.Extra images key={i}>
          {image}
        </Feed.Extra>
      ))}

      {data.text && <Feed.Extra text>{data.text}</Feed.Extra>}

      <Feed.Meta>
        {data.likes && data.likes > 0 &&
          <Feed.Like>
            <Icon name='like' />
            {data.likes} {data.likes > 1 ? 'Likes' : 'Like'}
          </Feed.Like>
        }
      </Feed.Meta>
    </Feed.Content>
  </Feed.Event>
);

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
const Sidebar = (props) => (
  <Transition.Group
    as={Feed}
    duration={200}
  >
    {props.data.map((eventData, i) =>
      <FeedEvent data={eventData} key={i} />
    )}
  </Transition.Group>
);

export default Sidebar