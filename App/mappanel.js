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

Ext.define('MyPath.mappanel',{
	extend:'GeoExt.panel.Map',
	alias:'Widget.mappanel',	
	title: "Philippine Geoportal - Map Composer",   			
	layout:'border',	
	region:'center',
	tPanel:'',
	width:100,
	height:100,
	selLayer:'',	
	gCode:function(addr, callback){	  
				var geocoder = new google.maps.Geocoder();					
				geocoder.geocode({ 'address': addr + ' Philippines' }, function (results, status) {					
					if (status == google.maps.GeocoderStatus.OK) {		
						var xx=results[0].geometry.location.lng();			
						var yy=results[0].geometry.location.lat();		
						SourceDest={a:xx, b:yy};							
					}else{
						console.log("Geocoding failed: " + status); 
						Ext.Msg.alert("Geocoding failed", "Please enter location")
					}				
					callback(SourceDest);	
				})		
	},
		
	buildItems:function(){
		var items = [];
		var me = this;
			
			// zoom in
		items.push(
			Ext.create('Ext.button.Button', Ext.create('GeoExt.Action', {
				control: new OpenLayers.Control.ZoomBox(),
				id: 'btnZoomIn',
				map: map,
				iconCls: 'add',
				iconAlign: 'top',
				icon: 'img/zoom_in.png',
				scale: 'large',
				width: 25, 
				height: 25,
				toggleGroup: 'navigation',
				allowDepress: false,
				tooltip: 'Zoom in',
				handler: function() {
				  if (navigator.appName == "Microsoft Internet Explorer") {
					me.body.applyStyles('cursor:url("img/zoom_in.cur")');
				  }
				  else {
					me.body.applyStyles('cursor:crosshair');
				  }
				}
			}))
		);
		
		
		// zoom out
		items.push(
			Ext.create('Ext.button.Button', Ext.create('GeoExt.Action', {
				control: new OpenLayers.Control.ZoomBox({out: true}),
				id: 'btnZoomOut',
				map: map,
				iconCls: 'add',
				iconAlign: 'top',
				icon: 'img/zoom_out.png',
				toggleGroup: 'navigation',
				tooltip: 'Zoom out',
				scale: 'large',
				width: 25, 
				height: 25,
				handler: function() {					
				  if (navigator.appName == "Microsoft Internet Explorer") {
					me.body.applyStyles('cursor:url("img/zoom_in.cur")');
				  }
				  else {
					me.body.applyStyles('cursor:crosshair');
				  }
				}
			}))
		);
		
		// pan
		items.push(
			Ext.create('Ext.button.Button', Ext.create('GeoExt.Action', {
				control: new OpenLayers.Control.DragPan(),
				id: 'btnPan',
				map: map,
				iconCls: 'add',
				iconAlign: 'top',
				icon: 'img/pan.png',
				scale: 'large',
				width: 25, 
				height: 25,
				toggleGroup: 'navigation',
				tooltip: 'Pan',
				pressed: true,
				handler: function() {					
					me.body.applyStyles('cursor:default');
				},
				listeners: {
					toggle: function(e){
						if(e.pressed) {
							//info.activate();							
							//this.up('panel').pgsGetFeatureInfo.activate();
						} else {
							//info.deactivate();							
							//this.up('panel').pgsGetFeatureInfo.deactivate();							
						} 
					}
				}
			}))
		);
		//search field
		items.push(
			{
				xtype:'textfield',									
				itemId:'Search',
				width:200,
				emptyText:'Location Search',
			}
		);
		
		//Go button		
		items.push(
			{
				xtype:'button',
				text:'Go',
				itemId:'btnGo',
				//disabled:true,
				handler:function(){								
					var me=this.up();				
					var findThis = (me.getComponent('Search').getValue());					
					if (findThis){
						var me=this.up().up();					
						
						if  (map.getLayersByName('My Location').length > 0) {				
							map.getLayersByName('My Location')[0].destroy();					
						};	 				
						console.log(me)
						me.gCode(findThis, function(coord){					
							if  (map.getLayersByName('Gcode').length > 0) {				
								map.getLayersByName('Gcode')[0].destroy();					
							};		 				
							var currLoc = new OpenLayers.Geometry.Point(coord.a,coord.b).transform('EPSG:4326','EPSG:900913');
							var Location = new OpenLayers.Layer.Vector(	'Gcode', {
									 styleMap: new OpenLayers.StyleMap({'default':{										
											externalGraphic: "./img/marker.png",				
											graphicYOffset: -25,
											graphicHeight: 35,
											graphicTitle: findThis
									}}), 	
									displayInLayerSwitcher: false,	
									renderers: ["Canvas"]
							});							
							Location.addFeatures([new OpenLayers.Feature.Vector(currLoc)]);						
							map.addLayer(Location);						
							map.zoomToExtent(Location.getDataExtent());			 		
						})	
					}else{
						Ext.Msg.alert('Message', 'Please enter a location');
					}	
				}	
			}		
		
		);
		
		//full extent
		items.push(
			{			
				xtype:'button',
				tooltip:'Full extent',
				icon:'./img/phil.png',
				scale:'medium',
				width:25,
				height:25,
				handler:function(){
					var me=this.up().up();									
					OthoExtent = new OpenLayers.Bounds(120.613472,14.295979, 121.550385,14.827789).transform('EPSG:4326','EPSG:900913')
					
					var lonlat = new OpenLayers.LonLat(121,14).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
					map.setCenter(lonlat);
					if (map.baseLayer.name=="BING Aerial Map")
						map.zoomTo(5);
					else if (map.baseLayer.name=="OpenStreetMap")					  
						map.zoomTo(6);
					else if (map.baseLayer.name=="Google Map - Satellite")
						map.zoomTo(6);
					else if (map.baseLayer.name=="ArcGIS Online - Imagery")
						map.zoomTo(6);		
					else if (map.baseLayer.name=="Ortho Image 2011 - Metro Manila")	
						map.zoomTo(1);
					else
						map.zoomTo(6);
				}
			}
		);
		
		
			
		items.push(
			{
				xtype:'button',						
				tooltip:'Upload layer',
				icon:'./icons/upload.png',
				height:25,
				width:25,
				scale:'large',
				handler:function(){
					var me = this.up('panel');
					var win = Ext.create('MyPath.UploadLayer', {
						mapContainer:me.map					})					
					win.show();					
				}	
			}
		);
			
		items.push(
			{
				xtype:'button',
				tooltip:'Annotate',
				icon:'./icons/annotate.png',
				scale:'large',
				height:25,
				//toggleGroup: 'navigation',
				width:25,
				handler:function(){				
					var me = this.up('panel');
					console.log(me);
					me.map.getControlsBy('id','drawLabel')[0].activate();							
				}	
			}
		);
		
		items.push(
			{
				xtype:'button',
				tooltip:'Download map',
				icon:'./icons/download.png',
				scale:'large',
				height:25,
				width:25,
				handler:function(){
					var me = this.up('panel');				 				
					var win = Ext.create('MyPath.ExportMap', {						
						map:me.map					
					})					
					win.show();					
					
				
				}	
			}
		);	
		
		items.push(
			'->',
			{
				xtype:'tbtext',
				itemId:'basemapLabel',
				text: 'Basemap: NAMRIA Basemaps'
			
			},
			'->'
		)
		

		
		//switch basemap
		items.push(					
			
			{
				xtype:'button',
				scale:'large',
				itemId:'btnSwitch',
				icon:'./img/layers.png',				
				width:68,
				height:30,	
				tooltip:'Switch basemap',
				menu     : [
					{
						text: 'NAMRIA Basemaps',
						group: 'basemap',
						checked: true,
						handler: function(){
							map.setBaseLayer(map.layers[0]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);													
						}
					},
					{
						text: 'Ortho Image 2011 (selected areas)',
						disable: true,
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.layers[1]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
							
						}
					},
					{
						text: 'Bing Maps - Aerial',
						disable: true,
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.layers[2]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
							
						}
					},
					{
						text: 'ArcGIS Online - Aerial',
						disable: true,
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.layers[3]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
						}
					},
					{
						text: 'Open Street Map',
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.layers[4]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
						}
					},
					{
						text: 'Google Map - Satellite',
						group: 'basemap',
						checked: false,
						handler: function(){
							map.setBaseLayer(map.layers[5]);
							this.up('toolbar').getComponent('basemapLabel').setText('Basemap : ' + this.text);
						}
					}
			   ]
				
			}
		)
		
	
	
		return items;
	},	
	initComponent:function(){		
	
		var popup, me=this 			
		
		
		
		//Map config
		var maxExtent = new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34);
		//var layerMaxExtent = new OpenLayers.Bounds(11128623.5489416,-55718.7227285097,16484559.8541582,3072210.74548981);
		var layerMaxExtent = new OpenLayers.Bounds( 11516520.903064, 482870.29798867,  15821300.345956,  2448728.3963715);		
		var units = 'm';
		var resolutions = [ 3968.75793751588, 
							2645.83862501058, 
							1322.91931250529, 
							661.459656252646, 
							264.583862501058, 
							132.291931250529, 
							66.1459656252646, 
							26.4583862501058, 
							13.2291931250529, 
							6.61459656252646, 
							2.64583862501058, 
							1.32291931250529, 
							0.661459656252646 ];
		var tileSize = new OpenLayers.Size(256, 256);
		var projection = 'EPSG:900913';
		var tileOrigin = new OpenLayers.LonLat(-20037508.342787,20037508.342787);
		//
		
		
		map = new OpenLayers.Map(				
				{ 
				controls: [
					new OpenLayers.Control.Navigation(),								
					new OpenLayers.Control.MousePosition(),
					new OpenLayers.Control.LayerSwitcher(),			
							
					
				],
				
				fallThrough: true,							
				projection: 'EPSG:900913'
				
		});		
		        
      var pgp_basemap_cache = new OpenLayers.Layer.XYZ(					//Use NAMRIA Basemap Tiles
					'NAMRIA Basemaps',
					'http://v2.geoportal.gov.ph/tiles/v2/PGP/${z}/${x}/${y}.png',
					{
						isBaseLayer: true,						
						sphericalMercator:true,					
						transitionEffect: "resize",								
						tileOrigin: tileOrigin,
						displayInLayerSwitcher: false  
						
			
				}
			);
		
		
		var pgp_ortho_mm_cache = new OpenLayers.Layer.XYZ(					//Use NAMRIA Basemap Tiles
				'Ortho Image 2011 (selected areas)',
				'http://v2.geoportal.gov.ph/tiles/v2/Orthoimage/${z}/${x}/${y}.png',
				{
					isBaseLayer: true,						
					sphericalMercator:true,
					displayInLayerSwitcher: false
						
			    }
		);
		
			
		//Bing
		
		var bing_aerial = new OpenLayers.Layer.Bing({
			name: "BING Aerial Map",
			key: 'BING_KEY',
			type: "Aerial",
			displayInLayerSwitcher: false
			
		}, {
			isBaseLayer: true,
			visibility: false,
			transitionEffect: "resize"
		});
		
		//ArcGIS
		
		var arcgis_world_imagery = new OpenLayers.Layer.ArcGIS93Rest("ArcGIS Online - Imagery", 
		'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export',
		{
			layers: 'show:0,1,2,3',
			format: 'png24'
		}, 
		{
			//additional options
			transitionEffect: "resize",
			isBaseLayer: true,
			displayInLayerSwitcher: false
		});
		
		//Open Street Map
		var osm  = new OpenLayers.Layer.OSM("","",
		{
			sphericalMercator: true,
			transitionEffect: "resize",
			isBaseLayer: true,
			displayInLayerSwitcher: false
		});	
		
			
	   //Google
	   var google_satellite = new OpenLayers.Layer.Google(
                "Google Map - Satellite",
                {
					type: google.maps.MapTypeId.SATELLITE, 
					numZoomLevels: 22,
					sphericalMercator: true,
					transitionEffect: "resize",
					isBaseLayer: true,
					displayInLayerSwitcher: false
				}
        );		
		//
		
		var Location = new OpenLayers.Layer.Vector('My Location', {
		 displayInLayerSwitcher: false,	
		 renderers: ["Canvas"]
		});	

		var labelLayer = new OpenLayers.Layer.Vector('label', {		
 			style: new OpenLayers.StyleMap({'default':{
							strokeWidth: 5,
							strokeColor: '#005aff',
							label:'Label'	
					}}), 
			displayInLayerSwitcher: false,				
		});			

		var cloneLayer = new OpenLayers.Layer.Vector('clone', {		            
			displayInLayerSwitcher: false,	
			renderers: ["Canvas"]			
			
		}); 				
		
		map.addLayers([pgp_basemap_cache, pgp_ortho_mm_cache,bing_aerial, arcgis_world_imagery, osm, google_satellite, Location, labelLayer, cloneLayer]);		
		
		//map.zoomToMaxExtent();		
		map.events.register("mousemove", map, function (e) {            
			
		}); 	
		
		var labelLayer = map.getLayersByName('label')[0];
		
		//drag feature control
		var drag = new OpenLayers.Control.DragFeature(labelLayer,{
			id:'dragLabel'
		});
		
		map.addControl(drag);
		
		//Insert label control		
		var labelControl = new OpenLayers.Control.DrawFeature(
			//map.layers[2],
			labelLayer,
			OpenLayers.Handler.Point, {
			id:'drawLabel',
			featureAdded: function(e) {				
			    Ext.create('Ext.window.Window',{
				title:'Enter Text',
				items:[
						new Ext.form.FormPanel({
							height:190, 
							items:[{
								xtype: 'textarea',
								name: 'label',
								padding:10,
								value: '',
								fieldLabel: 'Text '							
							},{
								xtype: 'combo',
								padding:10,
								store: [10,12,14,16,18,20,22,24,26,28,30],
								value:10,
								displayField: 'fontsize',
								fieldLabel: 'Font size ',
								//typeAhead: true,
								mode: 'local',
								triggerAction: 'all',
								editable: false,
							},
							{	
								xtype:'button',
								itemId:'btnColor',	
								name:'#000000',
								style: 'position:absolute; left:115px; top:120px;',						
								menu: {
									xtype: 'colormenu',
									value: '000000',
									itemId:'cmenu',
									handler: function (obj, rgb) {										
										var color='#'+ rgb.toString()										
										this.up().up().btnInnerEl.setStyle({background:color});		
										this.up().up().name=color;										
									} // handler
								}, // menu
							},{
									xtype: 'label',
									forId: 'myFieldId',
									text: 'Font color:',
									margin: '0 0 0 10'
							}],
							buttons: [{
								text: 'Ok',
								handler: function() {
									var me= this.up('form');
									var textColor = me.getComponent('btnColor').name;
									var labelValue = me.items.items[0].getValue(); //get the typed  text
									var fontSize = me.items.items[1].getValue(); //:get the  selected font size
									e.style = {label: labelValue, labelSelect: true, fontSize:fontSize, fontColor:textColor}; //labelSelect allows to drag the text
									labelLayer.redraw(); //Refresh needed to apply the label							
									console.log(me);
									map.getControlsBy('id','drawLabel')[0].deactivate();							
									map.getControlsBy('id','dragLabel')[0].activate();
									me.up('panel').close();									
																	
								}
							}]
						})
				]			
			  }).show();			  
			}
		  }
		); 
		map.addControl(labelControl)
		 
		//
		map.events.register('click', map, function(e){	
						
			var point = map.getLonLatFromPixel(this.events.getMousePosition(e) )     
			var pos = new OpenLayers.LonLat(point.lon,point.lat).transform('EPSG:900913', 'EPSG:4326');
			
		});  
		
		Ext.apply(this, {
			map:map,
			dockedItems: [
				{ xtype: 'toolbar',
				  dock: 'top',
				  items: this.buildItems(),
				}
			],
			center: new OpenLayers.LonLat(13610082.099764,1403622.1394924),
			zoom:6					
		});		
		
		this.callParent();   
    }	
	
	
});


