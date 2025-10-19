type Props = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
};

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
};

export default function LoadingSpinner({ size = 'md', className = '', label }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <span
        className={`inline-block rounded-full border-current border-t-transparent animate-spin ${sizeMap[size]} text-gray-500`}
        aria-hidden="true"
      />
      {label ? <span className="text-sm text-gray-500">{label}</span> : null}
    </div>
  );
}