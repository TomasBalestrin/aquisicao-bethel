function inputStyle(): React.CSSProperties {
  return {
    padding: "10px 14px",
    fontSize: 13.5,
    border: "1.5px solid #DEE2E6",
    borderRadius: 8,
    color: "#001321",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
}

function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#B19365";
  e.currentTarget.style.boxShadow = "0 0 0 3px #F5EDE1";
}

function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#DEE2E6";
  e.currentTarget.style.boxShadow = "none";
}

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onEnter: () => void;
  ref?: React.Ref<HTMLInputElement>;
}

export function FieldInput({ label, value, onChange, placeholder, onEnter, ref }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-semibold" style={{ fontSize: 12.5, color: "rgba(0,19,33,0.7)" }}>
        {label}
      </label>
      <input
        ref={ref}
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-table outline-none"
        style={inputStyle()}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={(e) => { if (e.key === "Enter") onEnter(); }}
      />
    </div>
  );
}
