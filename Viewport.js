/*
This file is part of PG Map Composer.

Copyright (c) 2013 National Mapping and Resource Information Authority

PG Map Composer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PG Map Composer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with PG Map Composer.  If not, see <http://www.gnu.org/licenses/>.
*/

Ext.Loader.setConfig({
disableCaching: false,
enabled: true,
paths: {   
    MyPath:'./App',
	GeoExt: "./lib/GeoExt",		
	} 
});

Ext.application({
    name: 'OL3EXT4',	
	requires:[
		'MyPath.mappanel','MyPath.ExportMap', 'MyPath.UploadLayer'							
		],
    launch: function () {
	
		
		var MapPanel= Ext.create('MyPath.mappanel',{		
		});	 		
		
		var labelForm = new Ext.form.FormPanel({
			items:[{
				xtype: "textarea",
				name: "label",
				value: "",
				fieldLabel: "Text "
			},{
				xtype: "combo",
				store: [10,12,14,16,18,20,22,24,26,28,30],
				displayField: "fontsize",
				fieldLabel: "Font size ",
				//typeAhead: true,
				mode: "local",
				triggerAction: "all",
				editable: false,
			}],
			buttons: [{
				text: "Validate",
				handler: function() {
					var labelValue = labelForm.items.items[0].getValue(); //get the typed  text
					var fontSize = labelForm.items.items[1].getValue(); //:get the  selected font size
					e.feature.style = {label: labelValue, labelSelect: true, fontSize:fontSize}; //labelSelect allows to drag the text
					//labelWindow.close(); //The labelForm is shown in an Ext.Window
					drawLayer.redraw(); //Refresh needed to apply the label
				}
			}]
});
		
	
        Ext.create('Ext.container.Viewport', {	
            layout: 'border',						
            items:[			
				MapPanel,
				//labelForm
				
            ]
        });	
    }
});


