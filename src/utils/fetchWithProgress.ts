import NProgress from 'nprogress';

export const fetchWithProgress = async (input: RequestInfo, init?: RequestInit) => {
  NProgress.start();
  try {
    const response = await fetch(input, init);
    NProgress.done();
    return response;
  } catch (error) {
    NProgress.done();
    throw error;
  }
};