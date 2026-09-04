import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api';
import {
  getTokenCookie,
  setTokenCookie,
  removeTokenCookie,
  getUserCookie,
  setUserCookie,
  removeUserCookie,
} from '../../utils/cookieUtils';

// Helper to normalize user object
const normalizeUser = (user) => {
  if (!user) return null;
  const id = user.id || user._id;
  return {
    ...user,
    id,
    _id: id,
    role: user.role || 'USER',
  };
};

export const loginOfficer = createAsyncThunk(
  'auth/loginOfficer',
  async (credentials, { rejectWithValue }) => {
    try {
      const normalizedEmail = credentials.email.trim().toLowerCase();
      const data = await apiClient.post('/auth/login', {
        email: normalizedEmail,
        password: credentials.password,
      });

      const user = normalizeUser(data?.user);
      if (data?.token) {
        setTokenCookie(data.token);
      }
      if (user) {
        setUserCookie(user);
      }

      return {
        ...data,
        user,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerAgency = createAsyncThunk(
  'auth/registerAgency',
  async (formData, { rejectWithValue }) => {
    try {
      const payload = {
        name: formData.name?.trim() || formData.email.split('@')[0],
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      if (formData.role === 'ADMIN' || formData.role === 'USER') {
        payload.role = formData.role;
      }

      const data = await apiClient.post('/auth/register', payload);
      const user = normalizeUser(data?.user);

      return {
        ...data,
        user,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiClient.get('/auth/me');
      if (data?.user) {
        const user = normalizeUser(data.user);
        setUserCookie(user);
        return {
          ...data,
          user,
        };
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Session verification failed');
    }
  }
);

export const fetchCurrentUser = fetchProfile;

const initialToken = getTokenCookie();
const initialUser = getUserCookie();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
    },
    logoutUser: (state) => {
      removeTokenCookie();
      removeUserCookie();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginOfficer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginOfficer.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginOfficer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAgency.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(fetchProfile.rejected, (state) => {
        removeTokenCookie();
        removeUserCookie();
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;