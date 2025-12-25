import { useArticle } from '../../contexts/ArticleContext';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, Check, FileText, BarChart2, Eye, FileEdit, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

export function BodyPreview() {
    const { articleData } = useArticle();

    const { body, metaDescription, hashtags, selectedTitle, generatedImageUrl } = articleData;
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'result' | 'preview' | 'score'>('preview'); // Default to preview

    // Show copy success state for 3 seconds
    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

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
            const contentToCopy = metaDescription
                ? `${body}\n\n---\n\n${metaDescription}`
                : body;
            await navigator.clipboard.writeText(contentToCopy);
            setCopied(true);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
        const contentToDownload = metaDescription
            ? `${body}\n\n---\n\n${metaDescription}`
            : body;
        const blob = new Blob([contentToDownload], { type: 'text/markdown' });
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
    // Mock score for now - in a real app this might come from the API
    const qualityScore = 96;


    return (
        <div className="space-y-8 animate-fade-in">
            {/* Success Hero Section with Quality Score Summary */}
            <div className="text-center space-y-4 py-6 bg-gradient-to-b from-green-50/50 to-transparent rounded-2xl border border-green-100/50">
                <div className="flex items-center justify-center gap-4 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">生成完了！</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full border border-green-200">
                        品質スコア: <span className="text-lg">{qualityScore}</span>点
                    </span>
                </div>
                <p className="text-gray-500 text-sm">
                    {wordCount.toLocaleString()}文字の記事が完成しました
                </p>
            </div>

            {/* Big Action Buttons - Flex */}
            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={handleCopy}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-[0.98] shadow-xl ${copied
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-900/20'
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-purple-900/20 hover:opacity-90'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        {copied ? (
                            <>
                                <Check className="w-6 h-6" />
                                コピーしました！
                            </>
                        ) : (
                            <>
                                <Copy className="w-6 h-6" />
                                記事をコピーする
                            </>
                        )}
                    </div>
                </button>

                <a
                    href="https://note.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 px-6 rounded-xl font-bold text-lg bg-white border-2 border-[#41c9b4] text-[#41c9b4] hover:bg-[#41c9b4] hover:text-white transition-all duration-300 shadow-lg shadow-[#41c9b4]/10 flex items-center justify-center gap-2 group"
                >
                    <ExternalLink className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    noteを開く
                </a>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#0f172a] p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('result')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'result'
                        ? 'bg-gray-800 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <FileEdit className="w-4 h-4" />
                    生成結果
                </button>
                <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'preview'
                        ? 'bg-gray-800 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <Eye className="w-4 h-4" />
                    noteプレビュー
                </button>
                <button
                    onClick={() => setActiveTab('score')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'score'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <BarChart2 className="w-4 h-4" />
                    品質スコア
                </button>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[400px]">
                {activeTab === 'result' && (
                    <div className="space-y-4">
                        {metaDescription && (
                            <div className="p-4 bg-[#0f172a] rounded-xl border border-gray-800">
                                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    メタディスクリプション
                                </p>
                                <p className="text-sm text-gray-300">{metaDescription}</p>
                            </div>
                        )}

                        {hashtags && hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {hashtags.map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-900/30 text-blue-300 text-sm rounded-full border border-blue-500/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="bg-[#1e293b]/50 rounded-xl border border-gray-700/50 p-6 overflow-hidden">
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                                {body}
                            </pre>
                        </div>
                    </div>
                )}

                {activeTab === 'preview' && (
                    <div className="bg-white text-gray-900 rounded-xl p-8 md:p-12 shadow-xl border border-gray-200">
                        <div className="prose prose-slate max-w-2xl mx-auto leading-loose">
                            <h1 className="text-3xl font-bold mb-10 pb-4 border-b border-gray-200">{selectedTitle}</h1>

                            <div className="note-preview-content">

                                {/* Generated Image Preview Area */}
                                <div className="mb-10 aspect-video rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm border border-gray-200 group relative">
                                    {generatedImageUrl ? (
                                        <>
                                            <img src={generatedImageUrl} alt="見出し画像" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                                                    再生成する
                                                </button>
                                                <a href={generatedImageUrl} download="eyecatch.png" className="bg-[#41c9b4] text-white px-4 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                                                    <Download className="w-4 h-4" />
                                                    保存する
                                                </a>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="text-2xl">🖼️</span>
                                            </div>
                                            <p className="text-sm font-bold text-gray-500">見出し画像を生成中...</p>
                                            <p className="text-xs mt-1">AIが記事に合った画像をデザインしています</p>
                                        </div>
                                    )}
                                </div>

                                <ReactMarkdown
                                    components={{
                                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900 border-b border-gray-200 pb-2" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900 border-l-4 border-green-500 pl-3" {...props} />,
                                        p: ({ node, ...props }) => <p className="leading-loose text-gray-800 mb-6 text-[17px]" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-6 bg-gray-50 p-6 rounded-lg border border-gray-100" {...props} />,
                                        li: ({ node, ...props }) => <li className="text-gray-700 leading-relaxed" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-gray-900 bg-yellow-100 px-1" {...props} />,
                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-6 text-gray-500 italic bg-gray-50 pr-4" {...props} />,
                                        a: ({ node, ...props }) => <a className="text-green-600 hover:text-green-700 underline underline-offset-4" {...props} />,
                                        hr: ({ node, ...props }) => <hr className="my-8 border-gray-200" {...props} />
                                    }}
                                >
                                    {body}
                                </ReactMarkdown>
                            </div>

                            {hashtags && hashtags.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                                    {hashtags.map((tag, index) => (
                                        <span key={index} className="text-gray-500 hover:text-gray-900 cursor-pointer">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'score' && (
                    <div className="space-y-6">
                        {/* Score Card */}
                        <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-8 text-center border border-white/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]" />
                            <h3 className="text-gray-300 mb-6 relative z-10">記事品質スコア</h3>
                            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                                {/* Simple CSS Gauge Circle */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        fill="none"
                                        stroke="#1e293b"
                                        strokeWidth="12"
                                    />
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        fill="none"
                                        stroke="url(#score-gradient)"
                                        strokeWidth="12"
                                        strokeDasharray={`${2 * Math.PI * 88}`}
                                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - qualityScore / 100)}`}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                    <defs>
                                        <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-bold text-white mb-1">{qualityScore}</span>
                                    <span className="text-sm text-gray-400">/ 100</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-4 bg-[#0f172a] rounded-xl border border-gray-800">
                                <p className="text-xs text-gray-500 mb-1">論理性</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-xl font-bold text-blue-400">S</span>
                                    <span className="text-xs text-gray-400 mb-1">非常に高い</span>
                                </div>
                            </div>
                            <div className="p-4 bg-[#0f172a] rounded-xl border border-gray-800">
                                <p className="text-xs text-gray-500 mb-1">SEO強度</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-xl font-bold text-purple-400">A+</span>
                                    <span className="text-xs text-gray-400 mb-1">上位表示</span>
                                </div>
                            </div>
                            <div className="p-4 bg-[#0f172a] rounded-xl border border-gray-800">
                                <p className="text-xs text-gray-500 mb-1">共感性</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-xl font-bold text-pink-400">S</span>
                                    <span className="text-xs text-gray-400 mb-1">心に響く</span>
                                </div>
                            </div>
                            <div className="p-4 bg-[#0f172a] rounded-xl border border-gray-800">
                                <p className="text-xs text-gray-500 mb-1">独自性</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-xl font-bold text-amber-400">A</span>
                                    <span className="text-xs text-gray-400 mb-1">ユニーク</span>
                                </div>
                            </div>
                            <div className="p-4 bg-[#0f172a] rounded-xl border border-gray-800">
                                <p className="text-xs text-gray-500 mb-1">読みやすさ</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-xl font-bold text-emerald-400">S+</span>
                                    <span className="text-xs text-gray-400 mb-1">快適</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleDownload}
                    className="text-sm text-gray-500 hover:text-white flex items-center gap-2 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Markdownをダウンロード
                </button>
            </div>
        </div>
    );
}
