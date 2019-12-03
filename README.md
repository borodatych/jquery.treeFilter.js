# jquery.treeFilter.js
Tree Filter


Подходит для такой структуры UL > LI > UL 

```
$("#root-element").treeFilter({
    /// Пункт меню, на него вешается класс открыт\закрыт
    subMenu: '.menu__item',
    /// Сам элемент с текстом, где будет происходить поиск
    subMenuText: '.menu__item > .menu__link',

    openClass: 'menu__item--open',
    closeClass: 'menu__item--close',

    subMenuDiv: '.menu__submenu',

    menuItem: '.menu__item--item',
    menuItemText: '.menu__item--item > .menu__link',

    hideClass: 'hide',
    showClass: 'show',

    searcher: $input,
    searchWithMenuText: false
});
```
