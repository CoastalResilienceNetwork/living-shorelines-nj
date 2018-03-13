// Bring in dojo and javascript api classes as well as varObject.json, js files, and content.html
define([
	"dojo/_base/declare", "framework/PluginBase", "dijit/layout/ContentPane", "dojo/dom", "dojo/dom-style", "dojo/dom-geometry", "dojo/text!./obj.json", 
	"dojo/text!./html/content.html", "dojo/text!./html/enh-techs.html", "dojo/text!./html/env-conds.html", "dojo/text!./html/zoom-to.html", "./js/esriapi", "./js/clicks", "./js/variables", "dojo/_base/lang"	
],
function ( 	declare, PluginBase, ContentPane, dom, domStyle, domGeom, obj, content, enhTechs, envConds, zoomTo, esriapi, clicks, variables, lang ) {
	return declare(PluginBase, {
		// app properties
		toolbarName: "Living Shoreline", showServiceLayersInLegend: true, allowIdentifyWhenActive: false, rendered: false, resizable: false,
		hasCustomPrint: false, size:'custom', width:390, hasHelp:false, fullName: "Living Shoreline",
		
		// First function called when the user clicks the pluging icon. 
		initialize: function (frameworkParameters) {
			// Access framework parameters
			declare.safeMixin(this, frameworkParameters);
			// Define object to access global variables from JSON object. Only add variables to varObject.json that are needed by Save and Share. 
			this.obj = dojo.eval("[" + obj + "]")[0];	
			this.url = "https://services.coastalresilience.org/arcgis/rest/services/New_Jersey/LivingShorelinesNJ/MapServer";
			this.layerDefs = [];
		},
		// Called after initialize at plugin startup (why the tests for undefined). Also called after deactivate when user closes app by clicking X. 
		hibernate: function () {
			if (this.appDiv != undefined){
				$("#" + this.id + "selectCounty").val('').trigger("chosen:updated").trigger("change");
			}
			this.open = "no";
		},
		// Called after hibernate at app startup. Calls the render function which builds the plugins elements and functions.   
		activate: function (showHelpOnStart) {
			if (this.rendered == false) {
				this.rendered = true;							
				this.render();
				$(this.printButton).hide();
			}else{
				this.dynamicLayer.setVisibleLayers(this.obj.visibleLayers);
			}
			this.open = "yes";
		},
		// Called when user hits the minimize '_' icon on the pluging. Also called before hibernate when users closes app by clicking 'X'.
		deactivate: function () {
			this.hibernate();	
		},	
		// Called when user hits 'Save and Share' button. This creates the url that builds the app at a given state using JSON. 
		// Write anything to you varObject.json file you have tracked during user activity.		
		getState: function () {
			// remove this conditional statement when minimize is added
			if ( $('#' + this.id ).is(":visible") ){
				//extent
				this.obj.extent = this.map.geographicExtent;
				this.obj.stateSet = "yes";	
				var state = new Object();
				state = this.obj;
				return state;	
			}
		},
		// Called before activate only when plugin is started from a getState url. 
		//It's overwrites the default JSON definfed in initialize with the saved stae JSON.
		setState: function (state) {
			this.obj = state;
		},
		// Called when the user hits the print icon
		beforePrint: function(printDeferred, $printArea, mapObject) {
			printDeferred.resolve();
		},	
		// Called by activate and builds the plugins elements and functions
		render: function() {
			//this.oid = -1;
			//$('.basemap-selector').trigger('change', 3);
			this.mapScale  = this.map.getScale();
			// BRING IN OTHER JS FILES
			this.esriapi = new esriapi();
			this.clicks = new clicks();
			this.variables = new variables();
			// ADD HTML TO APP
			// Define Content Pane as HTML parent		
			this.appDiv = new ContentPane({style:'padding:8px; flex:1; display:flex; flex-direction:column; height:100%;'});
			this.id = this.appDiv.id
			dom.byId(this.container).appendChild(this.appDiv.domNode);	
			// hide minimize for this app
			$('#' + this.id).parent().parent().find(".plugin-minimize").hide();
			if (this.obj.stateSet == "no"){
				$('#' + this.id).parent().parent().css('display', 'flex')
			}		
			// Get html from content.html, prepend appDiv.id to html element id's, and add to appDiv
			var idUpdate0 = content.replace(/for="/g, 'for="' + this.id);	
			var idUpdate = idUpdate0.replace(/id="/g, 'id="' + this.id);
			$('#' + this.id).html(idUpdate);
			// add enhancement techniques div
			this.enhTechDiv = new ContentPane({style:'display:none; position:absolute; top:8px; left:10px; box-shadow:2px 2px 3px rgba(0,0,0,0.4); border:1px solid #444; height:390px; overflow-y:hidden; border-radius:3px;' });
			this.enhTechID = this.enhTechDiv.id;
			dom.byId('map-0').appendChild(this.enhTechDiv.domNode);
			$('#' + this.enhTechID).html(enhTechs);
			// add environmental conditions div
			this.envConDiv = new ContentPane({style:'display:none; position:absolute; top:8px; left:10px; box-shadow:2px 2px 3px rgba(0,0,0,0.4); border:1px solid #444; overflow-y:hidden; border-radius:3px; background:#fff;' });
			this.envConID = this.envConDiv.id;
			dom.byId('map-0').appendChild(this.envConDiv.domNode);
			$('#' + this.envConID).html(envConds);
			// add zoomTo div
			this.zoomToDiv = new ContentPane({style:'display:none; position:absolute; top:8px; left:50%; width:380px; margin-left:-190px; box-shadow:2px 2px 3px rgba(0,0,0,0.4); border:1px solid #444; border-radius:3px; background:#fff;' });
			this.zoomToID = this.zoomToDiv.id;
			dom.byId('map-0').appendChild(this.zoomToDiv.domNode);
			$('#' + this.zoomToID).html(zoomTo);
			// Set up variables
			this.variables.makeVariables(this);
			// Click listeners
			this.clicks.eventListeners(this);
			// Create ESRI objects and event listeners	
			this.esriapi.esriApiFunctions(this);
			this.rendered = true;	
		}
	});
});