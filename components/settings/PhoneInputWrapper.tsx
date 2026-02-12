'use client';

import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { CheckCircle2 } from 'lucide-react';

interface PhoneInputWrapperProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    verified?: boolean;
}

export const PhoneInputWrapper: React.FC<PhoneInputWrapperProps> = ({ value, onChange, disabled, verified }) => {
    return (
        <div className="relative">
            <PhoneInput
                international
                defaultCountry="IN"
                value={value}
                onChange={(val) => onChange(val?.toString() || '')}
                disabled={disabled}
                className={`
                    w-full bg-zinc-950/50 border rounded-xl px-4 py-3 text-sm text-white transition-all
                    [&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:text-zinc-400 [&_.PhoneInputCountrySelect]:border-none [&_.PhoneInputCountrySelect]:mr-2
                    [&_.PhoneInputCountryIcon]:w-6 [&_.PhoneInputCountryIcon]:h-4 [&_.PhoneInputCountryIcon--border]:border-none
                    [&_input]:bg-transparent [&_input]:outline-none [&_input]:placeholder-zinc-600
                    ${disabled ? 'opacity-50 cursor-not-allowed border-white/5' : 'border-white/10 focus-within:border-tactical-500 focus-within:ring-1 focus-within:ring-tactical-500'}
                `}
            />
            {verified && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <CheckCircle2 size={18} />
                </div>
            )}
        </div>
    );
};
