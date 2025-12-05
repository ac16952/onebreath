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
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating article:', error);
    throw new Error('新增文章失敗，請稍後再試');
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
      articles.push({
        id: doc.id,
        date: doc.data().date,
        title: doc.data().title,
        author: doc.data().author,
        content: doc.data().content,
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
