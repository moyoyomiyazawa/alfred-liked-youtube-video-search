'use strict';

const createItem = (title, subtitle, url) => {
  return {
    title,
    subtitle,
    arg: url,
    icon: {
      type: 'png',
      path: 'icon.png',
    },
  };
};

module.exports = createItem;
