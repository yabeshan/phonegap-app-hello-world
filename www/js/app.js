

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
                html: '<div style="position:absolute;background-color:#aaf;height:100%;width:100%">Text</div>',
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

                            var mainMoveX = Math.floor( Math.random()*200 );
                            var style = {};

                            style['-webkit-transform'] = 'translate3d(' + mainMoveX + 'px, 0, 0)';
                            style['-webkit-transition'] = 'all .5s ease-in-out';
                            var mainEl = Ext.getCmp('StartPagePanel').element;
                            mainEl.setStyle(style);
                        },
                        element: 'innerElement'
                    }
                }
            },{
                html: '<div style="position:absolute;background-color:#900;height:200px">Text</div>',
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
                html: '<div style="position:absolute;background-color:#afa;height:100%;width:100%">Main page</div>',
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
                html: '<div style="position:absolute;background-color:#090;height:200px">Text</div>',
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
            html: '<div style="position:absolute;top:200px;background-color:#f99;height:10%;width:10%">Unvisible Panel</div>'
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