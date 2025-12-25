import { useArticle } from '../../contexts/ArticleContext';
import { Accordion } from '../common/Accordion';
import { Target, Zap } from 'lucide-react';

export function StrategySettings() {
    const { articleData, updateStrategy } = useArticle();
    const { strategy } = articleData;

    return (
        <div className="space-y-6">
            <Accordion
                title="カスタマイズ計画（自分で詳細設定オプション）"
                icon={<Target className="w-5 h-5 text-emerald-400" />}
                defaultOpen={false}
            >
                <div className="space-y-8 mt-6">
                    {/* 2 Title */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded bg-indigo-600 text-white text-sm font-bold">
                                2
                            </span>
                            <h3 className="font-bold text-gray-100">タイトル</h3>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1.5">確定タイトル（任意）</p>
                            <input
                                type="text"
                                value={strategy.title}
                                onChange={(e) => updateStrategy('title', e.target.value)}
                                placeholder="例：【経営者視点】社員には教えたくない..."
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* 3 Target & Reader Change */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-600 text-white text-sm font-bold">
                                3
                            </span>
                            <h3 className="font-bold text-gray-100">ターゲット・読者変容</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-1.5">想定ターゲット</p>
                                <textarea
                                    value={strategy.target}
                                    onChange={(e) => updateStrategy('target', e.target.value)}
                                    placeholder="例：副業に興味がある会社員（30-40代）"
                                    rows={2}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4 Concept / Differentiation */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded bg-orange-600 text-white text-sm font-bold">
                                4
                            </span>
                            <h3 className="font-bold text-gray-100">差別化・記事コンセプト</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-1.5">記事コンセプト</p>
                                <textarea
                                    value={strategy.concept}
                                    onChange={(e) => updateStrategy('concept', e.target.value)}
                                    placeholder="例：初心者でも1週間で実践できるステップバイステップガイド"
                                    rows={2}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1.5">記事の強み（差別化）</p>
                                <textarea
                                    value={strategy.strength}
                                    onChange={(e) => updateStrategy('strength', e.target.value)}
                                    placeholder="例：実体験に基づく具体的なアドバイス..."
                                    rows={2}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 5 Structure & Other */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded bg-purple-600 text-white text-sm font-bold">
                                5
                            </span>
                            <h3 className="font-bold text-gray-100">構成・その他</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-1.5">記事構成</p>
                                <textarea
                                    value={strategy.structure}
                                    onChange={(e) => updateStrategy('structure', e.target.value)}
                                    placeholder="例：導入 → Day1〜Day7の段階的ガイド → まとめ → FAQ"
                                    rows={3}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1.5">その他の指示</p>
                                <textarea
                                    value={strategy.otherInstructions}
                                    onChange={(e) => updateStrategy('otherInstructions', e.target.value)}
                                    placeholder="例：FAQを追加してほしい、特典の案内を入れてほしい"
                                    rows={2}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-800/50">
                        <div className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-blue-400 mt-0.5" />
                            <p className="text-sm text-blue-200">
                                <strong>ヒント：</strong>
                                すべての項目を埋める必要はありません。ノウハウとターゲットがあれば、AIが最適な記事を生成します。
                            </p>
                        </div>
                    </div>
                </div>
            </Accordion>
        </div>
    );
}
