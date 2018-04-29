/**
 * Created by leonmak on 28/4/18.
 */
import toonavatar  from 'cartoon-avatar'

export const getAvatar = (options) => {
  if (!!options) {
    return toonavatar.generate_avatar(options);
  } else {
    return toonavatar.generate_avatar();
  }
};
