# jquery.treeFilter.js
Tree Filter

В коде есть коментарии  
Пока ориентируемся на них

Пример использования:  
```
$("#tz-tree").treeFilter({
  menuParentRoot: '#tz-tree',
  menuParentShow: 'd-block',
  menuParentHide: 'd-none',

  menuTitleRoot: '.item__branch',
  menuTitleText: '.item__branch > a',
  menuTitleOpen: 'active',
  menuTitleClose: '',

  menuItemsRoot: '.tree-submenu',
  menuItemsShow: 'd-block',
  menuItemsHide: 'd-none',

  menuItemRoot: '.item__link',
  menuItemText: '.item__link > .pricing',
  menuItemTags: '.item__link > .pricing > .keywords-tags',
  menuItemShow: 'active',
  menuItemHide: 'd-none',

  ///searchWithMenuText: true,
  searcher: $('#input-search-tree'),
  reset: $('#btn-search-reset')
});
```
