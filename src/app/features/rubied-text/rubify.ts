import { hasKey } from '../../common/functions/strictly-typed';

type Token = { type: 'open' } | { type: 'close' } | { type: 'separator' } | { type: 'text'; text: string };

const specialTokens = {
  '{': { type: 'open' },
  '}': { type: 'close' },
  ':': { type: 'separator' },
} as const;

// parse a string into a list of ruby items
export default function rubify(input: Readonly<string>): RubyItem[] {
  return parse(tokenize(input));
}

// remove ruby text from a string or a list of ruby items
export function derubify(input: Readonly<string> | ReadonlyArray<RubyItem>, rp?: [string, string]): string {
  const list = typeof input === 'string' ? rubify(input) : input;
  if (rp) {
    return list.map((item) => (item.ruby ? `${rp[0]}${item.text}${rp[1]}` : item.text)).join('');
  }
  return list.map((item) => item.text).join('');
}

// parse a string into a list of tokens
// start ruby text with '{', end with '}', separate ruby text with ':', escape special characters with '\'
// e.g. 'fo\:o{ba\{r:ba\}z}' -> [{type: 'text', text: 'fo:o'}, {type: 'open'}, {type: 'text', text: 'ba{r'}, {type: 'separator'}, {type: 'text', text: 'ba}z'}, {type: 'close'}]
function tokenize(input: Readonly<string>): Token[] {
  const tokens: Token[] = [];
  let text = '';
  let escaped = false;
  for (const char of input) {
    if (escaped) {
      text += char;
      escaped = false;
    } else if (char === '\\') {
      escaped = true;
    } else if (hasKey(specialTokens, char)) {
      tokens.push({ type: 'text', text });
      text = '';
      tokens.push(specialTokens[char]);
    } else {
      text += char;
    }
  }
  if (text) {
    tokens.push({ type: 'text', text });
  }
  return tokens.filter((token) => token.type !== 'text' || token.text);
}

// type for the result of parsing a list of tokens
export type RubyItem = {
  text: string;

  // if the text is ruby text, this is the ruby text
  ruby?: string;
};

// parse a list of tokens into a list of ruby items
// e.g. [{type: 'text', text: 'fo:o'}, {type: 'open'}, {type: 'text', text: 'ba{r'}, {type: 'separator'}, {type: 'text', text: 'ba}z'}, {type: 'close'}] -> [{text: 'fo:o'}, {text: 'ba{r', ruby: 'ba}z'}]
function parse(tokens: ReadonlyArray<Token>): RubyItem[] {
  const items: RubyItem[] = [];
  let item: RubyItem = { text: '' };
  let open = false;
  let ruby = false;
  for (const token of tokens) {
    switch (token.type) {
      case 'open':
        open = true;
        if (item.text) {
          items.push(item);
          item = { text: '' };
        }
        break;
      case 'separator':
        if (!open) {
          break;
        }
        ruby = true;
        break;
      case 'close':
        open = false;
        ruby = false;
        items.push(item);
        item = { text: '' };
        break;
      case 'text':
        if (open && !ruby) {
          item.text += token.text;
        } else if (open && ruby) {
          item.ruby = token.text;
        } else {
          item.text = token.text;
        }
        break;
    }
  }
  if (item.text) {
    items.push(item);
  }
  return items;
}
