// services/firestoreService.ts
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Query,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Article } from '../types';

const COLLECTION_NAME = 'articles';

/**
 * Create a new article in Firestore
 */
export const createArticle = async (
  data: Omit<Article, 'id'>
): Promise<string> => {
  try {
    // Clean data - remove undefined values
    const cleanData: any = {
      date: data.date,
      title: data.title,
      author: data.author,
      content: data.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    if (data.images && data.images.length > 0) {
      cleanData.images = data.images;
    }
    if (data.externalUrl) {
      cleanData.externalUrl = data.externalUrl;
    }
    if (data.pdfUrl) {
      cleanData.pdfUrl = data.pdfUrl;
    }
    if (data.wordUrl) {
      cleanData.wordUrl = data.wordUrl;
    }
    if (data.pdfFileName) {
      cleanData.pdfFileName = data.pdfFileName;
    }
    if (data.wordFileName) {
      cleanData.wordFileName = data.wordFileName;
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanData);
    return docRef.id;
  } catch (error: any) {
    console.error('Error creating article:', error);
    const errorMessage = error?.message || '未知錯誤';
    const errorCode = error?.code || '';
    
    // Provide more specific error messages
    if (errorCode === 'permission-denied') {
      throw new Error('權限不足：請檢查 Firestore 安全規則設定');
    } else if (errorCode === 'unavailable') {
      throw new Error('服務暫時無法使用，請稍後再試');
    } else {
      throw new Error(`新增文章失敗：${errorMessage}`);
    }
  }
};

/**
 * Fetch all articles sorted by date (newest first)
 */
export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const constraints: QueryConstraint[] = [
      orderBy('date', 'desc'),
    ];
    const q: Query = query(
      collection(db, COLLECTION_NAME),
      ...constraints
    );

    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        date: data.date,
        title: data.title,
        author: data.author,
        content: data.content,
        images: data.images || [],
        externalUrl: data.externalUrl || undefined,
        pdfUrl: data.pdfUrl || undefined,
        wordUrl: data.wordUrl || undefined,
        pdfFileName: data.pdfFileName || undefined,
        wordFileName: data.wordFileName || undefined,
      });
    });

    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error('載入文章失敗，請稍後再試');
  }
};

/**
 * Update an existing article
 */
export const updateArticle = async (
  id: string,
  data: Partial<Omit<Article, 'id'>>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating article:', error);
    throw new Error('更新文章失敗，請稍後再試');
  }
};

/**
 * Delete an article
 */
export const deleteArticle = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw new Error('刪除文章失敗，請稍後再試');
  }
};
