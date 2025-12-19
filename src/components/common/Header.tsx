import { HelpCircle } from 'lucide-react';

export function Header() {
    return (
        <header className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-purple-500/20" />
                        <div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500">
                                note記事全自動AIエージェント
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
