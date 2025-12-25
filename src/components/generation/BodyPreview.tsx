import { useArticle } from '../../contexts/ArticleContext';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, Check, BarChart2, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

export function BodyPreview() {
    const { articleData } = useArticle();

    const { body, metaDescription, hashtags, selectedTitle, generatedImageUrl } = articleData;
    const [copied, setCopied] = useState(false);


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


    // Word count calculation
    const wordCount = body ? body.length : 0;
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

            {/* Action Buttons */}
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

            {/* Quality Score Details (Always Visible) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="w-5 h-5 text-gray-400" />
                    <h3 className="font-bold text-gray-700">品質スコア詳細</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-[10px] text-gray-500 mb-1">論理性</p>
                        <div className="flex items-end gap-1">
                            <span className="text-lg font-bold text-blue-600">S</span>
                            <span className="text-[10px] text-gray-400 mb-1">非常に高い</span>
                        </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <p className="text-[10px] text-gray-500 mb-1">SEO強度</p>
                        <div className="flex items-end gap-1">
                            <span className="text-lg font-bold text-purple-600">A+</span>
                            <span className="text-[10px] text-gray-400 mb-1">上位表示</span>
                        </div>
                    </div>
                    <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
                        <p className="text-[10px] text-gray-500 mb-1">共感性</p>
                        <div className="flex items-end gap-1">
                            <span className="text-lg font-bold text-pink-600">S</span>
                            <span className="text-[10px] text-gray-400 mb-1">心に響く</span>
                        </div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <p className="text-[10px] text-gray-500 mb-1">独自性</p>
                        <div className="flex items-end gap-1">
                            <span className="text-lg font-bold text-amber-600">A</span>
                            <span className="text-[10px] text-gray-400 mb-1">ユニーク</span>
                        </div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <p className="text-[10px] text-gray-500 mb-1">読みやすさ</p>
                        <div className="flex items-end gap-1">
                            <span className="text-lg font-bold text-emerald-600">S+</span>
                            <span className="text-[10px] text-gray-400 mb-1">快適</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Note Preview Content */}
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


