import { HelpCircle } from 'lucide-react';

export function Header() {
    return (
        <header className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <span className="text-white font-bold text-lg">AI</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500">
                                わど式note記事自動生成AIエージェント
                            </h1>
                        </div>
                    </div>

                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                        <HelpCircle className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
