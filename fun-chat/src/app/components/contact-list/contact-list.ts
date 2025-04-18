import { INPUT_TYPE } from '~/app/constants/constants';
import { aside, input, ul } from '~/app/utils/create-element';

export function createContacts(): HTMLElement {
  const asideElement = aside({});

  const searchInput = input({
    type: INPUT_TYPE.TEXT,
    placeholder: 'Find user...',
  });

  const userList = ul({});

  asideElement.append(searchInput, userList);
  return asideElement;
}
