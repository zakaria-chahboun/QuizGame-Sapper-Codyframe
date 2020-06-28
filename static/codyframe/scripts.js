// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	if (el.classList) el.classList.add(classList[0]);
 	else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.remove(classList[0]);	
	else if(Util.hasClass(el, classList[0])) {
		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
		el.className=el.className.replace(reg, ' ');
	}
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    var val = parseInt((progress/duration)*change + start);
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
        window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */
(function() {
  // make focus ring visible only for keyboard navigation (i.e., tab key) 
  var focusTab = document.getElementsByClassName('js-tab-focus');
  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusTabs(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusTabs(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
  };

  function resetFocusTabs(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };
  window.addEventListener('mousedown', detectClick);
}());
// File#: _1_accordion
// Usage: codyhouse.co/license
(function() {
	var Accordion = function(element) {
		this.element = element;
		this.items = Util.getChildrenByClassName(this.element, 'js-accordion__item');
		this.version = this.element.getAttribute('data-version') ? '-'+this.element.getAttribute('data-version') : '';
		this.showClass = 'accordion'+this.version+'__item--is-open';
		this.animateHeight = (this.element.getAttribute('data-animation') == 'on');
		this.multiItems = !(this.element.getAttribute('data-multi-items') == 'off'); 
		this.initAccordion();
	};

	Accordion.prototype.initAccordion = function() {
		//set initial aria attributes
		for( var i = 0; i < this.items.length; i++) {
			var button = this.items[i].getElementsByTagName('button')[0],
				content = this.items[i].getElementsByClassName('js-accordion__panel')[0],
				isOpen = Util.hasClass(this.items[i], this.showClass) ? 'true' : 'false';
			Util.setAttributes(button, {'aria-expanded': isOpen, 'aria-controls': 'accordion-content-'+i, 'id': 'accordion-header-'+i});
			Util.addClass(button, 'js-accordion__trigger');
			Util.setAttributes(content, {'aria-labelledby': 'accordion-header-'+i, 'id': 'accordion-content-'+i});
		}

		//listen for Accordion events
		this.initAccordionEvents();
	};

	Accordion.prototype.initAccordionEvents = function() {
		var self = this;

		this.element.addEventListener('click', function(event) {
			var trigger = event.target.closest('.js-accordion__trigger');
			//check index to make sure the click didn't happen inside a children accordion
			if( trigger && Util.getIndexInArray(self.items, trigger.parentElement) >= 0) self.triggerAccordion(trigger);
		});
	};

	Accordion.prototype.triggerAccordion = function(trigger) {
		var self = this;
		var bool = (trigger.getAttribute('aria-expanded') === 'true');

		this.animateAccordion(trigger, bool);
	};

	Accordion.prototype.animateAccordion = function(trigger, bool) {
		var self = this;
		var item = trigger.closest('.js-accordion__item'),
			content = item.getElementsByClassName('js-accordion__panel')[0],
			ariaValue = bool ? 'false' : 'true';

		if(!bool) Util.addClass(item, this.showClass);
		trigger.setAttribute('aria-expanded', ariaValue);
		self.resetContentVisibility(item, content, bool);

		if( !this.multiItems && !bool) this.closeSiblings(item);
	};

	Accordion.prototype.resetContentVisibility = function(item, content, bool) {
		Util.toggleClass(item, this.showClass, !bool);
		content.removeAttribute("style");
		if(bool && !this.multiItems) { // accordion item has been closed -> check if there's one open to move inside viewport 
			this.moveContent();
		}
	};

	Accordion.prototype.closeSiblings = function(item) {
		//if only one accordion can be open -> search if there's another one open
		var index = Util.getIndexInArray(this.items, item);
		for( var i = 0; i < this.items.length; i++) {
			if(Util.hasClass(this.items[i], this.showClass) && i != index) {
				this.animateAccordion(this.items[i].getElementsByClassName('js-accordion__trigger')[0], true);
				return false;
			}
		}
	};

	Accordion.prototype.moveContent = function() { // make sure title of the accordion just opened is inside the viewport
		var openAccordion = this.element.getElementsByClassName(this.showClass);
		if(openAccordion.length == 0) return;
		var boundingRect = openAccordion[0].getBoundingClientRect();
		if(boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
			var windowScrollTop = window.scrollY || document.documentElement.scrollTop;
			window.scrollTo(0, boundingRect.top + windowScrollTop);
		}
	};

	window.Accordion = Accordion;
	
	//initialize the Accordion objects
	var accordions = document.getElementsByClassName('js-accordion');
	if( accordions.length > 0 ) {
		for( var i = 0; i < accordions.length; i++) {
			(function(i){new Accordion(accordions[i]);})(i);
		}
	}
}());
// File#: _1_alert
// Usage: codyhouse.co/license
(function() {
	var alertClose = document.getElementsByClassName('js-alert__close-btn');
	if( alertClose.length > 0 ) {
		for( var i = 0; i < alertClose.length; i++) {
			(function(i){initAlertEvent(alertClose[i]);})(i);
		}
	};
}());

function initAlertEvent(element) {
	element.addEventListener('click', function(event){
		event.preventDefault();
		Util.removeClass(element.closest('.js-alert'), 'alert--is-visible');
	});
};
// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function() {
	var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
	if( menuBtns.length > 0 ) {
		for(var i = 0; i < menuBtns.length; i++) {(function(i){
			initMenuBtn(menuBtns[i]);
		})(i);}

		function initMenuBtn(btn) {
			btn.addEventListener('click', function(event){	
				event.preventDefault();
				var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
				Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
				// emit custom event
				var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
				btn.dispatchEvent(event);
			});
		};
	}
}());
// File#: _1_choice-accordion
// Usage: codyhouse.co/license
(function() {
  var ChoiceAccordion = function(element) {
    this.element = element;
    this.btns = this.element.getElementsByClassName('js-choice-accordion__btn');
    this.inputs = getChoiceInput(this);
    this.contents = getChoiceContent(this);
    this.isRadio = this.inputs[0].type == 'radio';
    this.animateHeight = (this.element.getAttribute('data-animation') == 'on');
    initAccordion(this);
    resetCheckedStatus(this, false); // set initial classes
    initChoiceAccordionEvent(this); // add listeners
  };

  function getChoiceInput(element) { // store input elements in an object property
    var inputs = [],
      fallbacks = element.element.getElementsByClassName('js-choice-accordion__fallback');
    for(var i = 0; i < fallbacks.length; i++) {
      inputs.push(fallbacks[i].getElementsByTagName('input')[0]);
    }
    return inputs;
  }

  function getChoiceContent(element) { // store content elements in an object property
    var contents = [];
    for(var i = 0; i < element.btns.length; i++) {
      var content = Util.getChildrenByClassName(element.btns[i].parentNode, 'js-choice-accordion__panel');
      if(content.length > 0 ) contents.push(content[0]);
      else  contents.push(false);
    }
    return contents;
  }

  function initAccordion(element) { //set initial aria attributes
		for( var i = 0; i < element.inputs.length; i++) {
      if(!element.contents[i]) return; // no content to trigger
      var isOpen = element.inputs[i].checked,
        id = element.inputs[i].getAttribute('id');
      if(!id) id = 'choice-accordion-header-'+i;
      
      Util.setAttributes(element.inputs[i], {'aria-expanded': isOpen, 'aria-controls': 'choice-accordion-content-'+i, 'id': id});
      Util.setAttributes(element.contents[i], {'aria-labelledby': id, 'id': 'choice-accordion-content-'+i});
      Util.toggleClass(element.contents[i], 'is-hidden', !isOpen);
		}
  };

  function initChoiceAccordionEvent(choiceAcc) {
    choiceAcc.element.addEventListener('click', function(event){ // update status on click
      if(Util.getIndexInArray(choiceAcc.inputs, event.target) > -1) return; // triggered by change in input element -> will be detected by the 'change' event

      var selectedBtn = event.target.closest('.js-choice-accordion__btn');
      if(!selectedBtn) return;
      
      var index = Util.getIndexInArray(choiceAcc.btns, selectedBtn);
      if(choiceAcc.isRadio && choiceAcc.inputs[index].checked) { // radio input already checked
        choiceAcc.inputs[index].focus(); // move focus to input element
        return; 
      }

      choiceAcc.inputs[index].checked = !choiceAcc.inputs[index].checked;
      choiceAcc.inputs[index].dispatchEvent(new CustomEvent('change')); // trigger change event
      choiceAcc.inputs[index].focus(); // move focus to input element
    });

    for(var i = 0; i < choiceAcc.btns.length; i++) {(function(i){ // change + focus events
      choiceAcc.inputs[i].addEventListener('change', function(event){
        choiceAcc.isRadio ? resetCheckedStatus(choiceAcc, true) : resetSingleStatus(choiceAcc, i, true);
      });

      choiceAcc.inputs[i].addEventListener('focus', function(event){
        resetFocusStatus(choiceAcc, i, true);
      });

      choiceAcc.inputs[i].addEventListener('blur', function(event){
        resetFocusStatus(choiceAcc, i, false);
      });
    })(i);}
  };

  function resetCheckedStatus(choiceAcc, bool) {
    for(var i = 0; i < choiceAcc.btns.length; i++) {
      resetSingleStatus(choiceAcc, i, bool);
    }
  };

  function resetSingleStatus(choiceAcc, index, bool) { // toggle .choice-accordion__btn--checked class
    Util.toggleClass(choiceAcc.btns[index], 'choice-accordion__btn--checked', choiceAcc.inputs[index].checked);
    if(bool) resetSingleContent(choiceAcc, index, choiceAcc.inputs[index].checked); // no need to run this when component is initialized
  };

  function resetFocusStatus(choiceAcc, index, bool) { // toggle .choice-accordion__btn--focus class
    Util.toggleClass(choiceAcc.btns[index], 'choice-accordion__btn--focus', bool);
  };

  function resetSingleContent(choiceAcc, index, bool) { // show accordion content
    var input = choiceAcc.inputs[index],
      content = choiceAcc.contents[index];

		if(bool && content) Util.removeClass(content, 'is-hidden');
		input.setAttribute('aria-expanded', bool);

		if(choiceAcc.animateHeight && content) {
			//store initial and final height - animate accordion content height
			var initHeight = !bool ? content.offsetHeight: 0,
				finalHeight = !bool ? 0 : content.offsetHeight;
    }

		if(window.requestAnimationFrame && choiceAcc.animateHeight && !reducedMotion && content) {
			Util.setHeight(initHeight, finalHeight, content, 200, function(){
				resetContentVisibility(content, bool);
			});
		} else {
			resetContentVisibility(content, bool);
		}
  };

	function resetContentVisibility(content, bool) {
    if(!content) return;
		Util.toggleClass(content, 'is-hidden', !bool);
		content.removeAttribute("style");
	};

  //initialize the ChoiceAccordions objects
  var choiceAccordion = document.getElementsByClassName('js-choice-accordion'),
    reducedMotion = Util.osHasReducedMotion();
	if( choiceAccordion.length > 0 ) {
		for( var i = 0; i < choiceAccordion.length; i++) {
			(function(i){new ChoiceAccordion(choiceAccordion[i]);})(i);
		}
	};
}());
// File#: _1_circular-progress-bar
// Usage: codyhouse.co/license
(function() {	
  var CProgressBar = function(element) {
    this.element = element;
    this.fill = this.element.getElementsByClassName('c-progress-bar__fill')[0];
    this.fillLength = getProgressBarFillLength(this);
    this.label = this.element.getElementsByClassName('js-c-progress-bar__value');
    this.value = parseInt(this.element.getAttribute('data-progress'));
    // before checking if data-animation is set -> check for reduced motion
    updatedProgressBarForReducedMotion(this);
    this.animate = this.element.hasAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on';
    this.animationDuration = this.element.hasAttribute('data-duration') ? this.element.getAttribute('data-duration') : 1000;
    // animation will run only on browsers supporting IntersectionObserver
    this.canAnimate = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    // this element is used to announce the percentage value to SR
    this.ariaLabel = this.element.getElementsByClassName('js-c-progress-bar__aria-value');
    // check if we need to update the bar color
    this.changeColor =  Util.hasClass(this.element, 'c-progress-bar--color-update') && Util.cssSupports('color', 'var(--color-value)');
    if(this.changeColor) {
      this.colorThresholds = getProgressBarColorThresholds(this);
    }
    initProgressBar(this);
    // store id to reset animation
    this.animationId = false;
  };

  // public function
  CProgressBar.prototype.setProgressBarValue = function(value) {
    setProgressBarValue(this, value);
  };

  function getProgressBarFillLength(progressBar) {
    return parseFloat(2*Math.PI*progressBar.fill.getAttribute('r')).toFixed(2);
  };

  function getProgressBarColorThresholds(progressBar) {
    var thresholds = [];
    var i = 1;
    while (!isNaN(parseInt(getComputedStyle(progressBar.element).getPropertyValue('--c-progress-bar-color-'+i)))) {
      thresholds.push(parseInt(getComputedStyle(progressBar.element).getPropertyValue('--c-progress-bar-color-'+i)));
      i = i + 1;
    }
    return thresholds;
  };

  function updatedProgressBarForReducedMotion(progressBar) {
    // if reduced motion is supported and set to reduced -> remove animations
    if(osHasReducedMotion) progressBar.element.removeAttribute('data-animation');
  };

  function initProgressBar(progressBar) {
    // set shape initial dashOffset
    setShapeOffset(progressBar);
    // set initial bar color
    if(progressBar.changeColor) updateProgressBarColor(progressBar, progressBar.value);
    // if data-animation is on -> reset the progress bar and animate when entering the viewport
    if(progressBar.animate && progressBar.canAnimate) animateProgressBar(progressBar);
    else setProgressBarValue(progressBar, progressBar.value);
    // reveal fill and label -> --animate and --color-update variations only
    setTimeout(function(){Util.addClass(progressBar.element, 'c-progress-bar--init');}, 30);

    // dynamically update value of progress bar
    progressBar.element.addEventListener('updateProgress', function(event){
      // cancel request animation frame if it was animating
      if(progressBar.animationId) window.cancelAnimationFrame(progressBar.animationId);
      
      var final = event.detail.value,
        duration = (event.detail.duration) ? event.detail.duration : progressBar.animationDuration;
      var start = getProgressBarValue(progressBar);
      // trigger update animation
      updateProgressBar(progressBar, start, final, duration, function(){
        emitProgressBarEvents(progressBar, 'progressCompleted', progressBar.value+'%');
        // update value of label for SR
        if(progressBar.ariaLabel.length > 0) progressBar.ariaLabel[0].textContent = final+'%';
      });
    });
  }; 

  function setShapeOffset(progressBar) {
    var center = progressBar.fill.getAttribute('cx');
    progressBar.fill.setAttribute('transform', "rotate(-90 "+center+" "+center+")");
    progressBar.fill.setAttribute('stroke-dashoffset', progressBar.fillLength);
    progressBar.fill.setAttribute('stroke-dasharray', progressBar.fillLength);
  };

  function animateProgressBar(progressBar) {
    // reset inital values
    setProgressBarValue(progressBar, 0);
    
    // listen for the element to enter the viewport -> start animation
    var observer = new IntersectionObserver(progressBarObserve.bind(progressBar), { threshold: [0, 0.1] });
    observer.observe(progressBar.element);
  };

  function progressBarObserve(entries, observer) { // observe progressBar position -> start animation when inside viewport
    var self = this;
    if(entries[0].intersectionRatio.toFixed(1) > 0 && !this.animationTriggered) {
      updateProgressBar(this, 0, this.value, this.animationDuration, function(){
        emitProgressBarEvents(self, 'progressCompleted', self.value+'%');
      });
    }
  };

  function setProgressBarValue(progressBar, value) {
    var offset = ((100 - value)*progressBar.fillLength/100).toFixed(2);
    progressBar.fill.setAttribute('stroke-dashoffset', offset);
    if(progressBar.label.length > 0 ) progressBar.label[0].textContent = value;
    if(progressBar.changeColor) updateProgressBarColor(progressBar, value);
  };

  function updateProgressBar(progressBar, start, to, duration, cb) {
    var change = to - start,
      currentTime = null;

    var animateFill = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      var val = parseInt((progress/duration)*change + start);
      // make sure value is in correct range
      if(change > 0 && val > to) val = to;
      if(change < 0 && val < to) val = to;

      setProgressBarValue(progressBar, val);
      if(progress < duration) {
        progressBar.animationId = window.requestAnimationFrame(animateFill);
      } else {
        progressBar.animationId = false;
        cb();
      }
    };
    if ( window.requestAnimationFrame && !osHasReducedMotion ) {
      progressBar.animationId = window.requestAnimationFrame(animateFill);
    } else {
      setProgressBarValue(progressBar, to);
      cb();
    }
  };

  function updateProgressBarColor(progressBar, value) {
    var className = 'c-progress-bar--fill-color-'+ progressBar.colorThresholds.length;
    for(var i = progressBar.colorThresholds.length; i > 0; i--) {
      if( !isNaN(progressBar.colorThresholds[i - 1]) && value <= progressBar.colorThresholds[i - 1]) {
        className = 'c-progress-bar--fill-color-' + i;
      } 
    }
    
    removeProgressBarColorClasses(progressBar);
    Util.addClass(progressBar.element, className);
  };

  function removeProgressBarColorClasses(progressBar) {
    var classes = progressBar.element.className.split(" ").filter(function(c) {
      return c.lastIndexOf('c-progress-bar--fill-color-', 0) !== 0;
    });
    progressBar.element.className = classes.join(" ").trim();
  };

  function getProgressBarValue(progressBar) {
    return (100 - Math.round((parseFloat(progressBar.fill.getAttribute('stroke-dashoffset'))/progressBar.fillLength)*100));
  };

  function emitProgressBarEvents(progressBar, eventName, detail) {
    progressBar.element.dispatchEvent(new CustomEvent(eventName, {detail: detail}));
  };

  window.CProgressBar = CProgressBar;

  //initialize the CProgressBar objects
  var circularProgressBars = document.getElementsByClassName('js-c-progress-bar');
  var osHasReducedMotion = Util.osHasReducedMotion();
  if( circularProgressBars.length > 0 ) {
    for( var i = 0; i < circularProgressBars.length; i++) {
      (function(i){new CProgressBar(circularProgressBars[i]);})(i);
    }
  }
}());
// File#: _1_countdown
// Usage: codyhouse.co/license
(function() {
  var CountDown = function(element) {
    this.element = element;
    this.labels = this.element.getAttribute('data-labels') ? this.element.getAttribute('data-labels').split(',') : [];
    this.intervalId;
    //create countdown HTML
    this.createCountDown();
    //store time elements
    this.days = this.element.getElementsByClassName('js-countdown__value--0')[0];
    this.hours = this.element.getElementsByClassName('js-countdown__value--1')[0];
    this.mins = this.element.getElementsByClassName('js-countdown__value--2')[0];
    this.secs = this.element.getElementsByClassName('js-countdown__value--3')[0];
    this.endTime = this.getEndTime();
    //init counter
    this.initCountDown();
  };

  CountDown.prototype.createCountDown = function() {
    var wrapper = document.createElement("div");
    Util.setAttributes(wrapper, {'aria-hidden': 'true', 'class': 'countdown__timer'});

    for(var i = 0; i < 4; i++) {
      var timeItem = document.createElement("span"),
        timeValue = document.createElement("span"),
        timeLabel = document.createElement('span');
      
      timeItem.setAttribute('class', 'countdown__item');
      timeValue.setAttribute('class', 'countdown__value countdown__value--'+i+' js-countdown__value--'+i);
      timeItem.appendChild(timeValue);

      if( this.labels && this.labels.length > 0 ) {
        timeLabel.textContent = this.labels[i].trim();
        timeLabel.setAttribute('class', 'countdown__label');
        timeItem.appendChild(timeLabel);
      }
      
      wrapper.appendChild(timeItem);
    }
    // append new content to countdown element
    this.element.insertBefore(wrapper, this.element.firstChild);
    // this.element.appendChild(wrapper);
  };

  CountDown.prototype.getEndTime = function() {
    // get number of remaining seconds 
    if(this.element.getAttribute('data-timer')) return Number(this.element.getAttribute('data-timer'))*1000 + new Date().getTime();
    else if(this.element.getAttribute('data-countdown')) return Number(new Date(this.element.getAttribute('data-countdown')).getTime());
  };

  CountDown.prototype.initCountDown = function() {
    var self = this;
    this.intervalId = setInterval(function(){
      self.updateCountDown(false);
    }, 1000);
    this.updateCountDown(true);
  };
  
  CountDown.prototype.updateCountDown = function(bool) {
    // original countdown function
    // https://gist.github.com/adriennetacke/f5a25c304f1b7b4a6fa42db70415bad2
    var time = parseInt( (this.endTime - new Date().getTime())/1000 ),
      days = 0,
      hours = 0,
      mins = 0,
      seconds = 0;

    if(isNaN(time) || time < 0) {
      clearInterval(this.intervalId);
      this.emitEndEvent();
    } else {
      days = parseInt(time / 86400);
      time = (time % 86400);
      hours = parseInt(time / 3600);
      time = (time % 3600);
      mins = parseInt(time / 60);
      time = (time % 60);
      seconds = parseInt(time);
    }
    
    // hide days/hours/mins if not available 
    if(bool && days == 0) this.days.parentElement.style.display = "none";
    if(bool && days == 0 && hours == 0) this.hours.parentElement.style.display = "none";
    if(bool && days == 0 && hours == 0 && mins == 0) this.mins.parentElement.style.display = "none";
    
    this.days.textContent = days;
    this.hours.textContent = this.getTimeFormat(hours);
    this.mins.textContent = this.getTimeFormat(mins);
    this.secs.textContent = this.getTimeFormat(seconds);
  };

  CountDown.prototype.getTimeFormat = function(time) {
    return ('0'+ time).slice(-2);
  };

  CountDown.prototype.emitEndEvent = function(time) {
    var event = new CustomEvent('countDownFinished');
    this.element.dispatchEvent(event);
  };

  //initialize the CountDown objects
  var countDown = document.getElementsByClassName('js-countdown');
  if( countDown.length > 0 ) {
    for( var i = 0; i < countDown.length; i++) {
      (function(i){new CountDown(countDown[i]);})(i);
    }
  }
}());
// File#: _1_countup
// Usage: codyhouse.co/license
(function() {	
	var CountUp = function(opts) {
		this.options = Util.extend(CountUp.defaults , opts);
    this.element = this.options.element;
    this.initialValue = parseFloat(this.options.initial);
    this.finalValue = parseFloat(this.element.textContent);
    this.intervalId;
    this.animationTriggered = false;
    // animation will run only on browsers supporting IntersectionObserver
    this.canAnimate = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    initCountUp(this);
  };

  CountUp.prototype.reset = function() { // reset element to its initial value
    if(!this.canAnimate) return;
    window.cancelAnimationFrame(this.intervalId);
    this.element.textContent = this.initialValue;
  };  

  CountUp.prototype.restart = function() { // restart element animation
    countUpAnimate(this);
  };

  function initCountUp(countup) {
    if(!countup.canAnimate) { // IntersectionObserver not supported
      countUpShow(countup);
      return;
    }

    // reset countUp for SR
    initCountUpSr(countup);

    // listen for the element to enter the viewport -> start animation
    var observer = new IntersectionObserver(countupObserve.bind(countup), { threshold: [0, 0.1] });
    observer.observe(countup.element);

    // listen to events
    countup.element.addEventListener('countUpReset', function(){countup.reset();});
    countup.element.addEventListener('countUpRestart', function(){countup.restart();});
  };

  function countUpShow(countup) { // reveal countup after it has been initialized
    Util.addClass(countup.element.closest('.countup'), 'countup--is-visible');
  };

  function countupObserve(entries, observer) { // observe countup position -> start animation when inside viewport
    if(entries[0].intersectionRatio.toFixed(1) > 0 && !this.animationTriggered) {
      countUpAnimate(this);
    }
  };

  function countUpAnimate(countup) { // animate countup
    countup.element.textContent = countup.initialValue;
    countUpShow(countup);
    window.cancelAnimationFrame(countup.intervalId);
    var currentTime = null;

    function runCountUp(timestamp) {
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > countup.options.duration) progress = countup.options.duration;
      var val = getValEaseOut(progress, countup.initialValue, countup.finalValue - countup.initialValue, countup.options.duration);
      countup.element.textContent = getCountUpValue(val, countup);
      if(progress < countup.options.duration) {
        countup.intervalId = window.requestAnimationFrame(runCountUp);
      } else {
        countUpComplete(countup);
      }
    };

    countup.intervalId = window.requestAnimationFrame(runCountUp);
  };

  function getCountUpValue(val, countup) { // reset new countup value to proper decimal places+separator
    if(countup.options.decimal) {val = parseFloat(val.toFixed(countup.options.decimal));}
    else {val = parseInt(val);}
    if(countup.options.separator) val = val.toLocaleString('en');
    return val;
  }

  function countUpComplete(countup) { // emit event when animation is over
    countup.element.dispatchEvent(new CustomEvent('countUpComplete'));
    countup.animationTriggered = true;
  };

  function initCountUpSr(countup) { // make sure countup is accessible
    // hide elements that will be animated to SR
    countup.element.setAttribute('aria-hidden', 'true');
    // create new element with visible final value - accessible to SR only
    var srValue = document.createElement('span');
    srValue.textContent = countup.finalValue;
    Util.addClass(srValue, 'sr-only');
    countup.element.parentNode.insertBefore(srValue, countup.element.nextSibling);
  };

  function getValEaseOut(t, b, c, d) { 
    t /= d;
    return -c * t*(t-2) + b;
  };

  CountUp.defaults = {
    element : '',
    separator : false,
    duration: 3000,
    decimal: false,
    initial: 0
  };

	window.CountUp = CountUp;

	//initialize the CountUp objects
  var countUp = document.getElementsByClassName('js-countup');
  if( countUp.length > 0 ) {
    for( var i = 0; i < countUp.length; i++) {(function(i){
    	var separator = (countUp[i].getAttribute('data-countup-sep')) ? countUp[i].getAttribute('data-countup-sep') : false,
        duration = (countUp[i].getAttribute('data-countup-duration')) ? countUp[i].getAttribute('data-countup-duration') : CountUp.defaults.duration,
        decimal = (countUp[i].getAttribute('data-countup-decimal')) ? countUp[i].getAttribute('data-countup-decimal') : false,
    		initial = (countUp[i].getAttribute('data-countup-start')) ? countUp[i].getAttribute('data-countup-start') : 0;
    	new CountUp({element: countUp[i], separator : separator, duration: duration, decimal: decimal, initial: initial});
    })(i);}
  }
}());
// File#: _1_custom-select
// Usage: codyhouse.co/license
(function() {
	// NOTE: you need the js code only when using the --custom-dropdown variation of the Custom Select component. Default version does nor require JS.
	
  var CustomSelect = function(element) {
		this.element = element;
    this.select = this.element.getElementsByTagName('select')[0];
    this.optGroups = this.select.getElementsByTagName('optgroup');
		this.options = this.select.getElementsByTagName('option');
		this.selectedOption = getSelectedOptionText(this);
		this.selectId = this.select.getAttribute('id');
		this.trigger = false;
		this.dropdown = false;
		this.customOptions = false;
		this.arrowIcon = this.element.getElementsByTagName('svg');
		this.label = document.querySelector('[for="'+this.selectId+'"]');

		this.optionIndex = 0; // used while building the custom dropdown

		initCustomSelect(this); // init markup
		initCustomSelectEvents(this); // init event listeners
  };
  
  function initCustomSelect(select) {
		// create the HTML for the custom dropdown element
		select.element.insertAdjacentHTML('beforeend', initButtonSelect(select) + initListSelect(select));
		
		// save custom elements
		select.dropdown = select.element.getElementsByClassName('js-select__dropdown')[0];
		select.trigger = select.element.getElementsByClassName('js-select__button')[0];
		select.customOptions = select.dropdown.getElementsByClassName('js-select__item');
    
    // hide default select
    Util.addClass(select.select, 'is-hidden');
		if(select.arrowIcon.length > 0 ) select.arrowIcon[0].style.display = 'none';

		// place dropdown
		placeDropdown(select);
  };

  function initCustomSelectEvents(select) {
		// option selection in dropdown
		initSelection(select);

		// click events
		select.trigger.addEventListener('click', function(){
			toggleCustomSelect(select, false);
		});
		if(select.label) {
			// move focus to custom trigger when clicking on <select> label
			select.label.addEventListener('click', function(){
				Util.moveFocus(select.trigger);
			});
		}
		// keyboard navigation
		select.dropdown.addEventListener('keydown', function(event){
			if(event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
				keyboardCustomSelect(select, 'prev', event);
			} else if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
				keyboardCustomSelect(select, 'next', event);
			}
		});
		// native <select> element has been updated -> update custom select as well
		select.element.addEventListener('select-updated', function(event){
			resetCustomSelect(select);
		});
  };

  function toggleCustomSelect(select, bool) {
    var ariaExpanded;
		if(bool) {
			ariaExpanded = bool;
		} else {
			ariaExpanded = select.trigger.getAttribute('aria-expanded') == 'true' ? 'false' : 'true';
		}
		select.trigger.setAttribute('aria-expanded', ariaExpanded);
		if(ariaExpanded == 'true') {
      var selectedOption = getSelectedOption(select);
      Util.moveFocus(selectedOption); // fallback if transition is not supported
			select.dropdown.addEventListener('transitionend', function cb(){
				Util.moveFocus(selectedOption);
				select.dropdown.removeEventListener('transitionend', cb);
			});
			placeDropdown(select); // place dropdown based on available space
		}
  };

  function placeDropdown(select) {
		// remove placement classes to reset position
		Util.removeClass(select.dropdown, 'select__dropdown--right select__dropdown--up');
		var triggerBoundingRect = select.trigger.getBoundingClientRect();
		Util.toggleClass(select.dropdown, 'select__dropdown--right', (document.documentElement.clientWidth - 5 < triggerBoundingRect.left + select.dropdown.offsetWidth));
    // check if there's enough space up or down
    var moveUp = (window.innerHeight - triggerBoundingRect.bottom - 5) < triggerBoundingRect.top;
    Util.toggleClass(select.dropdown, 'select__dropdown--up', moveUp);
    // check if we need to set a max width
		var maxHeight = moveUp ? triggerBoundingRect.top - 20 : window.innerHeight - triggerBoundingRect.bottom - 20;
		// set max-height based on available space
    select.dropdown.setAttribute('style', 'max-height: '+maxHeight+'px; width: '+triggerBoundingRect.width+'px;');
	};

  function keyboardCustomSelect(select, direction, event) { // navigate custom dropdown with keyboard
		event.preventDefault();
		var index = Util.getIndexInArray(select.customOptions, document.activeElement);
		index = (direction == 'next') ? index + 1 : index - 1;
		if(index < 0) index = select.customOptions.length - 1;
		if(index >= select.customOptions.length) index = 0;
		Util.moveFocus(select.customOptions[index]);
  };

  function initSelection(select) { // option selection
    select.dropdown.addEventListener('click', function(event){
			var option = event.target.closest('.js-select__item');
			if(!option) return;
			selectOption(select, option);
		});
	};
	
	function selectOption(select, option) {
		if(option.hasAttribute('aria-selected') && option.getAttribute('aria-selected') == 'true') {
			// selecting the same option
			select.trigger.setAttribute('aria-expanded', 'false'); // hide dropdown
		} else { 
			var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
			if(selectedOption) selectedOption.setAttribute('aria-selected', 'false');
			option.setAttribute('aria-selected', 'true');
			select.trigger.getElementsByClassName('js-select__label')[0].textContent = option.textContent;
			select.trigger.setAttribute('aria-expanded', 'false');
			// new option has been selected -> update native <select> element _ arai-label of trigger <button>
			updateNativeSelect(select, option.getAttribute('data-index'));
			updateTriggerAria(select); 
		}
		// move focus back to trigger
		select.trigger.focus();
	};

	function updateNativeSelect(select, index) {
		select.select.selectedIndex = index;
		select.select.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
	};

	function updateTriggerAria(select) {
		select.trigger.setAttribute('aria-label', select.options[select.select.selectedIndex].innerHTML+', '+select.label.textContent);
	};

  function getSelectedOptionText(select) {// used to initialize the label of the custom select button
		var label = '';
		if('selectedIndex' in select.select) {
			label = select.options[select.select.selectedIndex].text;
		} else {
			label = select.select.querySelector('option[selected]').text;
		}
		return label;

  };
  
  function initButtonSelect(select) { // create the button element -> custom select trigger
		// check if we need to add custom classes to the button trigger
		var customClasses = select.element.getAttribute('data-trigger-class') ? ' '+select.element.getAttribute('data-trigger-class') : '';

		var label = select.options[select.select.selectedIndex].innerHTML+', '+select.label.textContent;
	
    var button = '<button type="button" class="js-select__button select__button'+customClasses+'" aria-label="'+label+'" aria-expanded="false" aria-controls="'+select.selectId+'-dropdown"><span aria-hidden="true" class="js-select__label select__label">'+select.selectedOption+'</span>';
    if(select.arrowIcon.length > 0 && select.arrowIcon[0].outerHTML) {
			var clone = select.arrowIcon[0].cloneNode(true);
      Util.removeClass(clone, 'select__icon');
      button = button +clone.outerHTML;
    }
		
		return button+'</button>';

  };

  function initListSelect(select) { // create custom select dropdown
    var list = '<div class="js-select__dropdown select__dropdown" aria-describedby="'+select.selectId+'-description" id="'+select.selectId+'-dropdown">';
		list = list + getSelectLabelSR(select);
    if(select.optGroups.length > 0) {
      for(var i = 0; i < select.optGroups.length; i++) {
        var optGroupList = select.optGroups[i].getElementsByTagName('option'),
          optGroupLabel = '<li><span class="select__item select__item--optgroup">'+select.optGroups[i].getAttribute('label')+'</span></li>';
        list = list + '<ul class="select__list" role="listbox">'+optGroupLabel+getOptionsList(select, optGroupList) + '</ul>';
      }
    } else {
      list = list + '<ul class="select__list" role="listbox">'+getOptionsList(select, select.options) + '</ul>';
    }
    return list;
  };

  function getSelectLabelSR(select) {
    if(select.label) {
      return '<p class="sr-only" id="'+select.selectId+'-description">'+select.label.textContent+'</p>'
    } else {
      return '';
    }
	};
	
	function resetCustomSelect(select) {
		// <select> element has been updated (using an external control) - update custom select
		var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
		if(selectedOption) selectedOption.setAttribute('aria-selected', 'false');
		var option = select.dropdown.querySelector('.js-select__item[data-index="'+select.select.selectedIndex+'"]');
		option.setAttribute('aria-selected', 'true');
		select.trigger.getElementsByClassName('js-select__label')[0].textContent = option.textContent;
		select.trigger.setAttribute('aria-expanded', 'false');
		updateTriggerAria(select); 
	};

  function getOptionsList(select, options) {
    var list = '';
    for(var i = 0; i < options.length; i++) {
			var selected = options[i].hasAttribute('selected') ? ' aria-selected="true"' : ' aria-selected="false"';
			list = list + '<li><button type="button" class="reset js-select__item select__item select__item--option" role="option" data-value="'+options[i].value+'" '+selected+' data-index="'+select.optionIndex+'">'+options[i].text+'</button></li>';
			select.optionIndex = select.optionIndex + 1;
    };
    return list;
  };

  function getSelectedOption(select) {
    var option = select.dropdown.querySelector('[aria-selected="true"]');
    if(option) return option;
    else return select.dropdown.getElementsByClassName('js-select__item')[0];
  };

  function moveFocusToSelectTrigger(select) {
    if(!document.activeElement.closest('.js-select')) return
    select.trigger.focus();
	};
	
	function checkCustomSelectClick(select, target) { // close select when clicking outside it
		if( !select.element.contains(target) ) toggleCustomSelect(select, 'false');
  };
  
  //initialize the CustomSelect objects
	var customSelect = document.getElementsByClassName('js-select');
	if( customSelect.length > 0 ) {
		var selectArray = [];
		for( var i = 0; i < customSelect.length; i++) {
			(function(i){selectArray.push(new CustomSelect(customSelect[i]));})(i);
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
				// close custom select on 'Esc'
				selectArray.forEach(function(element){
					moveFocusToSelectTrigger(element); // if focus is within dropdown, move it to dropdown trigger
					toggleCustomSelect(element, 'false'); // close dropdown
				});
			} 
		});
		// close custom select when clicking outside it
		window.addEventListener('click', function(event){
			selectArray.forEach(function(element){
				checkCustomSelectClick(element, event.target);
			});
		});
	}
}());
// File#: _1_details
// Usage: codyhouse.co/license
(function() {
	var Details = function(element, index) {
		this.element = element;
		this.summary = this.element.getElementsByClassName('js-details__summary')[0];
		this.details = this.element.getElementsByClassName('js-details__content')[0];
		this.htmlElSupported = 'open' in this.element;
		this.initDetails(index);
		this.initDetailsEvents();
	};

	Details.prototype.initDetails = function(index) {
		// init aria attributes 
		Util.setAttributes(this.summary, {'aria-expanded': 'false', 'aria-controls': 'details--'+index, 'role': 'button'});
		Util.setAttributes(this.details, {'aria-hidden': 'true', 'id': 'details--'+index});
	};

	Details.prototype.initDetailsEvents = function() {
		var self = this;
		if( this.htmlElSupported ) { // browser supports the <details> element 
			this.element.addEventListener('toggle', function(event){
				var ariaValues = self.element.open ? ['true', 'false'] : ['false', 'true'];
				// update aria attributes when details element status change (open/close)
				self.updateAriaValues(ariaValues);
			});
		} else { //browser does not support <details>
			this.summary.addEventListener('click', function(event){
				event.preventDefault();
				var isOpen = self.element.getAttribute('open'),
					ariaValues = [];

				isOpen ? self.element.removeAttribute('open') : self.element.setAttribute('open', 'true');
				ariaValues = isOpen ? ['false', 'true'] : ['true', 'false'];
				self.updateAriaValues(ariaValues);
			});
		}
	};

	Details.prototype.updateAriaValues = function(values) {
		this.summary.setAttribute('aria-expanded', values[0]);
		this.details.setAttribute('aria-hidden', values[1]);
	};

	//initialize the Details objects
	var detailsEl = document.getElementsByClassName('js-details');
	if( detailsEl.length > 0 ) {
		for( var i = 0; i < detailsEl.length; i++) {
			(function(i){new Details(detailsEl[i], i);})(i);
		}
	}
}());
// File#: _1_diagonal-movement
// Usage: codyhouse.co/license
/*
  Modified version of the jQuery-menu-aim plugin
  https://github.com/kamens/jQuery-menu-aim
  - Replaced jQuery with Vanilla JS
  - Minor changes
*/
(function() {
  var menuAim = function(opts) {
    init(opts);
  };

  window.menuAim = menuAim;

  function init(opts) {
    var activeRow = null,
      mouseLocs = [],
      lastDelayLoc = null,
      timeoutId = null,
      options = Util.extend({
        menu: '',
        rows: false, //if false, get direct children - otherwise pass nodes list 
        submenuSelector: "*",
        submenuDirection: "right",
        tolerance: 75,  // bigger = more forgivey when entering submenu
        enter: function(){},
        exit: function(){},
        activate: function(){},
        deactivate: function(){},
        exitMenu: function(){}
      }, opts),
      menu = options.menu;

    var MOUSE_LOCS_TRACKED = 3,  // number of past mouse locations to track
      DELAY = 300;  // ms delay when user appears to be entering submenu

    /**
     * Keep track of the last few locations of the mouse.
     */
    var mousemoveDocument = function(e) {
      mouseLocs.push({x: e.pageX, y: e.pageY});

      if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
        mouseLocs.shift();
      }
    };

    /**
     * Cancel possible row activations when leaving the menu entirely
     */
    var mouseleaveMenu = function() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // If exitMenu is supplied and returns true, deactivate the
      // currently active row on menu exit.
      if (options.exitMenu(this)) {
        if (activeRow) {
          options.deactivate(activeRow);
        }

        activeRow = null;
      }
    };

    /**
     * Trigger a possible row activation whenever entering a new row.
     */
    var mouseenterRow = function() {
      if (timeoutId) {
        // Cancel any previous activation delays
        clearTimeout(timeoutId);
      }

      options.enter(this);
      possiblyActivate(this);
    },
    mouseleaveRow = function() {
      options.exit(this);
    };

    /*
     * Immediately activate a row if the user clicks on it.
     */
    var clickRow = function() {
      activate(this);
    };  

    /**
     * Activate a menu row.
     */
    var activate = function(row) {
      if (row == activeRow) {
        return;
      }

      if (activeRow) {
        options.deactivate(activeRow);
      }

      options.activate(row);
      activeRow = row;
    };

    /**
     * Possibly activate a menu row. If mouse movement indicates that we
     * shouldn't activate yet because user may be trying to enter
     * a submenu's content, then delay and check again later.
     */
    var possiblyActivate = function(row) {
      var delay = activationDelay();

      if (delay) {
        timeoutId = setTimeout(function() {
          possiblyActivate(row);
        }, delay);
      } else {
        activate(row);
      }
    };

    /**
     * Return the amount of time that should be used as a delay before the
     * currently hovered row is activated.
     *
     * Returns 0 if the activation should happen immediately. Otherwise,
     * returns the number of milliseconds that should be delayed before
     * checking again to see if the row should be activated.
     */
    var activationDelay = function() {
      if (!activeRow || !Util.is(activeRow, options.submenuSelector)) {
        // If there is no other submenu row already active, then
        // go ahead and activate immediately.
        return 0;
      }

      function getOffset(element) {
        var rect = element.getBoundingClientRect();
        return { top: rect.top + window.pageYOffset, left: rect.left + window.pageXOffset };
      };

      var offset = getOffset(menu),
          upperLeft = {
              x: offset.left,
              y: offset.top - options.tolerance
          },
          upperRight = {
              x: offset.left + menu.offsetWidth,
              y: upperLeft.y
          },
          lowerLeft = {
              x: offset.left,
              y: offset.top + menu.offsetHeight + options.tolerance
          },
          lowerRight = {
              x: offset.left + menu.offsetWidth,
              y: lowerLeft.y
          },
          loc = mouseLocs[mouseLocs.length - 1],
          prevLoc = mouseLocs[0];

      if (!loc) {
        return 0;
      }

      if (!prevLoc) {
        prevLoc = loc;
      }

      if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x || prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
        // If the previous mouse location was outside of the entire
        // menu's bounds, immediately activate.
        return 0;
      }

      if (lastDelayLoc && loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
        // If the mouse hasn't moved since the last time we checked
        // for activation status, immediately activate.
        return 0;
      }

      // Detect if the user is moving towards the currently activated
      // submenu.
      //
      // If the mouse is heading relatively clearly towards
      // the submenu's content, we should wait and give the user more
      // time before activating a new row. If the mouse is heading
      // elsewhere, we can immediately activate a new row.
      //
      // We detect this by calculating the slope formed between the
      // current mouse location and the upper/lower right points of
      // the menu. We do the same for the previous mouse location.
      // If the current mouse location's slopes are
      // increasing/decreasing appropriately compared to the
      // previous's, we know the user is moving toward the submenu.
      //
      // Note that since the y-axis increases as the cursor moves
      // down the screen, we are looking for the slope between the
      // cursor and the upper right corner to decrease over time, not
      // increase (somewhat counterintuitively).
      function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
      };

      var decreasingCorner = upperRight,
        increasingCorner = lowerRight;

      // Our expectations for decreasing or increasing slope values
      // depends on which direction the submenu opens relative to the
      // main menu. By default, if the menu opens on the right, we
      // expect the slope between the cursor and the upper right
      // corner to decrease over time, as explained above. If the
      // submenu opens in a different direction, we change our slope
      // expectations.
      if (options.submenuDirection == "left") {
        decreasingCorner = lowerLeft;
        increasingCorner = upperLeft;
      } else if (options.submenuDirection == "below") {
        decreasingCorner = lowerRight;
        increasingCorner = lowerLeft;
      } else if (options.submenuDirection == "above") {
        decreasingCorner = upperLeft;
        increasingCorner = upperRight;
      }

      var decreasingSlope = slope(loc, decreasingCorner),
        increasingSlope = slope(loc, increasingCorner),
        prevDecreasingSlope = slope(prevLoc, decreasingCorner),
        prevIncreasingSlope = slope(prevLoc, increasingCorner);

      if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
        // Mouse is moving from previous location towards the
        // currently activated submenu. Delay before activating a
        // new menu row, because user may be moving into submenu.
        lastDelayLoc = loc;
        return DELAY;
      }

      lastDelayLoc = null;
      return 0;
    };

    /**
     * Hook up initial menu events
     */
    menu.addEventListener('mouseleave', mouseleaveMenu);  
    var rows = (options.rows) ? options.rows : menu.children;
    if(rows.length > 0) {
      for(var i = 0; i < rows.length; i++) {(function(i){
        rows[i].addEventListener('mouseenter', mouseenterRow);  
        rows[i].addEventListener('mouseleave', mouseleaveRow);
        rows[i].addEventListener('click', clickRow);  
      })(i);}
    }

    document.addEventListener('mousemove', function(event){
    (!window.requestAnimationFrame) ? mousemoveDocument(event) : window.requestAnimationFrame(function(){mousemoveDocument(event);});
    });
  };
}());


