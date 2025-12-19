import { Loader2 } from 'lucide-react';

interface LoadingProps {
    message?: string;
    overlay?: boolean;
}

export function Loading({ message = '生成中...', overlay = false }: LoadingProps) {
    const content = (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-primary-100"></div>
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin absolute inset-0" />
            </div>
            <div className="text-center">
                <p className="text-gray-700 font-medium">{message}</p>
                <p className="text-sm text-gray-500 mt-1">しばらくお待ちください</p>
            </div>
        </div>
    );

    if (overlay) {
        return (
            <div className="loading-overlay">
                <div className="bg-white rounded-2xl p-8 shadow-2xl animate-fade-in">
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center py-12">
            {content}
        </div>
    );
}
