import { Sparkles } from 'lucide-react';

export function Header() {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                AI記事生成プラットフォーム
                            </h1>
                            <p className="text-xs text-gray-500">
                                わど式戦略企画メソッド
                            </p>
                        </div>
                    </div>

                    <button className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                        使い方
                    </button>
                </div>
            </div>
        </header>
    );
}
