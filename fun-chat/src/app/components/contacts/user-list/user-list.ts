import type { Render } from '~/app/types/types';

import { store } from '~/app/lib/store/store';
import { ACTION } from '~/app/store/actions';
import { li, ul } from '~/app/utils/create-element';

import styles from './user-list.module.css';

export function createUserList(): HTMLUListElement {
  const userList = ul({});

  const render: Render = ({ users, currentUser, searchValue }) => {
    userList.replaceChildren();

    const contacts = users
      .filter((user) => user.login !== currentUser?.login)
      .filter((user) => user.login.includes(searchValue));

    for (const contact of contacts) {
      const userElement = li({
        textContent: contact.login,
        className: styles.user,
      });

      if (contact.isLogined) {
        userElement.classList.add(styles.online);
      }

      userList.append(userElement);
    }
  };

  render(store.getState());

  store.subscribe(ACTION.SET_USERS, render);
  store.subscribe(ACTION.SET_SEARCH_VALUE, render);

  return userList;
}
