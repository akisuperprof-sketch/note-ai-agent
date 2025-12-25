import { useState, useEffect } from 'react';
import type { ArticleData, HistoryItem } from '../types';

const STORAGE_KEY = 'note-ai-agent-history';

export function useHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setHistory(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    };

    const saveToHistory = (data: ArticleData) => {
        try {
            // 現在の履歴に同じ内容（タイトルと日時が近いなど）があれば重複保存を防ぐロジックを入れてもいいが
            // シンプルに毎回保存する

            const newItem: HistoryItem = {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                title: data.selectedTitle || (data.generatedTitles.length > 0 ? data.generatedTitles[0] + ' (案)' : '無題のプロジェクト'),
                data: JSON.parse(JSON.stringify(data)), // Deep copy to ensure no reference issues
            };

            // 最新を上に、最大50件まで
            const updatedHistory = [newItem, ...history].slice(0, 50);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
            setHistory(updatedHistory);
            return true;
        } catch (error) {
            console.error('Failed to save history:', error);
            return false;
        }
    };

    const deleteHistoryItem = (id: string) => {
        try {
            const updatedHistory = history.filter(item => item.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
            setHistory(updatedHistory);
        } catch (error) {
            console.error('Failed to delete history item:', error);
        }
    };

    const clearHistory = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            setHistory([]);
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    };

    return {
        history,
        saveToHistory,
        deleteHistoryItem,
        clearHistory,
        refreshHistory: loadHistory
    };
}
