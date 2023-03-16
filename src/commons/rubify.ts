/**
 * ルビフォーマット文字列を RubyItem の配列に変換したり、ルビフォーマット文字列やRubyItem配列からルビを取り除いた文字列に変換するためのモジュール。
 * 書式: ルビを付けたい部分を{}(ブラケット)で囲い、ベース部分とルビ部分を:(コロン)で区切る。
 *       エスケープはバックスラッシュで行う。 {}:\ の四文字がエスケープできる
 * 例: {漢字:かんじ}とひらがなと{片仮名:カタカナ}
 *
 * @module rubify
 */

type Token = { type: 'open' } | { type: 'close' } | { type: 'split' } | { type: 'text'; value: string };

const spTokens = {
  '{': { type: 'open' },
  '}': { type: 'close' },
  ':': { type: 'split' },
} as const;

/**
 * パースされたルビ文字列
 */
export interface RubyItem {
  /** ベーステキスト */
  text: string;
  /** ルビ部分 */
  ruby?: string;
}

/**
 * ルビフォーマット文字列またはパース済みのRubyItem配列からルビを取り除いた文字列を返却する。
 * 引数rpに開始括弧、終了括弧が与えられた場合、ルビを括弧で展開した文字列を返却する。
 * @param input ルビフォーマット文字列、または rubify 関数でパースされたRubyItem配列
 * @returns ルビを除去または展開した平文文字列
 */
export function deruby(input: Readonly<string | RubyItem[]>, rp?: [string, string]): string {
  const items = typeof input == 'string' ? rubify(input) : input;
  if (!rp) {
    return items.map((item) => item.text).join('');
  }
  return items.map((item) => `${rp[0]}${item.text}${rp[1]}`).join('');
}

/**
 * ルビフォーマット文字列をパースしてRubyItemの配列に変換する。
 * @param input 変換対象の文字列
 * @returns パースされた配列
 */
export function rubify(input: Readonly<string>): RubyItem[] {
  return parse(tokenize(input));
}

function parse(input: readonly Token[]): RubyItem[] {
  const items: RubyItem[] = [];

  // 末尾再帰最適化が実装されていないためループで記述する
  let rest = input.slice();
  while (rest[0]) {
    const token = rest[0];
    if (token.type === 'text') {
      items.push({ text: token.value });
      rest = rest.slice(1);
      continue;
    }
    if (token.type === 'open') {
      const [item, next] = parsUntilTermination(rest.slice(1));
      if (item) {
        items.push(item);
      }
      rest = next;
    }
  }
  return items;
}

function tokenize(input: Readonly<string>): Token[] {
  const tokens: Token[] = [];
  let escape = false;
  let temp = '';
  // 末尾再帰最適化が実装されていないためループで記述する
  for (const c of input) {
    // エスケープされる文字
    if (escape) {
      temp += c;
      escape = false;
      continue;
    }
    // 次の文字をエスケープ
    if (c === '\\') {
      escape = true;
      continue;
    }
    // 特別なトークン
    if (c === '{' || c === '}' || c === ':') {
      const spToken = spTokens[c];
      const nextTokens: Token[] = temp ? [{ type: 'text', value: temp }, spToken] : [spToken];
      tokens.push(...nextTokens);
      temp = '';
      continue;
    }
    // ただのテキスト
    temp += c;
  }
  if (temp) {
    tokens.push({ type: 'text', value: temp });
  }
  return tokens;
}

// ルビフォーマット終了までをパース
function parsUntilTermination(input: readonly Token[]): [RubyItem | undefined, Token[]] {
  if (input.length === 0) {
    return [undefined, []];
  }
  let text = '';
  for (const [i, token] of input.entries()) {
    if (token.type === 'close') {
      return [text ? { text } : undefined, input.slice(i + 1)];
    }
    if (token.type === 'split') {
      const [ruby, rest] = parseRuby(input.slice(i + 1));
      const nextItem: RubyItem | undefined = text ? { text, ruby } : undefined;
      return [nextItem, rest];
    }
    if (token.type === 'text') {
      text += token.value;
    }
  }
  return [text ? { text } : undefined, []];
}

// ルビ部分の終了までをパース
function parseRuby(input: readonly Token[]): [string | undefined, Token[]] {
  if (input.length === 0) {
    return [undefined, []];
  }
  let ruby = '';
  for (const [i, token] of input.entries()) {
    if (token.type === 'close') {
      return [ruby, input.slice(i + 1)];
    }
    if (token.type === 'text') {
      ruby += token.value;
    }
  }
  return [ruby || undefined, []];
}
