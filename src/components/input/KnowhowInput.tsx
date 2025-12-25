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
        <div className="space-y-3 relative">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded bg-blue-600 text-white text-sm font-bold">
                        1
                    </span>
                    <span className="font-bold text-gray-100">ノウハウ・一次情報を入力</span>
                </label>

                <div className="flex items-center gap-4">
                    {/* Simulation Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSimulations(!showSimulations)}
                            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors bg-blue-900/20 px-2 py-1 rounded border border-blue-800/50"
                            title="検証用データを読み込む"
                        >
                            <Beaker className="w-3.5 h-3.5" />
                            シミュレーション読込
                        </button>

                        {/* Dropdown Menu */}
                        {showSimulations && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                                <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                                    <span className="text-xs font-bold text-gray-300">シミュレーションデータ選択</span>
                                    <button onClick={() => setShowSimulations(false)} className="text-gray-500 hover:text-white">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {simulationScenarios.map((scenario) => (
                                        <button
                                            key={scenario.id}
                                            onClick={() => loadScenario(scenario)}
                                            className="w-full text-left p-3 hover:bg-gray-800 border-b border-gray-800 last:border-0 transition-colors"
                                        >
                                            <div className="text-sm font-bold text-blue-300 mb-0.5">{scenario.label}</div>
                                            <div className="text-xs text-gray-400 line-clamp-1">{scenario.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {articleData.knowhow && (
                        <span className="text-xs text-gray-400">
                            {articleData.knowhow.length.toLocaleString()}文字
                        </span>
                    )}
                </div>
            </div>

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
                className="input-field resize-none overflow-hidden"
            />

            {articleData.knowhow && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setKnowhow('')}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        クリアする
                    </button>
                </div>
            )}
        </div>
    );
}
