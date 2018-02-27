define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/graphicsUtils", "esri/layers/FeatureLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol", "dojo/_base/Color"
],
function ( declare, Query, QueryTask, graphicsUtils, FeatureLayer, SimpleLineSymbol, SimpleMarkerSymbol, Color ) {
        "use strict";

        return declare(null, {
			eventListeners: function(t){
				// counties select
				$("#" + t.id + "selectCounty").chosen({allow_single_deselect:false, width:"300px"})
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
						$(c.target).parent().parent().next().show()
						$("#" + t.id + "ls-btn-wrap").hide();
						$(".ls-first-choice-wrap").hide();
						t.clicks.hideEnvConds(t);
						t.esriapi.clearLayers(t);
					});
				// municipalities select
				$("#" + t.id + "selectMuni").chosen({allow_single_deselect:false, width:"300px"})
					.change(function(c){
						t.mun = c.target.value;
						$.each(t.atts,function(i,v){
							if (v.MUN == t.mun){
								t.munUrl = "http://www.njfloodmapper.org/snapshot/#/process?action=tncre&mun_code=" + v.MUN_CODE;
							}
						})
						t.esriapi.zoomToMuni(t);
						$("#" + t.id + "sl-type input").prop("checked", false);
						$(".ls-choice-wraps").hide();
						t.clicks.hideEnvConds(t);
						t.esriapi.clearLayers(t);
						$(c.target).parent().next().show()
						$(".ls-first-choice-wrap").css("display", "flex")
					})
				// first choice radios
				$("#" + t.id + "sl-type input").click(function(c){
					t.slType= c.currentTarget.value;
					$(".ls-choice-wraps").hide();
					t.clicks.hideEnvConds(t);
					t.esriapi.clearLayers(t);
					$(".dis-pro").css("display", "flex")
					$("#" + t.id + "dis-pro input").prop("checked", false)
					t.clicks.clearInputs(t);
				})
				// second choice radios	
				$("#" + t.id + "dis-pro input").click(function(c){
					$(".ls-choice-wraps").hide();
					t.clicks.hideEnvConds(t);
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
					$(".iti-wrap").hide();
					t.clicks.hideEnvConds(t);
					$(".dis-pro").css("display", "flex");
					$(".view-results").css("display", "flex");
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
						t.obj.visibleLayers = [];
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers)
						$("#" + t.id + "ls-bottom").hide();
					}
				})
				// forth choice radios
				$(".etWrap input").click(function(c){
					$("#" + t.id + "iti-instr").show();
					$(".iti-wrap").hide();
					var valArray = c.currentTarget.value.split("/");
					t.indTechVal = valArray[0];
					t.indTechName = valArray[1];
					$("#" + t.id + "ind-tech-cb-label").html(t.indTechName);
					$("#" + t.id + "ind-tech-cb").val(t.indTechVal).prop("checked", true);
					t.obj.visibleLayers = [];
					t.obj.visibleLayers.push(t.indTechVal);
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					t.esriapi.indTechniques(t);
					$("#" + t.id + "ind-teah-cb-indent input").each(function(i,v){
						if ( v.checked ){
							$("#" + v.id).prop("checked", false).trigger("click");
						}
					})
					$("#" + t.id + "env-cond-wrap").slideDown();
					$("#" + t.id + "ls-bottom").css("display", "flex");
				})
				// Main environmental conditions checkbox
				$("#" + t.id + "ind-tech-cb").click(function(c){
					if ( c.currentTarget.checked ){
						t.obj.visibleLayers.push(t.indTechVal);
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						t.esriapi.indTechniques(t);
					}else{
						if (t.featureLayerOD){
							t.map.removeLayer(t.featureLayerOD);
						}
						t.map.graphics.clear();
						var index = t.obj.visibleLayers.indexOf(c.currentTarget.value)
						if ( index > -1){
							t.obj.visibleLayers.splice(index,1)
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						}
						$("#" + t.id + "iti-wrap").hide()
					}
				})
				// Environmental conditions layers checkbox
				$("#" + t.id + "ind-teah-cb-indent input").click(function(c){
					if ( c.currentTarget.checked ){
						t.obj.visibleLayers.push(c.currentTarget.value);
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					}else{
						var index = t.obj.visibleLayers.indexOf(c.currentTarget.value)
						if (index > -1){
							t.obj.visibleLayers.splice(index,1)
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers)
						}
					}
				})
				// Environmental conditions info clicks
				$("#" + t.id + "env-cond-wrap .ls-info").click(function(c){
					var tgt = c.currentTarget.id.split("-").pop();
					$("#" + t.id + "info-" + tgt ).hide();
					if (tgt == "show"){	
						$("#" + t.id + "info-hide").css("display", "inline-block");
						$("#" + t.id + "env-cond-instr").slideDown();
					}
					if (tgt == "hide"){
						$("#" + t.id + "info-show").css("display", "inline-block");
						$("#" + t.id + "env-cond-instr").slideUp();	
					}
				})
				// Environmental conditions info clicks
				$.each(t.envCondTable.iceCoverMarsh,function(i,v){
					$.each(v, function(key, valArray){
						if (key == "header"){
							$.each(valArray, function(i2, hval){
								$('#ecTable thead tr').append("<th style='color:#101d28;' class='ec-tbl ec-thc'>" + hval + "</th>")
							});
						}else{
							var tbl = "";
							$.each(valArray, function(i3, rval){
								var sty = "#5d6165; font-weight:bold; text-align:left;"
								if (rval == "Yes"){
									sty = "green;"
								}
								if (rval == "No"){
									sty = "red;"
								}
								if (rval == "NA*"){
									sty = "#5d6165;"
									naPresent = "yes"
								}
								tbl = tbl + "<td class='ec-tbl ec-tdc' style='color:" + sty + "'>" + rval + "</td>"
							})
							$("#ecTable").find("tbody").append("<tr>" + tbl + "</tr>")
						}
					})	
				})

				// Enhancement techniques info-graphic functions
				$("#" + t.id + "showEtInfo").click(function(c){
					if (t.picSrc == ""){
						t.picSrc = "Nature-based_Living_Shoreline";
						$("#lsInfoToggle input[value='" + t.picSrc + "']").trigger("click");
					}					
					$("#" + t.enhTechID).show();
				})
				$(".infopiccloser-nj").click(function(){
					$("#" + t.enhTechID).hide();
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
			},
			hideEnvConds: function(t){
				$("#" + t.id + "env-cond-wrap").hide();
				$("#" + t.id + "env-cond-wrap input").prop("checked", false);
				$("#" + t.id + "iti-instr").hide();
			}
        });
    }
);
