import { useArticle } from '../../contexts/ArticleContext';
import { Accordion } from '../common/Accordion';
import { Target, Zap } from 'lucide-react';

export function StrategySettings() {
    const { articleData, updateStrategy } = useArticle();
    const { strategy } = articleData;

    const fields = [
        {
            key: 'title' as const,
            label: '2 タイトル',
            placeholder: '記事のタイトル案（空白でも可）',
            rows: 1,
        },
        {
            key: 'target' as const,
            label: '3 ターゲット・読者変容',
            placeholder: '例：情報整理に悩むビジネスパーソン → 効率的に知識を管理できるようになる',
            rows: 2,
        },
        {
            key: 'concept' as const,
            label: '4 記事コンセプト',
            placeholder: '例：初心者でも1週間で実践できるステップバイステップガイド',
            rows: 2,
        },
        {
            key: 'strength' as const,
            label: '5 記事の強み',
            placeholder: '例：実体験に基づく具体的なアドバイス、初心者目線での丁寧な解説',
            rows: 2,
        },
        {
            key: 'structure' as const,
            label: '6 記事構成',
            placeholder: '例：導入 → Day1〜Day7の段階的ガイド → まとめ → FAQ',
            rows: 3,
        },
        {
            key: 'otherInstructions' as const,
            label: '7 その他の指示',
            placeholder: '例：FAQを追加してほしい、特典の案内を入れてほしい',
            rows: 2,
        },
    ];

    return (
        <Accordion
            title="戦略企画（わど式）"
            icon={<Target className="w-5 h-5" />}
        >
            <div className="space-y-4 mt-4">
                {fields.map((field) => (
                    <div key={field.key} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            {field.label}
                        </label>
                        {field.rows === 1 ? (
                            <input
                                type="text"
                                value={strategy[field.key]}
                                onChange={(e) => updateStrategy(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="input-field"
                            />
                        ) : (
                            <textarea
                                value={strategy[field.key]}
                                onChange={(e) => updateStrategy(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                rows={field.rows}
                                className="input-field"
                            />
                        )}
                    </div>
                ))}

                <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                    <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-primary-600 mt-0.5" />
                        <p className="text-sm text-primary-700">
                            <strong>ヒント：</strong>
                            すべての項目を埋める必要はありません。ノウハウとターゲットがあれば、AIが最適な記事を生成します。
                        </p>
                    </div>
                </div>
            </div>
        </Accordion>
    );
}
