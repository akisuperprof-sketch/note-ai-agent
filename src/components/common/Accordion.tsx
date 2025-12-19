import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
    title: string;
    children: ReactNode;
    icon?: ReactNode;
    defaultOpen?: boolean;
}

export function Accordion({ title, children, icon, defaultOpen = false }: AccordionProps) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100"
            >
                <span className="font-medium text-gray-800 flex items-center gap-2">
                    {icon && <span className="text-primary-500">{icon}</span>}
                    {title}
                </span>
                {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {open && <div className="p-4 bg-white">{children}</div>}
        </div>
    );
}
