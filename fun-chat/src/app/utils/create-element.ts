import { isNonNullable } from '../types/type-guards';

export type TagType = keyof HTMLElementTagNameMap;

type Properties<T extends TagType> = Partial<HTMLElementTagNameMap[T]>;

type Attributes = Record<string, string>;

type ChildNode = Node | string | null | undefined;

function createElementFactory<T extends TagType>(tag: T) {
  return function createElement(
    properties?: Properties<T>,

    children?: ChildNode[],

    attributes?: Attributes
  ): HTMLElementTagNameMap[T] {
    const element = document.createElement(tag);

    if (properties) {
      Object.assign(element, properties);
    }

    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
      }
    }

    if (children) {
      element.append(...children.filter((child) => isNonNullable(child)));
    }

    return element;
  };
}

export const div = createElementFactory('div');

export const main = createElementFactory('main');

export const section = createElementFactory('section');
