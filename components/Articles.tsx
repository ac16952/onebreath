import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../types';
import {
  createArticle,
  fetchArticles,
  updateArticle,
  deleteArticle,
} from '../services/firestoreService';
// Removed file upload services - using direct image paste in editor instead

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  // Form state for upload/edit
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    author: '',
    content: '',
    externalUrl: '',
  });

  const contentEditorRef = useRef<HTMLDivElement>(null);

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

    // Get latest content from editor
    let finalContent = formData.content;
    if (contentEditorRef.current) {
      finalContent = contentEditorRef.current.innerHTML;
    }

    // Check if content is empty (considering HTML tags)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = finalContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    if (!formData.title.trim() || !formData.author.trim() || !textContent.trim()) {
      setError('請填寫所有必填欄位（標題、作者、內容）');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Get final content from editor and convert blob images to base64
      if (contentEditorRef.current) {
        const editorImages = contentEditorRef.current.querySelectorAll('img');
        const conversionPromises: Promise<void>[] = [];

        for (const img of Array.from(editorImages)) {
          const src = img.getAttribute('src');
          if (src && src.startsWith('blob:')) {
            // Convert blob to base64
            const promise = new Promise<void>((resolve, reject) => {
              try {
                fetch(src)
                  .then(response => response.blob())
                  .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (reader.result) {
                        img.src = reader.result as string;
                      }
                      resolve();
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                  })
                  .catch(reject);
              } catch (error) {
                console.error('Error converting blob to base64:', error);
                resolve(); // Continue even if conversion fails
              }
            });
            conversionPromises.push(promise);
          }
        }

        // Wait for all conversions to complete
        await Promise.all(conversionPromises);
        
        // Get final content after conversion
        finalContent = contentEditorRef.current.innerHTML;
      }

      // Create or update article
      if (editingId) {
        // Update existing article
        await updateArticle(editingId, {
          date: formData.date,
          title: formData.title,
          author: formData.author,
          content: finalContent,
          externalUrl: formData.externalUrl || undefined,
        });
      } else {
        // Create new article
        await createArticle({
          date: formData.date,
          title: formData.title,
          author: formData.author,
          content: finalContent,
          externalUrl: formData.externalUrl || undefined,
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
        externalUrl: '',
      });
      setIsUploading(false);
      setEditingId(null);
      if (contentEditorRef.current) {
        contentEditorRef.current.innerHTML = '';
      }
    } catch (err: any) {
      console.error('Save article error:', err);
      
      // Extract more detailed error message
      let errorMessage = '保存文章時出現錯誤';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Check for specific Firebase errors
      if (err?.code) {
        switch (err.code) {
          case 'permission-denied':
            errorMessage = '權限不足：請檢查 Firebase 安全規則設定';
            break;
          case 'unavailable':
            errorMessage = '服務暫時無法使用，請檢查網路連線';
            break;
          case 'storage/unauthorized':
            errorMessage = '文件上傳失敗：請檢查 Firebase Storage 規則';
            break;
          default:
            errorMessage = `錯誤 (${err.code}): ${errorMessage}`;
        }
      }
      
      setError(errorMessage);
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
      externalUrl: article.externalUrl || '',
    });
    setEditingId(article.id);
    setIsUploading(true);
    setError(null);
    
    // Set editor content after a brief delay to ensure ref is ready
    setTimeout(() => {
      if (contentEditorRef.current) {
        contentEditorRef.current.innerHTML = article.content || '';
      }
    }, 100);
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
      externalUrl: '',
    });
    setError(null);
    if (contentEditorRef.current) {
      contentEditorRef.current.innerHTML = '';
    }
  };

  // Handle paste event in content editor
  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const items = e.clipboardData.items;
    
    let handled = false;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          await insertImageToEditor(file);
          handled = true;
          break;
        }
      } else if (item.type === 'text/html') {
        // Handle HTML paste - insert as HTML to render the result
        const htmlContent = e.clipboardData.getData('text/html');
        if (htmlContent) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            
            // Create a temporary div to parse and sanitize HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            
            // Insert the parsed HTML
            const fragment = document.createDocumentFragment();
            while (tempDiv.firstChild) {
              fragment.appendChild(tempDiv.firstChild);
            }
            range.insertNode(fragment);
            
            // Move cursor to end of inserted content
            range.setStartAfter(fragment.lastChild || range.startContainer);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          } else if (contentEditorRef.current) {
            // If no selection, append to end
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            while (tempDiv.firstChild) {
              contentEditorRef.current.appendChild(tempDiv.firstChild);
            }
          }
          handleContentChange();
          handled = true;
          break;
        }
      }
    }
    
    // If no HTML was found, check if plain text looks like HTML code
    if (!handled) {
      const plainText = e.clipboardData.getData('text/plain');
      if (plainText && (plainText.trim().startsWith('<') || plainText.includes('</'))) {
        // Looks like HTML code, try to parse and render it
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          
          // Create a temporary div to parse HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = plainText;
          
          // Insert the parsed HTML
          const fragment = document.createDocumentFragment();
          while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
          }
          range.insertNode(fragment);
          
          // Move cursor to end
          range.setStartAfter(fragment.lastChild || range.startContainer);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        } else if (contentEditorRef.current) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = plainText;
          while (tempDiv.firstChild) {
            contentEditorRef.current.appendChild(tempDiv.firstChild);
          }
        }
        handleContentChange();
      } else {
        // Regular plain text
        document.execCommand('insertText', false, plainText);
      }
    }
  };

  // Insert image to editor (convert to base64)
  const insertImageToEditor = async (file: File) => {
    if (!contentEditorRef.current) return;

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && contentEditorRef.current) {
          const img = document.createElement('img');
          img.src = reader.result as string;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.borderRadius = '8px';
          img.style.margin = '8px 0';
          img.alt = '文章圖片';
          
          // Insert image into editor
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(img);
            // Move cursor after image
            range.setStartAfter(img);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            contentEditorRef.current.appendChild(img);
          }
          
          handleContentChange();
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error inserting image:', error);
      setError('插入圖片時發生錯誤');
    }
  };

  // Handle content change in editor
  const handleContentChange = () => {
    if (contentEditorRef.current) {
      const htmlContent = contentEditorRef.current.innerHTML;
      setFormData(prev => ({ ...prev, content: htmlContent }));
    }
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
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#4A6B4A]">📄 療癒文章</h2>
        {!isUploading && !isLoading && (
          <button
            onClick={() => setIsUploading(true)}
            className="px-3 sm:px-4 py-2 bg-morandi-green text-white rounded-lg font-medium hover:bg-[#5A7B52] transition-colors shadow-md text-sm sm:text-base"
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
              內容 * <span className="text-xs text-[#5A7B52]/60">（可直接貼上圖片或 HTML 代碼）</span>
            </label>
            <div
              ref={contentEditorRef}
              contentEditable
              onPaste={handlePaste}
              onInput={handleContentChange}
              onBlur={handleContentChange}
              data-placeholder="輸入文章內容，可直接貼上圖片或 HTML 代碼（Ctrl+V 或 Cmd+V），HTML 會自動渲染顯示"
              className="w-full px-4 py-2 border border-[#B8D4A8] rounded-lg focus:outline-none focus:ring-2 focus:ring-morandi-green bg-white text-[#5A7B52] min-h-[200px] resize-vertical overflow-y-auto"
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            />
            <style>{`
              [contenteditable][data-placeholder]:empty:before {
                content: attr(data-placeholder);
                color: #A8C491;
                pointer-events: none;
              }
              [contenteditable] img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                margin: 8px 0;
                display: block;
              }
              [contenteditable] img.uploading-image {
                opacity: 0.6;
              }
              [contenteditable] a {
                color: #5A7B52;
                text-decoration: underline;
              }
              [contenteditable] a:hover {
                color: #7A9E6F;
              }
              [contenteditable] h1, [contenteditable] h2, [contenteditable] h3,
              [contenteditable] h4, [contenteditable] h5, [contenteditable] h6 {
                font-weight: bold;
                margin: 12px 0 8px 0;
              }
              [contenteditable] h1 { font-size: 1.5em; }
              [contenteditable] h2 { font-size: 1.3em; }
              [contenteditable] h3 { font-size: 1.1em; }
              [contenteditable] ul, [contenteditable] ol {
                margin: 8px 0;
                padding-left: 24px;
              }
              [contenteditable] li {
                margin: 4px 0;
              }
              [contenteditable] p {
                margin: 8px 0;
              }
              [contenteditable] code {
                background-color: #f0f0f0;
                padding: 2px 6px;
                border-radius: 4px;
                font-family: monospace;
              }
              [contenteditable] pre {
                background-color: #f0f0f0;
                padding: 12px;
                border-radius: 4px;
                overflow-x: auto;
                margin: 8px 0;
              }
              [contenteditable] blockquote {
                border-left: 3px solid #B8D4A8;
                padding-left: 12px;
                margin: 8px 0;
                color: #6B8E5F;
              }
            `}</style>
          </div>

          {/* External URL */}
          <div>
            <label className="block text-sm font-medium text-[#5A7B52] mb-2">
              外部連結（選填）
            </label>
            <input
              type="url"
              value={formData.externalUrl}
              onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-[#B8D4A8] rounded-lg focus:outline-none focus:ring-2 focus:ring-morandi-green bg-white text-[#5A7B52] placeholder-[#A8C491]"
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
        <div className="space-y-3">
          {articles.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-white/90 to-[#F3F7F0]/90 rounded-2xl border border-white/60">
              <p className="text-[#5A7B52]/60">尚無文章，新增第一篇吧！</p>
            </div>
          ) : (
            articles.map((article) => {
              const isExpanded = expandedArticleId === article.id;
              return (
                <div
                  key={article.id}
                  className="bg-gradient-to-br from-white/90 to-[#F3F7F0]/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 overflow-auto hover:shadow-xl transition-shadow"
                >
                  {/* Collapsible Header */}
                  <button
                    onClick={() =>
                      setExpandedArticleId(isExpanded ? null : article.id)
                    }
                    className="w-full px-6 py-4 flex justify-between items-start hover:bg-white/40 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#4A6B4A]">
                        {article.title}
                      </h3>
                      <div className="flex gap-4 text-sm text-[#5A7B52]/70 mt-2">
                        <span>📅 {formatDate(article.date)}</span>
                        <span>✍️ {article.author}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <span
                        className={`text-2xl text-morandi-green transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      >
                        ▼
                      </span>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-[#B8D4A8]/30 px-6 py-4 bg-white/20 space-y-4">
                      {/* External URL */}
                      {article.externalUrl && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                          <a
                            href={article.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                          >
                            🔗 查看外部連結
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      )}

                      {/* Article Content */}
                      <div 
                        className="text-[#5A7B52] leading-relaxed break-words max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto text-sm sm:text-base prose prose-sm max-w-none article-content"
                        dangerouslySetInnerHTML={{ __html: article.content || '' }}
                        style={{
                          wordBreak: 'break-word',
                        }}
                      />
                      <style>{`
                        .article-content {
                          line-height: 1.6;
                        }
                        .article-content img {
                          max-width: 100%;
                          height: auto;
                          border-radius: 8px;
                          margin: 12px 0;
                          display: block;
                        }
                        .article-content h1,
                        .article-content h2,
                        .article-content h3,
                        .article-content h4,
                        .article-content h5,
                        .article-content h6 {
                          font-weight: bold;
                          margin: 16px 0 8px 0;
                          color: #4A6B4A;
                        }
                        .article-content h1 { font-size: 1.75em; }
                        .article-content h2 { font-size: 1.5em; }
                        .article-content h3 { font-size: 1.25em; }
                        .article-content h4 { font-size: 1.1em; }
                        .article-content p {
                          margin: 8px 0;
                          line-height: 1.6;
                        }
                        .article-content ul,
                        .article-content ol {
                          margin: 8px 0;
                          padding-left: 24px;
                        }
                        .article-content li {
                          margin: 4px 0;
                          line-height: 1.5;
                        }
                        .article-content a {
                          color: #5A7B52;
                          text-decoration: underline;
                        }
                        .article-content a:hover {
                          color: #7A9E6F;
                        }
                        .article-content strong,
                        .article-content b {
                          font-weight: bold;
                        }
                        .article-content em,
                        .article-content i {
                          font-style: italic;
                        }
                        .article-content code {
                          background-color: #f0f0f0;
                          padding: 2px 6px;
                          border-radius: 4px;
                          font-family: 'Courier New', monospace;
                          font-size: 0.9em;
                        }
                        .article-content pre {
                          background-color: #f5f5f5;
                          padding: 12px;
                          border-radius: 4px;
                          overflow-x: auto;
                          margin: 12px 0;
                          border-left: 3px solid #B8D4A8;
                        }
                        .article-content pre code {
                          background-color: transparent;
                          padding: 0;
                        }
                        .article-content blockquote {
                          border-left: 3px solid #B8D4A8;
                          padding-left: 12px;
                          margin: 12px 0;
                          color: #6B8E5F;
                          font-style: italic;
                        }
                        .article-content table {
                          width: 100%;
                          border-collapse: collapse;
                          margin: 12px 0;
                        }
                        .article-content table th,
                        .article-content table td {
                          border: 1px solid #B8D4A8;
                          padding: 8px;
                          text-align: left;
                        }
                        .article-content table th {
                          background-color: #F0F5ED;
                          font-weight: bold;
                        }
                      `}</style>

                      {/* Edit & Delete Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-[#B8D4A8]/30">
                        <button
                          onClick={() => handleEdit(article)}
                          className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors text-sm"
                        >
                          ✏️ 編輯
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm"
                        >
                          🗑️ 刪除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Articles;
