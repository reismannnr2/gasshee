import { atom, useAtomValue, useSetAtom } from 'jotai';
import { typedEntries, typedKeys } from '../../../common/functions/strictly-typed';

export const STAT_NAMES = ['筋力', '反射', '感覚', '知力', '精神', '共感'] as const;
export type StatName = (typeof STAT_NAMES)[number];
export const CLASS_NAMES = ['ロード', 'メイジ', 'アーティスト', '投影体'] as const;
export type GcrClassName = (typeof CLASS_NAMES)[number];

export type StyleNames = {
  クラス: string;
  スタイル: string;
  サブスタイル: string;
  ワークス: string;
  ワークス特技: string;
};

export type StyleInfo = {
  能力修正: {
    [k in StatName]: number;
  };
  HP修正: number;
  MP修正: number;
  HP成長: number;
  MP成長: number;
};

export const GCR_STYLES: {
  [k in GcrClassName]: {
    [k in string]: StyleInfo;
  };
} = {
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
};

export type WorksInfo = {
  能力基本値: {
    [k in StatName]: number;
  };
  HP修正: number;
  MP修正: number;
  ワークス特技: string;
};

export const GCR_WORKS: { [k in string]: WorksInfo } = {
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
};

const styleNamesAtom = atom<StyleNames>({
  クラス: '',
  スタイル: '',
  サブスタイル: '',
  ワークス: '',
  ワークス特技: '',
});

const updateStyleNamesAtom = atom(null, (get, set, transform: (prev: StyleNames) => StyleNames) => {
  const prev = get(styleNamesAtom);
  const names = transform(prev);
  const changedField = typedKeys(prev).find((k) => prev[k] !== names[k]);
  if (!changedField) {
    return;
  }
  const predefinedStyle = findPredefinedStyle(names.スタイル);
  const predefinedWorks = GCR_WORKS[names.ワークス];
  if (changedField === 'クラス') {
    set(styleNamesAtom, {
      ...prev,
      クラス: names.クラス,
      スタイル: '',
    });
  } else if (changedField === 'スタイル' && predefinedStyle) {
    set(styleNamesAtom, {
      ...prev,
      スタイル: names.スタイル,
      クラス: predefinedStyle.className,
    });
  } else if (changedField === 'ワークス' && predefinedWorks) {
    set(styleNamesAtom, {
      ...prev,
      ワークス: names.ワークス,
      ワークス特技: predefinedWorks.ワークス特技,
    });
  } else {
    set(styleNamesAtom, names);
  }
});

function findPredefinedStyle(styleName: string) {
  const predefined = typedEntries(GCR_STYLES).find(([_, styles]) => styleName in styles);
  if (!predefined) {
    return null;
  }
  const [className, styles] = predefined;
  // キーの存在を確認しているので、ここでは as で型を強制する
  const style = styles[styleName] as StyleInfo;
  return { className, style };
}

export function useUpdateStyleNamesAtom() {
  return useSetAtom(updateStyleNamesAtom);
}

export function useStyleNamesAtom() {
  return useAtomValue(styleNamesAtom);
}
