console.log('top-navigation.js');
$ = jQuery;

var l2directory = l2directory !== ''
    && l2directory !== undefined ?
        l2directory
        : '/wp-content/plugins/MtgPluginL2Nav/'; 

var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));



console.log(isMobile);






/*
    CHECK IF SET-STICKY EXISTS
    If exists this will run the onScroll function
*/
$ = jQuery;

$('.set-sticky').length > 0 ? 
    runStickyNav($('.set-sticky').offset().top) : '';








/*
    PREPARE THEMING
    This will get the theming file context and prepare for change
*/

var isThemeColor = ''; /* Set variable */
/* Get the CSS */


$.ajax({
    url: l2directory+'css/theme.css',

    success: function(data){

        isThemeColor = data.replace(/\s/g,'');

    }

})
.error(function(){

    console.log('error getting theme - line:34');

});









/* 
    SET UP TOP NAVIGATION 
    This will setup the top navigation and set for auto mobile attributes
*/

var navCount = 1;
function startNavSetup(){

    $('.topNav').each(function(){


        if($(this).attr('data-nav-id')){


            return;
            
        }

        $(this).attr({
            'id': 'navId'+navCount,
            'data-nav-id': navCount
        });

        $(this).attr('data-max-width') ?
            function(nav){
                nav.find('>ul').css({'max-width':nav.attr('data-max-width')+'px'});
                nav.parent().addClass('theme-background');
            }($(this))
            : '';


        function addNavigationLogo(nav, navId){
            
            nav.attr('data-logo') ? 
                
                nav.find('>ul').append('<li class="logo"><a href="/"><img src="'+
                nav.attr('data-logo')+'" title="'+
                $(document).attr('title')+'"></a></li>')
                
                : (nav.find('#navigationLogo') ?
                    addImageLogo(nav, navId) : '');
            





            function addImageLogo(nav, navId){

                nav = $('.topNav[data-nav-id="'+navId+'"]');

                var imageSrc = nav.find('div#navigationLogo').find('img').attr('src');

                nav.find('>ul').append('<li class="logo"><a href="/"><img src="'+
                imageSrc+'" title="'+
                $(document).attr('title')+'"></a></li>');


            }
        }

        addNavigationLogo($(this), navCount);


        /* LOOP THROUGH AND ENSURE THAT MIN-WIDTH FILLS PARENT OR EXTENDS PAST IF APPLICABLE */
        $(this).find('li').each(function(){

            $(this).find('>ul').each(function(){

                $(this).css({'position':'relative','display':'block'});
                var setMinWidth = $(this).outerWidth();
                $(this).css({'position':'','display':''})

                $(this).css({'min-width': setMinWidth < $(this).parent('li').outerWidth() ?
                    $(this).parent('li').outerWidth()
                    : setMinWidth});

            });


        });

        var isLogo = $(this).find('li.logo').length ?
            $(this).find('li.logo') : '';


        /* ADD WRAPPER FOR STICKY NAV FEATURE */
        $(this).hasClass('set-sticky') ?
            $(this).wrap('<div class="nav-holder" style="height:'+$(this).outerHeight()+'" data-offset="'+$(this).offset().top+'" />')
            : '';

        $(this).addClass('autoNav'+navCount);

        $(this).find('li.lang') !== undefined ?
            $(this).find('.mobile-menu-items').append($(this).find('li.lang').html()) : '';

        setNavIndicators($(this)); 
        setWindowResize($('.topNav[data-nav-id="'+navCount+'"]'));
        
        isLogo !== undefined
            && isLogo !== '' ?
                setNavigationLogo($('.topNav[data-nav-id="'+navCount+'"]'))
                : '';

        autoMobileNav($('.topNav[data-nav-id="'+navCount+'"]'))

        $(this).attr('data-offset', $(this).offset().top);
        
        $(this).hasClass('set-sticky') ?
            runStickyNav(navCount) : '';

        window.scroll(1,-1);
        navCount++;

    });

}

