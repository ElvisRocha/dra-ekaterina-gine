import * as React from 'react';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
}

const PhoneInput = ({
  value,
  onChange,
  disabled = false,
  className,
  id,
  placeholder = '8888-8888',
}: PhoneInputProps) => {
  // Extract local number from stored value (which may include +506)
  const getLocalNumber = (val: string): string => {
    return val.replace(/^\+506/, '').replace(/\D/g, '').slice(0, 8);
  };

  const localNumber = getLocalNumber(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 8);
    onChange(input ? `+506${input}` : '');
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const cleaned = pastedText.replace(/\D/g, '');

    // If pasted number starts with 506, remove the country code
    const localPart = cleaned.startsWith('506')
      ? cleaned.slice(3, 11)
      : cleaned.slice(0, 8);

    onChange(localPart ? `+506${localPart}` : '');
  };

  const formatDisplay = (num: string): string => {
    if (num.length <= 4) return num;
    return `${num.slice(0, 4)}-${num.slice(4)}`;
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none select-none',
          disabled ? 'opacity-50' : ''
        )}
      >
        <span className="text-sm font-medium text-muted-foreground">+506</span>
      </div>

      <input
        id={id}
        type="tel"
        value={disabled ? getLocalNumber(value) ? formatDisplay(getLocalNumber(value)) : '' : formatDisplay(localNumber)}
        onChange={handleChange}
        onPaste={handlePaste}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background pl-14 pr-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        placeholder={placeholder}
      />
    </div>
  );
};

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
