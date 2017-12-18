$(() =>
{
  const gatherUserInputs = () =>
  {
    console.log("gathering user inputs");
    let colorPicker = $("#color-picker");
    colorPicker.hide();
    let depth, length, color;
    [depth, length] = [$("#input_height")
      .val(), $("#input_width")
      .val()
    ];
    return buildCanvas(depth, length);
  };
  const buildCanvas = (...dimensions) =>
  {
    let wrapper = $(".canvas-wrap")
      .find("figure");
    let [depth, length] = dimensions;
    let cssW, cssH;
    let wrapperWidth, wrapperHeight;
    let h, w;
    wrapperWidth = wrapper.width();
    cssW = cssH = wrapperWidth / length;
    if ((length * 40) < wrapperWidth)
    {
      cssW = cssH = 40;
    }
    $("#canvas")
      .remove();
    wrapper.prepend($(`<table class="canvas" id="canvas"></table>`)
      .hide()
      .fadeIn(2000));
    for (h = 0; h < depth; h++)
    {
      $("#canvas")
        .append($(`<tr class="canvas-row" id="canvas-row-${h}"></tr>`)
          .hide()
          .fadeIn(2000));
      for (w = 0; w < length; w++)
      {
        $(`#canvas-row-${h}`)
          .append($(`<td class="canvas-cell" id="canvas-row-${h}-cell-${w}"></td>`)
            .css(
            {
              "width": `${cssW}px`,
              "height": `${cssH}px`,
              "max-width": `${cssW}px`,
              "max-height": `${cssH}px`
            })
            .hide()
            .fadeIn(5000));
      }
    }
    $("#caption")
      .html($("<h2>canvas</h2>")
        .hide()
        .fadeIn(5000));
    $(".canvas-row .canvas-cell")
      .on("click", (e) =>
      {
        const id = $(e.target)
          .attr("id");
        const x = e.pageX;
        const y = e.pageY;
        let colorPicker = $("#color-picker");
        colorPicker.css(
        {
          "position": "absolute",
          "top": `${y - 20}px`,
          "left": `${x}px`,
          "z-index": 100
        });
        colorPicker = colorPicker.hide()
          .fadeIn(2000);
        colorPicker.removeClass("hidden");
      });
  };

  $("#size-picker")
    .on("submit", (e) =>
    {
      e.preventDefault();
      gatherUserInputs();
    })
})