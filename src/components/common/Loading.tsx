import { Loader2, Check, PenTool, Image, Send, Globe } from 'lucide-react';

interface LoadingProps {
    message?: string;
    overlay?: boolean;
}

export function Loading({ message = '生成中...', overlay = false }: LoadingProps) {

    // Modern Infographic Step Component
    const Step = ({ label, index, isActive, isCompleted, icon: Icon }: { label: string, index: number, isActive: boolean, isCompleted: boolean, icon: any }) => {
        const isCurrent = isActive && !isCompleted;


        // Base styles
        const baseCircleStyle = isCompleted
            ? "bg-[#41c9b4] text-white shadow-lg shadow-[#41c9b4]/30 scale-100" // Note Green
            : isCurrent
                ? "bg-white text-[#41c9b4] border-2 border-[#41c9b4] shadow-xl shadow-[#41c9b4]/20 scale-110 ring-4 ring-[#41c9b4]/10"
                : "bg-gray-50 text-gray-300 border border-gray-100 scale-95";

        const labelStyle = isCompleted
            ? "text-[#41c9b4] font-bold"
            : isCurrent
                ? "text-gray-800 font-bold"
                : "text-gray-300 font-medium";

        return (
            <div className="flex flex-col items-center gap-3 relative z-10 w-24">
                {/* Step Circle */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${baseCircleStyle}`}>
                    {isCompleted ? (
                        <Check className="w-7 h-7" strokeWidth={3} />
                    ) : (
                        <Icon className={`w-6 h-6 ${isCurrent ? 'animate-pulse' : ''}`} />
                    )}
                </div>


                <div className="flex flex-col items-center text-center">
                    <span className={`text-[10px] tracking-widest uppercase mb-1 font-bold ${isCurrent ? 'text-[#41c9b4]' : 'text-gray-300'}`}>
                        STEP {index + 1}
                    </span>
                    <span className={`text-sm whitespace-nowrap transition-colors duration-300 ${labelStyle}`}>
                        {label}
                    </span>
                </div>
            </div>
        );
    };

    const content = (
        <div className="flex flex-col items-center w-full max-w-4xl px-4">
            {/* Infographic Steps Container */}
            <div className="relative flex items-start justify-between w-full max-w-lg mb-16 px-4">

                {/* Connecting Line background */}
                <div className="absolute top-7 left-8 right-8 h-1 bg-gray-100 rounded-full -z-0" />


                {/* Active Progress Line */}
                <div
                    className="absolute top-7 left-8 h-1 bg-gradient-to-r from-[#41c9b4] to-[#2ea896] rounded-full -z-0 transition-all duration-1000 ease-out"
                    style={{
                        width: message.includes('完了') ? '85%' :
                            message.includes('投稿') ? '60%' :
                                message.includes('画像') ? '35%' : '10%'
                    }}
                />

                <Step
                    label="記事作成"
                    index={0}
                    icon={PenTool}
                    isActive={true}
                    isCompleted={message.includes('画像') || message.includes('投稿') || message.includes('完了')}
                />
                <Step
                    label="画像生成"
                    index={1}
                    icon={Image}
                    isActive={message.includes('画像') || message.includes('投稿') || message.includes('完了')}
                    isCompleted={message.includes('投稿') || message.includes('完了')}
                />
                <Step
                    label="記事投稿"
                    index={2}
                    icon={Send}
                    isActive={message.includes('投稿') || message.includes('完了')}
                    isCompleted={message.includes('完了')}
                />
                <Step
                    label="記事公開"
                    index={3}
                    icon={Globe}
                    isActive={message.includes('完了')}
                    isCompleted={false}
                />
            </div>

            {/* Main Loader & Message */}
            <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl w-full max-w-md">
                <div className="relative">

                    {/* Ring 1 */}
                    <div className="absolute inset-0 rounded-full border-4 border-[#41c9b4]/30 animate-ping opacity-20"></div>
                    {/* Ring 2 */}
                    <div className="w-20 h-20 rounded-full border-4 border-gray-100 flex items-center justify-center bg-white shadow-inner">
                        <Loader2 className="w-10 h-10 text-[#41c9b4] animate-spin" />
                    </div>
                </div>


                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                        {message}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium">
                        AIが最高のアウトプットを作成中...
                    </p>
                </div>
            </div>
        </div>
    );

    if (overlay) {
        return (
            <div className="loading-overlay flex items-center justify-center bg-black/60 backdrop-blur-sm fixed inset-0 z-50">
                <div className="bg-white/90 rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-scale-in max-w-3xl w-full mx-4 border border-white/50 backdrop-blur-md">
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
