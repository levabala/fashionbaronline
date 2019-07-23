/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */

// tslint:disable
export default function getTextWidth(
  text: string,
  font: string
): { width: number; height: number } {
  let existed = true;
  const test =
    document.getElementById("textWidthTester") ||
    (((existed = false) || true) &&
      document.body.appendChild(document.createElement("div")));

  if (!existed) {
    test.style.font = font;
    test.id = "textWidthTester";
  }
  test.innerText = text;

  const height = test.clientHeight + 1;
  const width = test.clientWidth + 1;

  return { width, height };
}
