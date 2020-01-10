$.expr[':'].containsText = function(obj, index, meta, stack){
	return $(obj).text().toLowerCase().indexOf(meta[3].toLowerCase()) >= 0;
};
$.fn.treeFilter = function(options) {
	let el = this;
	let defaults = {
		menuParentRoot: '.tf-menu',		/// Общий родитель у заголовка и элементами меню
		menuParentShow: 'tz-show',		///
		menuParentHide: 'tz-hide',		///
							///
		menuTitleRoot: '.tf-submenu',		///
		menuTitleText: '.tf-submenu-text',	///
		menuTitleOpen: 'tf-open',		///
		menuTitleClose: 'tf-close',		///
							///
		menuItemsRoot: '.tf-items',		/// Общий контейнер для всех ссылок
		menuItemsShow: 'tf-show',		///
		menuItemsHide: 'tf-hide',		///
							///
		menuItemRoot: '.tf-item',		///
		menuItemText: '.tf-item-text',		///
		menuItemTags: '.tf-item-tags',		/// Пока тэги пососедству с самими линками, пака небыло необходиости по другому
		menuItemShow: 'tf-show',		///
		menuItemHide: 'tf-hide',		///
							///
		resultClass: 'tf-result',		/// От найденных пунктов меню до общего родителя проставляется сквозной класс
							///
		searcher : null,			/// Строка поиска, сам input
		reset : null,				/// Кнопка сброса набранного
		searchWithMenuText: false		/// Искать в заголовкам \ По умолчанию ищем только в пунктах меню \ До конца еще не решил, что делать при поиске по меню: показывать всё подменю или что-то похитрее
	};

	/// Public Variables
	let plugin = {};
	let status = []; // save folder status for "var memory"

	plugin.settings = {};

	/// Main Function
	let init = function() {
		plugin.settings = $.extend({}, defaults, options);
		plugin.el = el;

		if( plugin.settings.searcher ) searcher();

		memory("in");
	};

	/// PUBLIC METHOD
	///plugin.openAll = function() { plugin.el.find("li"+plugin.settings.menuTitleRoot).addClass(menuTitleOpen); };
	///plugin.closeAll = function() { plugin.el.find("li"+plugin.settings.menuTitleRoot).removeClass(menuTitleOpen); };

	/// PRIVATE FUNCTION
	/** Fired when type on search input field */
	let searcher = function() {
		let menuParentRoot = plugin.settings.menuParentRoot;
		let menuParentShow = plugin.settings.menuParentShow;
		let menuParentHide = plugin.settings.menuParentHide;

		let menuTitleRoot = plugin.settings.menuTitleRoot;
		let menuTitleText = plugin.settings.menuTitleText;
		let menuTitleOpen = plugin.settings.menuTitleOpen;
		let menuTitleClose = plugin.settings.menuTitleClose;

		let menuItemsRoot = plugin.settings.menuItemsRoot;
		let menuItemsShow = plugin.settings.menuItemsShow;
		let menuItemsHide = plugin.settings.menuItemsHide;

		let menuItemRoot = plugin.settings.menuItemRoot;
		let menuItemText = plugin.settings.menuItemText;
		let menuItemTags = plugin.settings.menuItemTags;
		let menuItemShow = plugin.settings.menuItemShow;
		let menuItemHide = plugin.settings.menuItemHide;

		let resultClass = plugin.settings.resultClass;

		let clearTags = function(){
			/// Remove Tags
			plugin.el.find("."+resultClass).removeClass(resultClass);
			/// Items Close
			plugin.el.find(menuItemsRoot).removeClass(menuItemsShow).addClass(menuItemsHide);
			/// Items Hide
			plugin.el.find(menuItemRoot).removeClass(menuItemShow).addClass(menuItemHide);
			/// Hide Item Root
			plugin.el.find(menuParentRoot).removeClass(menuParentShow).addClass(menuParentHide);
			/// Title Not Active
			plugin.el.find(menuTitleRoot).removeClass(menuTitleOpen).addClass(menuTitleClose);
		};

		$(plugin.settings.reset).click(function(){
			$(plugin.settings.searcher).val('').trigger('keyup');
		});
		$(plugin.settings.searcher).keyup(function(){
			let search = $(this).val();
			clearTags();
			if( search.length === 0 ){
				console.log('| .:: SEARCH ZERO keyup ::. |');
				memory("out");
			}
			else{
				/// Items Show by Search in Links Text
				plugin.el
					.find(menuItemText+":containsText('" + search + "')")
					.parents(menuItemRoot).removeClass(menuItemHide).addClass(menuItemShow).addClass(resultClass)
				;
				/// Items Show by Search in Keyword-Tags
				plugin.el
					.find(menuItemTags+":containsText('" + search + "')")
					.parents(menuItemRoot).removeClass(menuItemHide).addClass(menuItemShow).addClass(resultClass)
				;

				/// SubMenu Open/Show by Search Input
				if( plugin.settings.searchWithMenuText ){
					plugin.el
						.find(menuTitleText+":containsText('" + search + "')")
						.parents(menuParentRoot).find(menuTitleRoot)
						.removeClass(menuTitleClose).addClass(menuTitleOpen)
						.removeClass(menuItemHide).addClass(menuItemShow)
						.addClass(resultClass)
						///.find(menuItemsRoot).show()
						.find(menuItemsRoot).removeClass(menuItemsHide).addClass(menuItemsShow)
						.find(menuItemRoot).removeClass(menuItemHide).addClass(menuItemShow)
					;
				}

				/// SubMenu Open/Show by Search Items
				$(menuItemRoot+"."+resultClass)
					.parents(menuParentRoot)
					.removeClass(menuParentHide).addClass(menuParentShow)
					.find(menuTitleRoot).removeClass(menuTitleClose).addClass(menuTitleOpen)
					.parents(menuParentRoot)
					.find(menuItemsRoot).removeClass(menuItemsHide).addClass(menuItemsShow)
				;

				/// Items Show by Search SubMenu
				if( plugin.settings.searchWithMenuText ){
					$(menuTitleRoot+"."+resultClass).find(menuItemRoot).removeClass(menuItemHide).addClass(menuItemShow);
				}
			}
		})
			//*/
			///.keydown(function(){ $(this).trigger('change'); })
			.change(function(){ /// Это нужно для внешней очистки поля ввода, там тригер по этому событию дергаем, что в принципе логично
				if( $(this).val().length === 0 ){
					console.log('| .:: SEARCH ZERO keydown\\change ::. |');
					clearTags();
					memory("out");
				}
				else $(this).trigger('keyup')
			})
			//*/
		;
	};
	/**
	 * Save current status of folder
	 * action : string "in" / "out"
	 * array : array that saves current status
	 * list : el
	 * */
	let memory = function(action) {
		console.log('| .:: MEMORY WORK ::. |',action);
		let menuParentRoot = plugin.settings.menuParentRoot;
		let menuParentHide = plugin.settings.menuParentHide;

		let menuTitleRoot = plugin.settings.menuTitleRoot;
		///let menuTitleText = plugin.settings.menuTitleText;
		let menuTitleOpen = plugin.settings.menuTitleOpen;
		let menuTitleClose = plugin.settings.menuTitleClose;

		let menuItemsRoot = plugin.settings.menuItemsRoot;
		let menuItemsShow = plugin.settings.menuItemsShow;
		let menuItemsHide = plugin.settings.menuItemsHide;

		let menuItemRoot = plugin.settings.menuItemRoot;
		///let menuItemText = plugin.settings.menuItemText;
		let menuItemShow = plugin.settings.menuItemShow;
		let menuItemHide = plugin.settings.menuItemHide;

		///let resultClass = plugin.settings.resultClass;

		if( action === "in" ){
			status = [];
			plugin.el.find(menuItemRoot).each(function() {
				status.push( $(this).hasClass(menuItemShow) );
			});
		}
		else if ( action === "out" ){
			plugin.el.find(menuItemRoot).each(function(i){
				let $ths = $(this);
				$ths.removeClass(menuItemHide).parents(menuParentRoot).removeClass(menuParentHide); /// Пока тут: по умолчанию ссылки не скрыты
				if( status[i] ){
					$ths
						.addClass(menuItemShow)
						.parents(menuParentRoot).find(menuTitleRoot).removeClass(menuTitleClose).addClass(menuTitleOpen)
						.parents(menuParentRoot).find(menuItemsRoot).removeClass(menuItemsHide).addClass(menuItemsShow)
					;
				}
				///else $(this).removeClass(menuItemShow);
			});
		}
	};

	init();
};
