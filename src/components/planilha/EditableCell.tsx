"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { updateDailyEntry } from "@/actions/dailyEntries";
import { centsToBrl, brlToCents } from "@/lib/utils/calcMetrics";

interface Props {
  entryId: string;
  field: string;
  value: number;
  isCurrency: boolean;
  isPercent: boolean;
  onUpdate: (field: string, value: number) => void;
}

export function EditableCell({ entryId, field, value, isCurrency, isPercent, onUpdate }: Props) {
  const displayVal = isCurrency ? centsToBrl(value) : String(value);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(displayVal);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!editing) setText(isCurrency ? centsToBrl(value) : String(value));
  }, [value, editing, isCurrency]);

  const save = useCallback(async (val: string) => {
    const numVal = isCurrency ? brlToCents(val) : (isPercent ? parseFloat(val.replace(",", ".")) : parseInt(val, 10));
    const finalVal = isNaN(numVal) ? 0 : numVal;

    if (finalVal === value) return;
    setSaving(true);
    onUpdate(field, finalVal);
    await updateDailyEntry(entryId, field as Parameters<typeof updateDailyEntry>[1], finalVal);
    setSaving(false);
  }, [entryId, field, value, isCurrency, isPercent, onUpdate]);

  function handleChange(val: string) {
    setText(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(val), 500);
  }

  function handleBlur() {
    if (timerRef.current) clearTimeout(timerRef.current);
    save(text);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div
        onClick={() => { setEditing(true); setTimeout(() => inputRef.current?.select(), 0); }}
        className={`cursor-pointer px-2 py-1.5 font-mono text-[12px] tabular-nums ${saving ? "text-gold" : "text-navy-dark"}`}
      >
        {isCurrency ? `R$ ${displayVal}` : displayVal}
      </div>
    );
  }

  return (
    <input
      ref={inputRef}
      autoFocus
      value={text}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => { if (e.key === "Enter") handleBlur(); }}
      className="w-full bg-gold-lightest px-2 py-1.5 font-mono text-[12px] tabular-nums text-navy-dark outline-none"
    />
  );
}
