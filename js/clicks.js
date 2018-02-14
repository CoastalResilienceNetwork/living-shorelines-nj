define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/graphicsUtils", "esri/layers/FeatureLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol", "dojo/_base/Color"
],
function ( declare, Query, QueryTask, graphicsUtils, FeatureLayer, SimpleLineSymbol, SimpleMarkerSymbol, Color ) {
        "use strict";

        return declare(null, {
			eventListeners: function(t){
				// counties select
				$("#" + t.id + "selectCounty").chosen({allow_single_deselect:false, width:"98%"})
					.change(function(c){
						t.county = c.target.value;
						$('#' + t.id + 'selectMuni').empty()
						$('#' + t.id + 'selectMuni').append("<option></option")
						var m = [];
						$.each(t.atts, function(i,v){
							if (v.COUNTY == t.county){
								m.push(v.MUN)
							}
						})
						var ms = m.sort();
						$.each(ms,function(i,v){
							$('#' + t.id + 'selectMuni').append("<option value='" + v + "'>" + v + "</option")	
						})
						$('#' + t.id + 'selectMuni').trigger("chosen:updated");
						$(c.target).parent().next().show()
						t.esriapi.clearLayers(t);
					});
				// municipalities select
				$("#" + t.id + "selectMuni").chosen({allow_single_deselect:false, width:"98%"})
					.change(function(c){
						t.mun = c.target.value;
						t.esriapi.zoomToMuni(t);
						$("#" + t.id + "sl-type input").prop("checked", false);
						$(".ls-choice-wraps").hide()
						t.esriapi.clearLayers(t);
						$(".ls-first-choice-wrap").css("display", "flex")
					})
				// first choice radios
				$("#" + t.id + "sl-type input").click(function(c){
					t.slType= c.currentTarget.value;
					$(".ls-choice-wraps").hide()
					t.esriapi.clearLayers(t);
					$(".dis-pro").css("display", "flex")
					$("#" + t.id + "dis-pro input").prop("checked", false)
					$("#" + t.id + "view-results input:radio[name='techs']").prop("checked", false)
				})
				// second choice radios	
				$("#" + t.id + "dis-pro input").click(function(c){
					$(".ls-choice-wraps").hide()
					t.esriapi.clearLayers(t);
					$(".dis-pro").css("display", "flex")
					$(".view-results").css("display", "flex")
					$(".ls-results-wrap").hide();
					$("#" + t.id + "view-results input:radio[name='techs']").prop("checked", false)
				})
				// third choice radios
				$("#" + t.id + "view-results input").click(function(c){
					t.viewResults = c.currentTarget.value;
					if (t.viewResults == "allTech"){
						$("#" + t.id + "all-tech-info").slideDown();
						t.esriapi.allTechniques(t);
					}
					if (t.viewResults == "ind-tech"){
						t.esriapi.clearLayers(t);
						$("#" + t.id + "all-tech-info").slideUp();
						// show forth choice
					}
				})
			},
			clearInputs: function(t){

			}
        });
    }
);
