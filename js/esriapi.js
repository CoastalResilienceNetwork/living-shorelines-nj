define([
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/tasks/query" ,"esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", 
	"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color", "dojo/_base/lang",
	"esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters", "esri/renderers/SimpleRenderer"
],
function ( 	ArcGISDynamicMapServiceLayer, Extent, SpatialReference, Query, QueryTask, declare, FeatureLayer, 
			SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color, lang,
			IdentifyTask, IdentifyParameters, SimpleRenderer) {
        "use strict";

        return declare(null, {
			esriApiFunctions: function(t){	
				// Add dynamic map service
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.7});
				t.map.addLayer(t.dynamicLayer);
				if (t.obj.visibleLayers.length > 0){	
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				t.dynamicLayer.on("load", function () { 			
					t.layersArray = t.dynamicLayer.layerInfos;				
					if (t.obj.stateSet == "no"){
						
					}
					// Save and Share Handler					
					if (t.obj.stateSet == "yes"){
						//extent
						var extent = new Extent(t.obj.extent.xmin, t.obj.extent.ymin, t.obj.extent.xmax, t.obj.extent.ymax, new SpatialReference({ wkid:4326 }))
						t.map.setExtent(extent, true);
						t.obj.stateSet = "no";
					}	
				});		
				// query to populate chosen menu
				var q = new Query();
				var qt = new QueryTask(t.url + "/0" );
				q.where = "OBJECTID > -1";
				q.returnGeometry = false;
				q.outFields = ["*"];
				var c = [];
				qt.execute(q, function(e){
					$.each(e.features, function(i,v){
						t.atts.push(v.attributes)
						c.push(v.attributes.COUNTY)	
					})
					var cu = _.uniq(c, false).sort()
					$.each(cu, function(i,v){
						$('#' + t.id + 'selectCounty').append("<option value='" + v + "'>"+ v +"</option")	
					})
					$('#' + t.id + 'selectCounty').trigger("chosen:updated");			
				});
				// symbol for point clicks
				t.pntSym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 8, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,0]), 1.5), new Color([255,255,0,0.1]));
				t.map.on ("extent-change", function(e,x,b,l){	 
					t.l = e.lod.level	
					if (t.l < 18) { t.pntSym.size = 10; }
					if (t.l == 18){ t.pntSym.size = 20; }
					if (t.l == 19){ t.pntSym.size = 42; }	
					if (t.l > 16) { 
						//$('#' + t.sliderpane.id + 'idIntro').hide();
					}
				});	
				
				
			},
			zoomToMuni: function(t){
				var q = new Query();
				var qt = new QueryTask(t.url + "/0" );
				q.where = "MUN = '" + t.mun + "'";
				q.returnGeometry = true;
				q.outFields = ["OBJECTID"];
				qt.execute(q, function(e){
					t.map.setExtent(e.features[0].geometry.getExtent(), true);	
				});	
			},
			allTechniques: function(t){
				t.obj.visibleLayers = [];
				t.obj.visibleLayers.push(t[t.viewResults + "_" + t.slType + "_ras"])
				t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				// feature layer for all techniques click			
				t.featureLayerOD = new FeatureLayer(t.url + "/" + t[t.viewResults + "_" + t.slType + "_pnt"], { mode: esri.layers.FeatureLayer.ONDEMAND, opacity:"0", outFields:"*" } );
				t.featureLayerOD.setRenderer(new SimpleRenderer(t.pntSym));
				
				t.featureLayerOD.on("mouse-over", function(evt){
					t.map.setMapCursor("pointer");
				});
				t.featureLayerOD.on("mouse-out", function(evt){
					t.map.setMapCursor("default");
				});
				t.featureLayerOD.on("mouse-down", function(evt){
					var atts = evt.graphic.attributes;
					$(".all-tech-atts").hide();
					$("." + t.slType + "-atts").show();
					$(".ati-instr").hide();
					$(".ati-wrap").slideDown();
					$("#" + t.id + "tm-techs-wrap span").each(function(i,v){
						var field = v.id.split("-").pop();
						var fieldThresh = field + "Threshold"
						var fieldParams = field + "ParametersMet"
						if (atts[field]){
							$("#" + v.id).html("<b>" + atts[field] + "</b>")
						}else{
							if (atts[fieldThresh] == 0){
								$("#" + v.id).html("Not Applicable/Not Used")	
								$("#" + v.id).parent().css("font-weight", "normal");
							}
							if (atts[fieldThresh] == 1){
								$("#" + v.id).html("No - " + atts[fieldParams] + " params met")
								$("#" + v.id).parent().css("font-weight", "normal");
							}
							if (atts[fieldThresh] == 2){
								$("#" + v.id).html("Yes - " + atts[fieldParams] + " params met")
								$("#" + v.id).parent().css("font-weight", "bold");
							}
						}
					})
					t.map.graphics.clear();
					t.selectedGraphic = new Graphic(evt.graphic.geometry,t.pntSym);
					t.map.graphics.add(t.selectedGraphic);
				});
				t.map.addLayer(t.featureLayerOD);
			},
			clearLayers: function(t){
				if (t.featureLayerOD){
					t.map.removeLayer(t.featureLayerOD);
				}
				t.obj.visibleLayers = [];
				t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				t.map.graphics.clear();
				$("#" + t.id + "ati-wrap").slideUp();
			}				
		});
    }
);