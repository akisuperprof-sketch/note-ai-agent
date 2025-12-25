import { useArticle } from '../../contexts/ArticleContext';
import { ImageIcon } from 'lucide-react';
import { styleLabels, audienceLabels, wordCountOptions, type WritingStyle, type AudienceLevel } from '../../types';

export function BasicSettings() {
    const { articleData, updateSettings } = useArticle();
    const { settings } = articleData;

    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex flex-wrap items-end gap-x-4 gap-y-3">

                {/* 文字数 - 最も重要なので左端に */}
                <div className="flex-1 min-w-[120px]">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">文字数目安</label>
                    <select
                        value={settings.wordCount}
                        onChange={(e) => updateSettings('wordCount', parseInt(e.target.value))}
                        className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all shadow-sm appearance-none"
                    >
                        {wordCountOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 文体 */}
                <div className="flex-1 min-w-[120px]">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">文体</label>
                    <select
                        value={settings.style}
                        onChange={(e) => updateSettings('style', e.target.value as WritingStyle)}
                        className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all shadow-sm appearance-none"
                    >
                        {Object.entries(styleLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 読者層 */}
                <div className="flex-1 min-w-[120px]">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">読者層</label>
                    <select
                        value={settings.audience}
                        onChange={(e) => updateSettings('audience', e.target.value as AudienceLevel)}
                        className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all shadow-sm appearance-none"
                    >
                        {Object.entries(audienceLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 画像テーマ - 幅広に */}
                <div className="flex-[2] min-w-[200px]">
                    <label className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-gray-400" />
                        画像雰囲気
                    </label>
                    <input
                        type="text"
                        value={settings.imageTheme}
                        onChange={(e) => updateSettings('imageTheme', e.target.value)}
                        placeholder="例: 明るいカフェ、未来的なオフィス"
                        className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all shadow-sm placeholder-gray-400"
                    />
                </div>

            </div>
        </div>
    );
}
