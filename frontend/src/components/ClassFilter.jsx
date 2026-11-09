/**
 * ClassFilter — a drop-down to show one class or all classes.
 * Props: classes (list of class names), value ("" = all), onChange(value)
 */
export default function ClassFilter({ classes, value, onChange }) {
  return (
    <div>
      <label htmlFor="class-filter" className="mb-1 block text-sm font-semibold text-slate-700">
        Class / कक्षा
      </label>
      <select
        id="class-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/20"
      >
        <option value="">All classes / सभी कक्षाएँ</option>
        {classes.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}

