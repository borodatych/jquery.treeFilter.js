$.expr[':'].containsText = function(obj, index, meta, stack){
	return $(obj).text().toLowerCase().indexOf(meta[3].toLowerCase()) >= 0;
};
$.fn.treeFilter = function(options) {
	var el = this;
	var defaults = {
		subMenu: '.tf-submenu',
		subMenuText: '.tf-submenu-text',

		openClass: 'tf-open',
		closeClass: 'tf-close',

		subMenuDiv: '.tf-submenu-div',

		menuItem: '.tf-item',
		menuItemText: '.tf-item-text',
		hideClass: 'tf-hide',
		showClass: 'tf-show',

		resultClass: 'tf-result',

		searcher : null, /// Search Input Field
		searchWithMenuText: true /// Search in Menu Label Items \ Default Only Menu Items Link Label
	};

	/// Public Variables
	var plugin = {};
	var status = []; // save folder status for "var memory"

	plugin.settings = {};

	/// Main Function
	var init = function() {
		plugin.settings = $.extend({}, defaults, options);
		plugin.el = el;

		if( plugin.settings.searcher ) searcher();
	};

	/// PUBLIC METHOD
	///plugin.openAll = function() { plugin.el.find("li"+plugin.settings.subMenu).addClass(plugin.settings.openClass); };
	///plugin.closeAll = function() { plugin.el.find("li"+plugin.settings.subMenu).removeClass(plugin.settings.openClass); };

	/// PRIVATE FUNCTION
	/** Fired when type on search input field */
	var searcher = function() {
		let menuItem = plugin.settings.menuItem;
		let menuItemText = plugin.settings.menuItemText;

		let subMenu = plugin.settings.subMenu;
		let subMenuText = plugin.settings.subMenuText;

		let clearTags = function(){
			plugin.el.find("."+plugin.settings.resultClass).removeClass(plugin.settings.resultClass);
			plugin.el.find(menuItem+"."+plugin.settings.hideClass).removeClass(plugin.settings.hideClass).addClass(plugin.settings.showClass);
			plugin.el.find(subMenu+"."+plugin.settings.hideClass).removeClass(plugin.settings.hideClass).addClass(plugin.settings.showClass);
		};
		$(plugin.settings.searcher).keyup(function(){
			let search = $(this).val();
			if( search.length === 0 ){
				memory("out",subMenu);
				clearTags();
			}
			else{
				/// Remove Tags
				plugin.el.find("."+plugin.settings.resultClass).removeClass(plugin.settings.resultClass);

				/// Items Hide
				plugin.el.find(menuItem+"."+plugin.settings.showClass).removeClass(plugin.settings.showClass).addClass(plugin.settings.hideClass);

				/// SubMenu Close
				plugin.el
					.find(subMenu+"."+plugin.settings.openClass).removeClass(plugin.settings.openClass).addClass(plugin.settings.closeClass)
					.find(plugin.settings.subMenuDiv).hide()
				;
				/// SubMenu Hide
				plugin.el
					.find(subMenu+"."+plugin.settings.showClass).removeClass(plugin.settings.showClass).addClass(plugin.settings.hideClass);

				/// Items Show by Search Input
				plugin.el
					.find(menuItemText+":containsText('" + search + "')")
					.parents(menuItem).removeClass(plugin.settings.hideClass).addClass(plugin.settings.showClass).addClass(plugin.settings.resultClass)
				;

				/// SubMenu Open/Show by Search Input
				if( plugin.settings.searchWithMenuText ){
					plugin.el
						.find(subMenuText+":containsText('" + search + "')")
						.parents(subMenu)
						.removeClass(plugin.settings.closeClass).addClass(plugin.settings.openClass)
						.removeClass(plugin.settings.hideClass).addClass(plugin.settings.showClass)
						.addClass(plugin.settings.resultClass)
						.find(plugin.settings.subMenuDiv).show()
						.find(menuItem).removeClass(plugin.settings.hideClass).addClass(plugin.settings.showClass)
					;
				}

				/// SubMenu Open/Show by Search Items
				$(menuItem+"."+plugin.settings.resultClass)
					.parents(subMenu).removeClass(plugin.settings.closeClass).addClass(plugin.settings.openClass).removeClass(plugin.settings.hideClass).addClass(plugin.settings.showClass)
					.find(plugin.settings.subMenuDiv).show()
				;

				/// Items Show by Search SubMenu
				if( plugin.settings.searchWithMenuText ){
					$(subMenu+"."+plugin.settings.resultClass).find(menuItem).removeClass(plugin.settings.hideClass).addClass(plugin.settings.showClass);
				}
			}
		}).keydown(function() {
			if( $(this).val().length === 0 ){
				memory("in",subMenu);
				clearTags();
			}
		}).change(function() {
			if( $(this).val().length === 0 ){
				memory("in",subMenu);
				clearTags();
			}
			else $(this).trigger('keyup')
		});
	};
	/**
	 * Save current status of folder
	 * action : string "in" / "out"
	 * array : array that saves current status
	 * list : el
	 * */
	var memory = function(action,items) {
		if( action === "in" ){
			status = [];
			plugin.el.find(items).each(function() {
				status.push( $(this).hasClass(plugin.settings.openClass) );
			});
		}
		else if ( action === "out" ){
			plugin.el.find(items).each(function(i){
				if( status[i] ){
					$(this).addClass(plugin.settings.openClass);
				}
				else{
					$(this).removeClass(plugin.settings.openClass);
				}
			});
		}
	};

	init();
};
