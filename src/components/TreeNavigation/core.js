import NavigationLevel from '../NavigationLevel/NavigationLevel.vue';
import NavigationItem from '../NavigationItem/NavigationItem.vue';

import {sanitizeElement, sanitizePath} from '../utils';

/**
 * Recursive function.
 * One call generates one level of the tree.
 */
export const generateLevel = (
  createElement,
  items,
  level,
  defaultOpenLevel,
  selectedKeyName = '',
  selectedKeys = [],
) => {
  const children = [];

  items.forEach(item => {
    if (!item.hidden) {
      if (item.hasOwnProperty('children')) {
        const navLevel = createElement(
          NavigationLevel,
          {
            props: {
              parentItem: item,
              level,
              defaultOpenLevel,
            },
          },
          [
            ...generateLevel(
              createElement,
              item.children,
              level + 1,
              defaultOpenLevel,
              item.selectedKeyName,
              item.selectedKeys,
            ),
          ]
        );

        children.push(createElement('li', [navLevel]));
      } else {
        const navItem = createElement(NavigationItem, {
          props: {
            item,
            selectedKeyName,
            selectedKeys,
          },
        });

        children.push(createElement('li', [navItem]));
      }
    }

  });

  return children;
};

/**
 * Recursive function.
 * Insert metadata containing the navigation path and its type to each item.
 **/
export const insertMetadataToNavItems = (items, parent) => {
  items.forEach(item => {
    item.meta = getItemMetadata(item, parent);

    if (item.hasOwnProperty('children')) {
      item.children = insertMetadataToNavItems(item.children, item);
    }
  });

  return items;
};

/**
 * Return item metadata object: { path: ..., target: ... }
 */
export const getItemMetadata = (item, parent) => {
  const element = sanitizeElement(item.element);
  const path = sanitizePath(item.path);
  const external = item.external;
  const pathFull = item.pathFull;
  const image = item.img;
  const number = item.number;
  const clickCall = item.click;
  // item is its own parent
  if (parent === undefined) {

    if (element === undefined && path === undefined && external === undefined) {
      return {
        path: '',
        target: '',
        pathFull: false,
        image: image,
        number: number,
        click: clickCall
      };
    }

    if (external !== undefined) {
      return {
        path: '',
        target: external,
        image: image,
        number: number,
        click: clickCall
      };
    }

    if (path !== undefined) {
      return {
        path: path,
        target: path,
        image: image,
        number: number,
        click: clickCall
      };
    }

    if (element !== undefined) {
      return {
        path: '',
        target: '/' + element,
        image: image,
        number: number,
        click: clickCall
      };
    }

  }

  const parentPath = sanitizePath(parent.meta.path);

  if (pathFull !== false) {
    return {
      path: parentPath,
      target: path,
      image: image,
      number: number,
      click: clickCall
    };
  }

  if (external !== undefined) {
    return {
      path: parentPath,
      target: external,
      image: image,
      number: number,
      click: clickCall
    };
  }

  if (path !== undefined) {
    return {
      path: parentPath + path,
      target: parentPath + path,
      image: image,
      number: number,
      click: clickCall
    };
  }

  if (element !== undefined) {
    return {
      path: parentPath,
      target: sanitizePath(parentPath + element),
      image: image,
      number: number,
      click: clickCall
    };
  }

  return {
    path: parentPath,
    target: '',
    image: image,
    number: number,
    click: clickCall
  };
};
