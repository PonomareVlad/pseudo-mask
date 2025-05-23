import parse from './parse';
import { autoNum, bestSize } from './math';
import { textOverflow, isWordBound, isHyphen } from './text';
import { appendTspan, writeInnerHTML } from './svg';

// Because text in Firefox is just slightly wider than in Chrome, causing
// linebreaks to be inconsistent across browsers.
const IS_GECKO = navigator.userAgent.indexOf('Gecko') !== -1 &&
  navigator.userAgent.indexOf('like Gecko') === -1;
const GECKO_DAMPER = IS_GECKO ? ((282.25 - 278.234375) / 280.25) : 0;

let maxLines;
let maxWidth;
let maxHeight;
let minLineHeight;

let chars;
let tags;

let isFinalLine;
let charIndex;
let tspan;
let tspans;
let tspanIndex;
let tagIndex;
let height;
let lineStr;
let tmpStr;
let clip;
let lastBoundIndex;
let lineCharIndex;
let openTags;

// charsRemain is true if current char is not the last non-whitespace char.
let charsRemain;

/**
 * Render lines of text into <tspan> elements, character by character.
 * Returns the number of lines rendered.
 * @param {SVG Text Element} text
 * @param {object} options
 * @param {number} lineHeight
 */
export default function render(text, options, lineHeight, fontSize) {
  maxLines = autoNum(options.maxLines, Number.MAX_VALUE);
  if (maxLines < 1) {
    return 0;
  }
  maxWidth = autoNum(bestSize(options.textPos, 'width'), Number.MAX_VALUE);
  maxHeight = autoNum(bestSize(options.textPos, 'height'), Number.MAX_VALUE);
  minLineHeight = typeof fontSize === 'undefined' ? lineHeight : fontSize * 1.1;
  if (maxHeight < minLineHeight) {
    return 0;
  }

  if (options.maxLines === 1 || (options.width === 'auto' && options.maxWidth === 'auto')) {
    appendTspan(text, options.text, 0, 0);
    return 1;
  }

  const parsed = parse(options.text);
  chars = parsed.chars;
  tags = parsed.tags;
  charIndex = 0;
  tspans = [];
  tspanIndex = 0;
  tagIndex = 0;
  lastBoundIndex = 0;
  lineCharIndex = 0;
  height = 0;
  tmpStr = '';
  clip = textOverflow(options.textOverflow);
  openTags = [];
  let workingLineStr = '';
  let lineStr = '';
  let index = 0;

  while (index < chars.length) {
    const c = chars[index];
    charIndex = index;
    isFinalLine = tspanIndex + 1 === maxLines || height + minLineHeight > maxHeight;
    charsRemain = !/^\s*$/.test(chars.slice(index).join(''));

    tmpStr = writeTmpStr(c);
    const tmpStrF = writeTmpStrF(c);
    const tspan = createTspan(text, tmpStrF, lineHeight);

    let complete = false;

    var theTextFits = textFits(text)

    if (theTextFits) {
      // Text with the test character fits, so now just exit if there are no
      // more characters to write.
      lineStr = tmpStr;

      if (!charsRemain) {
        complete = true;
      } else if (isWordBound(c)) { 
        workingLineStr = tmpStrF;
      }
    }

    if(!theTextFits || c === '\n') {
      // Text with the test character is too wide or it's a newline
      // Either way => a new line is needed

      // If a newline, mark it as a word boundary
      // If not a newline, we'll split at the last word boundary
      if(c === '\n') { 
        lastBoundIndex = index
      }

      if (charsRemain) {
        tmpStr = '';
        for (let i = 0; i < openTags.length; i++) {
          tmpStr += openTags[i].markup;
        }
        if (lastBoundIndex > lineCharIndex) {
          if (isHyphen(chars[lastBoundIndex])) {
            // Push the hyphen onto the last word.
            lineCharIndex = lastBoundIndex + 1;
          } else {
            // Otherwise start the next line with the word bound character.
            lineCharIndex = lastBoundIndex;
          }
          tmpStr += chars.slice(lineCharIndex, index).join('')
            .replace(/^\s+/g, '');
          lineStr = workingLineStr;
        } else {
          // Split the word at the character level instead of a word boundary.
          lineCharIndex = index;
        }
        if (isFinalLine) {
          lineStr = lineStr.replace(/^\s+$/, '');
        } else if(c !== '\n') {
          // rewind so we start the next line with the current character
          --index;
        }
      }

      lineStr = lineStr.replace(/^\s+|\s+$/g, '');
      writeInnerHTML(tspan, lineStr);

      // Remove temporarily to prevent the width from getting whacky:
      text.removeChild(tspan);
      
      if (isFinalLine || !lineStr) {
      
        complete = true;
      }

      workingLineStr = '';
      ++tspanIndex;
    }

    if (!complete && (isWordBound(c))) {
      lastBoundIndex = index;
    }

    if (complete) {
      break;
    }
    index++;
  }

  // Re-append `tspan` elements into the container `text` element.
  tspans.forEach((tspan) => {
    text.appendChild(tspan);
  });
  return tspans.length;
}


// Add the next character to the tmpStr and any inline elements at the same index.
function writeTmpStr(c) {
  for (let n = tagIndex; n < tags.length; n++) {
    if (tags[n].index === charIndex) {
      tmpStr += tags[n].markup;
      tagIndex = n + 1;
      if (tags[n].type === 'open') {
        openTags.push(tags[n]);
      } else {
        for (let i = openTags.length - 1; i >= 0; i--) {
          if (openTags[i].close === tags[n]) {
            openTags.splice(i, 1);
          }
        }
      }
    }
  }
  tmpStr += c;
  return tmpStr;
}

// Format the tmpStr by trimming whitespace and adding the text-overflow clip.
function writeTmpStrF(c) {
  let str = [
    tmpStr.replace(/^\s+|\s+$/g, ''),
    (charsRemain && isWordBound(c) && isFinalLine) ? clip : '',
  ].join('');
  return str;
}

// Create a working tspan, if it does not already exist, and insert the
// test string into it.
function createTspan(text, tmpStrF, lineHeight) {
  let tspan = tspans[tspanIndex];
  if (tspan) {
    writeInnerHTML(tspan, tmpStrF);
  } else {
    tspan = tspans[tspanIndex] = appendTspan(text, tmpStrF, 0, height);
    height += lineHeight;
  }
  return tspan;
}

function textFits(text) {
  let textWidth = text.getBBox().width
  textWidth -= textWidth * GECKO_DAMPER;
  return textWidth <= maxWidth;
}
