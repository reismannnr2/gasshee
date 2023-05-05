import Chapter from '../../../common/components/chapter';
import HTMLInput from '../../../features/user-input/html-input';
import { extraTextAtom, isExtraTextHTMLAtom } from '../states/misc';

export default function ExtraText() {
  return (
    <Chapter title="その他メモ">
      <HTMLInput
        isHtmlAtom={isExtraTextHTMLAtom}
        layout=""
        placeholder="その他のテキスト..."
        setIsHTMLAtom={isExtraTextHTMLAtom}
        setterAtom={extraTextAtom}
        valueAtom={extraTextAtom}
      />
    </Chapter>
  );
}
