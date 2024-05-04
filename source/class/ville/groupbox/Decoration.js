/* ************************************************************************

   License: MIT

   Authors: Chris Eskew (sqville)

************************************************************************ */

/**
 * @asset(ville/groupbox/baseline-expand_more-24px.svg)
 * @asset(ville/groupbox/baseline-expand_less-24px.svg)
 */

qx.Theme.define("ville.groupbox.Decoration",
{
  decorations :
  {    
    "ville-groupbox-open" :
    {
      style :
      {
        backgroundImage: "ville/groupbox/baseline-expand_less-24px.svg",
        backgroundRepeat: "no-repeat",
        backgroundPositionX: "right",
        backgroundPositionY: "center"
      }
    },

    "ville-groupbox-closed" :
    {
      style :
      {
        backgroundImage: "ville/groupbox/baseline-expand_more-24px.svg",
        backgroundRepeat: "no-repeat",
        backgroundPositionX: "right",
        backgroundPositionY: "center"
      }
    },

    "ville-white-box" :
    {
      style :
      {
        width: 1,
        color: "white-box-border",
        radius: 3
      }
    },

    "ville-connected-top-box" :
    {
    	include : "ville-white-box",
    	
    	style :
	    {
	      width: [1,0,0,0],
	      radius: [ 0, 0, 0, 0 ]
	    }
    }
   
  }
});