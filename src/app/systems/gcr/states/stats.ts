export const STAT_NAMES = ['筋力', '反射', '感覚', '知力', '精神', '共感'] as const;
export type StatName = (typeof STAT_NAMES)[number];

export type BaseStats = {
  [k in StatName]: number;
};

import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { nanoid } from 'nanoid';
import { useMemo } from 'react';
import { typedEntries } from '../../../common/functions/strictly-typed';

const x = {
  atom,
  useAtomValue,
  useSetAtom,
  atomFamily,
  nanoid,
  useMemo,
};

export const CLASS_NAMES = ['ロード', 'メイジ', 'アーティスト', '投影体'] as const;
export type GcrClassName = (typeof CLASS_NAMES)[number];

export type StyleInfo = {
  能力修正: {
    [k in StatName]: number;
  };
  HP修正: number;
  MP修正: number;
  HP成長: number;
  MP成長: number;
};

export const GCR_STYLES = {
  ロード: {
    セイバー: {
      能力修正: {
        筋力: 2,
        反射: 2,
        感覚: 1,
        知力: 0,
        精神: 1,
        共感: 0,
      },
      HP修正: 14,
      MP修正: 10,
      HP成長: 10,
      MP成長: 6,
    },
  },
  メイジ: {
    エレメンタラー: {
      能力修正: {
        筋力: 0,
        反射: 1,
        感覚: 1,
        知力: 0,
        精神: 2,
        共感: 2,
      },
      HP修正: 11,
      MP修正: 13,
      HP成長: 7,
      MP成長: 9,
    },
  },
  アーティスト: {
    アンデッド: {
      能力修正: {
        筋力: 2,
        反射: 1,
        感覚: 1,
        知力: 0,
        精神: 2,
        共感: 0,
      },
      HP修正: 11,
      MP修正: 13,
      HP成長: 7,
      MP成長: 9,
    },
  },
  投影体: {
    地球人: {
      能力修正: {
        筋力: 1,
        反射: 1,
        感覚: 1,
        知力: 1,
        精神: 1,
        共感: 1,
      },
      HP修正: 12,
      MP修正: 12,
      HP成長: 8,
      MP成長: 8,
    },
  },
} as const satisfies {
  [k in GcrClassName]: {
    [k in string]: StyleInfo;
  };
};

export type WorksInfo = {
  能力基本値: {
    [k in StatName]: number;
  };
  HP修正: number;
  MP修正: number;
  ワークス特技: string;
};

export const GCR_WORKS = {
  騎士A: {
    能力基本値: {
      筋力: 2,
      反射: 2,
      感覚: 1,
      知力: 0,
      精神: 1,
      共感: 0,
    },
    HP修正: 14,
    MP修正: 10,
    ワークス特技: '戦闘',
  },
} as const satisfies { [k in string]: WorksInfo };

const gcrStyleNameAtom = atom('');
const gcrSubStyleNameAtom = atom('');
const gcrClassNameAtom = atom('');
const predefinedStyleAtom = atom((get) => {
  const styleName = get(gcrStyleNameAtom);
  const existing = typedEntries(GCR_STYLES).find(([_, styles]) => styleName in styles);
  if (existing) {
    return { className: existing[0], styleName, style: existing[1][styleName as keyof (typeof existing)[1]] };
  }
  return null;
});
const gcrStyleAtom = atom<StyleInfo>({
  能力修正: {
    筋力: 0,
    反射: 0,
    感覚: 0,
    知力: 0,
    精神: 0,
    共感: 0,
  },
  HP修正: 0,
  MP修正: 0,
  HP成長: 0,
  MP成長: 0,
});

const setStyleNameAtom = atom(null, (get, set, styleName: string) => {
  set(gcrStyleNameAtom, styleName);
  const predefinedStyle = get(predefinedStyleAtom);
  if (predefinedStyle) {
    set(gcrClassNameAtom, predefinedStyle.className);
    set(gcrStyleAtom, predefinedStyle.style);
  }
});
