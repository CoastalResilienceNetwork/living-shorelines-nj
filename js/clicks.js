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
						$("#" + t.id + "ls-btn-wrap").hide();
						$(".ls-first-choice-wrap").hide();
						t.esriapi.clearLayers(t);
					});
				// municipalities select
				$("#" + t.id + "selectMuni").chosen({allow_single_deselect:false, width:"98%"})
					.change(function(c){
						t.mun = c.target.value;
						$.each(t.atts,function(i,v){
							if (v.MUN == t.mun){
								t.munUrl = "http://www.njfloodmapper.org/snapshot/#/process?action=tncre&mun_code=" + v.MUN_CODE;
							}
						})
						t.esriapi.zoomToMuni(t);
						$("#" + t.id + "sl-type input").prop("checked", false);
						$(".ls-choice-wraps").hide()
						t.esriapi.clearLayers(t);
						$(c.target).parent().next().show()
						$(".ls-first-choice-wrap").css("display", "flex")
					})
				// first choice radios
				$("#" + t.id + "sl-type input").click(function(c){
					t.slType= c.currentTarget.value;
					$(".ls-choice-wraps").hide()
					t.esriapi.clearLayers(t);
					$(".dis-pro").css("display", "flex")
					$("#" + t.id + "dis-pro input").prop("checked", false)
					t.clicks.clearInputs(t);
				})
				// second choice radios	
				$("#" + t.id + "dis-pro input").click(function(c){
					$(".ls-choice-wraps").hide()
					t.esriapi.clearLayers(t);
					$(".dis-pro").css("display", "flex")
					$(".view-results").css("display", "flex")
					$(".ls-results-wrap").hide();
					t.clicks.clearInputs(t);
				})
				// third choice radios
				$("#" + t.id + "view-results input").click(function(c){
					t.viewResults = c.currentTarget.value;
					$("#" + t.id + "view-ind-techs input:radio[name='teTechs']").prop("checked", false)
					$("#" + t.id + "view-ind-techs input:radio[name='fbTechs']").prop("checked", false)
					$(".dis-pro").css("display", "flex")
					$(".view-results").css("display", "flex")
					if (t.viewResults == "allTech"){
						$(".ati-instr").show();
						$("#" + t.id + "all-tech-info").slideDown();
						$(".view-ind-techs").hide();
						t.esriapi.allTechniques(t);
					}
					if (t.viewResults == "ind-tech"){
						if (t.slType == "tidalMarsh"){
							$("#" + t.id + "forestBeachBulk-etWrap").hide();
							$("#" + t.id + "tidalMarsh-etWrap").slideDown();
						}
						if (t.slType == "forestBeachBulk"){
							$("#" + t.id + "tidalMarsh-etWrap").hide();
							$("#" + t.id + "forestBeachBulk-etWrap").slideDown();
						}
						$(".view-ind-techs").slideDown();
						$("#" + t.id + "all-tech-info").hide();
					}
				})
				// forth choice radios
				$("#" + t.id + "view-ind-techs input").click(function(c){
					t.obj.visibleLayers = [];
					t.obj.visibleLayers.push(c.currentTarget.value);
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				})
				// Enhancement techniques info-graphic functions
				$("#" + t.id + "showEtInfo").click(function(c){
					if (t.picSrc == ""){
						t.picSrc = "Nature-based_Living_Shoreline";
						$("#lsInfoToggle input[value='" + t.picSrc + "']").trigger("click");
					}					
					$("#" + t.infoID).show();
				})
				$(".infopiccloser-nj").click(function(){
					$("#" + t.infoID).hide();
				})
				$("#lsInfoToggle input").click(function(c){
					t.picSrc = c.currentTarget.value;
					$("#lsnj-img").prop("src", "plugins/living-shorelines-nj/images/" + t.picSrc + ".jpg" );
				})
				// municipal report clicks
				$("#" + t.id + "showMunRep").click(function(){
					window.open(t.munUrl);
				})
			},
			clearInputs: function(t){
				$("#" + t.id + "view-results input:radio[name='techs']").prop("checked", false)
				$("#" + t.id + "view-ind-techs input:radio[name='teTechs']").prop("checked", false)
				$("#" + t.id + "view-ind-techs input:radio[name='fbTechs']").prop("checked", false)
			}
        });
    }
);
