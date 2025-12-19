import { useArticle } from '../../contexts/ArticleContext';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, Check, FileText } from 'lucide-react';
import { useState } from 'react';

export function BodyPreview() {
    const { articleData } = useArticle();
    const { body, metaDescription, selectedTitle } = articleData;
    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview');

    if (!body) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>まず「構成案」タブで構成を確認し、</p>
                <p>「本文を作成する」ボタンを押してください。</p>
            </div>
        );
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(body);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([body], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedTitle || 'article'}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const wordCount = body.length;

    return (
        <div className="space-y-6">
            {/* メタディスクリプション */}
            {metaDescription && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        メタディスクリプション
                    </p>
                    <p className="text-sm text-gray-700">{metaDescription}</p>
                </div>
            )}

            {/* ツールバー */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('preview')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'preview'
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        プレビュー
                    </button>
                    <button
                        onClick={() => setViewMode('markdown')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'markdown'
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Markdown
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        {wordCount.toLocaleString()}文字
                    </span>
                    <button
                        onClick={handleCopy}
                        className="btn-secondary flex items-center gap-1.5"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-green-600" />
                                コピー済み
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                コピー
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="btn-secondary flex items-center gap-1.5"
                    >
                        <Download className="w-4 h-4" />
                        ダウンロード
                    </button>
                </div>
            </div>

            {/* コンテンツ */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                {viewMode === 'preview' ? (
                    <div className="p-6 md:p-8 markdown-preview">
                        <ReactMarkdown>{body}</ReactMarkdown>
                    </div>
                ) : (
                    <pre className="p-6 text-sm overflow-x-auto bg-gray-900 text-gray-100">
                        <code>{body}</code>
                    </pre>
                )}
            </div>
        </div>
    );
}
