import { useArticle } from '../../contexts/ArticleContext';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { OutlineSection } from '../../types';

export function OutlineEditor() {
    const { articleData, setOutline } = useArticle();
    const { outline, selectedTitle } = articleData;
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    if (outline.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>まず「タイトル案」タブでタイトルを選択し、</p>
                <p>「構成案を作成する」ボタンを押してください。</p>
            </div>
        );
    }

    const updateSection = (index: number, updates: Partial<OutlineSection>) => {
        const newOutline = [...outline];
        newOutline[index] = { ...newOutline[index], ...updates };
        setOutline(newOutline);
    };

    const addSection = (afterIndex: number) => {
        const newSection: OutlineSection = {
            level: 1,
            heading: '新しいセクション',
            summary: '',
        };
        const newOutline = [...outline];
        newOutline.splice(afterIndex + 1, 0, newSection);
        setOutline(newOutline);
        setEditingIndex(afterIndex + 1);
    };

    const removeSection = (index: number) => {
        if (outline.length <= 1) return;
        const newOutline = outline.filter((_, i) => i !== index);
        setOutline(newOutline);
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === outline.length - 1)
        ) {
            return;
        }

        const newOutline = [...outline];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newOutline[index], newOutline[targetIndex]] = [newOutline[targetIndex], newOutline[index]];
        setOutline(newOutline);
    };

    return (
        <div className="space-y-6">
            {/* 選択中タイトル */}
            {selectedTitle && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">タイトル</p>
                    <p className="text-gray-800 font-medium">{selectedTitle}</p>
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    記事構成
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    見出しの編集・追加・削除・並び替えができます。
                </p>
            </div>

            <div className="space-y-2">
                {outline.map((section, index) => (
                    <div
                        key={index}
                        className={`
              group relative p-4 rounded-xl border transition-all duration-200
              ${editingIndex === index
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }
            `}
                    >
                        <div className="flex items-start gap-3">
                            {/* ドラッグハンドル */}
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => moveSection(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                                >
                                    ↑
                                </button>
                                <GripVertical className="w-4 h-4 text-gray-400" />
                                <button
                                    onClick={() => moveSection(index, 'down')}
                                    disabled={index === outline.length - 1}
                                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                                >
                                    ↓
                                </button>
                            </div>

                            {/* コンテンツ */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <select
                                        value={section.level}
                                        onChange={(e) => updateSection(index, { level: parseInt(e.target.value) })}
                                        className="text-xs px-2 py-1 border border-gray-200 rounded"
                                    >
                                        <option value={1}>H2</option>
                                        <option value={2}>H3</option>
                                    </select>
                                    <span className="text-xs text-gray-400">セクション {index + 1}</span>
                                </div>

                                {editingIndex === index ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={section.heading}
                                            onChange={(e) => updateSection(index, { heading: e.target.value })}
                                            className="input-field font-medium"
                                            placeholder="見出し"
                                            autoFocus
                                        />
                                        <textarea
                                            value={section.summary}
                                            onChange={(e) => updateSection(index, { summary: e.target.value })}
                                            className="input-field text-sm"
                                            placeholder="このセクションの概要（省略可）"
                                            rows={2}
                                        />
                                        <button
                                            onClick={() => setEditingIndex(null)}
                                            className="text-sm text-primary-600 hover:text-primary-700"
                                        >
                                            完了
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setEditingIndex(index)}
                                        className="cursor-pointer"
                                    >
                                        <p className={`font-medium ${section.level === 1 ? 'text-gray-900' : 'text-gray-700 text-sm pl-4'}`}>
                                            {section.level === 1 ? '## ' : '### '}{section.heading}
                                        </p>
                                        {section.summary && (
                                            <p className="text-sm text-gray-500 mt-1">{section.summary}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* アクション */}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => addSection(index)}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-600"
                                    title="下に追加"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => removeSection(index)}
                                    disabled={outline.length <= 1}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-500 disabled:opacity-30"
                                    title="削除"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* セクション追加ボタン */}
            <button
                onClick={() => addSection(outline.length - 1)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                セクションを追加
            </button>
        </div>
    );
}
