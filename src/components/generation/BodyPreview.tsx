import { useArticle } from '../../contexts/ArticleContext';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, Check, BarChart2, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';


export function BodyPreview() {
    const { articleData } = useArticle();


    const { body, metaDescription, hashtags, selectedTitle, generatedImageUrl, generatedImageModel, outline, logs, settings } = articleData;
    const [copied, setCopied] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [currentModel, setCurrentModel] = useState('');
    const [fallbackCount, setFallbackCount] = useState(0);

    // Fallback models chain: user-preferred -> stable -> fast -> wildly different
    const FALLBACK_MODELS = ['nano-banana-pro-preview', 'flux', 'turbo', 'paint'];

    useEffect(() => {
        if (generatedImageUrl) {
            setCurrentImageUrl(generatedImageUrl);
            setCurrentModel(generatedImageModel || '');
            setIsImageLoading(true);
            setFallbackCount(0); // Reset fallback count on new image
        }
    }, [generatedImageUrl, generatedImageModel]);

    // Force stop loading after 15 seconds to prevent eternal spinner
    useEffect(() => {
        if (isImageLoading) {
            const timer = setTimeout(() => {
                if (isImageLoading) {
                    console.warn('Image loading timed out. Forcing display.');
                    setIsImageLoading(false);
                }
            }, 15000);
            return () => clearTimeout(timer);
        }
    }, [isImageLoading]);

    const handleRegenerateImage = () => {
        if (!currentImageUrl) return;
        setIsImageLoading(true);
        // Change seed to force regeneration
        const newSeed = Math.floor(Math.random() * 1000000);

        // When regenerating, aim to keep the current model but change the seed
        // EXCEPT if the current model is failed, then we restart the chain?
        // Let's just update the seed on the current URL
        const newUrl = currentImageUrl.replace(/seed=\d+/, `seed=${newSeed}`);
        setCurrentImageUrl(newUrl);
    };

    const handleImageError = () => {
        console.warn(`Image failed to load: ${currentModel} (Attempt ${fallbackCount + 1})`);

        if (fallbackCount < FALLBACK_MODELS.length) {
            const nextModel = FALLBACK_MODELS[fallbackCount];
            console.log(`Switching to fallback model: ${nextModel}`);

            // Construct new URL with the next model
            // Check if URL already has a model param
            let newUrl = '';
            if (currentImageUrl.includes('model=')) {
                newUrl = currentImageUrl.replace(/model=[^&]+/, `model=${nextModel}`);
            } else {
                newUrl = `${currentImageUrl}&model=${nextModel}`;
            }

            // Allow retry by updating state
            setCurrentImageUrl(newUrl);
            setCurrentModel(`${nextModel} (fallback)`);
            setFallbackCount(prev => prev + 1);
            // Keep isImageLoading true
        } else {
            console.error('All image generation fallbacks failed.');
            setIsImageLoading(false); // Stop spinner
            // Optionally set an error state to show a "broken image" icon
        }
    };

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
            {/* Article Structure Summary */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">📝</span>
                    <h3 className="font-bold text-emerald-800 text-lg">記事構成</h3>
                </div>

                <div className="mb-4 text-emerald-900 font-bold text-lg">
                    「{selectedTitle}」
                </div>

                <div className="flex items-center gap-4 text-sm text-emerald-700 mb-4 opacity-80">
                    <span>{outline.length}セクション</span>
                    <span>•</span>
                    <span>推定{settings.wordCount.toLocaleString()}文字</span>
                </div>

                <ul className="space-y-2">
                    {outline.filter(s => s.level === 1).map((section, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-emerald-800">
                            <span className="font-bold text-emerald-500 mt-1 text-xs">H2</span>
                            <span>{section.heading}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Processing Logs */}
            {logs && logs.length > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                        <span className="text-xl">📋</span>
                        <h3 className="font-bold text-gray-700 text-lg">処理ログ</h3>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 relative z-10 custom-scrollbar">
                        {logs.map((log, index) => (
                            <div key={index} className="flex items-start gap-3 text-sm font-mono leading-relaxed group hover:bg-white/50 p-1 rounded transition-colors">
                                <span className="text-gray-400 select-none whitespace-nowrap text-xs pt-0.5">{log.timestamp}</span>
                                <span className={`font-bold whitespace-nowrap text-xs pt-0.5 px-1.5 rounded ${log.category === '[エラー]' ? 'bg-red-100 text-red-600' :
                                    log.category === '[完了]' ? 'bg-green-100 text-green-600' :
                                        'bg-indigo-50 text-indigo-500'
                                    }`}>
                                    {log.category.replace(/[\[\]]/g, '')}
                                </span>
                                <span className={log.category === '[エラー]' ? 'text-red-600' : 'text-gray-600'}>{log.message}</span>
                            </div>
                        ))}
                    </div>
                    {/* Decorative side bar */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-3/4 bg-gray-200/50 rounded-full" />
                </div>
            )}

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

            {/* Note Preview Content - Note-like UI Implementation */}
            <div className="bg-white text-[#333] rounded-xl shadow-xl border border-gray-200 overflow-hidden mx-auto max-w-[800px]"> {/* Width adjusted for note-like feel */}

                {/* Note Header Area */}
                <div className="p-8 md:p-12 md:pb-0 pb-0 bg-white">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#9c88ff] flex items-center justify-center text-white font-bold text-lg">
                            あ
                        </div>
                        <div>
                            <div className="font-bold text-gray-800 text-sm">あなた</div>
                            <div className="text-gray-400 text-xs flex items-center gap-2">
                                <span>{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <span>·</span>
                                <span>{wordCount}文字</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-[28px] md:text-[32px] font-bold leading-tight tracking-tight text-[#222] mb-8">
                        {selectedTitle}
                    </h1>

                    {/* Generated Image (Eyecatch) */}
                    <div className="mb-10 w-full aspect-video bg-gray-50 rounded-md overflow-hidden border border-gray-100 relative group">
                        {generatedImageUrl ? (
                            <>
                                <img
                                    src={currentImageUrl || generatedImageUrl}
                                    alt="見出し画像"
                                    className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoading ? 'opacity-50 blur-sm' : 'opacity-100'}`}
                                    onLoad={() => setIsImageLoading(false)}
                                    onError={handleImageError}
                                />

                                {/* Loading Spinner Overlay */}
                                {isImageLoading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-sm z-10">
                                        <div className="w-12 h-12 border-4 border-[#41c9b4] border-t-transparent rounded-full animate-spin mb-3"></div>
                                        <span className="text-sm font-bold text-gray-500 animate-pulse">
                                            画像を生成中...
                                            {fallbackCount > 0 && <span className="block text-xs font-normal mt-1 opacity-80">(再試行 {fallbackCount})</span>}
                                        </span>
                                    </div>
                                )}

                                {/* Overlay UI for Image Actions */}
                                <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 ${isImageLoading ? 'hidden' : ''}`}>
                                    <button
                                        onClick={handleRegenerateImage}
                                        className="bg-white/90 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white transition-colors">
                                        再生成
                                    </button>
                                    <a href={currentImageUrl} download="eyecatch.png" className="bg-[#41c9b4] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity flex items-center gap-1">
                                        <Download className="w-3 h-3" />
                                        保存
                                    </a>
                                </div>
                                {currentModel && (
                                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm pointer-events-none opacity-60">
                                        {currentModel}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-xl">🖼️</span>
                                </div>
                                <span className="text-xs">画像生成待機中...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Body Content */}
                <div className="px-8 md:px-12 pb-12">
                    <div className="prose prose-lg max-w-none prose-headings:text-[#222] prose-p:text-[#222] prose-strong:text-[#222]">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="hidden" {...props} />, // Main title is already shown above
                                h2: ({ node, ...props }) => <h2 className="text-[24px] font-bold mt-12 mb-6 leading-snug" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-[20px] font-bold mt-10 mb-4 leading-snug" {...props} />,
                                p: ({ node, ...props }) => <p className="text-[17px] leading-[1.9] mb-8 tracking-wide text-[#333]" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 space-y-2 mb-8 text-[17px] text-[#333]" {...props} />,
                                li: ({ node, ...props }) => <li className="leading-relaxed pl-1" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-bold bg-[linear-gradient(transparent_60%,#ffff66_60%)] px-0.5" {...props} />, // Highlighter style
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-[3px] border-[#ddd] pl-4 my-8 text-gray-500 italic" {...props} />,
                                a: ({ node, ...props }) => <a className="text-[#41c9b4] hover:underline underline-offset-2 decoration-[#41c9b4]/50" {...props} />,
                                hr: ({ node, ...props }) => <hr className="my-12 border-gray-200" {...props} />
                            }}
                        >
                            {body}
                        </ReactMarkdown>
                    </div>

                    {metaDescription && (
                        <div className="mt-16 p-5 bg-[#f9f9f9] rounded-lg border border-[#eee]">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">SEO Meta Description</h3>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(metaDescription);
                                        setCopied(true);
                                    }}
                                    className="text-xs text-gray-400 hover:text-[#41c9b4] flex items-center gap-1 transition-colors"
                                >
                                    <Copy className="w-3 h-3" />
                                </button>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {metaDescription}
                            </p>
                        </div>
                    )}

                    {hashtags && hashtags.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-2">
                            {hashtags.map((tag, index) => (
                                <span key={index} className="text-[#999] text-sm hover:text-[#41c9b4] cursor-pointer transition-colors">
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
                    className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors py-2 px-4 rounded-lg hover:bg-gray-100"
                >
                    <Download className="w-4 h-4" />
                    Markdown形式でダウンロード
                </button>
            </div>
        </div>
    );
}


