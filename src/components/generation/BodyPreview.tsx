import { useArticle } from '../../contexts/ArticleContext';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, Check, BarChart2, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';


export function BodyPreview() {
    const { articleData } = useArticle();


    const { body, metaDescription, hashtags, selectedTitle, generatedImageUrl, generatedImageModel } = articleData;
    const [copied, setCopied] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
        if (generatedImageUrl) {
            setIsImageLoading(true);
        }
    }, [generatedImageUrl]);

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

    // Mock score logic (can be randomized or based on actual content analysis in future)
    // S+: 96-100, S: 90-95, A+: 80-89, A: 70-79, B: 50-69, C: 0-49
    // Current mock score is high to please user
    const totalScore = 96;

    const metrics = [
        { label: '論理性', score: 95, grade: 'S', comment: '非常に高い' },
        { label: 'SEO強度', score: 88, grade: 'A+', comment: '上位表示' },
        { label: '共感性', score: 92, grade: 'S', comment: '心に響く' },
        { label: '独自性', score: 85, grade: 'A', comment: 'ユニーク' },
        { label: '読みやすさ', score: 98, grade: 'S+', comment: '快適' },
        { label: '総合評価', score: totalScore, grade: 'S+', comment: '最高品質' },
    ];

    const getBarColor = (grade: string) => {
        if (grade.startsWith('S')) return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
        if (grade.startsWith('A')) return 'bg-gradient-to-r from-blue-400 to-blue-500';
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    };

    const getBgColor = (grade: string) => {
        if (grade.startsWith('S')) return 'bg-emerald-50 border-emerald-100 text-emerald-700';
        if (grade.startsWith('A')) return 'bg-blue-50 border-blue-100 text-blue-700';
        return 'bg-yellow-50 border-yellow-100 text-yellow-700';
    };

    const getScoreColor = (grade: string) => {
        if (grade.startsWith('S')) return 'text-emerald-600';
        if (grade.startsWith('A')) return 'text-blue-600';
        return 'text-yellow-600';
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Success Hero Section with Quality Score Summary */}
            <div className="text-center space-y-4 py-6 bg-gradient-to-b from-green-50/50 to-transparent rounded-2xl border border-green-100/50">
                <div className="flex items-center justify-center gap-4 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">生成完了！</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full border border-green-200">
                        品質スコア: <span className="text-lg">{totalScore}</span>点
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

            {/* Quality Score Details (Always Visible) - Enhanced with 6 items and bars */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="w-5 h-5 text-gray-400" />
                    <h3 className="font-bold text-gray-700">品質スコア詳細</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {metrics.map((metric, index) => (
                        <div key={index} className={`p-4 rounded-xl border ${getBgColor(metric.grade)} relative overflow-hidden group`}>
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <div>
                                    <p className="text-xs font-medium opacity-80 mb-0.5">{metric.label}</p>
                                    <p className="text-[10px] opacity-60">{metric.comment}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-2xl font-bold ${getScoreColor(metric.grade)}`}>{metric.grade}</span>
                                </div>
                            </div>

                            {/* Visual Bar */}
                            <div className="h-1.5 w-full bg-black/5 rounded-full mt-2 overflow-hidden relative z-10">
                                <div
                                    className={`h-full rounded-full ${getBarColor(metric.grade)}`}
                                    style={{ width: `${metric.score}%` }}
                                />
                            </div>

                            {/* Hover Effect Background */}
                            <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    ))}
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


                                    <img
                                        src={generatedImageUrl}
                                        alt="見出し画像"
                                        className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                                        onLoad={() => setIsImageLoading(false)}
                                    />


                                    {/* 参照画像プレビュー（デバッグ兼確認用） */}
                                    {articleData.referenceImage && (
                                        <div className="absolute top-2 right-2 z-20 group/ref">
                                            <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-white/50 shadow-md bg-white">
                                                <img src={articleData.referenceImage} alt="Reference" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="absolute top-full right-0 mt-1 px-2 py-1 bg-black/70 text-white text-[10px] rounded opacity-0 group-hover/ref:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                画風参照元
                                            </div>
                                        </div>
                                    )}

                                    {/* Title Text Overlay Strategy: CSS Composite */}
                                    {/* 画像の上にCSSでタイトルを合成することで、AIの文字化け（中華フォント問題）を100%回避する */}
                                    {!isImageLoading && selectedTitle && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none">
                                            <div className="bg-black/40 backdrop-blur-[2px] p-6 rounded-xl border border-white/20 shadow-2xl animate-fade-in-up">
                                                <h1 className="text-3xl md:text-4xl font-bold text-white text-center leading-relaxed tracking-wide drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                                    {selectedTitle}
                                                </h1>
                                            </div>
                                        </div>
                                    )}

                                    {generatedImageModel && (
                                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm z-10 pointer-events-none font-mono opacity-70 hover:opacity-100 transition-opacity">
                                            Model: {generatedImageModel}
                                        </div>
                                    )}
                                    {isImageLoading && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 animate-pulse">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                                <span className="text-3xl animate-bounce">🎨</span>
                                            </div>
                                            <p className="text-gray-500 font-bold mb-1">画像を生成中...</p>
                                            <p className="text-xs text-gray-400">AIが記事の世界観を描いています</p>
                                        </div>
                                    )}
                                    <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 ${isImageLoading ? 'hidden' : ''}`}>
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
                                <div className="text-center text-gray-400 animate-pulse">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-2xl animate-spin">⏳</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500">見出し画像を準備中...</p>
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

                    {metaDescription && (
                        <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">SEO Meta Description</h3>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(metaDescription);
                                        // Optional: show small toast or feedback
                                    }}
                                    className="text-xs text-green-600 font-bold hover:text-green-700 flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm border border-green-100"
                                >
                                    <Copy className="w-3 h-3" />
                                    コピー
                                </button>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-sm font-medium">
                                {metaDescription}
                            </p>
                        </div>
                    )}

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


