$(document).ready(function() {
  var nav = document.getElementById('nav-menu');
  var mobileViewport = window.matchMedia('(max-width: 768px)');
  var navFramePending = false;
  function updateNav() {
    navFramePending = false;
    var scrollTop = Math.max(0, window.scrollY);
    // Separate thresholds keep a reversed gesture from flickering at the boundary.
    var threshold = mobileViewport.matches
      ? (nav.classList.contains('on') ? 48 : 120)
      : (nav.classList.contains('on') ? 70 : 147);
    nav.classList.toggle('on', scrollTop > threshold);
  }
  function scheduleNavUpdate() {
    if (navFramePending) return;
    navFramePending = true;
    window.requestAnimationFrame(updateNav);
  }
  window.addEventListener('scroll', scheduleNavUpdate, { passive: true });
  window.addEventListener('resize', scheduleNavUpdate);
  window.addEventListener('pageshow', scheduleNavUpdate);
  updateNav();

	$('body').scrollspy({ 
		target: '.navbar-default',
		offset: 80
	})
  
   /* SLIDER */
	$('#index-slider').flexslider({
		animation: "fade",      
		slideshowSpeed: 5000,     
		pauseOnHover: true,
		controlNav: false,
		smoothHeight: false,
		directionNav: false,
	});
  
  $('.slider .tagline-wrapper').css("width", $(window).width());
  $(window).resize(function(){
    $('.slider .tagline-wrapper').css("width", $(window).width());
  });   
  
  
	/* PRODUCT */
	$("#product").owlCarousel({
		navigation : true,
		navigationText :["",""],
		autoPlay: 3000, //Set AutoPlay to 3 seconds 
		pagination : true,
		items : 3,
		itemsDesktop : [1199,3],
		itemsDesktopSmall : [979,3]
	});
 
 
  
  /* BEGIN FEATURED ITEM */
  if($(window).width() > 767){
    $('.featured-item-content').css("min-height", $('.featured-item figure img').height());
  }else{
    $('.featured-item-content').css("min-height", "initial");
  }
  
  $(window).resize(function(){
    /* FEATURED ITEM */
    if($(window).width() > 767){
      $('.featured-item-content').css("min-height", $('.featured-item figure img').height());
    }else{
      $('.featured-item-content').css("min-height", "initial");
    }
  });
  
  $('.popup-with-zoom-anim').magnificPopup({
    type: 'inline',
    fixedContentPos: true,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,    
    midClick: true,
    removalDelay: 300,
    mainClass: 'my-mfp-zoom-in'
  });
  $(document).on('click', '.mfp-close', function (e) {
    e.preventDefault();
    $.magnificPopup.close();
  });
  
  // init Isotope
  if($('.grid').length){
    $('#gallery-filter a').click(function(event){
      event.preventDefault();
      var selector = $(this).attr('data-filter');
      $('.grid').isotope({ filter: selector });
      $('#gallery-filter a.selected').removeClass('selected');
      $(this).addClass('selected');
    });
    
    $('.grid').isotope({
      itemSelector: '.grid-item',
      percentPosition: true,
      masonry: {
        columnWidth: 1
      }
    });
    
    $('.grid').imagesLoaded(function(){
      $('.grid').isotope({
        itemSelector: '.grid-item',
        percentPosition: true,
        masonry: {
          columnWidth: 1
        }
      });
      $('.grid').isotope('reLayout');
    });
  }
  $('.photo-gallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		mainClass: 'mfp-fade',
		removalDelay: 180,
		gallery:{
      	enabled:true
    }
  });
  
/* MAIN NAV */
  $('.menu-item-has-children').hover(function () {
    clearTimeout($.data(this, 'timer'));
    $(this).addClass('active');
    $(this).children(".sub-menu").stop(true, true).slideDown(200);
  }, function () {
    $.data(this, 'timer', setTimeout($.proxy(function () {
      $(this).children(".sub-menu").stop(true, true).slideUp(200);
      $(this).removeClass('active');
    }, this), 200));
  });
  
    
  leaf_mobile_menu();
}());



