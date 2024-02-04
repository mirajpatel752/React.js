// src/actions/index.js
export const fetchData = () => {
    return async (dispatch) => {
      try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        dispatch({ type: 'FETCH_DATA_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_DATA_FAILURE', payload: error.message });
      }
    };
  };
  