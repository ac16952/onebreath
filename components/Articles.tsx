import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import {
  createArticle,
  fetchArticles,
  updateArticle,
  deleteArticle,
} from '../services/firestoreService';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for upload/edit
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    author: '',
    content: '',
  });

  // Load articles from Firestore on mount
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : '載入文章時出現錯誤';
      setError(message);
      console.error('Load articles error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author.trim() || !formData.content.trim()) {
      setError('請填寫所有欄位');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (editingId) {
        // Update existing article
        await updateArticle(editingId, {
          date: formData.date,
          title: formData.title,
          author: formData.author,
          content: formData.content,
        });
      } else {
        // Create new article
        await createArticle({
          date: formData.date,
          title: formData.title,
          author: formData.author,
          content: formData.content,
        });
      }

      // Reload articles
      await loadArticles();

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        title: '',
        author: '',
        content: '',
      });
      setIsUploading(false);
      setEditingId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : '保存文章時出現錯誤';
      setError(message);
      console.error('Save article error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Start editing
  const handleEdit = (article: Article) => {
    setFormData({
      date: article.date,
      title: article.title,
      author: article.author,
      content: article.content,
    });
    setEditingId(article.id);
    setIsUploading(true);
    setError(null);
  };

  // Delete article
  const handleDelete = async (id: string) => {
    if (confirm('確定要刪除此文章嗎？')) {
      setError(null);
      try {
        await deleteArticle(id);
        await loadArticles();
      } catch (err) {
        const message = err instanceof Error ? err.message : '刪除文章時出現錯誤';
        setError(message);
        console.error('Delete article error:', err);
      }
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setIsUploading(false);
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      title: '',
      author: '',
      content: '',
    });
    setError(null);
  };

  // Format date to readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#4A6B4A]">📄 療癒文章</h2>
        {!isUploading && !isLoading && (
          <button
            onClick={() => setIsUploading(true)}
            className="px-4 py-2 bg-morandi-green text-white rounded-lg font-medium hover:bg-[#5A7B52] transition-colors shadow-md"
          >
            + 新增文章
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 bg-gradient-to-br from-white/90 to-[#F3F7F0]/90 rounded-2xl border border-white/60">
          <p className="text-[#5A7B52]/60">載入中...</p>
        </div>
      )}

      {/* Upload/Edit Form */}
      {isUploading && !isLoading && (
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-white/90 to-[#F3F7F0]/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-[#4A6B4A]">
            {editingId ? '編輯文章' : '新增文章'}
          </h3>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[#5A7B52] mb-2">
              日期 *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-[#B8D4A8] rounded-lg focus:outline-none focus:ring-2 focus:ring-morandi-green bg-white text-[#5A7B52]"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#5A7B52] mb-2">
              標題 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="輸入文章標題"
              className="w-full px-4 py-2 border border-[#B8D4A8] rounded-lg focus:outline-none focus:ring-2 focus:ring-morandi-green bg-white text-[#5A7B52] placeholder-[#A8C491]"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-[#5A7B52] mb-2">
              作者 *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="輸入作者名稱"
              className="w-full px-4 py-2 border border-[#B8D4A8] rounded-lg focus:outline-none focus:ring-2 focus:ring-morandi-green bg-white text-[#5A7B52] placeholder-[#A8C491]"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-[#5A7B52] mb-2">
              內容 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="輸入文章內容"
              className="w-full px-4 py-2 border border-[#B8D4A8] rounded-lg focus:outline-none focus:ring-2 focus:ring-morandi-green bg-white text-[#5A7B52] placeholder-[#A8C491] min-h-[150px] resize-vertical"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-morandi-green text-white rounded-lg font-medium hover:bg-[#5A7B52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '保存中...' : editingId ? '更新' : '發佈'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              取消
            </button>
          </div>
        </form>
      )}

      {/* Articles List */}
      {!isLoading && (
        <div className="space-y-4">
          {articles.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-white/90 to-[#F3F7F0]/90 rounded-2xl border border-white/60">
              <p className="text-[#5A7B52]/60">尚無文章，新增第一篇吧！</p>
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                className="bg-gradient-to-br from-white/90 to-[#F3F7F0]/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-shadow"
              >
                {/* Article Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#4A6B4A]">{article.title}</h3>
                    <div className="flex gap-4 text-sm text-[#5A7B52]/70 mt-2">
                      <span>📅 {formatDate(article.date)}</span>
                      <span>✍️ {article.author}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(article)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200 transition-colors text-sm"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded font-medium hover:bg-red-200 transition-colors text-sm"
                    >
                      刪除
                    </button>
                  </div>
                </div>

                {/* Article Content */}
                <div className="text-[#5A7B52] leading-relaxed whitespace-pre-wrap break-words">
                  {article.content}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Articles;