function leaf_mobile_menu(){
	var $menu = $( "#primary-menu" ).clone();
	$menu.find("ul").removeClass("menu");
	$menu.find("ul").removeAttr("style");
	$menu.find("li").removeAttr("style");
	$menu.find("li").each(function() {
		if($(this).find('> ul').length > 0) {
			 $(this).prepend('<button type="button" class="sf-sub-indicator" aria-label="Toggle submenu" aria-expanded="false"></button>');
		}
	})
	//$(".header").append('<div id="three-lines-menu"><a href="#">&#9776;</a></div>');
	$(".container > #primary-menu").after("<div id='mobile-menu' class='navbar-collapse collapse navbar-right'>" + $menu.html() + "</div>");

  var $menuTrigger = $('#mobile-menu-trigger');
  var $mobileMenu = $('#mobile-menu');
  $mobileMenu.find('[id]').each(function(){ this.id = 'mobile-' + this.id; });
  $mobileMenu.find('.sub-menu').each(function(index){
    this.id = 'mobile-submenu-' + index;
    $(this).siblings('.sf-sub-indicator').attr('aria-controls', this.id);
    $(this).attr({'aria-hidden': 'true', inert: ''}).css('height', '0px');
  }).on('transitionend', function(event){
    if (event.originalEvent.propertyName === 'height' && $(this).siblings('.sf-sub-indicator').attr('aria-expanded') === 'true') {
      this.style.height = 'auto';
    }
  });
  $mobileMenu.attr({'aria-hidden': 'true', inert: ''});
  $menuTrigger.attr({role: 'button', tabindex: '0', 'aria-label': 'Open menu',
    'aria-controls': 'mobile-menu', 'aria-expanded': 'false'});
  $menuTrigger.on('click', function(event){
    var expanded = $menuTrigger.attr('aria-expanded') !== 'true';
    $menuTrigger.attr({'aria-expanded': String(expanded),
      'aria-label': expanded ? 'Close menu' : 'Open menu'});
    var instant = event.detail === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    $mobileMenu.toggleClass('menu-instant', instant).toggleClass('is-open', expanded)
      .attr('aria-hidden', String(!expanded));
    if (expanded) $mobileMenu.removeAttr('inert');
    else $mobileMenu.attr('inert', '');
    return false;
  });
  $menuTrigger.on('keydown', function(event){
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      $menuTrigger.trigger($.Event('click', {detail: 0}));
    }
  });
  $(document).on('keydown', function(event){
    if (event.key === 'Escape' && $menuTrigger.attr('aria-expanded') === 'true') {
      $menuTrigger.trigger($.Event('click', {detail: 0})).focus();
    }
  });
	
	$('#mobile-menu .sf-sub-indicator').click(function(event){
    var open = $(this).attr('aria-expanded') !== 'true';
    var submenu = $(this).siblings('ul')[0];
    var detail = event.originalEvent ? event.originalEvent.detail : event.detail;
    var instant = detail === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Freeze the current height before retargeting so rapid taps reverse in place.
    submenu.style.height = submenu.getBoundingClientRect().height + 'px';
    submenu.offsetHeight;
    $(this).parent().toggleClass('submenu-instant', instant);
    $(this).attr('aria-expanded', String(open)).parent().toggleClass('open', open);
    submenu.setAttribute('aria-hidden', String(!open));
    if (open) submenu.removeAttribute('inert');
    else submenu.setAttribute('inert', '');
    submenu.style.height = open ? (instant ? 'auto' : submenu.scrollHeight + 'px') : '0px';
		return false;
	});
  $mobileMenu.find('.menu-item-has-children > a').on('click', function(event){
    event.preventDefault();
    $(this).siblings('.sf-sub-indicator').trigger($.Event('click', {
      detail: event.originalEvent ? event.originalEvent.detail : event.detail
    }));
  });
  window.matchMedia('(max-width: 768px)').addEventListener('change', function(event){
    if (!event.matches && $menuTrigger.attr('aria-expanded') === 'true') $menuTrigger.trigger('click');
  });
}

// init Isotope
  if($('.grid').length){
    $('#gallery-filter a').click(function(event){
      event.preventDefault();
      var selector = $(this).attr('data-filter');
      $('.grid').isotope({ filter: selector });
      $('#gallery-filter a.selected').removeClass('selected');
      $(this).addClass('selected');
    });
    
    $('.grid').isotope({
      itemSelector: '.grid-item',
      percentPosition: true,
      masonry: {
        columnWidth: 1
      }
    });
    
    $('.grid').imagesLoaded(function(){
      $('.grid').isotope({
        itemSelector: '.grid-item',
        percentPosition: true,
        masonry: {
          columnWidth: 1
        }
      });
      $('.grid').isotope('reLayout');
    });
  }

