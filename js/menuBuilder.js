
function MenuBuilder (elementSelector){
	'use strict';

   	var _mainMenuElement = document.querySelector(elementSelector);

   	var getMenuData = function (file, callback) {   

   	    var xobj = new XMLHttpRequest();
   	    xobj.overrideMimeType("application/json");
   	    xobj.open('GET', file, true); 
   	    xobj.onreadystatechange = function () {
   	          if (xobj.readyState == 4 && xobj.status == "200") {
   	            callback(xobj.responseText);
   	          }
   	    };
   	    xobj.send(null);  
   	 };
   	 

	var buildMenuItems = function (menuData) {

		var menuItemsLength = menuData.length,
			subMenuList,
			subMenuParent,
			hasSubMenu;

		for(var i = 0; i < menuItemsLength; i +=1) {

			hasSubMenu = Boolean(!menuData[i].leaf && menuData[i].menu !== null);
			
			if(hasSubMenu){
				subMenuList = menuData[i].menu;
				subMenuParent = createMenuItem(menuData[i]);
				
				subMenuParent.appendChild( createSubMenuList(subMenuList) );
				addToMainMenu( subMenuParent );

			} else {
				addToMainMenu( createMenuItem(menuData[i]) );
			}
		}
	};
	

	var addToMainMenu = function(element) {
		_mainMenuElement.appendChild(element);
	};

	var updatePageContent = function (content) {
		
		var contentNode = document.createElement('p');
		var text = document.createTextNode(content);
		var pageContentNode = document.querySelector('.page-content');

		contentNode.appendChild(text);

		pageContentNode.innerHTML='';
		pageContentNode.appendChild(contentNode);
	};


	var createSubMenuList = function (menuItems) {

		var subMenuList = document.createElement('ul'),
			subMenuListLength = menuItems.length;

			subMenuList.className = "sub-menu";

		for(var j = 0; j < subMenuListLength; j += 1){
			subMenuList.appendChild( createMenuItem(menuItems[j]) );
		}

		return subMenuList;
	};


	var createMenuItem = function (menuItemInfo) {

		var menuLi = document.createElement('li');
		var menuLink = document.createElement('a');
		var menuLinkText = document.createTextNode(menuItemInfo.description || '');
		var cssClass = menuItemInfo.cssClass + ' menu-link'; 
		var linkHref = menuItemInfo.link || '#';
		var linkId = menuItemInfo.id || 'defaultId';
		var linkDataContent = menuItemInfo.content || 'No content available';

			if(!menuItemInfo.leaf) {
				menuLi.className = 'js-has-sub-menu';
			}

			menuLink.id = linkId;
			menuLink.className = cssClass;
			menuLink.href = linkHref;
			menuLink.setAttribute('data-content', linkDataContent);

			menuLink.appendChild(menuLinkText);
			menuLi.appendChild(menuLink);

		return menuLi;
	};


	var menuLinkClickHandler = function (menuItemClicked) {

		var menuLinks = document.querySelectorAll('.menu-link');

		for(var i = 0; i < menuLinks.length; i += 1) {
			
			menuLinks[i].addEventListener('click', function (event) {

				disableDefaultClickBehaviour(event);
				removeClassFromMenuLinks();

				var menuLinkClicked = event.target;
				var isSubMenuLink = menuLinkClicked.parentNode.classList.contains('js-has-sub-menu'); 
				var menuLinkContent;

				if(isSubMenuLink) {
					toggleClass(menuLinkClicked.nextElementSibling, 'is-open');
				} else {
					menuLinkContent = menuLinkClicked.getAttribute('data-content'); 
					toggleClass(menuLinkClicked, 'is-selected');
					updatePageContent(menuLinkContent);
				}
			});
		}
	};	

	var removeClassFromMenuLinks = function () {

		var allMenuLinks = document.querySelectorAll('.menu-link');

		for( var i = 0; i < allMenuLinks.length; i += 1) {
			allMenuLinks[i].classList.remove('is-selected');
		}
	};

	var disableDefaultClickBehaviour = function(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
	};


	var toggleClass = function(target,className) {
		target.classList.toggle(className);
	};


	var init = function (url) {
		
		getMenuData(url, function(response) {
	    	var menuData = JSON.parse(response);
	    	
	    	buildMenuItems(menuData.menu);
			menuLinkClickHandler();
	    });
	};

	return {
		init: init
	};
}