startNavSetup();









/*
    SET NAVIGATION LOGO
    This will adjust the navigation logo to center top/bottom of nav
*/

function setNavigationLogo(nav){

    nav.find('>ul li').first().css({'white-space':'nowrap'});
    var mxHeight = nav.find('>ul li').first().outerHeight();
    var imgMargin = (mxHeight - nav.find('li.logo img').outerHeight())/2.5;
    nav.find('>ul li').first().css({'white-space':''});

    var mainLogo = nav.find('li.logo');
    nav.find('li.logo').remove();
    mainLogo.css({'max-height': mxHeight});
    mainLogo.find('img').css({'max-height': nav.outerHeight()-10});
    nav.find('> ul').prepend(mainLogo);
    
    var mobileLogo = $(mainLogo.find('a').wrap('<span/>').parent().html());
    mainLogo.find('a').unwrap();

    mobileLogo.addClass('mobile-logo'),
    nav.find('.mobile-menu-items').prepend($(mobileLogo)),

    setTimeout(function(nav){

        autoMobileNav(nav);

    },200, nav);

    nav.find('div#navigationLogo').remove();

    if($('.navbar.l1').length){

        nav.find('li.logo').remove();

    }

}









/*
    AUTO MOBILE NAV
    This will auto show the nav by calculating its width of the nav parent ul li's.
*/

function autoMobileNav(nav, resizeTrigger){
    $ = jQuery;

    var navData = nav.data();
    var navId = $(nav).attr('data-nav-id');
    var navWidth = 0;
    var navCount = 0;
    var navLength = nav.find('> ul > li').length;

    nav.find('.glyphicon.contact-us')
        .parent().addClass('contact-us')
        .parent().addClass('contact-us');

    var autoNavMobileCss = $('head').find('#autoMobileStyles').length > 0 ?
        $('head').find('#autoMobileStyles').html()
        : ($('body').find('#autoMobileStyles').length > 0 ?
                $('body').find('#autoMobileStyles').html()
                : '');


    nav.find('themeColor').length > 0 ?
        getThemeColor(nav, navId) : '';

    
    if(autoNavMobileCss == ''
        || autoNavMobileCss == undefined){

        console.log('Auto moble css is either empty or undefined');
        return false;

    }




    autoNavMobileCss = cleanNavCSS(autoNavMobileCss)


    autoNavMobileCss = autoNavMobileCss.replace(/.topNav/g, '#navId'+navId+'.topNav')
        .replace(/fadeIt/g, 'navFadeIt'+navId);

    $('head #autoNavsetup'+navId).remove();
    $('head').append('<style type="text/css" id="autoNavsetup'+navId+'"></style>');


        nav.find(' > ul > li').each(function(navId){

            navCount++;

            navWidth = navWidth + $(this).outerWidth();

            nav.attr('data-mobile-width',navWidth);

            navCount == navLength ? 
                function(navId, autoNavMobileCss){


                    /* UPDATE AND APPEND AUTO MOBILE NAVIGATION CSS */
                    
                    navWidth = navWidth < 480 ?
                        480 : navWidth;

                    navWidth = $('.topNav[data-nav-id="'+navId+'"]').attr('data-mobile-toggle') ?
                        $('.topNav[data-nav-id="'+navId+'"]').attr('data-mobile-toggle')
                        : navWidth;

                    navWidth = isMobile ? 
                        $(window).outerWidth()*5 : navWidth;


                    console.log(navWidth);

                    $('head').find('#autoNavsetup'+navId).html(autoNavMobileCss.replace('480px)',navWidth+'px)'));

                    /*$('.topnav[data-nav-id="'+navId+'"]').attr('data-mobile-toggle') ?
                        setNavigationLogo(nav)
                        : ''; */

                    /* ADD DATA ATTRIBUTE FOR READ ON WINDOW.RESIZE */
                    nav.attr('data-mobile-width', navWidth);


                }($(this).closest('.topNav').attr('data-nav-id'), autoNavMobileCss) : '';


            navCount == navLength
                && resizeTrigger !== 1 ?
                    setWindowResize(nav) : '';

        }, navId);

}









