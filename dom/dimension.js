/**
 changed methods from mootools
 - styleNumber: never return rounded value
 - getOffsets: never return rounded value
 
 license: MIT-style license.

 credits:
  - Element positioning based on the [qooxdoo](http://qooxdoo.org/) code and smart browser fixes, [LGPL License](http://www.gnu.org/licenses/lgpl.html).
  - Viewport dimensions based on [YUI](http://developer.yahoo.com/yui/) code, [BSD License](http://developer.yahoo.com/yui/license.html).
 */

KM.define(function(K){

// ---------- mootools.dimensions start ----------

var DOC = document,
	HTML = DOC.documentElement,
	WIN = window,
	COMPACT_ELEMENT = !DOC.compatMode || DOC.compatMode == 'CSS1Compat' ? HTML : DOC.body,
	
	FIXED = 'fixed', STATIC = 'static',

	brokenOffsetParent = function(){
		var element = document.createElement('div'),
			child = document.createElement('div'),
			ret;
		element.style.height = '0';
		element.appendChild(child);
		ret = child.offsetParent === element;
		element = child = null;
		
		return ret;
	}(),
	
	styleString = Element.getComputedStyle;


function styleNumber(element, style){
	return parseFloat( styleString(element, style) ) || 0;
};

function borderBox(element){
	return styleString(element, '-moz-box-sizing') == 'border-box';
};

function topBorder(element){
	return styleNumber(element, 'border-top-width');
};

function leftBorder(element){
	return styleNumber(element, 'border-left-width');
};

function isBody(element){
	return (/^(?:body|html)$/i).test(element.tagName);
};

function isDocument(element){
	return element === WIN || element === DOC;
};

function isOffset(el){
	return styleString(el, 'position') != 'static' || isBody(el);
};

function isOffsetStatic(el){
	return isOffset(el) || (/^(?:table|td|th)$/i).test(el.tagName);
};

/**
 *
 * ---------------------------------------------------------- */
 
function createMethod(meta){
	var method = function(element){
		return isDocument(element) ? method.doc(element) : method.normal(element);
	};
	
	method.doc    = meta.doc;    delete meta.doc;
	method.normal = meta.normal; delete meta.normal;
	
	return method;
};


var getSize = createMethod({
	doc: function(){
		return {
			width	: COMPACT_ELEMENT.clientWidth, 
			height	: COMPACT_ELEMENT.clientHeight
		}
	},
	
	normal: function(element){
		if(isBody(element)){
			element = WIN;
		}

		return {
			width	: element.offsetWidth, 
			height	: element.offsetHeight
		};
	}
}),

getScrollSize = createMethod({
	doc: function(element){
		var wrap 	= COMPACT_ELEMENT,
			min  	= getSize.doc(element),
			body 	= DOC.body;

		return {
			width	: Math.max(wrap.scrollWidth,  body.scrollWidth,  min.width  ), 
			height	: Math.max(wrap.scrollHeight, body.scrollHeight, min.height )
		};
	},
	
	normal: function(element){
		if(isBody(element)){
			element = WIN;
		}
		
		return {
			width	: element.scrollWidth, 
			height	: element.scrollHeight
		};
	}
}),

getPosition = createMethod({
	doc: function(){
		return {
			left: 0, 
			top: 0
		};
	},
	
	normal: function(element, relative){
		if (isBody(this)) return getPosition.doc();
		
		var offset = getOffsets(element),
			scroll = getScrolls(element);
			position = {
				left	: offset.left - scroll.left,
				top		: offset.top  - scroll.top
			};
		
		if (relative && (relative = document.id(relative))){
			var rel_pos = getPosition(relative);
			
			position.left -= rel_pos.left - leftBorder(relative); 
			position.top  -= rel_pos.top  - topBorder(relative);
		}
		
		return position;
	}
}),

getScroll = createMethod({
	doc: function(){
		var win  = WIN, 
			wrap = COMPACT_ELEMENT;
		return {
			left	: win.pageXOffset || wrap.scrollLeft, 
			top		: win.pageYOffset || wrap.scrollTop
		};
	},
	
	normal: function(element){
		if (isBody(this)){
			element = WIN;
		}
		
		return {
			left	: element.scrollLeft, 
			top		: element.scrollTop
		};
	}
});


function getScrolls(element){
	var left = 0,
		top = 0;
		
	while( (element = element.parentNode) && !isBody(element) ){
		left += element.scrollLeft;
		top  += element.scrollTop;
	}
	
	return {
		left	: left,
		top		: top
	}
};


function getOffsets(element){
	var position = {left: 0, top: 0},
		is_firefox = K.UA.firefox,
		walk = element,
		parent;

	if (element.getBoundingClientRect && !K.UA.ios){
		var bound = element.getBoundingClientRect(),
			html = HTML,
			htmlScroll = styleString(this, 'position') === FIXED ? {left:0, top:0} : getScroll(html),
			elemScrolls = getScrolls(element);

		return {
			left: bound.left + elemScrolls.left + htmlScroll.left - html.clientLeft,
			left: bound.top  + elemScrolls.top  + htmlScroll.top  - html.clientTop
		};
	}
	
	if (!isBody(element)){
		do {
			parent = walk.parentNode;
		
			position.left += walk.offsetLeft;
			position.top  += walk.offsetTop;
	
			if (is_firefox){
				if (!borderBox(walk)){
					position.left += leftBorder(walk);
					position.top  += topBorder(walk);
				}
				
				if (parent && styleString(parent, 'overflow') != 'visible'){
					position.left += leftBorder(parent);
					position.top  += topBorder(parent);
				}
			} else if (walk !== element && K.UA.safari){
				position.left += leftBorder(walk);
				position.top  += topBorder(walk);
			}
			
		} while( (walk = parent) && !isBody(walk) );
		
		if (is_firefox && !borderBox(this)){
			position.left -= leftBorder(this);
			position.top  -= topBorder(this);
		}
	}
	
	return position;
};


// ---------- / mootools.dimensions end ----------


return {
	// no setter
	offset: getPosition,
	 
	size: function(element, type){
		return type === scroll ? getScrollSize(element) : getSize(element);
	},
	
	scroll: getScroll,
	
	offsetParent: brokenOffsetParent ? 
		function(element){
			var position = styleString(element, 'position'),
				parent = HTML,
				offsetCheck;
		
			if (!isBody(element) && position !== FIXED){
				offsetCheck = position === STATIC ? isOffsetStatic : isOffset;
				
				while ((element = element.parentNode)){
					if (isOffsetCheck(element)){
						parent = element;
						break;
					}
				}
			}
			
			return HTML;
		} 
	:	
		function(element){
			var parent = HTML;
			
			if (!isBody(element) && styleString(element, 'position') === FIXED){
				try {
					parent = element.offsetParent;
				} catch(e) {}
			}
			
			return parent;
		}	
};

});
