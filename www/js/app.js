

/**************************************************** CONTROLLER ******************************************/

Ext.define('App.controller.PageController', {
    extend: 'Ext.app.Controller',

    goPage: function( data ) {
        var nextPageCmp, animSide;
        if (data.nextPage==0) {
            nextPageCmp = Ext.getCmp('StartPage');
            animSide = 'right';
        } else {
            nextPageCmp = Ext.getCmp('MainPage');
            animSide = 'left';
        }
        nextPageCmp.update();

        var panelHolder = Ext.getCmp('panelHolder');
        panelHolder.getLayout().setAnimation({
            type: 'slide', duration: 300, direction: animSide
        });
        panelHolder.setActiveItem( nextPageCmp );
    }
});

/**************************************************** VIEW ******************************************/

Ext.define('App.view.StartPage' ,{
    extend: 'Ext.Container',
    alias : 'widget.startPage',
    id:'StartPage',

    config: {
        items:[
            {
                html: '<div class="page start-page"><p>Start Page.</p><p>Swipe for move "Unvisible Panel".</p></div>',
                listeners: {
                    swipe: {
                        fn: function( e ) {
//                            if (e.direction=="left") {
//                                App.app.dispatch({
//                                    controller:'PageController',
//                                    action:'goPage',
//                                    args:[{nextPage:1}]
//                                });
//                            }

                            alert("swipe");
                            var mainMoveX = Math.floor( Math.random()*400 );
                            var style = {};

                            style['-webkit-transform'] = 'translate3d(' + mainMoveX + 'px, 0, 0)';
//                            style['-webkit-transform'] = 'translateX(' + mainMoveX + 'px)';
                            style['-webkit-transition'] = 'all .5s ease-in-out';

                            Ext.getCmp('StartPagePanel').setStyle(style);
                        },
                        element: 'innerElement'
                    }
                }
            },{
                html: '<div class="button navig-button">Next Page</div>',
                listeners: {
                    tap: {
                        fn: function( e ) {
                            App.app.dispatch({
                                controller:'PageController',
                                action:'goPage',
                                args:[{nextPage:1}]
                            });
                        },
                        element: 'element'
                    }
                }
            },{
                xtype: 'mainPagePanel',
                id:'StartPagePanel'
            }
        ]
    },

    initialize: function() {},
    update:function(){
        if ( Math.random()*10 > 5 ) {
            Ext.getCmp('StartPagePanel').hide();
        } else {
            Ext.getCmp('StartPagePanel').show();
        }
    }

});

Ext.define('App.view.MainPage' ,{
    extend: 'Ext.Container',
    alias : 'widget.mainPage',
    id:'MainPage',

    config: {
        items:[
            {
                html: '<div class="page main-page"><p>Main page.</p><p>Swipe to right for prev page</p> </div>',
                listeners: {
                    swipe: {
                        fn: function( e ) {
                            if (e.direction=="right") {
                                App.app.dispatch({
                                    controller:'PageController',
                                    action:'goPage',
                                    args:[{nextPage:0}]
                                });
                            }
                        },
                        element: 'innerElement'
                    }
                }
            },{
                html: '<div class="button navig-button">Prev page</div>',
                listeners: {
                    tap: {
                        fn: function( e ) {
                            App.app.dispatch({
                                controller:'PageController',
                                action:'goPage',
                                args:[{nextPage:0}]
                            });
                        },
                        element: 'element'
                    }
                }
            },{
                xtype: 'mainPagePanel',
                id:'MainPagePanel'
            }
        ]
    },

    initialize: function() {},
    update:function(){
        if ( Math.random()*10 > 5 ) {
            Ext.getCmp('MainPagePanel').hide();
        } else {
            Ext.getCmp('MainPagePanel').show();
        }
    }

});

Ext.define('App.view.MainPagePanel' ,{
    extend: 'Ext.Container',
    alias : 'widget.mainPagePanel',

    config: {
        items:[{
            html: '<div class="panel unvisible-panel">Unvisible Panel</div>'
        }]
    }
});



/**************************************************** APPLICATION ******************************************/

var appInit = function() {
    if (initflag==true) return;

    Ext.application({
        name: 'App',

        controllers: [
            'PageController'
        ],

        views: [
            'StartPage', 'MainPage'
        ],

        launch: function() {

            Ext.create('Ext.Panel', {
                id:'panelHolder',
                fullscreen: true,
                layout: 'card',
                activeItem: 0,
                items: [ {xtype:'startPage'}, {xtype:'mainPage'} ]
            });

        }
    });
};

var initflag = false;
var onDeviceReady = function() {
    appInit();
    initflag = true;
    window.onload = function(){};
};

document.addEventListener('deviceready', onDeviceReady, false);
window.onload=function(){
    setTimeout( onDeviceReady, 1000 );
};