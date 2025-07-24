import { INPUT_TYPE, PLACEHOLDER } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { setSearchInputValue } from '~/app/store/actions';
import { aside, input } from '~/app/utils/create-element';

import styles from './contacts.module.css';
import { createUserList } from './user-list/user-list';

export function createContacts(): HTMLElement {
  const asideElement = aside({ className: styles.aside });

  const searchInput = input({
    type: INPUT_TYPE.TEXT,
    placeholder: PLACEHOLDER.SEARCH,
    value: store.getState().searchValue,
    className: styles.input,
  });

  searchInput.addEventListener('input', () => {
    store.dispatch(setSearchInputValue(searchInput.value));
  });

  const userList = createUserList();

  asideElement.append(searchInput, userList);
  return asideElement;
}
