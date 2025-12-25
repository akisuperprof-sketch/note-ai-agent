import { HelpCircle, Clock } from 'lucide-react';

interface HeaderProps {
    onShowGuide?: () => void;
    onShowHistory?: () => void;
}

export function Header({ onShowGuide, onShowHistory, onReset }: HeaderProps & { onReset?: () => void }) {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 cursor-pointer" onClick={onReset} title="トップ画面へ戻る">
                        {/* <img src="/logo-wide.jpeg" alt="Logo" className="w-auto h-32 rounded-2xl shadow-lg shadow-purple-500/20" /> */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                note記事全自動AIエージェント
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onShowHistory}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
                            title="生成履歴"
                        >
                            <Clock className="w-6 h-6" />
                        </button>
                        <button
                            onClick={onShowGuide}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                            title="使い方を見る"
                        >
                            <HelpCircle className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