// File#: _1_flash-message
// Usage: codyhouse.co/license
(function() {
	var FlashMessage = function(element) {
		this.element = element;
		this.showClass = "flash-message--is-visible";
		this.messageDuration = parseInt(this.element.getAttribute('data-duration')) || 3000;
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.temeoutId = null;
		this.isVisible = false;
		this.initFlashMessage();
	};

	FlashMessage.prototype.initFlashMessage = function() {
		var self = this;
		//open modal when clicking on trigger buttons
		if ( self.triggers ) {
			for(var i = 0; i < self.triggers.length; i++) {
				self.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					self.showFlashMessage();
				});
			}
		}
		//listen to the event that triggers the opening of a flash message
		self.element.addEventListener('showFlashMessage', function(){
			self.showFlashMessage();
		});
	};

	FlashMessage.prototype.showFlashMessage = function() {
		var self = this;
		Util.addClass(self.element, self.showClass);
		self.isVisible = true;
		//hide other flash messages
		self.hideOtherFlashMessages();
		if( self.messageDuration > 0 ) {
			//hide the message after an interveal (this.messageDuration)
			self.temeoutId = setTimeout(function(){
				self.hideFlashMessage();
			}, self.messageDuration);
		}
	};

	FlashMessage.prototype.hideFlashMessage = function() {
		Util.removeClass(this.element, this.showClass);
		this.isVisible = false;
		//reset timeout
		clearTimeout(this.temeoutId);
		this.temeoutId = null;
	};

	FlashMessage.prototype.hideOtherFlashMessages = function() {
		var event = new CustomEvent('flashMessageShown', { detail: this.element });
		window.dispatchEvent(event);
	};

	FlashMessage.prototype.checkFlashMessage = function(message) {
		if( !this.isVisible ) return; 
		if( this.element == message) return;
		this.hideFlashMessage();
	};

	//initialize the FlashMessage objects
	var flashMessages = document.getElementsByClassName('js-flash-message');
	if( flashMessages.length > 0 ) {
		var flashMessagesArray = [];
		for( var i = 0; i < flashMessages.length; i++) {
			(function(i){flashMessagesArray.push(new FlashMessage(flashMessages[i]));})(i);
		}

		//listen for a flash message to be shown -> close the others
		window.addEventListener('flashMessageShown', function(event){
			flashMessagesArray.forEach(function(element){
				element.checkFlashMessage(event.detail);
			});
		});
	}
}());
// File#: _1_image-magnifier
// Usage: codyhouse.co/license

