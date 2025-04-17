import { isNonNullable } from '../types/guards';

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

export const a = createElementFactory('a');

export const article = createElementFactory('article');

export const aside = createElementFactory('aside');

export const button = createElementFactory('button');

export const dialog = createElementFactory('dialog');

export const div = createElementFactory('div');

export const fieldset = createElementFactory('fieldset');

export const footer = createElementFactory('footer');

export const form = createElementFactory('form');

export const h1 = createElementFactory('h1');

export const header = createElementFactory('header');

export const input = createElementFactory('input');

export const label = createElementFactory('label');

export const legend = createElementFactory('legend');

export const main = createElementFactory('main');

export const p = createElementFactory('p');

export const section = createElementFactory('section');

export const span = createElementFactory('span');
