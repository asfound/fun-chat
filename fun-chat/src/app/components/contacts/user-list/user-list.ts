import type { Render } from '~/app/types/types';

import { store } from '~/app/lib/store/store';
import { ACTION } from '~/app/store/actions';
import { li, ul } from '~/app/utils/create-element';

import styles from './user-list.module.css';

export function createUserList(): HTMLUListElement {
  const userList = ul({});

  const render: Render = ({ users, currentUser }) => {
    userList.replaceChildren();

    for (const user of users) {
      if (user.login !== currentUser?.login) {
        const userElement = li({
          textContent: user.login,
          className: styles.user,
        });

        if (user.isLogined) {
          userElement.classList.add(styles.online);
        }

        userList.append(userElement);
      }
    }
  };

  render(store.getState());

  store.subscribe(ACTION.SET_USERS, render);

  return userList;
}