(function() {
  var ImageMagnifier = function(element) {
    this.element = element;
    this.asset = this.element.getElementsByClassName('js-img-mag__asset')[0];
    this.ready = false;
    this.scale = 1;
    this.intervalId = false;
    this.moving = false;
    this.moveEvent = false;
    initImageMagnifier(this);
  };

  function initImageMagnifier(imgMag) {
    // wait for the image to be loaded
    imgMag.asset.addEventListener('load', function(){
      initImageMagnifierMove(imgMag);
    });
    if(imgMag.asset.complete) {
      initImageMagnifierMove(imgMag);
    }
  };

  function initImageMagnifierMove(imgMag) {
    if(imgMag.ready) return;
    imgMag.ready = true;
    initImageMagnifierScale(imgMag); // get image scale
    // listen to mousenter event
    imgMag.element.addEventListener('mouseenter', handleEvent.bind(imgMag));
  };

  function initImageMagnifierScale(imgMag) {
    var customScale = imgMag.element.getAttribute('data-scale');
    if(customScale) { // use custom scale set in HTML
      imgMag.scale = customScale;
    } else { // use natural width of image to get the scale value
      imgMag.scale = imgMag.asset.naturalWidth/imgMag.element.offsetWidth;
      // round to 2 places decimal
      imgMag.scale = Math.floor((imgMag.scale*100))/100;
      if(imgMag.scale > 1.2)  imgMag.scale = imgMag.scale - 0.2;
    }
  };

  function initImageMove(imgMag) { // add move event listeners
    imgMag.moveEvent = handleEvent.bind(imgMag);
    imgMag.element.addEventListener('mousemove', imgMag.moveEvent);
    imgMag.element.addEventListener('mouseleave', imgMag.moveEvent);
  };

  function cancelImageMove(imgMag) { // remove move event listeners
		if(imgMag.intervalId) {
			(!window.requestAnimationFrame) ? clearInterval(imgMag.intervalId) : window.cancelAnimationFrame(imgMag.intervalId);
			imgMag.intervalId = false;
    }
    if(imgMag.moveEvent) {
      imgMag.element.removeEventListener('mousemove', imgMag.moveEvent);
      imgMag.element.removeEventListener('mouseleave', imgMag.moveEvent);
      imgMag.moveEvent = false;
    }
  };

  function handleEvent(event) {
		switch(event.type) {
			case 'mouseenter':
				startMove(this, event);
				break;
			case 'mousemove':
				move(this, event);
				break;
			case 'mouseleave':
				endMove(this);
				break;
		}
  };
  
  function startMove(imgMag, event) {
    imgMag.moving = true;
    initImageMove(imgMag); // listen to mousemove event
    zoomImageMagnifier(imgMag, event);
  };

  function move(imgMag, event) {
    if(!imgMag.moving || imgMag.intervalId) return;
    (!window.requestAnimationFrame) 
      ? imgMag.intervalId = setTimeout(function(){zoomImageMagnifier(imgMag, event);}, 250)
      : imgMag.intervalId = window.requestAnimationFrame(function(){zoomImageMagnifier(imgMag, event);});
  };

  function endMove(imgMag) {
    imgMag.moving = false;
    cancelImageMove(imgMag); // remove event listeners
    imgMag.asset.removeAttribute('style'); // reset image style
  };

  function zoomImageMagnifier(imgMag, event) { // zoom effect on mousemove
    var elementRect = imgMag.element.getBoundingClientRect();
    var translateX = (elementRect.left - event.clientX);
    var translateY = (elementRect.top - event.clientY);
    if(translateX > 0) translateX = 0;if(translateX < -1*elementRect.width) translateX = -1*elementRect.width;
    if(translateY > 0) translateY = 0;if(translateY < -1*elementRect.height) translateX = -1*elementRect.height;
    var transform = 'translateX('+translateX*(imgMag.scale - 1)+'px) translateY('+translateY*(imgMag.scale - 1)+'px) scale('+imgMag.scale+')';
    imgMag.asset.setAttribute('style', 'transform: '+transform+';');
    imgMag.intervalId = false;
  };

  // init ImageMagnifier object
  var imageMag = document.getElementsByClassName('js-img-mag');
  if( imageMag.length > 0 ) {
    for( var i = 0; i < imageMag.length; i++) {
      new ImageMagnifier(imageMag[i]);
    }
  }
}());
// File#: _1_image-zoom
// Usage: codyhouse.co/license

