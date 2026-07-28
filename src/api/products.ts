import axiosInstance from './axios';

export const PAGE_SIZE = 20;
export const getProducts = async ({
  limit = PAGE_SIZE,
  offset = 0,
  searchString = '',
  sortBy,
}) => {
  const response = await axiosInstance.get('/products', {
    params: {
      limit: limit,
      offset: offset,
    },
  });
  console.log(response);
  if (!Array.isArray(response.data?.products)) {
    throw { message: 'Unexpected response from server.' };
  }

  return {
    products: response.data.products,
    total: response.data.total,
    skip: response.data.offset,
    limit: response.data.limit,
  };
};
