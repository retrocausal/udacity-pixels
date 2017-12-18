$(() => {
  const start = () => {
    console.log("gathering user inputs");
    let depth, length;
    [depth, length] = [
      $("#input_height")
      .val(),
      $("#input_width")
      .val()
    ];
    return buildCanvas(depth, length);
  };
  const buildCanvas = (...dimensions) => {
    let wrapper = $(".canvas-wrap")
      .find("figure");
    let [depth, length] = dimensions;
    let cssW, cssH;
    let wrapperWidth, wrapperHeight;
    let h, w;
    wrapperWidth = wrapper.width();
    cssW = cssH = wrapperWidth / length;
    if ((length * 40) < wrapperWidth) {
      cssW = cssH = 40;
    }
    $("#canvas")
      .remove();
    wrapper.prepend($(`<table class="canvas" id="canvas"></table>`)
      .hide()
      .fadeIn(2000));
    for (h = 0; h < depth; h++) {
      $("#canvas")
        .append($(`<tr class="canvas-row" id="canvas-row-${h}"></tr>`)
          .hide()
          .fadeIn(2000));
      for (w = 0; w < length; w++) {
        $(`#canvas-row-${h}`)
          .append($(`<td class="canvas-cell" id="canvas-row-${h}-cell-${w}"></td>`)
            .css({
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
      .html($('<h2> canvas </h2>')
        .hide()
        .fadeIn(5000));
    return activateCanvas();
  };
  const activateCanvas = () => {
    return $(".canvas-cell")
      .on("click", (eCell) => {
        let colorPicker = $('<input type="color"></input>')
          .hide();
        let id = $(eCell.target)
          .attr("id");
        colorPicker.attr("id", `color-picker-${id}`);
        const x = eCell.pageX;
        const y = eCell.pageY;
        colorPicker.css({
          "position": "absolute",
          "top": `${y - 20}px`,
          "left": `${x}px`,
          "z-index": 100
        });
        $("BODY")
          .append(colorPicker);
        colorPicker.hide()
          .fadeIn(2000)
          .on("mouseleave", (e) => {
            $(e.target)
              .fadeOut(3000);
          })
          .on("mouseover", (e) => {
            $(e.target)
              .stop()
              .fadeIn();
          })
          .on("click", (e) => {
            let cpID = $(e.target)
              .attr("id");
          })
          .on("change", (e) => {
            let cpID = $(e.target)
              .attr("id");
            $(`#${id}`)
              .css("background-color", `${$(e.target).val()}`);
            $(e.target)
              .remove();
          });
      });
  };
  $("#size-picker")
    .on("submit", (e) => {
      e.preventDefault();
      start();
    });
});