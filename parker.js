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

      var elHeight = element.offsetHeight;
      var parHeight = parent ? parent.offsetHeight : element.parentElement.offsetHeight;

      if (parHeight > elHeight) {
        checkBrowserWidth();

        window.addEventListener('resize', checkBrowserWidth);
      }

    }

  };

  parkerObject.tidyUp = function() {
    unstick();
    window.removeEventListener('resize', checkBrowserWidth);
    window.removeEventListener('scroll', makeSticky);
  }

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
      watchScroll();
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

    var elementIsShorterThanWindow = elementProperties.height < wh - elementProperties.top ? true : false;

    // Make it sticky
    if (elementIsShorterThanWindow) {

      element.classList.add('shorter');

      // scrolling down
      if (scrollingDown) {
        if (elementProperties.bottom + 10 >= parentProperties.bottom && elementProperties.top > 0) {

          element.style.position = 'absolute';
          element.style.top = 'auto';
          element.style.bottom = options.bottomMargin + 'px';
          parkerIsSticky = true
        } else if (parentProperties.top <= 0) {
          element.style.position = 'sticky';
          element.style.width = Math.round(elementProperties.width) + 'px';
          element.style.top = elementProperties.y + 'px';
          parkerIsSticky = true
        }

      } else {
        if (elementProperties.bottom + 50 > parentProperties.bottom && elementProperties.top < 0) {
          element.style.position = 'absolute';
          element.style.top = 'auto';
          element.style.bottom = options.bottomMargin + 'px';
          parkerIsSticky = true
        } else if (elementProperties.bottom >= wh) {
          element.style.position = 'fixed';
          element.style.width = Math.round(elementProperties.width) + 'px';
          element.style.bottom = options.bottomMargin + 'px';
          parkerIsSticky = true
        } else if (parentProperties.top <= 0) {
          element.style.position = 'sticky';
          element.style.width = Math.round(elementProperties.width) + 'px';
          element.style.top = elementProperties.y + 'px';
          parkerIsSticky = true
        }
      }

    } else if (scrollingDown) {
      // Scrolling down
      if (parkerIsSticky && scrollPosition <= 0) {
        unstick(element);
      } else if ((elementProperties.height - window.innerHeight) <= -elementProperties.top) {

        if (!parkerIsSticky) {
          parkerIsSticky = true;

          element.style.width = Math.round(elementProperties.width) + 'px';
          element.style.bottom = options.bottomMargin + 'px';
          element.style.position = 'fixed';
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
          if (floor) {
            element.style.bottom = wh - floor + options.bottomMargin + 'px';
          }
        }

      }
    }
  };

  // Unstick sticky element
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
