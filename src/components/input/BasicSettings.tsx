import { useArticle } from '../../contexts/ArticleContext';
import { Accordion } from '../common/Accordion';
import { Settings, ImageIcon } from 'lucide-react';
import { styleLabels, audienceLabels, wordCountOptions, type WritingStyle, type AudienceLevel } from '../../types';

export function BasicSettings() {
    const { articleData, updateSettings } = useArticle();
    const { settings } = articleData;

    return (
        <Accordion
            title="基本設定"
            icon={<Settings className="w-5 h-5 text-gray-500" />}
        >
            <div className="space-y-4 mt-4">
                {/* 文体 */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">文体</label>
                    <select
                        value={settings.style}
                        onChange={(e) => updateSettings('style', e.target.value as WritingStyle)}
                        className="input-field"
                    >
                        {Object.entries(styleLabels).map(([value, label]) => (
                            <option key={value} value={value} className="text-gray-900">
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 読者層 */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">読者層</label>
                    <select
                        value={settings.audience}
                        onChange={(e) => updateSettings('audience', e.target.value as AudienceLevel)}
                        className="input-field"
                    >
                        {Object.entries(audienceLabels).map(([value, label]) => (
                            <option key={value} value={value} className="text-gray-900">
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 文字数 */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">文字数</label>
                    <select
                        value={settings.wordCount}
                        onChange={(e) => updateSettings('wordCount', parseInt(e.target.value))}
                        className="input-field"
                    >
                        {wordCountOptions.map((option) => (
                            <option key={option.value} value={option.value} className="text-gray-900">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 画像テーマ */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-gray-500" />
                        画像テーマ（オプション）
                    </label>
                    <input
                        type="text"
                        value={settings.imageTheme}
                        onChange={(e) => updateSettings('imageTheme', e.target.value)}
                        placeholder="例：モダン、ビジネス、カジュアル"
                        className="input-field"
                    />
                </div>
            </div>
        </Accordion>
    );
}
