define([
	"dojo/_base/declare"
],
function ( declare ) {
        "use strict";

        return declare(null, {
			makeVariables: function(t){
				t.county = "";
				t.atts = [];
				t.picSrc = "";
				t.munUrl = "";
				// layer IDs
				t.allTech_tidalMarsh_ras = 12;
				t.allTech_tidalMarsh_pnt = 13;
				t.allTech_forestBeachBulk_ras = 23;				
				t.allTech_forestBeachBulk_pnt = 24;				
				t.enTechLyrs = [2,4,6,8,10,15,17,19,21];
				t.envCondTable = {
					"iceCoverMarsh": [
						{
							"header": ["Environmental parameter criteria thresholds", "Nature-Based Living Shoreline", "Living Reef Breakwater", "Marsh Sill", "Ecologically Enhanced Revement", "Breakwater"],
							"row1": ["Low", "Yes", "Yes", "Yes", "Yes","Yes"],
							"row2": ["Moderate", "Yes", "Yes", "Yes", "Yes","Yes"],
							"row3": ["High", "No", "No", "No", "Yes","Yes"],
							"row4": ["Higher", "No", "No", "No", "Yes","Yes"],
							"row5": ["Highest", "No", "No", "No", "Yes","No"]
						}
					],	
					"iceCoverUpland": [
						{
							"header": ["Environmental parameter criteria thresholds", "Beach Restoration", "Living Reef Breakwater", "Breakwater", "Ecologically Enhanced Revement"],
							"row1": ["Low", "Yes", "Yes", "Yes", "Yes"],
							"row2": ["Moderate", "Yes", "Yes", "Yes", "Yes"],
							"row3": ["High", "Yes", "No", "Yes", "Yes"],
							"row4": ["Higher", "Yes", "No", "Yes", "Yes"],
							"row5": ["Highest", "Yes", "No", "No", "Yes"]
						}
					],	
					"nearshoreSlopeMarsh": [
						{
							"header": ["Environmental parameter criteria thresholds", "Nature-Based Living Shoreline", "Living Reef Breakwater", "Marsh Sill", "Ecologically Enhanced Revement", "Breakwater"],
							"row1": ["0-5%", "Yes", "Yes", "Yes", "Yes", "Yes"],
							"row2": ["5-10%", "Yes", "Yes", "Yes", "Yes", "Yes"],
							"row3": ["10-15%", "No", "No", "No", "Yes", "No"],
							"row4": ["15-20%", "No", "No", "No", "Yes", "No"],
							"row5": ["> 20%", "No", "No", "No", "Yes", "No"]
						}
					],
					"nearshoreSlopeUpland": [
						{
							"header": ["Environmental parameter criteria thresholds", "Beach Restoration", "Living Reef Breakwater", "Breakwater", "Ecologically Enhanced Revement"],
							"row1": ["0-5%", "Yes", "Yes", "Yes", "Yes"],
							"row2": ["5-10%", "Yes", "Yes", "Yes", "Yes"],
							"row3": ["10-15%", "No", "No", "No", "Yes"],
							"row4": ["15-20%", "No", "No", "No", "Yes"],
							"row5": ["> 20%", "No", "No", "No", "Yes"]
						}
					],
					"shorelineSlopeMarsh": [
						{
							"header": ["Environmental parameter criteria thresholds", "Nature-Based Living Shoreline", "Living Reef Breakwater", "Marsh Sill", "Ecologically Enhanced Revement", "Breakwater"],
							"row1": ["0-5%", "Yes", "Yes", "Yes", "Yes", "Yes"],
							"row2": ["5-10%", "Yes", "Yes", "Yes", "Yes", "Yes"],
							"row3": ["10-15%", "No", "Yes", "Yes", "Yes", "Yes"],
							"row4": ["15-20%", "No", "Yes", "Yes", "Yes", "Yes"],
							"row5": ["> 20%", "No", "No", "No", "Yes", "Yes"]
						}
					],
					"shorelineSlopeUpland": [
						{
							"header": ["Environmental parameter criteria thresholds", "Beach Restoration", "Living Reef Breakwater", "Breakwater", "Ecologically Enhanced Revement"],
							"row1": ["0-5%", "Yes", "Yes", "Yes", "Yes"],
							"row2": ["5-10%", "Yes", "Yes", "Yes", "Yes"],
							"row3": ["10-15%", "Yes", "Yes", "Yes", "Yes"],
							"row4": ["15-20%", "Yes", "Yes", "Yes", "Yes"],
							"row5": ["> 20%", "No", "No", "Yes", "Yes"]
						}
					],
					"waveHeightMarsh": [
						{
							"header": ["Environmental parameter criteria thresholds", "Nature-Based Living Shoreline", "Living Reef Breakwater", "Marsh Sill", "Ecologically Enhanced Revement", "Breakwater"],
							"row1": ["<1 ft", "Yes", "Yes", "Yes", "NA*", "NA*"],
							"row2": ["1-2 ft", "No", "Yes", "Yes", "Yes", "NA*"],
							"row3": ["2-3 ft", "No", "Yes", "Yes", "Yes", "NA*"],
							"row4": ["3-4 ft", "No", "No", "No", "Yes", "Yes"],
							"row5": ["> 4 ft", "No", "No", "No", "Yes", "Yes"]
						}
					],
					"waveHeightUpland": [
						{
							"header": ["Environmental parameter criteria thresholds", "Beach Restoration", "Living Reef Breakwater", "Breakwater", "Ecologically Enhanced Revement"],
							"row1": ["<1 ft", "Yes", "Yes", "NA*", "NA*"],
							"row2": ["1-2 ft", "Yes", "Yes", "NA*", "Yes"],
							"row3": ["2-3 ft", "Yes", "Yes", "NA*", "Yes"],
							"row4": ["3-4 ft", "Yes", "No", "Yes", "Yes"],
							"row5": ["> 4 ft", "Yes", "No", "Yes", "Yes"]
						}
					],
					"salinityMarsh": [
						{
							"header": ["Environmental parameter criteria thresholds", "Nature-Based Living Shoreline", "Living Reef Breakwater", "Marsh Sill", "Ecologically Enhanced Revement", "Breakwater"],
							"row1": ["0-1 ppt", "No", "No", "Yes", "Yes", "Yes"],
							"row2": ["1-3 ppt", "No", "No", "Yes", "Yes", "Yes"],
							"row3": ["3-10 ppt", "Yes", "Yes", "Yes", "Yes", "Yes"],
							"row4": ["10-30 ppt", "Yes", "Yes", "Yes", "Yes", "Yes"],
							"row5": ["> 30 ppt", "No", "No", "Yes", "Yes", "Yes"]
						}
					],
					"salinityUpland": [
						{
							"header": ["Environmental parameter criteria thresholds", "Beach Restoration", "Living Reef Breakwater", "Breakwater", "Ecologically Enhanced Revement"],
							"row1": ["0-1 ppt", "Yes", "No", "Yes", "Yes"],
							"row2": ["1-3 ppt", "Yes", "No", "Yes", "Yes"],
							"row3": ["3-10 ppt", "Yes", "Yes", "Yes", "Yes"],
							"row4": ["10-30 ppt", "Yes", "Yes", "Yes", "Yes"],
							"row5": ["> 30 ppt", "Yes", "No", "Yes", "Yes"]	
						}
					],
					"tidalRangeMarsh": [
						{
							"header": ["Environmental parameter criteria thresholds", "Nature-Based Living Shoreline", "Living Reef Breakwater", "Marsh Sill", "Ecologically Enhanced Revement", "Breakwater"],
							"row1": ["0-2 ft", "Yes", "Yes", "Yes", "Yes", "Yes"],
							"row2": ["2-4 ft", "Yes", "Yes", "Yes", "Yes", "Yes"],
							"row3": ["4-6 ft", "No", "No", "No", "Yes", "Yes"],
							"row4": ["> 6 ft", "No", "No", "No", "Yes", "Yes"]
						}
					],
					"tidalRangeUpland": [
						{
							"header": ["Environmental parameter criteria thresholds", "Beach Restoration", "Living Reef Breakwater", "Breakwater", "Ecologically Enhanced Revement"],
							"row1": ["0-2 ft", "Yes", "Yes", "Yes", "Yes"],
							"row2": ["2-4 ft", "Yes", "Yes", "Yes", "Yes"],
							"row3": ["4-6 ft", "Yes", "No", "Yes", "Yes"],
							"row4": ["> 6 ft", "Yes", "No", "Yes", "Yes"]	
						}
					],
					"shorelineChangeMarsh": [
						{
							"header": ["Environmental parameter criteria thresholds", "Nature-Based Living Shoreline", "Living Reef Breakwater", "Marsh Sill", "Ecologically Enhanced Revement", "Breakwater"],
							"row1": ["Accretion", "NA*", "NA*", "NA*", "NA*", "NA*"],
							"row2": ["0-2 ft/yr", "Yes", "Yes", "Yes", "NA*", "NA*"],
							"row3": ["2-4 ft/yr", "Yes", "Yes", "Yes", "Yes", "Yes"],
							"row4": ["4-6 ft/yr", "No", "No", "No", "Yes", "Yes"],
							"row5": [">6 ft/yr", "No", "No", "No", "Yes", "Yes"]		
						}
					],
					"shorelineChangeUpland": [
						{
							"header": ["Environmental parameter criteria thresholds", "Beach Restoration", "Living Reef Breakwater", "Breakwater", "Ecologically Enhanced Revement"],
							"row1": ["Accretion", "NA*", "NA*", "NA*", "NA*"],
							"row2": ["0-2 ft/yr", "Yes", "Yes", "NA*", "NA*"],
							"row3": ["2-4 ft/yr", "Yes", "Yes", "Yes", "Yes"],
							"row4": ["4-6 ft/yr", "No", "No", "Yes", "Yes"],
							"row5": [">6 ft/yr", "No", "No", "Yes", "Yes"]
						}
					]
				}
			}
        });
    }
);