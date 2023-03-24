import DOMPurify from 'dompurify';

export interface Props {
  raw: string;
  onChange: (value: string) => void;
  editMode: boolean;
}

export default function HTMLEditor({ raw, editMode, onChange }: Props) {
  return <div>{editMode ? <EditMode raw={raw} onChange={onChange} /> : <ViewMode raw={raw} />}</div>;
}

function EditMode({ raw, onChange }: { raw: string; onChange: (value: string) => void }) {
  return (
    <>
      <textarea
        defaultValue={raw}
        onBlur={(e) => {
          const purified = DOMPurify.sanitize(e.target.value);
          e.target.value = purified;
          onChange(purified);
        }}
      />
    </>
  );
}

function ViewMode({ raw }: { raw: string }) {
  const purified = DOMPurify.sanitize(raw);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: purified }} />
    </>
  );
}
