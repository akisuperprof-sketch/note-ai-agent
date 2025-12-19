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
import { GenerationStage } from './types';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

function ArticleGenerator() {
  const {
    articleData,
    setCurrentStage,
    setIsStepMode,
    setIsGenerating,
    setGeneratedTitles,
    setSelectedTitle,
    setOutline,
    setBody,
    resetFromStage,
  } = useArticle();

  const {
    currentStage,
    isStepMode,
    isGenerating,
    knowhow,
    generatedTitles,
    selectedTitle,
    outline,
    body,
  } = articleData;

  const [completedStages, setCompletedStages] = useState<GenerationStage[]>(['input']);

  // ダミー生成関数（後でAPI連携）
  const generateTitles = async () => {
    if (!knowhow.trim()) {
      alert('ノウハウを入力してください');
      return;
    }

    setIsGenerating(true);

    // ダミーの遅延
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ダミーのタイトル生成
    const dummyTitles = [
      `【完全ガイド】${knowhow.slice(0, 20)}...で成果を出す方法`,
      `初心者でもできる！${knowhow.slice(0, 15)}...の実践テクニック`,
      `${knowhow.slice(0, 20)}...を1週間でマスターするロードマップ`,
      `プロが教える${knowhow.slice(0, 15)}...の極意【2025年版】`,
      `なぜ${knowhow.slice(0, 15)}...が重要なのか？成功者の共通点`,
    ];

    setGeneratedTitles(dummyTitles);
    setIsGenerating(false);
    setCurrentStage('title');
    setCompletedStages(prev => [...new Set([...prev, 'title'])]);
  };

  const generateOutline = async () => {
    if (!selectedTitle) {
      alert('タイトルを選択してください');
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ダミーの構成生成
    const dummyOutline = [
      { level: 1, heading: 'はじめに', summary: '記事の導入と読者への約束' },
      { level: 1, heading: 'なぜこれが重要なのか', summary: '背景と重要性の説明' },
      { level: 1, heading: '具体的な方法 Step 1', summary: '最初のステップの詳細' },
      { level: 2, heading: 'ポイント1', summary: '詳細なポイント' },
      { level: 2, heading: 'ポイント2', summary: '詳細なポイント' },
      { level: 1, heading: '具体的な方法 Step 2', summary: '次のステップの詳細' },
      { level: 1, heading: '具体的な方法 Step 3', summary: '最後のステップの詳細' },
      { level: 1, heading: 'よくある質問', summary: 'FAQ形式で疑問に回答' },
      { level: 1, heading: 'まとめ', summary: '記事の総括とCTA' },
    ];

    setOutline(dummyOutline);
    setIsGenerating(false);
    setCurrentStage('outline');
    setCompletedStages(prev => [...new Set([...prev, 'outline'])]);
  };

  const generateBody = async () => {
    if (outline.length === 0) {
      alert('構成を作成してください');
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // ダミーの本文生成
    const dummyBody = `# ${selectedTitle}

「${knowhow.slice(0, 30)}...」について悩んでいませんか？

この記事では、初心者でも実践できる具体的な方法をお伝えします。

## はじめに

まずは、この記事を読むことで得られることをお約束します。

${outline.map(section => `
${'#'.repeat(section.level + 1)} ${section.heading}

${section.summary || 'ここに詳細な内容が入ります。'}

具体的なポイントを見ていきましょう。

- ポイント1: 重要な考え方
- ポイント2: 実践的なテクニック
- ポイント3: よくある間違いを避ける方法

`).join('\n')}

## まとめ

この記事では、${selectedTitle}について解説しました。

ぜひ今日から実践してみてください！
`;

    const dummyMetaDescription = `${selectedTitle}の完全ガイド。初心者でも実践できる具体的な方法を、わかりやすく解説します。`;

    setBody(dummyBody, dummyMetaDescription);
    setIsGenerating(false);
    setCurrentStage('body');
    setCompletedStages(prev => [...new Set([...prev, 'body'])]);
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
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
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
              <div className={`w-12 h-6 rounded-full transition-colors ${isStepMode ? 'bg-primary-500' : 'bg-gray-300'
                }`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isStepMode ? 'translate-x-7' : 'translate-x-1'
                  }`} />
              </div>
            </div>
            <span className="font-medium text-gray-800">段階的制作モード</span>
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
              <StrategySettings />
              <BasicSettings />
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
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {(generatedTitles.length > 0 || outline.length > 0 || body) && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors"
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
