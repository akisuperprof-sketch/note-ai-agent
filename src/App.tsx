import { useState } from 'react';
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
import type { GenerationStage } from './types';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { GuideModal } from './components/common/GuideModal';
import { api } from './lib/api';
import { useEffect } from 'react';

function ArticleGenerator() {
  const {
    articleData,
    setCurrentStage,
    setIsStepMode,
    setIsGenerating,
    setGeneratedTitles,
    setOutline,
    setBody,
    resetFromStage,
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
  } = articleData;

  const [completedStages, setCompletedStages] = useState<GenerationStage[]>(['input']);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenGuide');
    if (!hasSeen) {
      setShowGuide(true);
    }
  }, []);


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
        setCompletedStages(prev => {
          const next = new Set([...prev, 'title']);
          return Array.from(next) as GenerationStage[];
        });
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
        setCompletedStages(prev => {
          const next = new Set([...prev, 'outline']);
          return Array.from(next) as GenerationStage[];
        });
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
        setBody(res.body.markdown, res.body.metaDescription);
        setCurrentStage('body');
        setCompletedStages(prev => {
          const next = new Set([...prev, 'body']);
          return Array.from(next) as GenerationStage[];
        });
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

  const handleGenerateClick = () => {
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
      setCompletedStages(['input']);
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
      <Header onShowGuide={() => setShowGuide(true)} />

      <main className="w-full max-w-4xl px-4 py-12 flex-grow flex flex-col justify-center">
        {/* 段階的制作モード切り替え */}
        <div className="mb-6">
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
      {isGenerating && <Loading overlay message="AIが生成中です..." />}

      {/* ガイドモーダル */}
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
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
