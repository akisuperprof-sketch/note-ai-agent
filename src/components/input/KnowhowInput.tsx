import { useArticle } from '../../contexts/ArticleContext';
import { Trash2 } from 'lucide-react';

export function KnowhowInput() {
    const { articleData, setKnowhow } = useArticle();

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-sm font-bold flex items-center justify-center">
                        1
                    </span>
                    <span className="font-medium text-gray-800">ノウハウ・一次情報を入力</span>
                </label>
                {articleData.knowhow && (
                    <span className="text-xs text-gray-500">
                        {articleData.knowhow.length.toLocaleString()}文字
                    </span>
                )}
            </div>

            <textarea
                value={articleData.knowhow}
                onChange={(e) => setKnowhow(e.target.value)}
                placeholder="ここにあなたのノウハウや一次情報を入力してください。

例：
- 体験談や経験
- 専門知識やスキル
- 解決した課題
- 学んだこと"
                className="input-field min-h-[200px] resize-y"
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
