"use client";

import { useEffect, useState } from "react";

/** A real, persisted on/off setting (localStorage — zero cost, no backend). */
export function SettingToggle({
  id,
  label,
  desc,
  defaultOn = false,
}: {
  id: string;
  label: string;
  desc: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);

  useEffect(() => {
    const v = localStorage.getItem(`ap_setting_${id}`);
    if (v != null) setOn(v === "1");
  }, [id]);

  function toggle() {
    const next = !on;
    setOn(next);
    localStorage.setItem(`ap_setting_${id}`, next ? "1" : "0");
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted">{desc}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={toggle}
        className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
          on ? "justify-end bg-primary" : "justify-start bg-border"
        }`}
      >
        <span className="h-5 w-5 rounded-full bg-white" />
      </button>
    </div>
  );
}
