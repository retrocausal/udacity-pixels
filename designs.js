/**
 *designs.js
 *Code to implement a pixel art maker using JQuery and HTML and CSS
 *Version 1.0
 *Author Nitin Prabhakar
 *Repository git@github.com:retrocausal/udacity-pixels.git
 *Licence MIT
 */

/**
 *Runs after 'DOMContentLoaded' event.
 *Passed as a function definition into the global JQuery Object
 *@params none
 */
$(() => {
  /*
   *@name start
   *@params none
   *@description Triggered via the "submit" event on the form
   *Sources the depth and length of the canvas to draw on
   */
  const start = () => {
    let depth, length;
    [depth, length] = [
      $("#input_height")
      .val(),
      $("#input_width")
      .val()
    ];
    return buildCanvas(depth, length);
  };
  /*
   *@name buildCanvas
   *@params [spread dimensions] array with depth and length as elements
   *@description Called after sourcing user inputs
   *builds the table to be used as the canvas to make pixel art
   */
  const buildCanvas = (...dimensions) => {
    //extract container dimensions
    let wrapper = $(".canvas-wrap")
      .find("figure");
    //Initialize variables to be used below
    let [depth, length] = dimensions;
    let cssW, cssH;
    let wrapperWidth, wrapperHeight;
    //incrementors
    let h, w;
    //redraw the canvas based on viewport widths
    wrapperWidth = wrapper.width();
    cssW = cssH = wrapperWidth / length;
    if ((length * 40) < wrapperWidth) {
      cssW = cssH = 40;
    }
    //delete old canvas,append new canvas
    $("#canvas")
      .remove();
    //fadein all canvas elements
    wrapper.prepend($(`<table class="canvas" id="canvas"></table>`)
      .hide()
      .fadeIn(2000));
    //depth
    for (h = 0; h < depth; h++) {
      $("#canvas")
        .append($(`<tr class="canvas-row" id="canvas-row-${h}"></tr>`)
          .hide()
          .fadeIn(2000));
      //length
      for (w = 0; w < length; w++) {
        $(`#canvas-row-${h}`)
          .append($(`<td class="canvas-cell" id="canvas-row-${h}-cell-${w}"></td>`)
            .css({
              "width": `${cssW}px`,
              "height": `${cssH}px`,
              "max-width": `${cssW}px`,
              "max-height": `${cssH}px`,
              //set initial background color
              "background-color": "#fff"
            })
            .attr("data-current-bg-color", "#ffffff")
            .hide()
            .fadeIn(3000));
      }
      //end length
    }
    //end depth

    // add a caption to the canvas
    $("#caption")
      .html($('<h2> canvas </h2>')
        .hide()
        .fadeIn(3000));
    //unhide the multiple cell painter
    $(".multiplier")
      .hide()
      .fadeIn(2000);
    //listen for global color pick event
    $("#multiple-cell-painter")
      .change((eMCP) => {
        const form = document.querySelector("#multiple-paint-enabled");
        if (!form) {
          const enableMCP = $('<input id="multiple-paint-enabled" name="mcpEnabled" type="checkbox" value="yes" checked>')
            .css({
              "min-width": "40px",
              "min-height": "40px"
            });
          enableMCP.change(reactivateCanvas);
          $(".mcpform")
            .append(enableMCP);
        }
        return activateCanvas(true);
      });

    return activateCanvas(false);
  };
  /*
   *@name reactivateCanvas
   *@params[emcpCB] event handler obtained event Object
   *@description Registered change handler for the toggler between multiple and single cell paint setter
   */
  const reactivateCanvas = (emcpCB) => {
    const checked = $(emcpCB.target)
      .attr("checked");
    const val = $(emcpCB.target)
      .val();
    if (checked) {
      $(emcpCB.target)
        .removeAttr("checked");
      $(emcpCB.target)
        .attr("value", "no");
      $(emcpCB.target)
        .remove();
      return activateCanvas(false);
    }
    $(emcpCB.target)
      .attr("checked", "checked");
    $(emcpCB.target)
      .attr("value", "yes");
    return false;
  };

  /*
   *@name activateCanvas
   *@params none
   *@description attaches the event handlers required on each individual canvas cell
   *when a user clicks on a particular cell, the cell would have a UNIQUE ID
   *This id is used later to fill a chosen background color to the particular cell.
   *Each canvas cell, activates EXACTLY ONE color-picker, and later removes it from the DOM.
   @events "onclick" = > canvas cell , ["onchange" ,"onmouseover" ,"onmouseleave"] = > input[color]
   */
  const activateCanvas = (multiple) => {
    //listen to click events on each cell
    $(".canvas-cell")
      .off("click");
    if (multiple) {
      return $(".canvas-cell")
        .click((eCell) => {
          const bgColor = $("#multiple-cell-painter")
            .val();
          const id = $(eCell.target)
            .attr("id");
          return paintCell(id, bgColor);
        });
    } else {
      return $(".canvas-cell")
        .on("click", initCanvas);
    }
  };
  /*
   *@name paintCell
   *@params[id] ID of the canvas cell to be painted
   *@params[bgColor] color of the canvas cell chosen
   *@description paints a cell's background to the chosen color
   */
  const paintCell = (id, bgColor) => {
    $(`#${id}`)
      .attr("data-current-bg-color", bgColor);
    return $(`#${id}`)
      .css("background-color", bgColor);
  };
  /*
   *@name initCanvas
   *@params[eCell] target html elements
   *@description attach an event handler to handle "click" events
   */
  const initCanvas = (eCell) => {
    //create a new input dedicated to a cell, hide by default until required
    let colorPicker = $('<input type="color"></input>')
      .hide();
    const id = $(eCell.target)
      .attr("id");
    colorPicker.attr("id", `color-picker-${id}`);
    const currentBGColor = $(eCell.target)
      .attr("data-current-bg-color");
    //Set the default value to the current background color
    colorPicker.attr("value", currentBGColor);
    //gather page co-ordinates where the click event happened
    const x = eCell.pageX;
    const y = eCell.pageY;
    //push the color picker input to the exact click location
    colorPicker.css({
      "position": "absolute",
      "top": `${y}px`,
      "left": `${x}px`,
      "z-index": 100,
      "box-shadow": "0 0 2em 0 #ccc",
      "width": "6em",
      "height": "3em"
    });
    //add the color picker,hide if not already hidden, and fade it into view
    $("BODY")
      .append(colorPicker);
    return colorPicker
      .fadeIn()
      .fadeOut(5000)
      // if user moves the mouse away, fadeout in 3
      .on("mouseleave", (e) => {
        $(e.target)
          .fadeOut(2000);
      })
      //if the user moves the mouse back to hover, fade back in immediately
      .on("mouseover", (e) => {
        $(e.target)
          .stop()
          .fadeIn();
      })
      //If the user clicks on the input, do nothing
      .on("click", (e) => {
        $(e.target)
          .stop()
          .fadeIn();
      })
      .on("input", (e) => {
        paintCell(id, $(e.target)
          .val());
      })
      //If the user selects a color, set the background color appropriately
      .on("change", (e) => {
        //the cell on which the event happened, is now colored by it's own colorPicker
        paintCell(id, $(e.target)
          .val());
        //job done, remove the dynamic color picker from the DOM
        $(e.target)
          .remove();
      });
  };
  //Begin listening after DOMContentLoaded, do not submit by default
  $("#size-picker")
    .on("submit", (e) => {
      e.preventDefault();
      start();
    });
  //Set maximum dimensions
  const wrapper = $(".canvas-wrap")
    .find("figure");
  const wrapperWidth = wrapper.width();
  const maxLength = Math.abs(Math.round(wrapperWidth / 40));
  const maxDepth = maxLength;
  $("#input_height")
    .attr("max", maxDepth);
  $("#input_width")
    .attr("max", maxLength);
});