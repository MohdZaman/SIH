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

// Helper to normalize user object as per backend User schema
const normalizeUser = (user) => {
  if (!user) return null;
  const id = user.id || user._id;
  return {
    ...user,
    id,
    _id: id,
    employeeID: user.employeeID || '',
    role: user.role || 'OFFICIAL',
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
      const msg = error.data?.message || error.message || 'Login failed. Check your credentials.';
      return rejectWithValue(msg);
    }
  }
);

export const registerAgency = createAsyncThunk(
  'auth/registerAgency',
  async (formData, { rejectWithValue }) => {
    try {
      const normalizedEmployeeID = (formData.employeeID || '').trim().toUpperCase();
      const normalizedEmail = (formData.email || '').trim().toLowerCase();
      const payload = {
        employeeID: normalizedEmployeeID,
        name: (formData.name || '').trim(),
        email: normalizedEmail,
        password: formData.password,
      };

      if (formData.role) {
        payload.role = formData.role;
      }

      const data = await apiClient.post('/auth/register', payload);
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
      const msg = error.data?.message || error.message || 'Registration failed';
      return rejectWithValue(msg);
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
      const msg = error.data?.message || error.message || 'Session verification failed';
      return rejectWithValue(msg);
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
        state.error = null;
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
      .addCase(registerAgency.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = !!action.payload.token;
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