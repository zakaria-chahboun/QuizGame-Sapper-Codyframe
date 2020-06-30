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