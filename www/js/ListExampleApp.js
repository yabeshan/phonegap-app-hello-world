
/**************************************************** MODEL ******************************************/
Ext.define('AM.model.User', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id', 'name', 'email', 'department']
    }
});

Ext.define('AM.model.Department', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['code', 'name', 'location']
    }
});

/**************************************************** STORE ******************************************/
Ext.define('AM.store.Users', {
    extend: 'Ext.data.Store',

    config: {
        autoLoad: true,
        model: 'AM.model.User',
        storeId: 'Users',
        data  : [
            { id : 'id1', name : 'name1', email : 'email1', department : 'code1' },
            { id : 'id2', name : 'name2', email : 'email2', department : 'code2' },
            { id : 'id3', name : 'name3', email : 'email3', department : 'code3' }
        ]
//        proxy: {
//            type: 'ajax',
//            api: {
//                read: 'data/users.json'
//            },
//            reader: {
//                type: 'json',
//                rootProperty: 'users'
//            }
//        }
    },

    filterUsersByDepartment: function(deptCode) {
        this.clearFilter();
        this.filter([{
            property: 'department',
            value: deptCode
        }]);
    },

    refresh: function() {
        this.clearFilter();
    }
});

Ext.define('AM.store.Departments', {
    extend: 'Ext.data.Store',
    model: 'AM.model.Department',

    config: {
        autoLoad: true,
        model: 'AM.model.Department',
        storeId: 'Departments',
        data  : [
            { code : 'code1', name : 'name1', location : 'location1' },
            { code : 'code2', name : 'name2', location : 'location2' },
            { code : 'code3', name : 'name3', location : 'location3' }
        ]

//        proxy: {
//            type: 'ajax',
//            api: {
//                read: 'data/departments.json'
//            },
//            reader: {
//                type: 'json',
//                rootProperty: 'departments'
//            }
//        }
    }
});


/**************************************************** VIEW ******************************************/
Ext.define('AM.view.user.List' ,{
    extend: 'Ext.Container',
    alias : 'widget.userlist',
    config: {
        ui: 'light',
        layout: {
            type: 'fit'
        },
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                title: 'All Users',
                defaults: {
                    iconMask: true
                },
                items: [{
                    xtype: 'spacer'
                },{
                        iconCls: 'refresh',
                        ui: 'confirm',
                        handler: function(){
                            this.up('userlist').down('list').getStore().refresh();
                            this.up('toolbar').setTitle('All Users');
                        }
                    }]
            },{
                xtype: 'list',
                height: '100%',
                ui: 'round',
                itemTpl: [
                    '<div style="float:left;">{name}</div>',
                    '<div style="float:left;position:absolute;padding-left:150px;">{email}</div>'
                ],
                store: 'Users',
                onItemDisclosure: true
            }
        ]
    }
});



Ext.define('AM.view.department.List' ,{
    extend: 'Ext.Container',
    alias : 'widget.departmentlist',
    config: {
        ui: 'light',
        layout: {
            type: 'fit'
        },
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'Departments'
            },{
                xtype: 'list',
                height: '100%',
                ui: 'round',
                itemTpl: [
                    '<div style="float:left;">{name}</div>',
                    '<div style="float:left;position:absolute;padding-left:150px;">{location}</div>'
                ],
                store: 'Departments',
                onItemDisclosure: false
            }
        ]
    }
});

Ext.define('AM.view.user.Edit', {
    extend: 'Ext.form.Panel',
    alias : 'widget.useredit',
    config: {
        ui: 'light',
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'Edit User'
            },
            {
                xtype: 'textfield',
                label: 'Name',
                name: 'name',
                labelWidth: '50%',
                required: true
            },
            {
                xtype: 'textfield',
                label: 'Email',
                name: 'email',
                labelWidth: '50%',
                required: true
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [{
                    xtype: 'button',
                    margin: 10,
                    align: 'left',
                    ui: 'confirm',
                    action: 'save',
                    text: 'Save'
                }, {
                    xtype: 'spacer'
                }, {
                    xtype: 'button',
                    margin: 10,
                    align: 'right',
                    ui: 'decline',
                    action: 'cancel',
                    text: 'Cancel'
                }]
            }

        ]
    }
});


/**************************************************** CONTROLLER ******************************************/
Ext.define('AM.controller.Users', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Users'],
        models: ['User'],
        views: ['user.Edit', 'user.List'],
        refs: {
            usersPanel: 'userlist'
        }
    },
    init: function(app) {
        this.control({
            'userlist list': {
                disclose: this.editUser
            },
            'useredit button[action=save]': {
                tap: this.updateUser
            },
            'useredit button[action=cancel]': {
                tap: this.cancelEditUser
            }
        });

        app.on('departmentselected', function(app, model) {
            this.getUsersStore().filterUsersByDepartment(model.get('code'));
            this.getUsersPanel().down('toolbar').setTitle(model.get('name') + ' Users');
        }, this);
    },
    editUser: function(view, model, t, index, e, eOpts) {
        var edit = Ext.create('AM.view.user.Edit');
        Ext.Viewport.add(edit);
        edit.setRecord(model);
        Ext.Viewport.setActiveItem(edit);
    },
    updateUser: function(button, e ,eOpts) {
        var form   = button.up('formpanel');
        var record = form.getRecord(),
            values = form.getValues();
        record.set(values);
        this.getUsersStore().sync();
        Ext.Viewport.setActiveItem(0);
    },
    cancelEditUser: function(button, e ,eOpts) {
        Ext.Viewport.setActiveItem(0);
    },
    showUsersList: function() {
        var list = Ext.create('AM.view.user.List');
        Ext.Viewport.add(list);
    },
    getUsersStore: function() {
        return this.getUsersPanel().down('list').getStore();
    }
});


Ext.define('AM.controller.Departments', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Departments'],
        models: ['Department'],
        views: ['department.List']
    },

    init: function() {
        this.control({
            'departmentlist list': {
                itemtap: this.showDepartmentUser
            }
        });
    },
    showDepartmentUser: function(view, idx, t, model, e, eOpts) {
        var app = this.initialConfig.application;
        app.fireEvent('departmentselected', app, model);
    }
});


/**************************************************** APPLICATION ******************************************/
Ext.application({
    name: 'AM',
    // dependencies
    controllers: ['Users', 'Departments'],

    // launch application
    launch: function() {
        var config = {
            layout: 'fit',
            items: [{
                xtype: 'departmentlist',
                docked: 'left',
                width: 400
            }, {
                xtype: 'userlist'
            }]

        };
        Ext.Viewport.add(config);
    }
});