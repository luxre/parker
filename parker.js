var parker = (function() {

  // Set initial vars
  var wh = window.innerHeight;
  var defaultOptions = {
    breakpointStart: 768,
    bottomMargin: 0,
    parent: false,
    widthReferenceSelector: false
  };
  var parkerObject = {}
  var parkerIsSticky = false;
  var options = {};
  var element = false;
  var elementProperties, parent, parentProperties, floor;
  var lastScrollTop = 0;
  var scrollingDown = true;

  // Init function
  parkerObject.init = function(selector, opts) {

    // Set up options object
    options = Object.assign({}, defaultOptions, opts);

    // Get element to make sticky
    element = document.querySelector(selector);

    if(element) {
      elementProperties = element.getBoundingClientRect();
      element.style.width = Math.round(elementProperties.width) + 'px';

      // Look for specified parent element if present
      parent = options.parentSelector ? document.querySelector(options.parentSelector) : false;

      checkBrowserWidth();

      window.addEventListener('resize', function() {
        checkBrowserWidth();
      });
    }

  };

  // Make sure we are above the min-wdth breakpoint
  function checkBrowserWidth() {
    if (window.matchMedia('(min-width: ' + options.breakpointStart + 'px)').matches) {
      if (options.widthReferenceSelector) {
        var widthReferenceEl = document.querySelector(options.widthReferenceSelector);
        var padding = window.getComputedStyle(widthReferenceEl).getPropertyValue('padding').split(' ');
        var paddingValue = Number(padding[1].replace('px', '')) + Number(padding[3].replace('px', ''));
        var referenceWidth = Math.round(widthReferenceEl.getBoundingClientRect().width - paddingValue);
        element.style.width = referenceWidth + 'px';
        makeSticky();
      }
      if (!parkerIsSticky) {
        watchScroll();
      }
    } else {
      window.removeEventListener('scroll', makeSticky);
      unstick(element, true);
    }
  };

  // Watch scrolling event
  function watchScroll() {
    window.addEventListener('scroll', makeSticky);
  };

  // Make the selected element sticky
  function makeSticky(e) {

    parentProperties = parent ? parent.getBoundingClientRect() : element.parentElement.getBoundingClientRect();
    floor = parentProperties.bottom;
    elementProperties = element.getBoundingClientRect();
    var parentTop = parentProperties.top;
    var parentOffset = parentProperties.height - wh + parentProperties.y;

    // Check scroll direction
    var scrollPosition = window.scrollY;
    if ( scrollPosition > lastScrollTop ){
      scrollingDown = true;
    } else {
      scrollingDown = false;
    }
    lastScrollTop = scrollPosition;

    // Make it sticky
    if (scrollingDown) {

      // Scrolling down
      if (parkerIsSticky && scrollPosition <= 0) {
        unstick(element);
      } else if ((elementProperties.height - window.innerHeight) <= -elementProperties.top) {

        if (!parkerIsSticky) {
          parkerIsSticky = true;

          element.style.width = Math.round(elementProperties.width) + 'px';
          element.style.bottom = options.bottomMargin + 'px';
          element.style.position = 'fixed';
          element.style.height = elementProperties.height + 'px';
        }

        if (parentOffset <= 0) {
          if (element.parentNode.style.position === 'relative') {
            element.style.position = 'absolute';
            element.style.bottom = options.bottomMargin + 'px';
          } else {
            if (floor) {
              var diff = wh - floor;
              element.style.bottom = diff + options.bottomMargin + 'px';
            }
          }
        }
      } else if (parentProperties.bottom >= wh) {
      }
    } else {

      // Scrolling Up
      if(floor > wh && parkerIsSticky && element.style.position == 'absolute') {
        element.style.position = 'fixed';
      } else if(elementProperties.y <= parentTop) {
        if (parkerIsSticky) {
          unstick();
        }
      } else if(parentTop <= 0) {
        if (parentProperties.bottom >= wh) {
        } else {
          element.style.bottom = options.bottomMargin + 'px';
          element.style.position = 'fixed';
          element.style.height = elementProperties.height + 'px';
          if (floor) {
            element.style.bottom = wh - floor + options.bottomMargin + 'px';
          }
        }

      }
    }
  };

  //
  function unstick(full = false) {
    element.style.position = '';
    element.style.top = '';
    element.style.right = '';
    element.style.bottom = '';
    element.style.left = '';
    parkerIsSticky = false;
    if (full) {
      element.style.width = '';
    }
    parkerIsSticky = false;
  };

  return parkerObject;

})();

export default parker
