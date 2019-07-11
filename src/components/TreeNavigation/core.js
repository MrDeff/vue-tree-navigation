import NavigationLevel from '../NavigationLevel/NavigationLevel.vue';
import NavigationItem from '../NavigationItem/NavigationItem.vue';

import { sanitizeElement, sanitizePath } from '../utils';

/**
 * Recursive function.
 * One call generates one level of the tree.
 */
export const generateLevel = (
  createElement,
  items,
  level,
  defaultOpenLevel
) => {
  const children = [];

  items.forEach(item => {
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
            defaultOpenLevel
          ),
        ]
      );

      children.push(createElement('li', [navLevel]));
    } else {
      const navItem = createElement(NavigationItem, {
        props: {
          item,
        },
      });

      children.push(createElement('li', [navItem]));
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
  const custom = item.custom;

  // item is its own parent
  if (parent === undefined) {
    if (element === undefined && path === undefined && external === undefined) {
      return {
        path: '',
        target: '',
      };
    }

    if (external !== undefined && custom === undefined) {
      return {
        path: '',
        target: external,
      };
    }

    if (path !== undefined && custom === undefined) {
      return {
        path: path,
        target: path,
      };
    }

    if (element !== undefined && custom === undefined) {
      return {
        path: '',
        target: '/' + element,
      };
    }
    if (custom !== undefined) {
      return {
        path: '',
        custom: custom,
      };
    }
  }

  const parentPath = sanitizePath(parent.meta.path);

  if (external !== undefined && custom === undefined) {
    return {
      path: parentPath,
      target: external,
    };
  }

  if (path !== undefined && custom === undefined) {
    return {
      path: parentPath + path,
      target: parentPath + path,
    };
  }

  if (element !== undefined  && custom === undefined) {
    return {
      path: parentPath,
      target: sanitizePath(parentPath + element),
    };
  }

  if (custom !== undefined) {
    return {
      path: parentPath,
      custom: custom,
    };
  }

  return {
    path: parentPath,
    target: '',
  };
};
