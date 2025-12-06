// services/storageService.ts
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebaseConfig';

const STORAGE_PATH = 'articles';

/**
 * Upload an image file to Firebase Storage
 */
export const uploadImage = async (file: File, articleId: string): Promise<string> => {
  try {
    if (!storage) {
      throw new Error('Firebase Storage 未初始化，請檢查配置');
    }
    
    const timestamp = Date.now();
    // Sanitize file name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `image_${timestamp}_${sanitizedName}`;
    const storageRef = ref(storage, `${STORAGE_PATH}/${articleId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    const errorMessage = error?.message || '未知錯誤';
    const errorCode = error?.code || '';
    
    if (errorCode === 'storage/unauthorized') {
      throw new Error('圖片上傳失敗：權限不足，請檢查 Firebase Storage 規則');
    } else if (errorCode === 'storage/canceled') {
      throw new Error('圖片上傳已取消');
    } else if (errorCode === 'storage/unknown') {
      throw new Error('圖片上傳失敗：未知錯誤');
    } else {
      throw new Error(`圖片上傳失敗：${errorMessage}`);
    }
  }
};

/**
 * Upload a PDF file to Firebase Storage
 */
export const uploadPDF = async (file: File, articleId: string): Promise<{ url: string; fileName: string }> => {
  try {
    const timestamp = Date.now();
    const fileName = `document_${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${STORAGE_PATH}/${articleId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return { url: downloadURL, fileName: file.name };
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw new Error('PDF 上傳失敗，請稍後再試');
  }
};

/**
 * Upload a Word file to Firebase Storage
 */
export const uploadWord = async (file: File, articleId: string): Promise<{ url: string; fileName: string }> => {
  try {
    const timestamp = Date.now();
    const fileName = `document_${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${STORAGE_PATH}/${articleId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return { url: downloadURL, fileName: file.name };
  } catch (error) {
    console.error('Error uploading Word file:', error);
    throw new Error('Word 文件上傳失敗，請稍後再試');
  }
};

/**
 * Delete a file from Firebase Storage
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw error for deletion failures (file might not exist)
  }
};

