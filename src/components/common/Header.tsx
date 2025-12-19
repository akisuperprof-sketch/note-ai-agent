import { HelpCircle } from 'lucide-react';

interface HeaderProps {
    onShowGuide?: () => void;
}

export function Header({ onShowGuide }: HeaderProps) {
    return (
        <header className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <img src="/logo-wide.jpeg" alt="Logo" className="w-auto h-32 rounded-2xl shadow-lg shadow-purple-500/20" />
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500">
                                note記事全自動AIエージェント
                            </h1>
                        </div>
                    </div>

                    <button
                        onClick={onShowGuide}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        title="使い方を見る"
                    >
                        <HelpCircle className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
