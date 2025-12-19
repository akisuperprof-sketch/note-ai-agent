import { useArticle } from '../../contexts/ArticleContext';
import { Check, Pencil } from 'lucide-react';
import { useState } from 'react';

export function TitleSelector() {
    const { articleData, setSelectedTitle } = useArticle();
    const { generatedTitles, selectedTitle } = articleData;
    const [customTitle, setCustomTitle] = useState('');
    const [isCustom, setIsCustom] = useState(false);

    if (generatedTitles.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>まず「入力」タブでノウハウを入力し、</p>
                <p>「タイトル案を作成する」ボタンを押してください。</p>
            </div>
        );
    }

    const handleSelectTitle = (title: string) => {
        setSelectedTitle(title);
        setIsCustom(false);
    };

    const handleCustomTitle = () => {
        if (customTitle.trim()) {
            setSelectedTitle(customTitle.trim());
            setIsCustom(true);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    タイトル候補
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    以下の候補から選択するか、オリジナルのタイトルを入力してください。
                </p>
            </div>

            <div className="space-y-3">
                {generatedTitles.map((title, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelectTitle(title)}
                        className={`
              w-full text-left p-4 rounded-xl border-2 transition-all duration-200
              ${selectedTitle === title && !isCustom
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                            }
            `}
                    >
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-sm font-medium flex items-center justify-center">
                                {index + 1}
                            </span>
                            <span className="text-gray-800 flex-1">{title}</span>
                            {selectedTitle === title && !isCustom && (
                                <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* カスタムタイトル入力 */}
            <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                    <Pencil className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                        オリジナルのタイトルを入力
                    </span>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="独自のタイトルを入力..."
                        className="input-field flex-1"
                    />
                    <button
                        onClick={handleCustomTitle}
                        disabled={!customTitle.trim()}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        適用
                    </button>
                </div>
                {isCustom && selectedTitle && (
                    <p className="mt-2 text-sm text-primary-600 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        カスタムタイトルを選択中
                    </p>
                )}
            </div>

            {/* 選択中のタイトル表示 */}
            {selectedTitle && (
                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                    <p className="text-sm text-primary-700 font-medium mb-1">選択中のタイトル:</p>
                    <p className="text-gray-900 font-semibold">{selectedTitle}</p>
                </div>
            )}
        </div>
    );
}