(function() {
  var ImageZoom = function(element, index) {
    this.element = element;
    this.lightBoxId = 'img-zoom-lightbox--'+index;
    this.imgPreview = this.element.getElementsByClassName('js-image-zoom__preview')[0];
    
    initImageZoomHtml(this); // init markup
    
    this.lightbox = document.getElementById(this.lightBoxId);
    this.imgEnlg = this.lightbox.getElementsByClassName('js-image-zoom__fw')[0];
    this.input = this.element.getElementsByClassName('js-image-zoom__input')[0];
    this.animate = this.element.getAttribute('data-morph') != 'off';
    
    initImageZoomEvents(this); //init events
  };

  function initImageZoomHtml(imageZoom) {
    // get zoomed image url
    var url = imageZoom.element.getAttribute('data-img');
    if(!url) url = imageZoom.imgPreview.getAttribute('src');

    var lightBox = document.createElement('div');
    Util.setAttributes(lightBox, {class: 'image-zoom__lightbox js-image-zoom__lightbox', id: imageZoom.lightBoxId, 'aria-hidden': 'true'});
    lightBox.innerHTML = '<img src="'+url+'" class="js-image-zoom__fw"></img>';
    document.body.appendChild(lightBox);
    
    var keyboardInput = '<input aria-hidden="true" type="checkbox" class="image-zoom__input js-image-zoom__input"></input>';
    imageZoom.element.insertAdjacentHTML('afterbegin', keyboardInput);

  };

  function initImageZoomEvents(imageZoom) {
    // toggle lightbox on click
    imageZoom.imgPreview.addEventListener('click', function(event){
      toggleFullWidth(imageZoom, true);
      imageZoom.input.checked = true;
    });
    imageZoom.lightbox.addEventListener('click', function(event){
      toggleFullWidth(imageZoom, false);
      imageZoom.input.checked = false;
    });
    // keyboard accessibility
    imageZoom.input.addEventListener('change', function(event){
      toggleFullWidth(imageZoom, imageZoom.input.checked);
    });
    imageZoom.input.addEventListener('keydown', function(event){
      if( (event.keyCode && event.keyCode == 13) || (event.key && event.key.toLowerCase() == 'enter') ) {
        imageZoom.input.checked = !imageZoom.input.checked;
        toggleFullWidth(imageZoom, imageZoom.input.checked);
      }
    });
  };

  function toggleFullWidth(imageZoom, bool) {
    if(animationSupported && imageZoom.animate) { // start expanding animation
      window.requestAnimationFrame(function(){
        animateZoomImage(imageZoom, bool);
      });
    } else { // show lightbox without animation
      Util.toggleClass(imageZoom.lightbox, 'image-zoom__lightbox--is-visible', bool);
    }
  };

  function animateZoomImage(imageZoom, bool) {
    // get img preview position and dimension for the morphing effect
    var rect = imageZoom.imgPreview.getBoundingClientRect(),
      finalWidth = imageZoom.lightbox.getBoundingClientRect().width;
    var init = (bool) ? [rect.top, rect.left, rect.width] : [0, 0, finalWidth],
      final = (bool) ? [-rect.top, -rect.left, parseFloat(finalWidth/rect.width)] : [rect.top + imageZoom.lightbox.scrollTop, rect.left, parseFloat(rect.width/finalWidth)];
    
    if(bool) {
      imageZoom.imgEnlg.setAttribute('style', 'top: '+init[0]+'px; left:'+init[1]+'px; width:'+init[2]+'px;');
    }
    
    // show modal
    Util.removeClass(imageZoom.lightbox, 'image-zoom__lightbox--no-transition');
    Util.addClass(imageZoom.lightbox, 'image-zoom__lightbox--is-visible');

    imageZoom.imgEnlg.addEventListener('transitionend', function cb(event){ // reset elements once animation is over
      if(!bool) Util.removeClass(imageZoom.lightbox, 'image-zoom__lightbox--is-visible');
      Util.addClass(imageZoom.lightbox, 'image-zoom__lightbox--no-transition');
      imageZoom.imgEnlg.removeAttribute('style');
      imageZoom.imgEnlg.removeEventListener('transitionend', cb);
    });
    
    // animate image and bg
    imageZoom.imgEnlg.style.transform = 'translateX('+final[1]+'px) translateY('+final[0]+'px) scale('+final[2]+')';
    Util.toggleClass(imageZoom.lightbox, 'image-zoom__lightbox--animate-bg', bool);
  };

  // init ImageZoom object
  var imageZoom = document.getElementsByClassName('js-image-zoom'),
    animationSupported = window.requestAnimationFrame && !Util.osHasReducedMotion();
  if( imageZoom.length > 0 ) {
    var imageZoomArray = [];
    for( var i = 0; i < imageZoom.length; i++) {
      imageZoomArray.push(new ImageZoom(imageZoom[i], i));
    }

    // close Zoom Image lightbox on Esc
    window.addEventListener('keydown', function(event){
      if((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'esc')) {
        for( var i = 0; i < imageZoomArray.length; i++) {
          imageZoomArray[i].input.checked = false;
          if(Util.hasClass(imageZoomArray[i].lightbox, 'image-zoom__lightbox--is-visible')) toggleFullWidth(imageZoomArray[i], false);
        }
      }
    });
  }
}());
// File#: _1_infinite-scroll
// Usage: codyhouse.co/license
(function() {
  var InfiniteScroll = function(opts) {
    this.options = Util.extend(InfiniteScroll.defaults, opts);
    this.element = this.options.element;
    this.loader = document.getElementsByClassName('js-infinite-scroll__loader');
    this.loadBtn = document.getElementsByClassName('js-infinite-scroll__btn');
    this.loading = false;
    this.currentPageIndex = this.element.getAttribute('data-current-page') ? parseInt(this.element.getAttribute('data-current-page')) : 0;
    this.index = this.currentPageIndex;
    initLoad(this);
  };

  function initLoad(infiniteScroll) {
    setPathValues(infiniteScroll); // get dynamic content paths

    getTresholdPixel(infiniteScroll);
    
    if(infiniteScroll.options.container) { // get container of dynamic content
      infiniteScroll.container = infiniteScroll.element.querySelector(infiniteScroll.options.container);
    }
    
    if((!infiniteScroll.options.loadBtn || infiniteScroll.options.loadBtnDelay) && infiniteScroll.loadBtn.length > 0) { // hide load more btn
      Util.addClass(infiniteScroll.loadBtn[0], 'sr-only');
    }

    if(!infiniteScroll.options.loadBtn || infiniteScroll.options.loadBtnDelay) {
      if(intersectionObserverSupported) { // check element scrolling
        initObserver(infiniteScroll);
      } else {
        infiniteScroll.scrollEvent = handleEvent.bind(infiniteScroll);
        window.addEventListener('scroll', infiniteScroll.scrollEvent);
      }
    }
    
    initBtnEvents(infiniteScroll); // listen for click on load Btn
    
    if(!infiniteScroll.options.path) { // content has been loaded using a custom function
      infiniteScroll.element.addEventListener('loaded-new', function(event){
        contentWasLoaded(infiniteScroll, event.detail.path, event.detail.checkNext); // reset element
      });
    }
  };

  function setPathValues(infiniteScroll) { // path can be strin or comma-separated list
    if(!infiniteScroll.options.path) return;
    var split = infiniteScroll.options.path.split(',');
    if(split.length > 1) {
      infiniteScroll.options.path = [];
      for(var i = 0; i < split.length; i++) infiniteScroll.options.path.push(split[i].trim());
    }
  };

  function getTresholdPixel(infiniteScroll) { // get the threshold value in pixels - will be used only if intersection observer is not supported
    infiniteScroll.thresholdPixel = infiniteScroll.options.threshold.indexOf('px') > -1 ? parseInt(infiniteScroll.options.threshold.replace('px', '')) : parseInt(window.innerHeight*parseInt(infiniteScroll.options.threshold.replace('%', ''))/100);
  };

  function initObserver(infiniteScroll) { // intersection observer supported
    // append an element to the bottom of the container that will be observed
    var observed = document.createElement("div");
    Util.setAttributes(observed, {'aria-hidden': 'true', 'class': 'js-infinite-scroll__observed', 'style': 'width: 100%; height: 1px; margin-top: -1px; visibility: hidden;'});
    infiniteScroll.element.appendChild(observed);

    infiniteScroll.observed = infiniteScroll.element.getElementsByClassName('js-infinite-scroll__observed')[0];

    var config = {rootMargin: '0px 0px '+infiniteScroll.options.threshold+' 0px'};
    infiniteScroll.observer = new IntersectionObserver(observerLoadContent.bind(infiniteScroll), config);
    infiniteScroll.observer.observe(infiniteScroll.observed);
  };

  function observerLoadContent(entry) { 
    if(this.loading) return;
    if(entry[0].intersectionRatio > 0) loadMore(this);
  };

  function handleEvent(event) { // handle click/scroll events
    switch(event.type) {
      case 'click': {
        initClick(this, event); // click on load more button
        break;
      }
      case 'scroll': { // triggered only if intersection onserver is not supported
        initScroll(this);
        break;
      }
    }
  };

  function initScroll(infiniteScroll) { // listen to scroll event (only if intersectionObserver is not supported)
    (!window.requestAnimationFrame) ? setTimeout(checkLoad.bind(infiniteScroll)) : window.requestAnimationFrame(checkLoad.bind(infiniteScroll));
  };

  function initBtnEvents(infiniteScroll) { // load more button events - click + focus (for keyboard accessibility)
    if(infiniteScroll.loadBtn.length == 0) return;
    infiniteScroll.clickEvent = handleEvent.bind(infiniteScroll);
    infiniteScroll.loadBtn[0].addEventListener('click', infiniteScroll.clickEvent);
    
    if(infiniteScroll.options.loadBtn && !infiniteScroll.options.loadBtnDelay) {
      Util.removeClass(infiniteScroll.loadBtn[0], 'sr-only');
      if(infiniteScroll.loader.length > 0 ) Util.addClass(infiniteScroll.loader[0], 'is-hidden');
    }

    // toggle class sr-only if link is in focus/loses focus
    infiniteScroll.loadBtn[0].addEventListener('focusin', function(){
      if(Util.hasClass(infiniteScroll.loadBtn[0], 'sr-only')) {
        Util.addClass(infiniteScroll.loadBtn[0], 'js-infinite-scroll__btn-focus');
        Util.removeClass(infiniteScroll.loadBtn[0], 'sr-only');
      }
    });
    infiniteScroll.loadBtn[0].addEventListener('focusout', function(){
      if(Util.hasClass(infiniteScroll.loadBtn[0], 'js-infinite-scroll__btn-focus')) {
        Util.removeClass(infiniteScroll.loadBtn[0], 'js-infinite-scroll__btn-focus');
        Util.addClass(infiniteScroll.loadBtn[0], 'sr-only');
      }
    });
  };

  function initClick(infiniteScroll, event) { // click on 'Load More' button
    event.preventDefault();
    Util.addClass(infiniteScroll.loadBtn[0], 'sr-only');
    loadMore(infiniteScroll);
  };

  function checkLoad() { // while scrolling -> check if we need to load new content (only if intersectionObserver is not supported)
    if(this.loading) return;
    if(!needLoad(this)) return;
    loadMore(this);
  };

  function loadMore(infiniteScroll) { // new conten needs to be loaded
    infiniteScroll.loading = true;
    if(infiniteScroll.loader.length > 0) Util.removeClass(infiniteScroll.loader[0], 'is-hidden');
    var moveFocus = false;
    if(infiniteScroll.loadBtn.length > 0 ) moveFocus = Util.hasClass(infiniteScroll.loadBtn[0], 'js-infinite-scroll__btn-focus');
    // check if need to add content or user has custom load function
    if(infiniteScroll.options.path) {
      contentBasicLoad(infiniteScroll, moveFocus); // load content
    } else {
      emitCustomEvents(infiniteScroll, 'load-new', moveFocus); // user takes care of loading content
    }
  };

  function contentBasicLoad(infiniteScroll, moveFocus) {
    var filePath = getFilePath(infiniteScroll);
    // load file content
    getNewContent(filePath, function(content){
      var checkNext = insertNewContent(infiniteScroll, content, moveFocus);
      contentWasLoaded(infiniteScroll, filePath, checkNextPageAvailable(infiniteScroll, checkNext));
      // emit 'content-loaded' event -> this could be useful when new content needs to be initialized
      infiniteScroll.element.dispatchEvent(new CustomEvent('content-loaded', {detail: filePath}));
    });
  };

  function getFilePath(infiniteScroll) { // get path of the file to load
    return (Array.isArray(infiniteScroll.options.path)) 
      ? infiniteScroll.options.path[infiniteScroll.index]
      : infiniteScroll.options.path.replace('{n}', infiniteScroll.index+1);
  };

  function getNewContent(path, cb) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) cb(this.responseText);
    };
    xhttp.open("GET", path, true);
    xhttp.send();
  };

  function insertNewContent(infiniteScroll, content, moveFocus) {
    var next = false;
    if(infiniteScroll.options.container) {
      var div = document.createElement("div");
      div.innerHTML = content;
      var wrapper = div.querySelector(infiniteScroll.options.container);
      if(wrapper) {
        content = wrapper.innerHTML;
        next = wrapper.getAttribute('data-path');
      }
    }
    var lastItem = false;
    if(moveFocus) lastItem = getLastChild(infiniteScroll);
    if(infiniteScroll.container) {
      infiniteScroll.container.insertAdjacentHTML('beforeend', content);
    } else {
      (infiniteScroll.loader.length > 0) 
        ? infiniteScroll.loader[0].insertAdjacentHTML('beforebegin', content)
        : infiniteScroll.element.insertAdjacentHTML('beforeend', content);
    }
    if(moveFocus && lastItem) Util.moveFocus(lastItem);

    return next;
  };

  function getLastChild(infiniteScroll) {
    if(infiniteScroll.container) return infiniteScroll.container.lastElementChild;
    if(infiniteScroll.loader.length > 0) return infiniteScroll.loader[0].previousElementSibling;
    return infiniteScroll.element.lastElementChild;
  };

  function checkNextPageAvailable(infiniteScroll, checkNext) { // check if there's still content to be loaded
    if(Array.isArray(infiniteScroll.options.path)) {
      return infiniteScroll.options.path.length > infiniteScroll.index + 1;
    }
    return checkNext;
  };

  function contentWasLoaded(infiniteScroll, url, checkNext) { // new content has been loaded - reset status 
    if(infiniteScroll.loader.length > 0) Util.addClass(infiniteScroll.loader[0], 'is-hidden'); // hide loader
    
    if(infiniteScroll.options.updateHistory && url) { // update browser history
      var pageArray = location.pathname.split('/'),
        actualPage = pageArray[pageArray.length - 1] ;
      if( actualPage != url && history.pushState ) window.history.replaceState({path: url},'',url);
    }
    
    if(!checkNext) { // no need to load additional pages - remove scroll listening and/or click listening
      removeScrollEvents(infiniteScroll);
      if(infiniteScroll.clickEvent) {
        infiniteScroll.loadBtn[0].removeEventListener('click', infiniteScroll.clickEvent);
        Util.addClass(infiniteScroll.loadBtn[0], 'is-hidden');
        Util.removeClass(infiniteScroll.loadBtn[0], 'sr-only');
      }
    }
    
    if(checkNext && infiniteScroll.options.loadBtn) { // check if we need to switch from scrolling to click -> add/remove proper listener
      if(!infiniteScroll.options.loadBtnDelay) {
        Util.removeClass(infiniteScroll.loadBtn[0], 'sr-only');
      } else if(infiniteScroll.index - infiniteScroll.currentPageIndex + 1 >= infiniteScroll.options.loadBtnDelay && infiniteScroll.loadBtn.length > 0) {
        removeScrollEvents(infiniteScroll);
        Util.removeClass(infiniteScroll.loadBtn[0], 'sr-only');
      }
    }

    if(checkNext && infiniteScroll.loadBtn.length > 0 && Util.hasClass(infiniteScroll.loadBtn[0], 'js-infinite-scroll__btn-focus')) { // keyboard accessibility
      Util.removeClass(infiniteScroll.loadBtn[0], 'sr-only');
    }

    infiniteScroll.index = infiniteScroll.index + 1;
    infiniteScroll.loading = false;
  };

  function removeScrollEvents(infiniteScroll) {
    if(infiniteScroll.scrollEvent) window.removeEventListener('scroll', infiniteScroll.scrollEvent);
    if(infiniteScroll.observer) infiniteScroll.observer.unobserve(infiniteScroll.observed);
  };

  function needLoad(infiniteScroll) { // intersectionObserverSupported not supported -> check if threshold has been reached
    return infiniteScroll.element.getBoundingClientRect().bottom - window.innerHeight <= infiniteScroll.thresholdPixel;
  };

  function emitCustomEvents(infiniteScroll, eventName, moveFocus) { // applicable when user takes care of loading new content
		var event = new CustomEvent(eventName, {detail: {index: infiniteScroll.index+1, moveFocus: moveFocus}});
		infiniteScroll.element.dispatchEvent(event);
	};

  InfiniteScroll.defaults = {
    element : '',
    path : false, // path of files to be loaded: set to comma-separated list or string (should include {n} to be replaced by integer index). If not set, user will take care of loading new content
    container: false, // Append new content to this element. Additionally, when loaded a new page, only content of the element will be appended
    threshold: '200px', // distance between viewport and scroll area for loading new content
    updateHistory: false, // push new url to browser history
    loadBtn: false, // use a button to load more content
    loadBtnDelay: false // set to an integer if you want the load more button to be visible only after a number of loads on scroll - loadBtn needs to be 'on'
  };

  window.InfiniteScroll = InfiniteScroll;

  //initialize the InfiniteScroll objects
  var infiniteScroll = document.getElementsByClassName('js-infinite-scroll'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);

  if( infiniteScroll.length > 0) {
    for( var i = 0; i < infiniteScroll.length; i++) {
      (function(i){
        var path = infiniteScroll[i].getAttribute('data-path') ? infiniteScroll[i].getAttribute('data-path') : false,
        container = infiniteScroll[i].getAttribute('data-container') ? infiniteScroll[i].getAttribute('data-container') : false,
        updateHistory = ( infiniteScroll[i].getAttribute('data-history') && infiniteScroll[i].getAttribute('data-history') == 'on') ? true : false,
        loadBtn = ( infiniteScroll[i].getAttribute('data-load-btn') && infiniteScroll[i].getAttribute('data-load-btn') == 'on') ? true : false,
        loadBtnDelay = infiniteScroll[i].getAttribute('data-load-btn-delay') ? infiniteScroll[i].getAttribute('data-load-btn-delay') : false,
        threshold = infiniteScroll[i].getAttribute('data-threshold') ? infiniteScroll[i].getAttribute('data-threshold') : '200px';
        new InfiniteScroll({element: infiniteScroll[i], path : path, container : container, updateHistory: updateHistory, loadBtn: loadBtn, loadBtnDelay: loadBtnDelay, threshold: threshold});
      })(i);
    }
  };
}());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
	var Modal = function(element) {
		this.element = element;
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null; // focus will be moved to this element when modal is open
		this.modalFocus = this.element.getAttribute('data-modal-first-focus') ? this.element.querySelector(this.element.getAttribute('data-modal-first-focus')) : null;
		this.selectedTrigger = null;
		this.showClass = "modal--is-visible";
		this.initModal();
	};

	Modal.prototype.initModal = function() {
		var self = this;
		//open modal when clicking on trigger buttons
		if ( this.triggers ) {
			for(var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					if(Util.hasClass(self.element, self.showClass)) {
						self.closeModal();
						return;
					}
					self.selectedTrigger = event.target;
					self.showModal();
					self.initModalEvents();
				});
			}
		}

		// listen to the openModal event -> open modal without a trigger button
		this.element.addEventListener('openModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.showModal();
			self.initModalEvents();
		});

		// listen to the closeModal event -> close modal without a trigger button
		this.element.addEventListener('closeModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.closeModal();
		});

		// if modal is open by default -> initialise modal events
		if(Util.hasClass(this.element, this.showClass)) this.initModalEvents();
	};

	Modal.prototype.showModal = function() {
		var self = this;
		Util.addClass(this.element, this.showClass);
		this.getFocusableElements();
		this.moveFocusEl.focus();
		// wait for the end of transitions before moving focus
		this.element.addEventListener("transitionend", function cb(event) {
			self.moveFocusEl.focus();
			self.element.removeEventListener("transitionend", cb);
		});
		this.emitModalEvents('modalIsOpen');
	};

	Modal.prototype.closeModal = function() {
		if(!Util.hasClass(this.element, this.showClass)) return;
		Util.removeClass(this.element, this.showClass);
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null;
		if(this.selectedTrigger) this.selectedTrigger.focus();
		//remove listeners
		this.cancelModalEvents();
		this.emitModalEvents('modalIsClose');
	};

	Modal.prototype.initModalEvents = function() {
		//add event listeners
		this.element.addEventListener('keydown', this);
		this.element.addEventListener('click', this);
	};

	Modal.prototype.cancelModalEvents = function() {
		//remove event listeners
		this.element.removeEventListener('keydown', this);
		this.element.removeEventListener('click', this);
	};

	Modal.prototype.handleEvent = function (event) {
		switch(event.type) {
			case 'click': {
				this.initClick(event);
			}
			case 'keydown': {
				this.initKeyDown(event);
			}
		}
	};

	Modal.prototype.initKeyDown = function(event) {
		if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
			//trap focus inside modal
			this.trapFocus(event);
		} else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
			event.preventDefault();
			this.closeModal(); // close modal when pressing Enter on close button
		}	
	};

	Modal.prototype.initClick = function(event) {
		//close modal when clicking on close button or modal bg layer 
		if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
		event.preventDefault();
		this.closeModal();
	};

	Modal.prototype.trapFocus = function(event) {
		if( this.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of modal
			event.preventDefault();
			this.lastFocusable.focus();
		}
		if( this.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of modal
			event.preventDefault();
			this.firstFocusable.focus();
		}
	}

	Modal.prototype.getFocusableElements = function() {
		//get all focusable elements inside the modal
		var allFocusable = this.element.querySelectorAll(focusableElString);
		this.getFirstVisible(allFocusable);
		this.getLastVisible(allFocusable);
		this.getFirstFocusable();
	};

	Modal.prototype.getFirstVisible = function(elements) {
		//get first visible focusable element inside the modal
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				this.firstFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getLastVisible = function(elements) {
		//get last visible focusable element inside the modal
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				this.lastFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getFirstFocusable = function() {
		if(!this.modalFocus || !Element.prototype.matches) {
			this.moveFocusEl = this.firstFocusable;
			return;
		}
		var containerIsFocusable = this.modalFocus.matches(focusableElString);
		if(containerIsFocusable) {
			this.moveFocusEl = this.modalFocus;
		} else {
			this.moveFocusEl = false;
			var elements = this.modalFocus.querySelectorAll(focusableElString);
			for(var i = 0; i < elements.length; i++) {
				if( isVisible(elements[i]) ) {
					this.moveFocusEl = elements[i];
					break;
				}
			}
			if(!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
		}
	};

	Modal.prototype.emitModalEvents = function(eventName) {
		var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
		this.element.dispatchEvent(event);
	};

	function isVisible(element) {
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

	//initialize the Modal objects
	var modals = document.getElementsByClassName('js-modal');
	// generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	if( modals.length > 0 ) {
		var modalArrays = [];
		for( var i = 0; i < modals.length; i++) {
			(function(i){modalArrays.push(new Modal(modals[i]));})(i);
		}

		window.addEventListener('keydown', function(event){ //close modal window on esc
			if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
				for( var i = 0; i < modalArrays.length; i++) {
					(function(i){modalArrays[i].closeModal();})(i);
				};
			}
		});
	}
}());
// File#: _1_number-input
// Usage: codyhouse.co/license
(function() {
	var InputNumber = function(element) {
		this.element = element;
		this.input = this.element.getElementsByClassName('js-number-input__value')[0];
		this.min = parseFloat(this.input.getAttribute('min'));
		this.max = parseFloat(this.input.getAttribute('max'));
		this.step = parseFloat(this.input.getAttribute('step'));
		if(isNaN(this.step)) this.step = 1;
		this.precision = getStepPrecision(this.step);
		initInputNumberEvents(this);
	};

	function initInputNumberEvents(input) {
		// listen to the click event on the custom increment buttons
		input.element.addEventListener('click', function(event){ 
			var increment = event.target.closest('.js-number-input__btn');
			if(increment) {
				event.preventDefault();
				updateInputNumber(input, increment);
			}
		});

		// when input changes, make sure the new value is acceptable
		input.input.addEventListener('focusout', function(event){
			var value = parseFloat(input.input.value);
			if( value < input.min ) value = input.min;
			if( value > input.max ) value = input.max;
			// check value is multiple of step
			value = checkIsMultipleStep(input, value);
			if( value != parseFloat(input.input.value)) input.input.value = value;

		});
	};

	function getStepPrecision(step) {
		// if step is a floating number, return its precision
		return (step.toString().length - Math.floor(step).toString().length - 1);
	};

	function updateInputNumber(input, btn) {
		var value = ( Util.hasClass(btn, 'number-input__btn--plus') ) ? parseFloat(input.input.value) + input.step : parseFloat(input.input.value) - input.step;
		if( input.precision > 0 ) value = value.toFixed(input.precision);
		if( value < input.min ) value = input.min;
		if( value > input.max ) value = input.max;
		input.input.value = value;
		input.input.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
	};

	function checkIsMultipleStep(input, value) {
		// check if the number inserted is a multiple of the step value
		var remain = (value*10*input.precision)%(input.step*10*input.precision);
		if( remain != 0) value = value - remain;
		if( input.precision > 0 ) value = value.toFixed(input.precision);
		return value;
	};

	//initialize the InputNumber objects
	var inputNumbers = document.getElementsByClassName('js-number-input');
	if( inputNumbers.length > 0 ) {
		for( var i = 0; i < inputNumbers.length; i++) {
			(function(i){new InputNumber(inputNumbers[i]);})(i);
		}
	}
}());
// File#: _1_password
// Usage: codyhouse.co/license
(function() {
	var Password = function(element) {
		this.element = element;
		this.password = this.element.getElementsByClassName('js-password__input')[0];
		this.visibilityBtn = this.element.getElementsByClassName('js-password__btn')[0];
		this.visibilityClass = 'password--text-is-visible';
		this.initPassword();
	};

	Password.prototype.initPassword = function() {
		var self = this;
		//listen to the click on the password btn
		this.visibilityBtn.addEventListener('click', function(event) {
			//if password is in focus -> do nothing if user presses Enter
			if(document.activeElement === self.password) return;
			event.preventDefault();
			self.togglePasswordVisibility();
		});
	};

	Password.prototype.togglePasswordVisibility = function() {
		var makeVisible = !Util.hasClass(this.element, this.visibilityClass);
		//change element class
		Util.toggleClass(this.element, this.visibilityClass, makeVisible);
		//change input type
		(makeVisible) ? this.password.setAttribute('type', 'text') : this.password.setAttribute('type', 'password');
	};
	
	//initialize the Password objects
	var passwords = document.getElementsByClassName('js-password');
	if( passwords.length > 0 ) {
		for( var i = 0; i < passwords.length; i++) {
			(function(i){new Password(passwords[i]);})(i);
		}
	};
}());
// File#: _1_pre-header
// Usage: codyhouse.co/license
(function() {
	var preHeader = document.getElementsByClassName('js-pre-header');
	if(preHeader.length > 0) {
		for(var i = 0; i < preHeader.length; i++) {
			(function(i){ addPreHeaderEvent(preHeader[i]);})(i);
		}

		function addPreHeaderEvent(element) {
			var close = element.getElementsByClassName('js-pre-header__close-btn')[0];
			if(close) {
				close.addEventListener('click', function(event) {
					event.preventDefault();
					Util.addClass(element, 'pre-header--is-hidden');
				});
			}
		}
	}
}());
// File#: _1_read-more
// Usage: codyhouse.co/license
(function() {
  var ReadMore = function(element) {
    this.element = element;
    this.moreContent = this.element.getElementsByClassName('js-read-more__content');
    this.count = this.element.getAttribute('data-characters') || 200;
    this.counting = 0;
    this.btnClasses = this.element.getAttribute('data-btn-class');
    this.ellipsis = this.element.getAttribute('data-ellipsis') && this.element.getAttribute('data-ellipsis') == 'off' ? false : true;
    this.btnShowLabel = 'Read more';
    this.btnHideLabel = 'Read less';
    this.toggleOff = this.element.getAttribute('data-toggle') && this.element.getAttribute('data-toggle') == 'off' ? false : true;
    if( this.moreContent.length == 0 ) splitReadMore(this);
    setBtnLabels(this);
    initReadMore(this);
  };

  function splitReadMore(readMore) { 
    splitChildren(readMore.element, readMore); // iterate through children and hide content
  };

  function splitChildren(parent, readMore) {
    if(readMore.counting >= readMore.count) {
      Util.addClass(parent, 'js-read-more__content');
      return parent.outerHTML;
    }
    var children = parent.childNodes;
    var content = '';
    for(var i = 0; i < children.length; i++) {
      if (children[i].nodeType == Node.TEXT_NODE) {
        content = content + wrapText(children[i], readMore);
      } else {
        content = content + splitChildren(children[i], readMore);
      }
    }
    parent.innerHTML = content;
    return parent.outerHTML;
  };

  function wrapText(element, readMore) {
    var content = element.textContent;
    if(content.replace(/\s/g,'').length == 0) return '';// check if content is empty
    if(readMore.counting >= readMore.count) {
      return '<span class="js-read-more__content">' + content + '</span>';
    }
    if(readMore.counting + content.length < readMore.count) {
      readMore.counting = readMore.counting + content.length;
      return content;
    }
    var firstContent = content.substr(0, readMore.count - readMore.counting);
    firstContent = firstContent.substr(0, Math.min(firstContent.length, firstContent.lastIndexOf(" ")));
    var secondContent = content.substr(firstContent.length, content.length);
    readMore.counting = readMore.count;
    return firstContent + '<span class="js-read-more__content">' + secondContent + '</span>';
  };

  function setBtnLabels(readMore) { // set custom labels for read More/Less btns
    var btnLabels = readMore.element.getAttribute('data-btn-labels');
    if(btnLabels) {
      var labelsArray = btnLabels.split(',');
      readMore.btnShowLabel = labelsArray[0].trim();
      readMore.btnHideLabel = labelsArray[1].trim();
    }
  };

  function initReadMore(readMore) { // add read more/read less buttons to the markup
    readMore.moreContent = readMore.element.getElementsByClassName('js-read-more__content');
    if( readMore.moreContent.length == 0 ) {
      Util.addClass(readMore.element, 'read-more--loaded');
      return;
    }
    var btnShow = ' <button class="js-read-more__btn '+readMore.btnClasses+'">'+readMore.btnShowLabel+'</button>';
    var btnHide = ' <button class="js-read-more__btn is-hidden '+readMore.btnClasses+'">'+readMore.btnHideLabel+'</button>';
    if(readMore.ellipsis) {
      btnShow = '<span class="js-read-more__ellipsis" aria-hidden="true">...</span>'+ btnShow;
    }

    readMore.moreContent[readMore.moreContent.length - 1].insertAdjacentHTML('afterend', btnHide);
    readMore.moreContent[0].insertAdjacentHTML('afterend', btnShow);
    resetAppearance(readMore);
    initEvents(readMore);
  };

  function resetAppearance(readMore) { // hide part of the content
    for(var i = 0; i < readMore.moreContent.length; i++) Util.addClass(readMore.moreContent[i], 'is-hidden');
    Util.addClass(readMore.element, 'read-more--loaded'); // show entire component
  };

  function initEvents(readMore) { // listen to the click on the read more/less btn
    readMore.btnToggle = readMore.element.getElementsByClassName('js-read-more__btn');
    readMore.ellipsis = readMore.element.getElementsByClassName('js-read-more__ellipsis');

    readMore.btnToggle[0].addEventListener('click', function(event){
      event.preventDefault();
      updateVisibility(readMore, true);
    });
    readMore.btnToggle[1].addEventListener('click', function(event){
      event.preventDefault();
      updateVisibility(readMore, false);
    });
  };

  function updateVisibility(readMore, visibile) {
    for(var i = 0; i < readMore.moreContent.length; i++) Util.toggleClass(readMore.moreContent[i], 'is-hidden', !visibile);
    // reset btns appearance
    Util.toggleClass(readMore.btnToggle[0], 'is-hidden', visibile);
    Util.toggleClass(readMore.btnToggle[1], 'is-hidden', !visibile);
    if(readMore.ellipsis.length > 0 ) Util.toggleClass(readMore.ellipsis[0], 'is-hidden', visibile);
    if(!readMore.toggleOff) Util.addClass(readMore.btn, 'is-hidden');
    // move focus
    if(visibile) {
      var targetTabIndex = readMore.moreContent[0].getAttribute('tabindex');
      Util.moveFocus(readMore.moreContent[0]);
      resetFocusTarget(readMore.moreContent[0], targetTabIndex);
    } else {
      Util.moveFocus(readMore.btnToggle[0]);
    }
  };

  function resetFocusTarget(target, tabindex) {
    if( parseInt(target.getAttribute('tabindex')) < 0) {
			target.style.outline = 'none';
			!tabindex && target.removeAttribute('tabindex');
		}
  };

  //initialize the ReadMore objects
	var readMore = document.getElementsByClassName('js-read-more');
	if( readMore.length > 0 ) {
		for( var i = 0; i < readMore.length; i++) {
			(function(i){new ReadMore(readMore[i]);})(i);
		}
	};
}());
// File#: _1_reading-progressbar
// Usage: codyhouse.co/license
(function() {
	var readingIndicator = document.getElementsByClassName('js-reading-progressbar')[0],
		readingIndicatorContent = document.getElementsByClassName('js-reading-content')[0];
	
	if( readingIndicator && readingIndicatorContent) {
		var progressInfo = [],
			progressEvent = false,
			progressFallback = readingIndicator.getElementsByClassName('js-reading-progressbar__fallback')[0],
			progressIsSupported = 'value' in readingIndicator;

		progressInfo['height'] = readingIndicatorContent.offsetHeight;
		progressInfo['top'] = readingIndicatorContent.getBoundingClientRect().top;
		progressInfo['window'] = window.innerHeight;
		progressInfo['class'] = 'reading-progressbar--is-active';
		
		//init indicator
		setProgressIndicator();
		//listen to the window scroll event - update progress
		window.addEventListener('scroll', function(event){
			if(progressEvent) return;
			progressEvent = true;
			(!window.requestAnimationFrame) ? setTimeout(function(){setProgressIndicator();}, 250) : window.requestAnimationFrame(setProgressIndicator);
		});
		// listen to window resize - update progress
		window.addEventListener('resize', function(event){
			if(progressEvent) return;
			progressEvent = true;
			(!window.requestAnimationFrame) ? setTimeout(function(){resetProgressIndicator();}, 250) : window.requestAnimationFrame(resetProgressIndicator);
		});

		function setProgressIndicator() {
			progressInfo['top'] = readingIndicatorContent.getBoundingClientRect().top;
			if(progressInfo['height'] <= progressInfo['window']) {
				// short content - hide progress indicator
				Util.removeClass(readingIndicator, progressInfo['class']);
				progressEvent = false;
				return;
			}
			// get new progress and update element
			Util.addClass(readingIndicator, progressInfo['class']);
			var value = (progressInfo['top'] >= 0) ? 0 : 100*(0 - progressInfo['top'])/(progressInfo['height'] - progressInfo['window']);
			readingIndicator.setAttribute('value', value);
			if(!progressIsSupported && progressFallback) progressFallback.style.width = value+'%';
			progressEvent = false;
		};

		function resetProgressIndicator() {
			progressInfo['height'] = readingIndicatorContent.offsetHeight;
			progressInfo['window'] = window.innerHeight;
			setProgressIndicator();
		};
	}
}());
// File#: _1_responsive-sidebar
// Usage: codyhouse.co/license
(function() {
  var Sidebar = function(element) {
		this.element = element;
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.selectedTrigger = null;
    this.showClass = "sidebar--is-visible";
    this.staticClass = "sidebar--static";
    this.customStaticClass = "";
    this.readyClass = "sidebar--loaded";
    this.layout = false; // this will be static or mobile
    getCustomStaticClass(this); // custom classes for static version
    initSidebar(this);
  };

  function getCustomStaticClass(element) {
    var customClasses = element.element.getAttribute('data-static-class');
    if(customClasses) element.customStaticClass = ' '+customClasses;
  };
  
  function initSidebar(sidebar) {
    initSidebarResize(sidebar); // handle changes in layout -> mobile to static and viceversa
    
		if ( sidebar.triggers ) { // open sidebar when clicking on trigger buttons - mobile layout only
			for(var i = 0; i < sidebar.triggers.length; i++) {
				sidebar.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					if(Util.hasClass(sidebar.element, sidebar.showClass)) {
            sidebar.selectedTrigger = event.target;
            closeSidebar(sidebar);
            return;
          }
					sidebar.selectedTrigger = event.target;
					showSidebar(sidebar);
					initSidebarEvents(sidebar);
				});
			}
		}
  };

  function showSidebar(sidebar) { // mobile layout only
		Util.addClass(sidebar.element, sidebar.showClass);
		getFocusableElements(sidebar);
		Util.moveFocus(sidebar.element);
  };

  function closeSidebar(sidebar) { // mobile layout only
		Util.removeClass(sidebar.element, sidebar.showClass);
		sidebar.firstFocusable = null;
		sidebar.lastFocusable = null;
    if(sidebar.selectedTrigger) sidebar.selectedTrigger.focus();
    sidebar.element.removeAttribute('tabindex');
		//remove listeners
		cancelSidebarEvents(sidebar);
	};

  function initSidebarEvents(sidebar) { // mobile layout only
    //add event listeners
		sidebar.element.addEventListener('keydown', handleEvent.bind(sidebar));
		sidebar.element.addEventListener('click', handleEvent.bind(sidebar));
  };

  function cancelSidebarEvents(sidebar) { // mobile layout only
    //remove event listeners
		sidebar.element.removeEventListener('keydown', handleEvent.bind(sidebar));
		sidebar.element.removeEventListener('click', handleEvent.bind(sidebar));
  };

  function handleEvent(event) { // mobile layout only
    switch(event.type) {
      case 'click': {
        initClick(this, event);
      }
      case 'keydown': {
        initKeyDown(this, event);
      }
    }
  };

  function initKeyDown(sidebar, event) { // mobile layout only
    if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
      //close sidebar window on esc
      closeSidebar(sidebar);
    } else if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
      //trap focus inside sidebar
      trapFocus(sidebar, event);
    }
  };

  function initClick(sidebar, event) { // mobile layout only
    //close sidebar when clicking on close button or sidebar bg layer 
		if( !event.target.closest('.js-sidebar__close-btn') && !Util.hasClass(event.target, 'js-sidebar') ) return;
		event.preventDefault();
		closeSidebar(sidebar);
  };

  function trapFocus(sidebar, event) { // mobile layout only
    if( sidebar.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of sidebar
			event.preventDefault();
			sidebar.lastFocusable.focus();
		}
		if( sidebar.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of sidebar
			event.preventDefault();
			sidebar.firstFocusable.focus();
		}
  };

  function initSidebarResize(sidebar) {
    // custom event emitted when window is resized - detect only if the sidebar--static@{breakpoint} class was added
    var beforeContent = getComputedStyle(sidebar.element, ':before').getPropertyValue('content');
    if(beforeContent && beforeContent !='' && beforeContent !='none') {
      checkSidebarLayour(sidebar);

      sidebar.element.addEventListener('update-sidebar', function(event){
        checkSidebarLayour(sidebar);
      });
    } 
    Util.addClass(sidebar.element, sidebar.readyClass);
  };

  function checkSidebarLayour(sidebar) {
    var layout = getComputedStyle(sidebar.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    if(layout == sidebar.layout) return;
    sidebar.layout = layout;
    if(layout != 'static') Util.addClass(sidebar.element, 'is-hidden');
    Util.toggleClass(sidebar.element, sidebar.staticClass + sidebar.customStaticClass, layout == 'static');
    if(layout != 'static') setTimeout(function(){Util.removeClass(sidebar.element, 'is-hidden')});
    // reset element role 
    (layout == 'static') ? sidebar.element.removeAttribute('role', 'alertdialog') :  sidebar.element.setAttribute('role', 'alertdialog');
    // reset mobile behaviour
    if(layout == 'static' && Util.hasClass(sidebar.element, sidebar.showClass)) closeSidebar(sidebar);
  };

  function getFocusableElements(sidebar) {
    //get all focusable elements inside the drawer
		var allFocusable = sidebar.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
		getFirstVisible(sidebar, allFocusable);
		getLastVisible(sidebar, allFocusable);
  };

  function getFirstVisible(sidebar, elements) {
		//get first visible focusable element inside the sidebar
		for(var i = 0; i < elements.length; i++) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				sidebar.firstFocusable = elements[i];
				return true;
			}
		}
	};

	function getLastVisible(sidebar, elements) {
		//get last visible focusable element inside the sidebar
		for(var i = elements.length - 1; i >= 0; i--) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				sidebar.lastFocusable = elements[i];
				return true;
			}
		}
  };

  //initialize the Sidebar objects
	var sidebar = document.getElementsByClassName('js-sidebar');
	if( sidebar.length > 0 ) {
		for( var i = 0; i < sidebar.length; i++) {
			(function(i){new Sidebar(sidebar[i]);})(i);
    }
    // switch from mobile to static layout
    var customEvent = new CustomEvent('update-sidebar');
    window.addEventListener('resize', function(event){
      (!window.requestAnimationFrame) ? setTimeout(function(){resetLayout();}, 250) : window.requestAnimationFrame(resetLayout);
    });

    function resetLayout() {
      for( var i = 0; i < sidebar.length; i++) {
        (function(i){sidebar[i].dispatchEvent(customEvent)})(i);
      };
    };
	}
}());
// File#: _1_side-navigation
// Usage: codyhouse.co/license
(function() {
  function initSideNav(nav) {
    nav.addEventListener('click', function(event){
      var btn = event.target.closest('.js-sidenav__sublist-control');
      if(!btn) return;
      var listItem = btn.parentElement,
        bool = Util.hasClass(listItem, 'sidenav__item--expanded');
      btn.setAttribute('aria-expanded', !bool);
      Util.toggleClass(listItem, 'sidenav__item--expanded', !bool);
    });
  };

	var sideNavs = document.getElementsByClassName('js-sidenav');
	if( sideNavs.length > 0 ) {
		for( var i = 0; i < sideNavs.length; i++) {
      (function(i){initSideNav(sideNavs[i]);})(i);
		}
	}
}());
// File#: _1_slider
// Usage: codyhouse.co/license
(function() {
	var Slider = function(element) {
		this.element = element;
		this.rangeWrapper = this.element.getElementsByClassName('slider__range');
		this.rangeInput = this.element.getElementsByClassName('slider__input');
		this.value = this.element.getElementsByClassName('js-slider__value'); 
		this.floatingValue = this.element.getElementsByClassName('js-slider__value--floating'); 
		this.rangeMin = this.rangeInput[0].getAttribute('min');
		this.rangeMax = this.rangeInput[0].getAttribute('max');
		this.sliderWidth = window.getComputedStyle(this.element.getElementsByClassName('slider__range')[0]).getPropertyValue('width');
		this.thumbWidth = getComputedStyle(this.element).getPropertyValue('--slide-thumb-size');
		this.isInputVar = (this.value[0].tagName.toLowerCase() == 'input');
		this.isFloatingVar = this.floatingValue.length > 0;
		if(this.isFloatingVar) {
			this.floatingValueLeft = window.getComputedStyle(this.floatingValue[0]).getPropertyValue('left');
		}
		initSlider(this);
	};

	function initSlider(slider) {
		updateLabelValues(slider);// update label/input value so that it is the same as the input range
		updateLabelPosition(slider, false); // update label position if floating variation
		updateRangeColor(slider, false); // update range bg color
		checkRangeSupported(slider); // hide label/input value if input range is not supported
		
		// listen to change in the input range
		for(var i = 0; i < slider.rangeInput.length; i++) {
			(function(i){
				slider.rangeInput[i].addEventListener('input', function(event){
					updateSlider(slider, i);
				});
				slider.rangeInput[i].addEventListener('change', function(event){ // fix issue on IE where input event is not emitted
					updateSlider(slider, i);
				});
			})(i);
		}

		// if there's an input text, listen for changes in value, validate it and then update slider
		if(slider.isInputVar) {
			for(var i = 0; i < slider.value.length; i++) {
				(function(i){
					slider.value[i].addEventListener('change', function(event){
						updateRange(slider, i);
					});
				})(i);
			}
		}

		// native <input> element has been updated (e.g., form reset) -> update custom appearance
		slider.element.addEventListener('slider-updated', function(event){
			for(var i = 0; i < slider.value.length; i++) {updateSlider(slider, i);}
		});

		// custom events - emitted if slider has allows for multi-values
		slider.element.addEventListener('inputRangeLimit', function(event){
			updateLabelValues(slider);
			updateLabelPosition(slider, event.detail);
		});
	};

	function updateSlider(slider, index) {
		updateLabelValues(slider);
		updateLabelPosition(slider, index);
		updateRangeColor(slider, index);
	};

	function updateLabelValues(slider) {
		for(var i = 0; i < slider.rangeInput.length; i++) {
			slider.isInputVar ? slider.value[i].value = slider.rangeInput[i].value : slider.value[i].textContent = slider.rangeInput[i].value;
		}
	};

	function updateLabelPosition(slider, index) {
		if(!slider.isFloatingVar) return;
		var i = index ? index : 0,
			j = index ? index + 1: slider.rangeInput.length;
		for(var k = i; k < j; k++) {
			var percentage = (slider.rangeInput[k].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin);
			slider.floatingValue[k].style.left = 'calc(0.5 * '+slider.floatingValueLeft+' + '+percentage+' * ( '+slider.sliderWidth+' - '+slider.floatingValueLeft+' ))';
		}
	};

	function updateRangeColor(slider, index) {
		if(slider.rangeInput.length > 1) {slider.element.dispatchEvent(new CustomEvent('updateRange', {detail: index}));return;}
		var percentage = parseInt((slider.rangeInput[0].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin)*100),
			fill = 'calc('+percentage+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)',
			empty = 'calc('+slider.sliderWidth+' - '+percentage+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)';

		slider.rangeWrapper[0].style.setProperty('--slider-fill-value', fill);
		slider.rangeWrapper[0].style.setProperty('--slider-empty-value', empty);
	};

	function updateRange(slider, index) {
		var newValue = parseFloat(slider.value[index].value);
		if(isNaN(newValue)) {
			slider.value[index].value = slider.rangeInput[index].value;
			return;
		} else {
			if(newValue < slider.rangeMin) newValue = slider.rangeMin;
			if(newValue > slider.rangeMax) newValue = slider.rangeMax;
			slider.rangeInput[index].value = newValue;
			var inputEvent = new Event('change');
			slider.rangeInput[index].dispatchEvent(inputEvent);
		}
	};

	function checkRangeSupported(slider) {
		var input = document.createElement("input");
		input.setAttribute("type", "range");
		Util.toggleClass(slider.element, 'slider--range-not-supported', input.type !== "range");
	};

	//initialize the Slider objects
	var sliders = document.getElementsByClassName('js-slider');
	if( sliders.length > 0 ) {
		for( var i = 0; i < sliders.length; i++) {
			(function(i){new Slider(sliders[i]);})(i);
		}
	}
}());
// File#: _1_smooth-scrolling
// Usage: codyhouse.co/license
(function() {
	var SmoothScroll = function(element) {
		this.element = element;
		this.scrollDuration = parseInt(this.element.getAttribute('data-duration')) || 300;
		this.dataElement = this.element.getAttribute('data-element');
		this.scrollElement = this.dataElement ? document.querySelector(this.dataElement) : window;
		this.initScroll();
	};

	SmoothScroll.prototype.initScroll = function() {
		var self = this;

		//detect click on link
		this.element.addEventListener('click', function(event){
			event.preventDefault();
			var targetId = event.target.closest('.js-smooth-scroll').getAttribute('href').replace('#', ''),
				target = document.getElementById(targetId),
				targetTabIndex = target.getAttribute('tabindex'),
				windowScrollTop = self.scrollElement.scrollTop || document.documentElement.scrollTop;

			if(!self.dataElement) windowScrollTop = window.scrollY || document.documentElement.scrollTop;

			var scrollElement = self.dataElement ? self.scrollElement : false;

			var fixedHeight = self.getFixedElementHeight(); // check if there's a fixed element on the page
			Util.scrollTo(target.getBoundingClientRect().top + windowScrollTop - fixedHeight, self.scrollDuration, function() {
				//move the focus to the target element - don't break keyboard navigation
				Util.moveFocus(target);
				history.pushState(false, false, '#'+targetId);
				self.resetTarget(target, targetTabIndex);
			}, scrollElement);
		});
	};

	SmoothScroll.prototype.resetTarget = function(target, tabindex) {
		if( parseInt(target.getAttribute('tabindex')) < 0) {
			target.style.outline = 'none';
			!tabindex && target.removeAttribute('tabindex');
		}	
	};

	SmoothScroll.prototype.getFixedElementHeight = function() {
		var fixedElementDelta = parseInt(getComputedStyle(document.documentElement).getPropertyValue('scroll-padding'));
		if(isNaN(fixedElementDelta) ) { // scroll-padding not supported
			fixedElementDelta = 0;
			var fixedElement = document.querySelector(this.element.getAttribute('data-fixed-element'));
			if(fixedElement) fixedElementDelta = parseInt(fixedElement.getBoundingClientRect().height);
		}
		return fixedElementDelta;
	};
	
	//initialize the Smooth Scroll objects
	var smoothScrollLinks = document.getElementsByClassName('js-smooth-scroll');
	if( smoothScrollLinks.length > 0 && !Util.cssSupports('scroll-behavior', 'smooth') && window.requestAnimationFrame) {
		// you need javascript only if css scroll-behavior is not supported
		for( var i = 0; i < smoothScrollLinks.length; i++) {
			(function(i){new SmoothScroll(smoothScrollLinks[i]);})(i);
		}
	}
}());
// File#: _2_flexi-header
// Usage: codyhouse.co/license
(function() {
  var flexHeader = document.getElementsByClassName('js-f-header');
	if(flexHeader.length > 0) {
		var menuTrigger = flexHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
			firstFocusableElement = getMenuFirstFocusable();

		// we'll use these to store the node that needs to receive focus when the mobile menu is closed 
		var focusMenu = false;

		menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){
			toggleMenuNavigation(event.detail);
		});

		// listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
					focusMenu = menuTrigger; // move focus to menu trigger when menu is close
					menuTrigger.click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-f-header')) menuTrigger.click();
			}
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 500);
		});

		function getMenuFirstFocusable() {
			var focusableEle = flexHeader[0].getElementsByClassName('f-header__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
				firstFocusable = false;
			for(var i = 0; i < focusableEle.length; i++) {
				if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
					firstFocusable = focusableEle[i];
					break;
				}
			}

			return firstFocusable;
    };
    
    function isVisible(element) {
      return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
		};

		function doneResizing() {
			if( !isVisible(menuTrigger) && Util.hasClass(flexHeader[0], 'f-header--expanded')) {
				menuTrigger.click();
			}
		};
		
		function toggleMenuNavigation(bool) { // toggle menu visibility on small devices
			Util.toggleClass(document.getElementsByClassName('f-header__nav')[0], 'f-header__nav--is-visible', bool);
			Util.toggleClass(flexHeader[0], 'f-header--expanded', bool);
			menuTrigger.setAttribute('aria-expanded', bool);
			if(bool) firstFocusableElement.focus(); // move focus to first focusable element
			else if(focusMenu) {
				focusMenu.focus();
				focusMenu = false;
			}
		};
	}
}());
// File#: _2_password-strength
// Usage: codyhouse.co/license
(function() {
  var PasswordStrength = function(opts) {
    this.options = Util.extend(PasswordStrength.defaults , opts); // used to store custom filter/sort functions
    this.element = this.options.element;
    this.input = this.element.getElementsByClassName('js-password-strength__input');
    this.reqs = this.element.getElementsByClassName('js-password-strength__req');
    this.strengthSection = this.element.getElementsByClassName('js-password-strength__meter-wrapper');
    this.strengthValue = this.element.getElementsByClassName('js-password-strength__value');
    this.strengthMeter = this.element.getElementsByClassName('js-password-strength__meter');
    this.passwordInteracted = false;
    this.reqMetClass = 'password-strength__req--met';
    this.reqNoMetClass = 'password-strength__req--no-met';
    shouldCheckStrength(this); // check if password strength should be checked
    getStrengthLabels(this); // labels for password strength
    initPasswordStrength(this);
  };

  function shouldCheckStrength(password) {
    password.checkStrength = true;
    var checkStrength = password.element.getAttribute('data-check-strength');
    if(checkStrength && checkStrength == 'off') password.checkStrength = false;
  };

  function getStrengthLabels(password) {
    if(!password.checkStrength) password.strengthLabels = false;
    password.strengthLabels = ['Bad', 'Weak', 'Good', 'Strong'];
    var dataLabel = password.element.getAttribute('data-strength-labels');
    if(dataLabel) {
      var labels = dataLabel.split(',');
      if(labels.length < 4) return;
      password.strengthLabels = labels.map(function(element){return element.trim()});
    }
  };

  function initPasswordStrength(password) {
    if(password.input.length == 0) return;
    toggleCheckStrength(password); // hide/show password strenght section
    checkStrength(password);
    checkConditions(password);
    initInput(password);
  };

  function initInput(password) {
    password.input[0].addEventListener('input', function(event) { // password changed
      toggleCheckStrength(password); // hide/show password strenght section
      checkStrength(password);
      checkConditions(password);
    });

    password.input[0].addEventListener('blur', function cb(event) {
      password.input[0].removeEventListener('blur', cb);
      password.passwordInteracted = true;
      // show error for requirement not met
      for(var i = 0; i < password.reqs.length; i++) {
        if(!Util.hasClass(password.reqs[i], password.reqMetClass)) Util.addClass(password.reqs[i], password.reqNoMetClass);
      }
    });
  };

  function toggleCheckStrength(password) {
    if(password.strengthSection.length == 0) return;
    Util.toggleClass(password.strengthSection[0], 'is-hidden', (password.input[0].value.length == 0));
  };

  function checkStrength(password) {
    if(!password.checkStrength || !zxcvbn) return;
    var response = zxcvbn(password.input[0].value);
    if(password.strengthValue.length > 0) { // update strength label
      if(response.score >= 1) password.strengthValue[0].textContent = password.strengthLabels[response.score - 1];
      else password.strengthValue[0].textContent = password.strengthLabels[0];
    }

    if(password.strengthMeter.length > 0) { // update strength meter
      var score = response.score;
      if(score == 0 && password.input[0].value.length > 0) score = 1;
      password.strengthMeter[0].firstElementChild.style.width = score/0.04+'%';
      removeStrengthClasses(password);
      if(response.score >= 1) Util.addClass(password.strengthMeter[0], 'password-strength__meter--fill-'+response.score);
      else Util.addClass(password.strengthMeter[0], 'password-strength__meter--fill-1');
    }
  };

  function checkConditions(password) {
    // uppercase, lowercase, special characters, length, number + custom
    for(var i = 0; i < password.reqs.length; i++) {
      var req = password.reqs[i].getAttribute('data-password-req');
      var result = false;
      if(password.options[req]) {
        result = password.options[req](password.input[0].value);
      } else {
        result = checkSingleCondition(password.input[0].value, req);
      }

      Util.toggleClass(password.reqs[i], password.reqMetClass, result);
      if(password.passwordInteracted) Util.toggleClass(password.reqs[i], password.reqNoMetClass, !result);
    }
  };

  function checkSingleCondition(value, req) {
    var result;
    switch (true) {
      case (req.trim() == 'uppercase'):
        result = (value.toLowerCase() != value);
        break;
      case (req.trim() == 'lowercase'):
        result = (value.toUpperCase() != value);
        break;
      case (req.trim() == 'number'):
        result = /\d/.test(value);
        break;
      case (req.indexOf('length:') == 0):
        var reqArray = req.split(':');
        result = (value.length >= parseInt(reqArray[1]));
        if(reqArray.length > 2 && result) result = (value.length <= parseInt(reqArray[2]));
        break;
      case (req.trim() == 'special'):
        result = /[!@#$%^&*=~`'"|/\?\_\-\,\;\.\:\(\)\{\}\[\]\+\>\<\\]/.test(value);
        break;
      case (req.trim() == 'letter'):
        result = /[a-zA-Z]/.test(value);
        break;
      default:
        result = false;
        break;
    }
    return result;
  };

  function removeStrengthClasses(password) {
    var classes = password.strengthMeter[0].className.split(" ").filter(function(c) {
      return c.lastIndexOf('password-strength__meter--fill-', 0) !== 0;
    });
    password.strengthMeter[0].className = classes.join(" ").trim();
  };

  PasswordStrength.defaults = {
    element : false,
  };

  window.PasswordStrength = PasswordStrength;

  //initialize the PasswordStrength objects
	var passwordStrength = document.getElementsByClassName('js-password-strength');
	if( passwordStrength.length > 0 ) {
		for( var i = 0; i < passwordStrength.length; i++) {
			(function(i){new PasswordStrength({element: passwordStrength[i]});})(i);
		}
  };
}());
// File#: _2_slider-multi-value
// Usage: codyhouse.co/license
(function() {
	var SliderMulti = function(element) {
		this.element = element;
		this.rangeWrapper = this.element.getElementsByClassName('slider__range');
		this.rangeInput = this.element.getElementsByClassName('slider__input');
		this.rangeMin = this.rangeInput[0].getAttribute('min');
		this.rangeMax = this.rangeInput[0].getAttribute('max');
		this.sliderWidth = window.getComputedStyle(this.element.getElementsByClassName('slider__range')[0]).getPropertyValue('width');
		this.thumbWidth = getComputedStyle(this.element).getPropertyValue('--slide-thumb-size');
		initSliderMulti(this);
	};

	function initSliderMulti(slider) {
		// toggle custom class based on browser support
		toggleMsClass(slider);

		// init bg color of the slider
		updateRangeColor(slider);

		slider.element.addEventListener('updateRange', function(event){
			checkRangeValues(slider, event.detail);
			updateRangeColor(slider);
		});

		// custom event emitted after window resize
		slider.element.addEventListener('update-slider-multi-value', function(event){
			slider.sliderWidth = window.getComputedStyle(slider.element.getElementsByClassName('slider__range')[0]).getPropertyValue('width');
			updateRangeColor(slider);
		});
	};

	function checkRangeValues(slider, index) {
		// if min value was changed -> make sure min value is smaller than max value 
		// if max value was changed -> make sure max value is bigger than min value 
		var i = (index == 0) ? 1 : 0,
			limit = parseFloat(slider.rangeInput[i].value);
		if( (index == 0 && slider.rangeInput[0].value >= limit) || (index == 1 && slider.rangeInput[1].value <= limit) ) {
			slider.rangeInput[index].value = limit;
			slider.element.dispatchEvent(new CustomEvent('inputRangeLimit', {detail: index}))
		}
	};

	function updateRangeColor(slider) { // update background fill color of the slider
		var percentageStart = parseInt((slider.rangeInput[0].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin)*100),
			percentageEnd = parseInt((slider.rangeInput[1].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin)*100), 
			start = 'calc('+percentageStart+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)',
			end = 'calc('+percentageEnd+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)';

		slider.rangeWrapper[0].style.setProperty('--slider-fill-value-start', start);
		slider.rangeWrapper[0].style.setProperty('--slider-fill-value-end', end);
	};

	function toggleMsClass(slider) {
		var cssVariablesSupport = Util.cssSupports('--color-value', 'red'),
			imeAlignSuport = Util.cssSupports('-ms-ime-align', 'auto');
		if(imeAlignSuport || !cssVariablesSupport) Util.addClass(slider.element, 'slider--ms-fallback'); // IE and Edge (<=18) Fallback
	};

	//initialize the SliderMulti objects
	var slidersMulti = document.getElementsByClassName('js-slider');
	if( slidersMulti.length > 0 ) {
		var slidersMultiArray = [];
		for( var i = 0; i < slidersMulti.length; i++) {(function(i){
			if(slidersMulti[i].getElementsByClassName('slider__input').length > 1) slidersMultiArray.push(new SliderMulti(slidersMulti[i]));
		})(i);}
		if(slidersMultiArray.length > 0) {
			var resizingId = false,
        customEvent = new CustomEvent('update-slider-multi-value');
      
      window.addEventListener('resize', function() {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });

      function doneResizing() {
        for( var i = 0; i < slidersMultiArray.length; i++) {
          (function(i){slidersMultiArray[i].element.dispatchEvent(customEvent)})(i);
        };
      };
		}
	}
}());
// File#: _2_table-of-contents
// Usage: codyhouse.co/license
(function() {
  var Toc = function(element) {
		this.element = element;
    this.list = this.element.getElementsByClassName('js-toc__list')[0];
    this.content = document.getElementsByClassName('js-toc-conten')[0];
    this.anchors = this.list.querySelectorAll('a[href^="#"]');
    this.sections = getSections(this);
    this.clickScrolling = false;
    initToc(this);
  };

  function getSections(toc) {
    var sections = [];
    // get all content sections
    for(var i = 0; i < toc.anchors.length; i++) {
      var section = document.getElementById(toc.anchors[i].getAttribute('href').replace('#', ''));
      if(section) sections.push(section);
    }
    return sections;
  };

  function initToc(toc) {
    // listen for click on anchors
    toc.list.addEventListener('click', function(event){
      var anchor = event.target.closest('a[href^="#"]');
      if(!anchor) return;
      // reset link apperance 
      toc.clickScrolling = true;
      resetAnchors(toc, anchor);
    });

    // check when a new section enters the viewport
    var observer = new IntersectionObserver(
      function(entries, observer) { 
        entries.forEach(function(entry){
          var threshold = entry.intersectionRatio.toFixed(1);
          if(threshold > 0 && !toc.clickScrolling) { // do not update classes if user clicked on a link
            resetAnchors(toc, toc.list.querySelector('a[href="#'+entry.target.getAttribute('id')+'"]'));
          }
        });
      }, 
      {
        threshold: [0, 0.1],
        rootMargin: "0px 0px -80% 0px"
      }
    );

    for(var i = 0; i < toc.sections.length; i++) {
      observer.observe(toc.sections[i]);
    }

    // detect the end of scrolling -> reactivate IntersectionObserver on scroll
    toc.element.addEventListener('toc-scroll', function(event){
      toc.clickScrolling = false;
    });
  };

  function resetAnchors(toc, anchor) {
    if(!anchor) return;
    for(var i = 0; i < toc.anchors.length; i++) Util.removeClass(toc.anchors[i], 'toc__link--selected');
    Util.addClass(anchor, 'toc__link--selected');
  };
  
  var tocs = document.getElementsByClassName('js-toc'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);

  var tocsArray = [];
	if( tocs.length > 0 && intersectionObserverSupported) {
		for( var i = 0; i < tocs.length; i++) {
			(function(i){ tocsArray.push(new Toc(tocs[i])); })(i);
    }

    // listen to window scroll -> reset clickScrolling property
    var scrollId = false,
      customEvent = new CustomEvent('toc-scroll');
      
    window.addEventListener('scroll', function() {
      clearTimeout(scrollId);
      scrollId = setTimeout(doneScrolling, 100);
    });

    function doneScrolling() {
      for( var i = 0; i < tocsArray.length; i++) {
        (function(i){tocsArray[i].element.dispatchEvent(customEvent)})(i);
      };
    };
  }
}());
// File#: _3_hiding-nav
// Usage: codyhouse.co/license
(function() {
  var hidingNav = document.getElementsByClassName('js-hide-nav');
  if(hidingNav.length > 0 && window.requestAnimationFrame) {
    var mainNav = Array.prototype.filter.call(hidingNav, function(element) {
      return Util.hasClass(element, 'js-hide-nav--main');
    }),
    subNav = Array.prototype.filter.call(hidingNav, function(element) {
      return Util.hasClass(element, 'js-hide-nav--sub');
    });
    
    var scrolling = false,
      previousTop = window.scrollY,
      currentTop = window.scrollY,
      scrollDelta = 10,
      scrollOffset = 150, // scrollY needs to be bigger than scrollOffset to hide navigation
      headerHeight = 0; 

    var navIsFixed = false; // check if main navigation is fixed
    if(mainNav.length > 0 && Util.hasClass(mainNav[0], 'hide-nav--fixed')) navIsFixed = true;

    // store button that triggers navigation on mobile
    var triggerMobile = getTriggerMobileMenu();
    var prevElement = createPrevElement();
    var mainNavTop = 0;
    // list of classes the hide-nav has when it is expanded -> do not hide if it has those classes
    var navOpenClasses = hidingNav[0].getAttribute('data-nav-target-class'),
      navOpenArrayClasses = [];
    if(navOpenClasses) navOpenArrayClasses = navOpenClasses.split(' ');
    getMainNavTop();
    if(mainNavTop > 0) {
      scrollOffset = scrollOffset + mainNavTop;
    }
    
    // init navigation and listen to window scroll event
    getHeaderHeight();
    initSecondaryNav();
    initFixedNav();
    resetHideNav();
    window.addEventListener('scroll', function(event){
      if(scrolling) return;
      scrolling = true;
      window.requestAnimationFrame(resetHideNav);
    });

    window.addEventListener('resize', function(event){
      if(scrolling) return;
      scrolling = true;
      window.requestAnimationFrame(function(){
        if(headerHeight > 0) {
          getMainNavTop();
          getHeaderHeight();
          initSecondaryNav();
          initFixedNav();
        }
        // reset both navigation
        hideNavScrollUp();

        scrolling = false;
      });
    });

    function getHeaderHeight() {
      headerHeight = mainNav[0].offsetHeight;
    };

    function initSecondaryNav() { // if there's a secondary nav, set its top equal to the header height
      if(subNav.length < 1 || mainNav.length < 1) return;
      subNav[0].style.top = (headerHeight - 1)+'px';
    };

    function initFixedNav() {
      if(!navIsFixed || mainNav.length < 1) return;
      mainNav[0].style.marginBottom = '-'+headerHeight+'px';
    };

    function resetHideNav() { // check if navs need to be hidden/revealed
      currentTop = window.scrollY;
      if(currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
        hideNavScrollDown();
      } else if( previousTop - currentTop > scrollDelta || (previousTop - currentTop > 0 && currentTop < scrollOffset) ) {
        hideNavScrollUp();
      } else if( previousTop - currentTop > 0 && subNav.length > 0 && subNav[0].getBoundingClientRect().top > 0) {
        setTranslate(subNav[0], '0%');
      }
      // if primary nav is fixed -> toggle bg class
      if(navIsFixed) {
        var scrollTop = window.scrollY || window.pageYOffset;
        Util.toggleClass(mainNav[0], 'hide-nav--has-bg', (scrollTop > headerHeight + mainNavTop));
      }
      previousTop = currentTop;
      scrolling = false;
    };

    function hideNavScrollDown() {
      // if there's a secondary nav -> it has to reach the top before hiding nav
      if( subNav.length  > 0 && subNav[0].getBoundingClientRect().top > headerHeight) return;
      // on mobile -> hide navigation only if dropdown is not open
      if(triggerMobile && triggerMobile.getAttribute('aria-expanded') == "true") return;
      // check if main nav has one of the following classes
      if( mainNav.length > 0 && (!navOpenClasses || !checkNavExpanded())) {
        setTranslate(mainNav[0], '-100%'); 
        mainNav[0].addEventListener('transitionend', addOffCanvasClass);
      }
      if( subNav.length  > 0 ) setTranslate(subNav[0], '-'+headerHeight+'px');
    };

    function hideNavScrollUp() {
      if( mainNav.length > 0 ) {setTranslate(mainNav[0], '0%'); Util.removeClass(mainNav[0], 'hide-nav--off-canvas');mainNav[0].removeEventListener('transitionend', addOffCanvasClass);}
      if( subNav.length  > 0 ) setTranslate(subNav[0], '0%');
    };

    function addOffCanvasClass() {
      mainNav[0].removeEventListener('transitionend', addOffCanvasClass);
      Util.addClass(mainNav[0], 'hide-nav--off-canvas');
    };

    function setTranslate(element, val) {
      element.style.transform = 'translateY('+val+')';
    };

    function getTriggerMobileMenu() {
      // store trigger that toggle mobile navigation dropdown
      var triggerMobileClass = hidingNav[0].getAttribute('data-mobile-trigger');
      if(!triggerMobileClass) return false;
      if(triggerMobileClass.indexOf('#') == 0) { // get trigger by ID
        var trigger = document.getElementById(triggerMobileClass.replace('#', ''));
        if(trigger) return trigger;
      } else { // get trigger by class name
        var trigger = hidingNav[0].getElementsByClassName(triggerMobileClass);
        if(trigger.length > 0) return trigger[0];
      }
      
      return false;
    };

    function createPrevElement() {
      // create element to be inserted right before the mainNav to get its top value
      if( mainNav.length < 1) return false;
      var newElement = document.createElement("div"); 
      newElement.setAttribute('aria-hidden', 'true');
      mainNav[0].parentElement.insertBefore(newElement, mainNav[0]);
      var prevElement =  mainNav[0].previousElementSibling;
      prevElement.style.opacity = '0';
      return prevElement;
    };

    function getMainNavTop() {
      if(!prevElement) return;
      mainNavTop = prevElement.getBoundingClientRect().top + window.scrollY;
    };

    function checkNavExpanded() {
      var navIsOpen = false;
      for(var i = 0; i < navOpenArrayClasses.length; i++){
        if(Util.hasClass(mainNav[0], navOpenArrayClasses[i].trim())) {
          navIsOpen = true;
          break;
        }
      }
      return navIsOpen;
    };
    
  } else {
    // if window requestAnimationFrame is not supported -> add bg class to fixed header
    var mainNav = document.getElementsByClassName('js-hide-nav--main');
    if(mainNav.length < 1) return;
    if(Util.hasClass(mainNav[0], 'hide-nav--fixed')) Util.addClass(mainNav[0], 'hide-nav--has-bg');
  }
}());
// File#: _3_main-header-v2
// Usage: codyhouse.co/license
(function() {
	var Submenu = function(element) {
		this.element = element;
		this.trigger = this.element.getElementsByClassName('nav-v2__link')[0];
		this.dropdown = this.element.getElementsByClassName('nav-v2__dropdown')[0];
		this.triggerFocus = false;
		this.dropdownFocus = false;
		this.hideInterval = false;
		this.prevFocus = false; // nested dropdown - store element that was in focus before focus changed
		initSubmenu(this);
		initNestedDropdown(this);
	};

	function initSubmenu(list) {
		initElementEvents(list, list.trigger);
		initElementEvents(list, list.dropdown);
	};

	function initElementEvents(list, element, bool) {
		element.addEventListener('focus', function(){
			bool = true;
			showDropdown(list);
		});
		element.addEventListener('focusout', function(event){
			bool = false;
			hideDropdown(list, event);
		});
	};

	function showDropdown(list) {
		if(list.hideInterval) clearInterval(list.hideInterval);
		Util.addClass(list.dropdown, 'nav-v2__list--is-visible');
		resetDropdownStyle(list.dropdown, true);
	};

	function hideDropdown(list, event) {
		if(list.hideInterval) clearInterval(this.hideInterval);
		list.hideInterval = setTimeout(function(){
			var submenuFocus = document.activeElement.closest('.nav-v2__item--main'),
				inFocus = submenuFocus && (submenuFocus == list.element);
			if(!list.triggerFocus && !list.dropdownFocus && !inFocus) { // hide if focus is outside submenu
				Util.removeClass(list.dropdown, 'nav-v2__list--is-visible');
				resetDropdownStyle(list.dropdown, false);
				hideSubLevels(list);
				list.prevFocus = false;
			}
		}, 100);
	};

	function initNestedDropdown(list) {
		var dropdownMenu = list.element.getElementsByClassName('nav-v2__list');
		for(var i = 0; i < dropdownMenu.length; i++) {
			var listItems = dropdownMenu[i].children;
			// bind hover
	    new menuAim({
	      menu: dropdownMenu[i],
	      activate: function(row) {
	      	var subList = row.getElementsByClassName('nav-v2__dropdown')[0];
	      	if(!subList) return;
	      	Util.addClass(row.querySelector('a.nav-v2__link'), 'nav-v2__link--hover');
	      	showLevel(list, subList);
	      },
	      deactivate: function(row) {
	      	var subList = row.getElementsByClassName('nav-v2__dropdown')[0];
	      	if(!subList) return;
	      	Util.removeClass(row.querySelector('a.nav-v2__link'), 'nav-v2__link--hover');
	      	hideLevel(list, subList);
	      },
	      exitMenu: function() {
	        return true;
	      },
	      submenuSelector: '.nav-v2__item--has-children',
	    });
		}
		// store focus element before change in focus
		list.element.addEventListener('keydown', function(event) { 
			if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
				list.prevFocus = document.activeElement;
			}
		});
		// make sure that sublevel are visible when their items are in focus
		list.element.addEventListener('keyup', function(event) {
			if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
				// focus has been moved -> make sure the proper classes are added to subnavigation
				var focusElement = document.activeElement,
					focusElementParent = focusElement.closest('.nav-v2__dropdown'),
					focusElementSibling = focusElement.nextElementSibling;

				// if item in focus is inside submenu -> make sure it is visible
				if(focusElementParent && !Util.hasClass(focusElementParent, 'nav-v2__list--is-visible')) {
					showLevel(list, focusElementParent);
				}
				// if item in focus triggers a submenu -> make sure it is visible
				if(focusElementSibling && !Util.hasClass(focusElementSibling, 'nav-v2__list--is-visible')) {
					showLevel(list, focusElementSibling);
				}

				// check previous element in focus -> hide sublevel if required 
				if( !list.prevFocus) return;
				var prevFocusElementParent = list.prevFocus.closest('.nav-v2__dropdown'),
					prevFocusElementSibling = list.prevFocus.nextElementSibling;
				
				if( !prevFocusElementParent ) return;
				
				// element in focus and element prev in focus are siblings
				if( focusElementParent && focusElementParent == prevFocusElementParent) {
					if(prevFocusElementSibling) hideLevel(list, prevFocusElementSibling);
					return;
				}

				// element in focus is inside submenu triggered by element prev in focus
				if( prevFocusElementSibling && focusElementParent && focusElementParent == prevFocusElementSibling) return;
				
				// shift tab -> element in focus triggers the submenu of the element prev in focus
				if( focusElementSibling && prevFocusElementParent && focusElementSibling == prevFocusElementParent) return;
				
				var focusElementParentParent = focusElementParent.parentNode.closest('.nav-v2__dropdown');
				
				// shift tab -> element in focus is inside the dropdown triggered by a siblings of the element prev in focus
				if(focusElementParentParent && focusElementParentParent == prevFocusElementParent) {
					if(prevFocusElementSibling) hideLevel(list, prevFocusElementSibling);
					return;
				}
				
				if(prevFocusElementParent && Util.hasClass(prevFocusElementParent, 'nav-v2__list--is-visible')) {
					hideLevel(list, prevFocusElementParent);
				}
			}
		});
	};

	function hideSubLevels(list) {
		var visibleSubLevels = list.dropdown.getElementsByClassName('nav-v2__list--is-visible');
		if(visibleSubLevels.length == 0) return;
		while (visibleSubLevels[0]) {
			hideLevel(list, visibleSubLevels[0]);
	 	}
	 	var hoveredItems = list.dropdown.getElementsByClassName('nav-v2__link--hover');
	 	while (hoveredItems[0]) {
			Util.removeClass(hoveredItems[0], 'nav-v2__link--hover');
	 	}
	};

	function showLevel(list, level, bool) {
		if(bool == undefined) {
			//check if the sublevel needs to be open to the left
			Util.removeClass(level, 'nav-v2__dropdown--nested-left');
			var boundingRect = level.getBoundingClientRect();
			if(window.innerWidth - boundingRect.right < 5 && boundingRect.left + window.scrollX > 2*boundingRect.width) Util.addClass(level, 'nav-v2__dropdown--nested-left');
		}
		Util.addClass(level, 'nav-v2__list--is-visible');
	};

	function hideLevel(list, level) {
		if(!Util.hasClass(level, 'nav-v2__list--is-visible')) return;
		Util.removeClass(level, 'nav-v2__list--is-visible');
		
		level.addEventListener('transition', function cb(){
			level.removeEventListener('transition', cb);
			Util.removeClass(level, 'nav-v2__dropdown--nested-left');
		});
	};

	var mainHeader = document.getElementsByClassName('js-header-v2');
	if(mainHeader.length > 0) {
		var menuTrigger = mainHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
			firstFocusableElement = getMenuFirstFocusable();

		// we'll use these to store the node that needs to receive focus when the mobile menu is closed 
		var focusMenu = false;

		menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){ // toggle menu visibility an small devices
			Util.toggleClass(document.getElementsByClassName('nav-v2')[0], 'nav-v2--is-visible', event.detail);
			Util.toggleClass(mainHeader[0], 'header-v2--expanded', event.detail);
			menuTrigger.setAttribute('aria-expanded', event.detail);
			if(event.detail) firstFocusableElement.focus(); // move focus to first focusable element
			else if(focusMenu) {
				focusMenu.focus();
				focusMenu = false;
			}
		});

		// take care of submenu
		var mainList = mainHeader[0].getElementsByClassName('nav-v2__list--main');
		if(mainList.length > 0) {
			for( var i = 0; i < mainList.length; i++) {
				(function(i){
					new menuAim({ // use diagonal movement detection for main submenu
			      menu: mainList[i],
			      activate: function(row) {
			      	var submenu = row.getElementsByClassName('nav-v2__dropdown');
			      	if(submenu.length == 0 ) return;
			      	Util.addClass(submenu[0], 'nav-v2__list--is-visible');
			      	resetDropdownStyle(submenu[0], true);
			      },
			      deactivate: function(row) {
			      	var submenu = row.getElementsByClassName('nav-v2__dropdown');
			      	if(submenu.length == 0 ) return;
			      	Util.removeClass(submenu[0], 'nav-v2__list--is-visible');
			      	resetDropdownStyle(submenu[0], false);
			      },
			      exitMenu: function() {
			        return true;
			      },
			      submenuSelector: '.nav-v2__item--has-children',
			      submenuDirection: 'below'
			    });

			    // take care of focus event for main submenu
					var subMenu = mainList[i].getElementsByClassName('nav-v2__item--main');
					for(var j = 0; j < subMenu.length; j++) {(function(j){if(Util.hasClass(subMenu[j], 'nav-v2__item--has-children')) new Submenu(subMenu[j]);})(j);};
				})(i);
			}
		}

		// if data-animation-offset is set -> check scrolling
		var animateHeader = mainHeader[0].getAttribute('data-animation');
		if(animateHeader && animateHeader == 'on') {
			var scrolling = false,
				scrollOffset = (mainHeader[0].getAttribute('data-animation-offset')) ? parseInt(mainHeader[0].getAttribute('data-animation-offset')) : 400,
				mainHeaderHeight = mainHeader[0].offsetHeight,
				mainHeaderWrapper = mainHeader[0].getElementsByClassName('header-v2__wrapper')[0];

			window.addEventListener("scroll", function(event) {
				if( !scrolling ) {
					scrolling = true;
					(!window.requestAnimationFrame) ? setTimeout(function(){checkMainHeader();}, 250) : window.requestAnimationFrame(checkMainHeader);
				}
			});

			function checkMainHeader() {
				var windowTop = window.scrollY || document.documentElement.scrollTop;
				Util.toggleClass(mainHeaderWrapper, 'header-v2__wrapper--is-fixed', windowTop >= mainHeaderHeight);
				Util.toggleClass(mainHeaderWrapper, 'header-v2__wrapper--slides-down', windowTop >= scrollOffset);
				scrolling = false;
			};
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
					focusMenu = menuTrigger; // move focus to menu trigger when menu is close
					menuTrigger.click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-header-v2')) menuTrigger.click();
			}
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 500);
		});

		function doneResizing() {
			if( !isVisible(menuTrigger) && Util.hasClass(mainHeader[0], 'header-v2--expanded')) menuTrigger.click();
		};

		function getMenuFirstFocusable() {
			var focusableEle = mainHeader[0].getElementsByClassName('nav-v2')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
				firstFocusable = false;
			for(var i = 0; i < focusableEle.length; i++) {
				if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
					firstFocusable = focusableEle[i];
					break;
				}
			}

			return firstFocusable;
		};
	}

	function resetDropdownStyle(dropdown, bool) {
		if(!bool) {
			dropdown.addEventListener('transitionend', function cb(){
				dropdown.removeAttribute('style');
				dropdown.removeEventListener('transitionend', cb);
			});
		} else {
			var boundingRect = dropdown.getBoundingClientRect();
			if(window.innerWidth - boundingRect.right < 5 && boundingRect.left + window.scrollX > 2*boundingRect.width) {
				var left = parseFloat(window.getComputedStyle(dropdown).getPropertyValue('left'));
				dropdown.style.left = (left + window.innerWidth - boundingRect.right - 5) + 'px';
			}
		}
	};

	function isVisible(element) {
		return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
	};
}());