class Cursor {
  static isSelectedBackwards(): boolean {
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(selection.anchorNode, selection.anchorOffset);
    range.setEnd(selection.focusNode, selection.focusOffset);

    const backwards = range.collapsed;
    range.detach();
    return backwards;
  }

  static getCurrentSelected(): string {
    let text: string;

    // TODO: handle if window.getSelection is undefined too
    if (window.getSelection) {
      text = window.getSelection().toString();
    }

    return text;
  }

  static getCurrentCursorPosition(parentElement: HTMLElement): number {
    const selection = window.getSelection();
    let charCount = -1;
    let node: Node;

    if (selection.focusNode) {
      if (Cursor._isChildOf(selection.focusNode, parentElement)) {
        node = selection.focusNode;
        charCount = selection.focusOffset;

        while (node) {
          if (node === parentElement) {
            break;
          }

          if (node.previousSibling) {
            node = node.previousSibling;
            charCount += node.textContent.length;
          } else {
            node = node.parentNode;
            if (node === null) {
              break;
            }
          }
        }
      }
    }

    return charCount;
  }

  static setCurrentCursorPosition(chars: number, element: HTMLElement) {
    if (chars >= 0) {
      const selection = window.getSelection();

      const range = Cursor._createRange(element, { count: chars });

      if (range) {
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  private static _createRange(node: Node, chars: any, range?: Range) {
    if (!range) {
      range = document.createRange();
      range.selectNode(node);
      range.setStart(node, 0);
    }

    if (chars.count === 0) {
      range.setEnd(node, chars.count);
    } else if (node && chars.count > 0) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.length < chars.count) {
          chars.count -= node.textContent.length;
        } else {
          range.setEnd(node, chars.count);
          chars.count = 0;
        }
      } else {
        for (let lp = 0; lp < node.childNodes.length; lp++) {
          range = Cursor._createRange(node.childNodes[lp], chars, range);

          if (chars.count === 0) {
            break;
          }
        }
      }
    }

    return range;
  }

  private static _isChildOf(node: Node, parentElement: HTMLElement) {
    while (node !== null) {
      if (node === parentElement) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  }
}

export default Cursor;
