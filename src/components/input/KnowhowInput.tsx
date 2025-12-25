import { useState, useRef, useEffect } from 'react';
import { useArticle } from '../../contexts/ArticleContext';
import { Trash2, Beaker, X } from 'lucide-react';
import { simulationScenarios } from '../../data/simulationScenarios';
import type { SimulationScenario } from '../../data/simulationScenarios';

export function KnowhowInput() {
    const { articleData, setKnowhow, updateStrategy, updateSettings } = useArticle();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showSimulations, setShowSimulations] = useState(false);

    // Auto-resize logic
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const adjustHeight = () => {
            textarea.style.height = 'auto'; // Reset height
            const minHeight = 6 * 24; // Approximation for 6 lines (line-height ~24px)
            const newHeight = Math.max(minHeight, textarea.scrollHeight);

            textarea.style.height = `${newHeight}px`;
        };

        adjustHeight();
    }, [articleData.knowhow]);

    const loadScenario = (scenario: SimulationScenario) => {
        if (confirm(`シミュレーション「${scenario.label}」のデータを読み込みますか？\n現在の入力内容は上書きされます。`)) {
            // ノウハウ
            if (scenario.data.knowhow) setKnowhow(scenario.data.knowhow);

            // 基本設定
            if (scenario.data.settings) {
                Object.entries(scenario.data.settings).forEach(([key, value]) => {
                    updateSettings(key as any, value);
                });
            }

            // 戦略設定
            if (scenario.data.strategy) {
                Object.entries(scenario.data.strategy).forEach(([key, value]) => {
                    updateStrategy(key as any, value);
                });
            }

            setShowSimulations(false);
        }
    };

    return (
        <div className="space-y-4 relative">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
                <label className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-base font-bold shadow-md shadow-green-500/20">
                        1
                    </span>
                    <span className="text-lg font-bold text-gray-800 tracking-tight">原稿の元ネタを入力</span>
                </label>

                <div className="flex items-center gap-4">
                    {/* Simulation Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSimulations(!showSimulations)}
                            className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 transition-colors bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full border border-green-200"
                            title="検証用データを読み込む"
                        >
                            <Beaker className="w-3.5 h-3.5" />
                            シミュレーション読込
                        </button>

                        {/* Dropdown Menu - Modernized */}
                        {showSimulations && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in ring-1 ring-black/5">
                                <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <span className="text-xs font-bold text-gray-600">シミュレーションデータ選択</span>
                                    <button onClick={() => setShowSimulations(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar bg-white">
                                    {simulationScenarios.map((scenario) => (
                                        <button
                                            key={scenario.id}
                                            onClick={() => loadScenario(scenario)}
                                            className="w-full text-left p-3 hover:bg-green-50 border-b border-gray-50 last:border-0 transition-colors group"
                                        >
                                            <div className="text-sm font-bold text-gray-700 group-hover:text-green-700 mb-0.5">{scenario.label}</div>
                                            <div className="text-xs text-gray-400 group-hover:text-gray-500 line-clamp-1">{scenario.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative group">
                <textarea
                    ref={textareaRef}
                    value={articleData.knowhow}
                    onChange={(e) => setKnowhow(e.target.value)}
                    rows={6}
                    placeholder="ここにあなたのノウハウや一次情報を入力してください。
例：
- 体験談や経験
- 専門知識やスキル
- 解決した課題
- 学んだこと"
                    className="w-full bg-white text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl p-6 text-base leading-relaxed focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none resize-none overflow-hidden shadow-sm"
                />

                {/* Character Count Floating Inside/Bottom */}
                <div className="absolute bottom-4 right-4 flex items-center gap-4 pointer-events-none">
                    {articleData.knowhow.length > 0 && (
                        <span className="text-xs font-mono text-gray-400 bg-white/80 px-2 py-1 rounded backdrop-blur-sm border border-gray-100 shadow-sm">
                            {articleData.knowhow.length.toLocaleString()}文字
                        </span>
                    )}
                </div>
            </div>

            {articleData.knowhow && (
                <div className="flex justify-end pt-2">
                    <button
                        onClick={() => setKnowhow('')}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors px-2 py-1 hover:bg-red-50 rounded"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        クリアする
                    </button>
                </div>
            )}
        </div>
    );
}
