type Props = {
  value: unknown;
  className?: string;
  // optional: max string length before truncating with tooltip
  maxLen?: number;
};

const numberFormatter = new Intl.NumberFormat();

function truncate(text: string, max: number) {
  const trimmed = text.trim();
  if (trimmed.length <= max) {
    return { shown: trimmed, title: undefined as string | undefined };
  }
  return { shown: trimmed.slice(0, max) + '…', title: trimmed };
}

function isIsoDateString(s: string) {
  const t = s.trim();
  // Accepts common ISO formats like 2024-05-01T12:34:56Z or with offsets (+hh:mm)
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/.test(t);
}

function tryFormatDate(v: string) {
  const t = v.trim();
  if (!isIsoDateString(t)) return null;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return null;
  // Locale-friendly short format
  return d.toLocaleString();
}

export default function GenericCell({ value, className = '', maxLen = 80 }: Props) {
  if (value === null || value === undefined) {
    return <span className={`text-gray-400 ${className}`}>—</span>;
  }

  switch (typeof value) {
    case 'boolean':
      return <span className={className}>{value ? 'Yes' : 'No'}</span>;

    case 'number':
      return <span className={className}>{numberFormatter.format(value)}</span>;

    case 'string': {
      const t = value.trim();
      const maybeDate = tryFormatDate(t);
      if (maybeDate) {
        return <span className={className} title={t}>{maybeDate}</span>;
      }
      const { shown, title } = truncate(t, maxLen);
      return <span className={className} title={title}>{shown || '—'}</span>;
    }

    case 'object': {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return <span className={`text-gray-400 ${className}`}>—</span>;
        }
        const text = value.join(', ');
        const { shown, title } = truncate(text, maxLen);
        return <span className={className} title={title}>{shown}</span>;
      }

      try {
        const json = JSON.stringify(value);
        const { shown, title } = truncate(json, maxLen);
        return <span className={className} title={title}>{shown}</span>;
      } catch {
        return <span className={className}>[object]</span>;
      }
    }

    default:
      // Fallback for unhandled types (e.g., symbol, function)
      return <span className={className}>—</span>;
  }
}