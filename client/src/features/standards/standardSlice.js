import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api';

// GET /api/standard/search?q=...
export const searchStandards = createAsyncThunk(
  'standards/searchStandards',
  async (query, { rejectWithValue }) => {
    try {
      return await apiClient.get(`/standard/search?q=${encodeURIComponent(query)}`);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to search standards');
    }
  }
);

// GET /api/standard/:id/version
export const fetchStandardVersion = createAsyncThunk(
  'standards/fetchStandardVersion',
  async (id, { rejectWithValue }) => {
    try {
      return await apiClient.get(`/standard/${id}/version`);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch standard version');
    }
  }
);

// GET /api/standard/:id/graph?depth=1
export const fetchStandardGraph = createAsyncThunk(
  'standards/fetchStandardGraph',
  async ({ id, depth = 1 }, { rejectWithValue }) => {
    try {
      return await apiClient.get(`/standard/${id}/graph?depth=${depth}`);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch standard graph');
    }
  }
);

// Flexible Graph Thunk: supports MongoDB ObjectId or Standard Code (e.g. 'IS 1786')
export const fetchStandardGraphByCode = createAsyncThunk(
  'standards/fetchStandardGraphByCode',
  async ({ code, depth = 1 }, { rejectWithValue }) => {
    try {
      const cleanCode = (code || '').trim();
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(cleanCode);
      if (isObjectId) {
        return await apiClient.get(`/standard/${cleanCode}/graph?depth=${depth}`);
      }

      // Search standard in database first
      const searchRes = await apiClient.get(`/standard/search?q=${encodeURIComponent(cleanCode)}`);
      const matched = searchRes?.standards?.find(
        (s) => s.code?.toLowerCase().includes(cleanCode.toLowerCase())
      ) || searchRes?.standards?.[0];

      if (matched && matched._id) {
        const graphRes = await apiClient.get(`/standard/${matched._id}/graph?depth=${depth}`);
        return {
          ...graphRes,
          standard: matched,
        };
      }

      return {
        success: true,
        standard: {
          code: cleanCode,
          title: `Indian Standard ${cleanCode}`,
        },
        depth,
        graph: { nodes: [], edges: [] },
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch standard graph');
    }
  }
);

// POST /api/standard
export const createNewStandard = createAsyncThunk(
  'standards/createNewStandard',
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/standard', data);
      return res.standard;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create standard');
    }
  }
);

const standardSlice = createSlice({
  name: 'standards',
  initialState: {
    searchQuery: '',
    standards: [],
    searchCount: 0,
    activeStandard: null,
    standardVersion: null,
    standardGraph: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveStandard: (state, action) => {
      state.activeStandard = action.payload;
    },
    clearStandardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search
      .addCase(searchStandards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchStandards.fulfilled, (state, action) => {
        state.loading = false;
        state.standards = action.payload.standards || [];
        state.searchCount = action.payload.count || 0;
        state.searchQuery = action.payload.query || '';
      })
      .addCase(searchStandards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Version
      .addCase(fetchStandardVersion.fulfilled, (state, action) => {
        state.standardVersion = action.payload;
      })
      // Graph
      .addCase(fetchStandardGraph.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStandardGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.standardGraph = action.payload;
      })
      // Graph by Code
      .addCase(fetchStandardGraphByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStandardGraphByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.standardGraph = action.payload;
      })
      .addCase(fetchStandardGraphByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setActiveStandard, clearStandardError } = standardSlice.actions;
export default standardSlice.reducer;