import { Loader2, Check } from 'lucide-react';

interface LoadingProps {
    message?: string;
    overlay?: boolean;
}

export function Loading({ message = '生成中...', overlay = false }: LoadingProps) {

    // Chevron Step Component
    const Step = ({ label, index, isActive, isCompleted }: { label: string, index: number, isActive: boolean, isCompleted: boolean }) => {
        // Base colors for the steps matching the provided image style (Red -> Blue -> Yellow -> Green-ish)
        const colors = [
            'from-blue-600 to-cyan-500',   // Step 1: Article
            'from-amber-400 to-orange-500', // Step 2: Image
            'from-emerald-500 to-green-500' // Step 3: Complete
        ];

        const colorClass = colors[index % colors.length];

        return (
            <div className={`relative flex items-center justify-center h-14 px-10 min-w-[180px] transition-all duration-500
                ${isActive || isCompleted ? 'opacity-100 transform translate-y-0' : 'opacity-30 translate-y-2'}
            `}>
                {/* Chevron Shape Background */}
                <div
                    className={`absolute inset-0 bg-gradient-to-r ${colorClass} shadow-xl`}
                    style={{
                        clipPath: index === 0
                            ? 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' // Flat start
                            : 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)' // Arrow shape
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-white font-bold tracking-wider uppercase drop-shadow-md">
                    <span className="text-[10px] opacity-90 mb-0.5">STEP {index + 1}</span>
                    <div className="flex items-center gap-2 text-lg">
                        {isCompleted && <Check className="w-5 h-5" />}
                        {label}
                    </div>
                </div>
            </div>
        );
    };

    const content = (
        <div className="flex flex-col items-center w-full max-w-5xl px-4">
            {/* Steps Visualization */}
            <div className="flex items-center justify-center w-full -space-x-6 mb-16">
                <Step
                    label="記事執筆"
                    index={0}
                    isActive={true}
                    isCompleted={message.includes('画像') || message.includes('完了')}
                />
                <Step
                    label="画像生成"
                    index={1}
                    isActive={message.includes('画像') || message.includes('完了')}
                    isCompleted={message.includes('完了')}
                />
                <Step
                    label="完了"
                    index={2}
                    isActive={message.includes('完了')}
                    isCompleted={false} // "Complete" is the final state
                />
            </div>

            {/* Spinning Loader & Message */}
            <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-white/10"></div>
                    <Loader2 className="w-20 h-20 text-white animate-spin absolute inset-0" />
                </div>
                <h3 className="text-xl md:text-3xl font-bold text-white tracking-tight text-center">{message}</h3>
                <p className="text-gray-300 text-sm animate-pulse">AIが最高のアウトプットを作成中...</p>
            </div>
        </div>
    );

    if (overlay) {
        return (
            <div className="loading-overlay">
                <div className="bg-white rounded-xl p-10 shadow-2xl animate-fade-in min-w-[300px]">
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
