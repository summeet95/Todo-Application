// src/Component/__mocks__/axios.js
export default {
  post: jest.fn().mockResolvedValue({
    data: {
      /* mock data */
    },
  }), // Mocking a post request
};
