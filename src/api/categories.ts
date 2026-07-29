import axiosInstance from './axios';

export const getCategories = async (): Promise<string[]> => {
  const response = await axiosInstance.get('/products/category-list');
  return Array.isArray(response.data) ? response.data : [];
};
