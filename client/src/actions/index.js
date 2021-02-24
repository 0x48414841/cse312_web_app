 

import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  // Verify the user is logged in
  dispatch({ type: FETCH_USER, payload: res.data });
};