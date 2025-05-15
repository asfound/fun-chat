import type { Render } from '~/app/types/types';

import { EMPTY_VALUE, HAS_NOTIFICATIONS, NOTIFICATION_VAR } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { fetchChatMessageHistory } from '~/app/services/message-service';
import { ACTION } from '~/app/store/actions';
import { li, ul } from '~/app/utils/create-element';

import styles from './user-list.module.css';

export function createUserList(): HTMLUListElement {
  const userList = ul({ className: styles.list });

  const render: Render = ({ users, currentUser, searchValue, unreadMessagesCounters }) => {
    userList.replaceChildren();

    const contacts = [...users.values()]
      .filter((user) => user.login !== currentUser?.login)
      .filter((user) => user.login.includes(searchValue))
      .sort((u1, u2) => {
        if (u1.isLogined !== u2.isLogined) {
          return Number(u2.isLogined) - Number(u1.isLogined);
        }
        return u1.login.localeCompare(u2.login);
      });

    for (const contact of contacts) {
      const userElement = li({
        textContent: contact.login,
        className: styles.user,
      });

      const notificationCount = unreadMessagesCounters.get(contact.login) ?? [];
      updateBadge(userElement, notificationCount.length);

      if (contact.isLogined) {
        userElement.classList.add(styles.online);
      }

      userElement.addEventListener('click', () => {
        fetchChatMessageHistory(contact.login);
      });

      userList.append(userElement);
    }
  };

  render(store.getState());

  store.subscribe(ACTION.SET_USERS, render);
  store.subscribe(ACTION.SET_SEARCH_VALUE, render);
  store.subscribe(ACTION.UPDATE_USER_STATUS, render);
  store.subscribe(ACTION.UPDATE_NOTIFICATION_COUNT, render);

  return userList;
}

function updateBadge(element: HTMLLIElement, value: number): void {
  if (value === EMPTY_VALUE) {
    element.style.setProperty(NOTIFICATION_VAR, '');
    delete element.dataset.hasNotifications;
  } else {
    element.style.setProperty(NOTIFICATION_VAR, `"${value.toString()}"`);
    element.dataset.hasNotifications = HAS_NOTIFICATIONS;
  }
}
