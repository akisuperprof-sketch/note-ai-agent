import { useState, useEffect } from 'react';
import { ArticleProvider, useArticle } from './contexts/ArticleContext';
import { Header } from './components/common/Header';
import { TabNav } from './components/common/TabNav';
import { Loading } from './components/common/Loading';
import { KnowhowInput } from './components/input/KnowhowInput';
import { StrategySettings } from './components/input/StrategySettings';
import { BasicSettings } from './components/input/BasicSettings';
import { TitleSelector } from './components/generation/TitleSelector';
import { OutlineEditor } from './components/generation/OutlineEditor';
import { BodyPreview } from './components/generation/BodyPreview';
import type { GenerationStage, ArticleData } from './types';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { GuideModal } from './components/common/GuideModal';
import { HistoryModal } from './components/history/HistoryModal';
import { NoteTutorialModal } from './components/common/NoteTutorialModal';
import { api } from './lib/api';
import { useHistory } from './hooks/useHistory';

function ArticleGenerator() {
  const {
    articleData,
    setCurrentStage,
    setIsStepMode,
    setIsGenerating,
    setGeneratedTitles,
    setOutline,
    setBody,
    setCompletedStages,
    resetFromStage,
    loadArticle,
  } = useArticle();

  const {
    currentStage,
    isStepMode,
    isGenerating,
    knowhow,
    strategy,
    settings,
    generatedTitles,
    selectedTitle,
    outline,
    body,
    completedStages,
  } = articleData;

  const [showGuide, setShowGuide] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showNoteTutorial, setShowNoteTutorial] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('AIが生成中です...');
  const [apiStatus, setApiStatus] = useState<{ hasKey: boolean; checked: boolean }>({ hasKey: true, checked: false });

  const history = useHistory();

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setApiStatus({ hasKey: data.hasKey, checked: true });
        }
      } catch (e) {
        console.error('Health check failed', e);
      }
    };
    checkApi();

    const hasSeen = localStorage.getItem('hasSeenGuide');
    if (!hasSeen) {
      setShowGuide(true);
    }
  }, []);

  // auto-save when generation completes or manually triggered
  const saveCurrentArticle = (data: ArticleData) => {
    if (data.body || data.outline.length > 0 || data.generatedTitles.length > 0) {
      history.saveToHistory(data);
    }
  };

  // API呼び出し
  const generateTitles = async () => {
    if (!knowhow.trim()) {
      alert('ノウハウを入力してください');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.generateTitle({ knowhow, strategy, settings });
      if (res.success && res.titles) {
        setGeneratedTitles(res.titles);
        setCurrentStage('title');
        setCompletedStages(Array.from(new Set([...completedStages, 'title'])) as GenerationStage[]);
      } else {
        alert('タイトルの生成に失敗しました: ' + (res.error || '不明なエラー'));
      }
    } catch (error) {
      alert('エラーが発生しました');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateOutline = async () => {
    if (!selectedTitle) {
      alert('タイトルを選択してください');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.generateOutline({ knowhow, selectedTitle, settings, strategy });
      if (res.success && res.outline?.sections) {
        setOutline(res.outline.sections);
        setCurrentStage('outline');
        setCompletedStages(Array.from(new Set([...completedStages, 'outline'])) as GenerationStage[]);
      } else {
        alert('構成の生成に失敗しました: ' + (res.error || '不明なエラー'));
      }
    } catch (error) {
      alert('エラーが発生しました');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBody = async () => {
    if (outline.length === 0) {
      alert('構成を作成してください');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.generateBody({ knowhow, selectedTitle, outline, settings, strategy });
      if (res.success && res.body) {
        setBody(res.body.markdown, res.body.metaDescription, res.body.hashtags);
        setCurrentStage('body');
        const newStages = Array.from(new Set([...completedStages, 'body'])) as GenerationStage[];
        setCompletedStages(newStages);

        // Auto-save
        const dataToSave: ArticleData = {
          ...articleData,
          body: res.body.markdown,
          metaDescription: res.body.metaDescription,
          hashtags: res.body.hashtags,
          currentStage: 'body',
          completedStages: newStages,
        };
        saveCurrentArticle(dataToSave);

      } else {
        alert('本文の生成に失敗しました: ' + (res.error || '不明なエラー'));
      }
    } catch (error) {
      alert('エラーが発生しました');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAll = async () => {
    if (!knowhow.trim()) {
      alert('ノウハウを入力してください');
      return;
    }

    setIsGenerating(true);
    try {
      // 1. Title
      setLoadingMessage('記事のタイトルを考案中...');
      const titleRes = await api.generateTitle({ knowhow, strategy, settings });
      if (!titleRes.success || !titleRes.titles?.length) throw new Error(titleRes.error || 'Title generation failed');
      const titles = titleRes.titles;
      const title = titles[0]; // Auto-select first
      setGeneratedTitles(titles);

      // 2. Outline
      setLoadingMessage('記事の構成を考えています...');
      const outlineRes = await api.generateOutline({ knowhow, selectedTitle: title, settings, strategy });
      if (!outlineRes.success || !outlineRes.outline?.sections) throw new Error(outlineRes.error || 'Outline generation failed');
      const sections = outlineRes.outline.sections;
      setOutline(sections);

      // 3. Body
      setLoadingMessage('記事本文を執筆・推敲しています...');
      const bodyRes = await api.generateBody({ knowhow, selectedTitle: title, outline: { sections }, settings, strategy });
      if (!bodyRes.success || !bodyRes.body) throw new Error(bodyRes.error || 'Body generation failed');

      setBody(bodyRes.body.markdown, bodyRes.body.metaDescription, bodyRes.body.hashtags);
      setCurrentStage('body');
      const finalStages: GenerationStage[] = ['input', 'title', 'outline', 'body'];
      setCompletedStages(finalStages);

      // Auto-save
      const dataToSave: ArticleData = {
        ...articleData,
        generatedTitles: titles,
        selectedTitle: title,
        outline: sections,
        body: bodyRes.body.markdown,
        metaDescription: bodyRes.body.metaDescription,
        hashtags: bodyRes.body.hashtags,
        currentStage: 'body',
        completedStages: finalStages,
      };

      // 4. Image Generation (Mock)
      setLoadingMessage('見出し画像を生成しています...');
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3s wait

      // Complete
      saveCurrentArticle(dataToSave);
      setLoadingMessage('すべての生成が完了しました！');
      await new Promise(resolve => setTimeout(resolve, 800)); // Short wait to show completion
      setShowNoteTutorial(true);

    } catch (e: any) {
      alert('生成エラー: ' + e.message);
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateClick = () => {
    if (!isStepMode && currentStage === 'input') {
      generateAll();
      return;
    }

    switch (currentStage) {
      case 'input':
        generateTitles();
        break;
      case 'title':
        generateOutline();
        break;
      case 'outline':
        generateBody();
        break;
    }
  };

  const handleReset = () => {
    if (confirm('現在の内容をリセットしますか？')) {
      resetFromStage('input');
    }
  };

  const getButtonText = () => {
    switch (currentStage) {
      case 'input':
        return isStepMode ? 'タイトル案を作成する' : '記事を作成する';
      case 'title':
        return '構成案を作成する';
      case 'outline':
        return '本文を作成する';
      case 'body':
        return '';
    }
  };

  const canGenerate = () => {
    switch (currentStage) {
      case 'input':
        return knowhow.trim().length > 0;
      case 'title':
        return selectedTitle.length > 0;
      case 'outline':
        return outline.length > 0;
      case 'body':
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header
        onShowGuide={() => setShowGuide(true)}
        onShowHistory={() => setShowHistory(true)}
        onReset={() => {
          if (confirm('トップ画面に戻りますか？\n入力内容はクリアされます。')) {
            resetFromStage('input');
            setIsStepMode(false);
            window.scrollTo(0, 0);
          }
        }}
      />

      {apiStatus.checked && !apiStatus.hasKey && (
        <div className="w-full bg-red-500/10 border-b border-red-500/20 p-3 text-center">
          <p className="text-red-400 font-bold">⚠️ APIキーが設定されていません</p>
          <p className="text-xs text-red-300 mt-1">VercelのSettings &gt; Environment Variablesで「GEMINI_API_KEY」を設定してください。</p>
        </div>
      )}

      <main className="w-full max-w-3xl px-6 py-12 flex-grow flex flex-col justify-center mx-auto">
        {/* タブナビゲーション（段階的モード時のみ表示） */}
        {isStepMode && (
          <div className="mb-6">
            <TabNav
              currentStage={currentStage}
              onStageChange={setCurrentStage}
              isStepMode={isStepMode}
              completedStages={completedStages}
            />
          </div>
        )}

        {/* メインコンテンツ */}
        <div className="card p-6 md:p-8 space-y-6">
          {/* 入力タブ */}
          {currentStage === 'input' && (
            <>
              <KnowhowInput />
              <BasicSettings />

              {/* 段階的制作モード切り替え */}
              <div className="py-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isStepMode}
                      onChange={(e) => setIsStepMode(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${isStepMode ? 'bg-primary-500' : 'bg-gray-600'
                      }`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isStepMode ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                    </div>
                  </div>
                  <span className="font-medium text-gray-200">段階的上級者向け設定</span>
                </label>
              </div>

              <StrategySettings />
            </>
          )}

          {/* タイトル案タブ */}
          {currentStage === 'title' && <TitleSelector />}

          {/* 構成案タブ */}
          {currentStage === 'outline' && <OutlineEditor />}

          {/* 本文タブ */}
          {currentStage === 'body' && <BodyPreview />}

          {/* アクションボタン */}
          {currentStage !== 'body' && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              {(generatedTitles.length > 0 || outline.length > 0 || body) && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  リセット
                </button>
              )}

              <button
                onClick={handleGenerateClick}
                disabled={!canGenerate()}
                className="btn-primary flex items-center gap-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                {getButtonText()}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ローディングオーバーレイ */}
      {isGenerating && <Loading overlay message={loadingMessage} />}

      {/* ガイドモーダル */}
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />

      {/* Note チュートリアルモーダル */}
      <NoteTutorialModal isOpen={showNoteTutorial} onClose={() => setShowNoteTutorial(false)} />

      {/* 履歴モーダル */}
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history.history}
        onSelect={(item) => {
          loadArticle(item.data);
          // 復元後、CompletedStagesなども復元されている（はず）
        }}
        onDelete={history.deleteHistoryItem}
      />
    </div>
  );
}

function App() {
  return (
    <ArticleProvider>
      <ArticleGenerator />
    </ArticleProvider>
  );
}

export default App;
