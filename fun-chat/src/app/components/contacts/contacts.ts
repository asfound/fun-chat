import { INPUT_TYPE } from '~/app/constants/constants';
import { aside, input } from '~/app/utils/create-element';

import { createUserList } from './user-list/user-list';

export function createContacts(): HTMLElement {
  const asideElement = aside({});

  const searchInput = input({
    type: INPUT_TYPE.TEXT,
    placeholder: 'Find user...',
  });

  const userList = createUserList();

  asideElement.append(searchInput, userList);
  return asideElement;
}
