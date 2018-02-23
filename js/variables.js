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
			}
        });
    }
);