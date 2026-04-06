"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
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

function formatDisplay(value: number, isCurrency: boolean, isPercent: boolean): string {
  if (isCurrency) return `R$ ${centsToBrl(value)}`;
  if (isPercent) return `${String(value).replace(".", ",")}%`;
  return String(value);
}

function formatEdit(value: number, isCurrency: boolean): string {
  if (isCurrency) return centsToBrl(value);
  return String(value);
}

export function EditableCell({ entryId, field, value, isCurrency, isPercent, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(formatEdit(value, isCurrency));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!editing) setText(formatEdit(value, isCurrency));
  }, [value, editing, isCurrency]);

  const save = useCallback(async (val: string) => {
    const numVal = isCurrency ? brlToCents(val) : (isPercent ? parseFloat(val.replace(",", ".")) : parseInt(val, 10));
    const finalVal = isNaN(numVal) ? 0 : numVal;

    if (finalVal === value) return;
    setSaving(true);
    setError(false);
    onUpdate(field, finalVal);

    try {
      const result = await updateDailyEntry(entryId, field as Parameters<typeof updateDailyEntry>[1], finalVal);
      if (!result.success) {
        onUpdate(field, value);
        setError(true);
        toast.error("Erro ao salvar célula");
        setTimeout(() => setError(false), 2000);
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
      onUpdate(field, value);
      setError(true);
      toast.error("Erro ao salvar célula");
      setTimeout(() => setError(false), 2000);
    }
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

  const borderCls = error ? "ring-2 ring-error/50" : "";

  if (!editing) {
    return (
      <div
        onClick={() => { setEditing(true); setTimeout(() => inputRef.current?.select(), 0); }}
        className={`cursor-pointer px-2 py-1.5 font-table text-[12px] tabular-nums ${borderCls} ${saving ? "text-gold" : "text-navy-dark"}`}
      >
        {formatDisplay(value, isCurrency, isPercent)}
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
      className={`w-full bg-gold-lightest px-2 py-1.5 font-table text-[12px] tabular-nums text-navy-dark outline-none ${borderCls}`}
    />
  );
}
