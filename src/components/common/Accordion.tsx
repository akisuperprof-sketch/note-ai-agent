import { useState } from 'react';
import { ArticleContextType, useArticle } from '../../contexts/ArticleContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100"
            >
                <span className="font-medium text-gray-800">{title}</span>
                {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {open && <div className="p-4 bg-white">{children}</div>}
        </div>
    );
}