/*! jquery.iframetracker v2.1.0 | https://github.com/vincepare/iframeTracker-jquery | Copyright (c) 2013-2018 Vincent Paré | Licensed Apache-2.0 */
!function(e,r){"function"==typeof define&&define.amd?define(["jquery"],function(e){return r(e)}):"object"==typeof module&&module.exports?module.exports=r(require("jquery")):r(e.jQuery)}(this,function(e){!function(e){e.fn.iframeTracker=function(r){"function"==typeof r&&(r={blurCallback:r});var t=this.get();if(null===r||!1===r)e.iframeTracker.untrack(t);else{if("object"!=typeof r)throw new Error("Wrong handler type (must be an object, or null|false to untrack)");e.iframeTracker.track(t,r)}return this},e.iframeTracker={focusRetriever:null,focusRetrieved:!1,handlersList:[],isIE8AndOlder:!1,init:function(){try{!0===e.browser.msie&&e.browser.version<9&&(this.isIE8AndOlder=!0)}catch(e){try{navigator.userAgent.match(/(msie) ([\w.]+)/i)[2]<9&&(this.isIE8AndOlder=!0)}catch(e){}}if(e(window).focus(),e(window).blur(function(r){e.iframeTracker.windowLoseFocus(r)}),e("body").append('<div style="position:fixed; top:0; left:0; overflow:hidden;"><input style="position:absolute; left:-300px;" type="text" value="" id="focus_retriever" readonly="true" /></div>'),this.focusRetriever=e("#focus_retriever"),this.focusRetrieved=!1,this.isIE8AndOlder){this.focusRetriever.blur(function(r){r.stopPropagation(),r.preventDefault(),e.iframeTracker.windowLoseFocus(r)}),e("body").click(function(r){e(window).focus()}),e("form").click(function(e){e.stopPropagation()});try{e("body").on("click","form",function(e){e.stopPropagation()})}catch(e){console.log("[iframeTracker] Please update jQuery to 1.7 or newer. (exception: "+e.message+")")}}},track:function(r,t){t.target=r,e.iframeTracker.handlersList.push(t),e(r).bind("mouseover",{handler:t},e.iframeTracker.mouseoverListener).bind("mouseout",{handler:t},e.iframeTracker.mouseoutListener)},untrack:function(r){if("function"==typeof Array.prototype.filter){e(r).each(function(r){e(this).unbind("mouseover",e.iframeTracker.mouseoverListener).unbind("mouseout",e.iframeTracker.mouseoutListener)});var t=function(e){return null!==e};for(var i in this.handlersList){for(var o in this.handlersList[i].target)-1!==e.inArray(this.handlersList[i].target[o],r)&&(this.handlersList[i].target[o]=null);this.handlersList[i].target=this.handlersList[i].target.filter(t),0===this.handlersList[i].target.length&&(this.handlersList[i]=null)}this.handlersList=this.handlersList.filter(t)}else console.log("Your browser doesn't support Array filter, untrack disabled")},mouseoverListener:function(r){r.data.handler.over=!0,e.iframeTracker.retrieveFocus();try{r.data.handler.overCallback(this,r)}catch(e){}},mouseoutListener:function(r){r.data.handler.over=!1,e.iframeTracker.retrieveFocus();try{r.data.handler.outCallback(this,r)}catch(e){}},retrieveFocus:function(){document.activeElement&&"IFRAME"===document.activeElement.tagName&&(e.iframeTracker.focusRetriever.focus(),e.iframeTracker.focusRetrieved=!0)},windowLoseFocus:function(e){for(var r in this.handlersList)if(!0===this.handlersList[r].over)try{this.handlersList[r].blurCallback(e)}catch(e){}}},e(document).ready(function(){e.iframeTracker.init()})}(e)});

(function($) {
	$(window).on('load', function(){
  	setTimeout(function(){
    	$('#wh-widget-send-button-iframe').iframeTracker({
        blurCallback: function(event) {
          ga('send', 'event', { eventCategory: 'whatsapp', eventAction: 'click', eventLabel: 'submit text'});
        },
        overCallback: function(element, event) {
          this._overId = $(element).parents('.iframe_wrap').attr('id');
        },
        outCallback: function(element, event) {
          this._overId = null; 
        },
        _overId: null
      });
    },1000);
  });
})( jQuery );