/*
    SET THEME COLOR
    This function will add the color theme to the navigation.
    This will utilize JSON structure setup in the html.
*/

var setCustomColor = '';

function getThemeColor(nav, navId){



    var themeColor = $.trim(nav.find('themeColor').html());
    themeColor = JSON.parse(themeColor.replace(/\s/g,'').replace(/&gt;/g,''));
    nav.find('themeColor').remove();



    if(isThemeColor === undefined
            || isThemeColor === ''){
                
                $.ajax({
                    url:'css/theme.css',
                    success: function(data){

                        isThemeColor = cleanNavCSS(data)
                        setCustomColor = isThemeColor;
                        setColorTheme(themeColor, setCustomColor, navId);

                    }

                })
                .error(function(){

                    console.log('error getting theme - line:217');

                });

    } else {

        setCustomColor = isThemeColor;

        setColorTheme(themeColor, setCustomColor, navId);

    }









    function setColorTheme(themeColor, isThemeColor, navId){



        /* CLEAN CSS COMPRESSION */

        isThemeColor = cleanNavCSS(isThemeColor);

        isThemeColor = isThemeColor.replace(/# link/g,'#link')
            .replace(/\s+/g,' ');


        /* THEME BASE */

        isThemeColor = themeColor.base !== undefined 
            && themeColor.base  !== '' ?
                isThemeColor.replace(/#base/g, '#'+themeColor.base.replace('#',''))
                : isThemeColor;

        
        /* LINK BASE */

        isThemeColor = themeColor.link.base !== undefined
            && themeColor.link.base  !== '' ?
                isThemeColor.replace(/#linkBase/g, '#'+themeColor.link.base.replace('#',''))
                : isThemeColor;


        /* LINK HOVER */

        isThemeColor = themeColor.link.hover !== undefined 
            && themeColor.link.hover !== '' ?
                isThemeColor.replace(/#linkHover/g, '#'+themeColor.link.hover.replace('#',''))
                : isThemeColor;


        /* LINK SECONDARY BASE */

        isThemeColor = themeColor.link.secondary.base !== undefined
            && themeColor.link.secondary.base !== '' ?
                isThemeColor.replace(/#linkSecondaryBase/g, '#'+themeColor.link.secondary.base.replace('#',''))
                : isThemeColor;


        /* LINK SECONDARY HOVER */

        isThemeColor = themeColor.link.secondary.hover !== undefined 
            && themeColor.link.secondary.hover !== '' ?
                isThemeColor.replace(/#linkSecondaryHover/g, '#'+themeColor.link.secondary.hover.replace('#',''))
                : isThemeColor;

        
        /* LI DEFAULT START */

        isThemeColor = themeColor.li.default !== undefined
            && themeColor.li.default !== '' ?
                isThemeColor.replace(/#default/g, '#'+themeColor.li.default.replace('#',''))
                : isThemeColor;


        /* LI:HOVER */



        isThemeColor = themeColor.li.hover !== undefined
            && themeColor.li.hover !== '' ?
                isThemeColor.replace(/#liHover/g, '#'+themeColor.li.hover.replace('#',''))
                : isThemeColor;



        /* TRANSITION START */

        isThemeColor = themeColor.li.transition.start !== undefined
            && themeColor.li.transition.start !== '' ?
                isThemeColor.replace(/#transitionStart/g, '#'+themeColor.li.transition.start.replace('#',''))
                : isThemeColor;


        /* TRANSITION END */

        isThemeColor = themeColor.li.transition.end !== undefined
            && themeColor.li.transition.end !== '' ?
                isThemeColor.replace(/#transitionEnd/g, '#'+themeColor.li.transition.end.replace('#',''))
                : isThemeColor;


        /* SET NAV ID */


        isThemeColor = isThemeColor.replace(/fadeIt/g, 'navFadeIt'+navId).replace(/.topNav/g,'#navId'+navId+'.topNav');

        $('head').find('#autoNavsetup1').before('<style id="navTheme'+navId+'">'+isThemeColor+'</style>');
        /*console.log('After', themeColor, isThemeColor);*/



    }


}









/* 
    SET NAV INDICATORS
*/

function setNavIndicators(container){

    /* CHECK FIRST LEVEL LI FOR CHILDREN */

        container.find('.topNav').find(' > ul > li').each(function(){
            $(this).find('> ul').length > 0 ?
                addChildIndicator($(this), 1)
                :'';
        });

        container.find('.topNav').find(' > ul ul > li').each(function(){
            $(this).find('> ul').length > 0 ?
                addChildIndicator($(this), 2)
                :'';
        });


        function addChildIndicator(navItem, level){

            /* Ignore this setup if '.custom-indicators' is set */

             container.find('.caret')
                .replaceWith('<i class="fa fa-chevron-down first"></i><i class="fa fa-chevron-up second"></i>');

            navItem.find('> ul').each(function(){

                $(this).css({'position': 'relative', 'display':'table'});
                $(this).css({'min-width': $(this).outerWidth()});
                $(this).css({'position': '', 'display':''});


            });

            if(navItem.hasClass('custom-indicators')){

                return false;
            }

            /* REMOVE ANY EXISTING INDICATORS */

            navItem.find('.fa').not('.fa-globe').remove();
            navItem.find('.caret').remove();

            /* ADD CHILD INDICATOR BY LEVEL */
            navItem.find('> a').not('.go-to').append(level === 1 ?
                ' <i class="fa fa-chevron-down first"></i><i class="fa fa-chevron-up second"></i>'
                : ' <i class="fa fa-chevron-right first"></i><i class="fa fa-chevron-left second"></i>'
            );


        }

    container.find('.topNav > ul').css({'min-width': ''});
    return container;

}









/* 
    SHOW MOBILE MENU
    This will show/hide the mobile menu
*/

function showMobileMenu(event){

    $ = jQuery;

    $(event).toggleClass('close-mobile-menu');
    $(event).find('.fa').toggleClass('fa-bars fa-close');
    $(event).closest('.topNav').find('ul').first().slideToggle(200);
    return false;

}









/* 
    SHOW MOBILE NAVIGATION ITEM
    This will show/hide the mobile navigation children
*/

function showMobileChildren(event){

    $(event).parent().find('>ul').slideToggle(200, function(){

        $(event).parent().toggleClass('mobile-active');

        $(event).parent().hasClass('mobile-active') ? 
            $(event).parent().find('.mobile-active').trigger('click') : '';

    });
    $(event).find('.fa').toggle();
    return false;   
}








/* 
    SET WINDOW RESIZE
*/

function setWindowResize(nav){

    if(nav.attr('data-mobile-width') == undefined){

        return; 

    } 
    
    /* SET INDICATORS ONLOAD FUNCTION */    

    var windowWidth = $(window).outerWidth();

    var navWidth = nav.attr('data-mobile-width');


    navWidth = parseInt(navWidth);

    windowWidth <= navWidth ?
        function(nav){
            
            /* TRIGGER ADJUSTMENT ON LOAD IF APPLICABLE */

            adjustMobileLogo(nav);
            nav.find('.caret')
                .replaceWith('<i class="fa fa-chevron-down first"></i><i class="fa fa-chevron-up second"></i>');
            nav.find('li > ul').parent().find('>a').attr('onClick', 'showMobileChildren(this); return false;');
            nav.find('li').find('.fa-chevron-right').toggleClass('fa-chevron-right fa-chevron-down mobile');
            nav.find('li').find('.fa-chevron-left').toggleClass('fa-chevron-left fa-chevron-up mobile');

            if(parseInt(nav.attr('data-nav-id')) === 1){

                addDynamicMenu(nav);
            }

        }(nav)
        : '';

    $(window).trigger('resize');


    

    /* SET INDICATORS ON RESIZE FUNCTION */

    $(window).on('resize', function(){
    
        var windowWidth = $(window).outerWidth();
        var navWidth = nav.attr('data-mobile-width') == undefined ?
            480 : nav.attr('data-mobile-width');

        navWidth = isMobile === true ? 
            50000 : navWidth;


        !nav.hasClass('.stick') ? 
            nav.attr('data-offset', nav.offset().top) : '';


        nav.parent().hasClass('nav-holder') ?
            function(nav){
                nav.parent().attr('data-offset', nav.parent().offset().top)
                nav.attr('data-offset', nav.parent().offset().top)
            }(nav)
            : '';
        

        windowWidth < navWidth ?
            function(nav){

                nav.find('a.go-to').remove();
                nav.find('.caret')
                    .replaceWith('<i class="fa fa-chevron-down first"></i><i class="fa fa-chevron-up second"></i>');
                
                nav.find('li > ul').parent().find('>a').attr('onClick', 'showMobileChildren(this); return false;');
                nav.find('li').find('.fa-chevron-right').toggleClass('fa-chevron-right fa-chevron-down mobile');
                nav.find('li').find('.fa-chevron-left').toggleClass('fa-chevron-left fa-chevron-up mobile');

                nav.find('.fa-chevron-down').each(function(){

                    var isHref = $(this).parent('a').attr('href');
                    var isText = $(this).parent('a').text();
                    var isLink = '<a href="'+isHref+'" title="'+isText+'" class="go-to"><i class="fa fa-chevron-right"></i></a>';
                    isText !== ''
                        && !$(this).closest('li').hasClass('dynamic-menu') ? 
                            $(this).closest('li').first().prepend(isLink)
                            : '';
                })

                $('head').find('navWidth'+nav.attr('data-nav-id')).length == undefined ? 
                    autoMobileNav(nav, 1) : '';

                if(parseInt(nav.attr('data-nav-id')) === 1
                    && $('.navbar.l1').length > 0 ){

                    addDynamicMenu(nav);

                }

            }(nav)
            : function(nav){
                
                $('head').find('navWidth'+nav.attr('data-nav-id')).length == undefined ? 
                    autoMobileNav(nav, 1) : '';
                nav.find('a.go-to').remove();
                nav.find('.is-mobile-active').removeClass('is-mobile-active');
                nav.find('.mobile-menu .fa-close').removeClass('fa-close').addClass('fa-bars');
                nav.find('a > .fa').css({'display': ''});
                nav.find('ul').css({'display':''});
                nav.find('li > ul').parent().find('a').attr('onClick', '');
                nav.find('li').find('.fa-chevron-down.mobile').toggleClass('fa-chevron-right fa-chevron-down mobile');
                nav.find('li').find('.fa-chevron-up.mobile').toggleClass('fa-chevron-left fa-chevron-up mobile');
                nav.find('.mobile-menu-icon').removeClass('close-mobile-menu');
                nav.find('li.dynamic-menu').remove();

            }(nav);

    });









    /*
        FUNCTION ADD DYNAMIC MENU
        This will add the menu items to the L2 if applicable
    */

    function addDynamicMenu(nav){

        if(nav.find('.dynamic-menu').length > 0 ){
            return false;
        }

        $('.navbar.l1 li').addClass('dynamic-menu');

        var additionalMenu = $('.navbar.l1') ?
            $('.navbar.l1')
            : '';

        additionalMenu = additionalMenu.find('#l1-nav').html();

        if(additionalMenu == ''){
            return false;
        }

        $(additionalMenu).find('li').addClass('dynamic-menu');
        
        nav.find('span.caret').remove();

        nav.find('a').css({'margin': ''});

        $(additionalMenu).find('a').css({'margin-left':''});

        var addMenu = nav.attr('data-auto-addition') ? 
            nav.attr('data-auto-addition') : 'top';

        addMenu == 'bottom' ?
            nav.find('> ul > li').last().after(additionalMenu)
            : nav.find('> ul > li').not('li.logo').first().before(additionalMenu);

        $('.navbar.l1 li').removeClass('dynamic-menu');

        setNavIndicators(nav), function(nav){

            nav.find('>ul .fa').parent().attr('onClick', 'showMobileChildren(this); return false;');

        }(nav)


    }









    /*
        FUNCTION ADJUST MOBILE LOGO
        This will adjust the look/feel of the logo on mobile
    */

    function adjustMobileLogo(nav){

        var isMobileLogo = nav.find('.mobile-logo');
        nav.find('.mobile-logo').remove();

        var mxHeight = nav.find('.mobile-menu-items').first().outerHeight();

        isMobileLogo.find('img')
            .css({
                'max-height': mxHeight
            });
        nav.find('li.logo img')
            .css({
                'max-height': mxHeight
        });
        $('.navbar.l1').length > 0 ?
            nav.find('li.logo').remove()
            : '';

        nav.find('.mobile-menu-items').prepend(isMobileLogo);
        return false;


    }

}




/*
    RUN STICKY NAV 
    This function checks the distance between the set-stick nav and top of window.
    On scroll the function is triggered. Once the window scroll is greater than or equal
    to the distance of the navigation top distance, it will add class to the nav container
    as well as add a margin to the body so the page does not shift awkwardly.
    The body margin top also allows removal of the stick feature if the nav is first position
    on the page.
*/

var scrollRecord = {};
function runStickyNav(navId){

    var isNav = navId;
    if(navId === undefined){
        return;
    }

    $(window).on('scroll', function(){

        var loggedInUserMargin = $('#wpadminbar') ? 
            $('#wpadminbar').outerHeight() : 0;

        var isScroll = $(window).scrollTop();
        var isOffset = $('.topNav[data-nav-id="'+isNav+'"]').parent().attr('data-offset') ?
            $('.topNav[data-nav-id="'+isNav+'"]').parent().attr('data-offset')
            : ($('.topNav[data-nav-id="'+isNav+'"]').attr('data-offset') ?
                    $('.topNav[data-nav-id="'+isNav+'"]').attr('data-offset')
                    : 0);

        isScroll >= isOffset
            && !$('.topNav[data-nav-id="'+isNav+'"] .mobile-menu').is(':visible') ?
                $('.topNav[data-nav-id="'+isNav+'"]').addClass('stick')
                : $('.topNav[data-nav-id="'+isNav+'"]').removeClass('stick');

        $('.topNav[data-nav-id="'+isNav+'"]').hasClass('stick')
            && !$('.topNav[data-nav-id="'+isNav+'"] .mobile-menu').is(':visible') ?
                $('.topNav[data-nav-id="'+isNav+'"]').css({'margin-top': loggedInUserMargin})
                : $('.topNav[data-nav-id="'+isNav+'"]').css({'margin-top': ''});

        $('body').attr('style') == '' ? 
            $('body').removeAttr('style') : '';


    });
}









/*
    FUNCTION CLEAN CSS
*/

function cleanNavCSS(css){
    
    return css.replace(/}\s+/g,'}')
        .replace(/&gt;/g,'>')
        .replace(/\t/g,'')
        .replace(/[\n\r]/g, '')
        .replace(/{\s/g,'{')
        .replace(/\s+{/g,'{')
        .replace(/{\s+/g,'{')
        .replace(/\s{/g,'{')
        .replace(/}\s/g,'}')
        .replace(/\s}/g,'}')
        .replace(/;\s/g,';')
        .replace(/:\s/g,':');

}