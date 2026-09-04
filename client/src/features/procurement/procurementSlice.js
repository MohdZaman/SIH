import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api';

// GET /api/procurement/dashboard/summary
export const fetchDashboardSummary = createAsyncThunk(
  'procurement/fetchDashboardSummary',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get('/procurement/dashboard/summary');
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch dashboard summary');
    }
  }
);

// GET /api/procurement
export const fetchProcurements = createAsyncThunk(
  'procurement/fetchProcurements',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/procurement');
      return res.procurement;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch procurements');
    }
  }
);

// GET /api/procurement/:id
export const fetchProcurementById = createAsyncThunk(
  'procurement/fetchProcurementById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/procurement/${id}`);
      return res.procurement;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch procurement details');
    }
  }
);

// POST /api/procurement
export const createProcurement = createAsyncThunk(
  'procurement/createProcurement',
  async (data, { rejectWithValue }) => {
    try {
      const validTypes = ['tender', 'procurement', 'boq'];
      const lower = (data.type || '').toLowerCase();
      const type = validTypes.includes(lower) ? lower : 'tender';
      const res = await apiClient.post('/procurement', {
        name: data.name || data.title,
        description: data.description,
        type,
      });
      return res.procurement;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create procurement');
    }
  }
);

// POST /api/procurement/:id/analyze
export const analyzeProcurement = createAsyncThunk(
  'procurement/analyzeProcurement',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(`/procurement/${id}/analyze`);
      return res.requirement;
    } catch (err) {
      return rejectWithValue(err.message || 'Procurement analysis failed');
    }
  }
);

// DELETE /api/procurement/:id
export const deleteProcurement = createAsyncThunk(
  'procurement/deleteProcurement',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/procurement/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete procurement');
    }
  }
);

// GET /api/procurement/:id/recommendations
export const fetchRecommendations = createAsyncThunk(
  'procurement/fetchRecommendations',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/procurement/${id}/recommendations`);
      return res.recommendations;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch recommendations');
    }
  }
);

// POST /api/procurement/:id/recommend
export const recommendStandard = createAsyncThunk(
  'procurement/recommendStandard',
  async ({ id, query }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(`/procurement/${id}/recommend`, { query });
      return res.recommendations;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to recommend standard');
    }
  }
);

// GET /api/procurement/:id/evidence
export const fetchProcurementEvidence = createAsyncThunk(
  'procurement/fetchProcurementEvidence',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/procurement/${id}/evidence`);
      return res.evidence;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch procurement evidence');
    }
  }
);

// GET /api/procurement/:id/graph
export const fetchProcurementGraph = createAsyncThunk(
  'procurement/fetchProcurementGraph',
  async ({ id, depth = 1 }, { rejectWithValue }) => {
    try {
      return await apiClient.get(`/procurement/${id}/graph?depth=${depth}`);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch procurement graph');
    }
  }
);

const procurementSlice = createSlice({
  name: 'procurement',
  initialState: {
    procurements: [],
    currentProcurement: null,
    dashboardSummary: null,
    recentProcurements: [],
    recentRecommendations: [],
    recommendations: [],
    evidence: [],
    graph: null,
    requirement: null,
    loading: false,
    isAuditing: false,
    error: null,
  },
  reducers: {
    setCurrentProcurement: (state, action) => {
      state.currentProcurement = action.payload;
    },
    clearProcurementError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Summary
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardSummary = action.payload.summary || null;
        state.recentProcurements = action.payload.recentProcurements || [];
        state.recentRecommendations = action.payload.recentRecommendations || [];
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Procurements
      .addCase(fetchProcurements.fulfilled, (state, action) => {
        state.procurements = action.payload || [];
      })
      .addCase(fetchProcurementById.fulfilled, (state, action) => {
        state.currentProcurement = action.payload;
      })
      .addCase(createProcurement.fulfilled, (state, action) => {
        if (action.payload) {
          state.procurements.unshift(action.payload);
          state.currentProcurement = action.payload;
        }
      })
      .addCase(deleteProcurement.fulfilled, (state, action) => {
        state.procurements = state.procurements.filter((p) => p._id !== action.payload);
        if (state.currentProcurement?._id === action.payload) {
          state.currentProcurement = null;
        }
      })
      // Analyze
      .addCase(analyzeProcurement.pending, (state) => {
        state.isAuditing = true;
        state.error = null;
      })
      .addCase(analyzeProcurement.fulfilled, (state, action) => {
        state.isAuditing = false;
        state.requirement = action.payload;
      })
      .addCase(analyzeProcurement.rejected, (state, action) => {
        state.isAuditing = false;
        state.error = action.payload;
      })
      // Recommendations
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload || [];
      })
      .addCase(recommendStandard.fulfilled, (state, action) => {
        state.recommendations = action.payload || [];
      })
      // Evidence & Graph
      .addCase(fetchProcurementEvidence.fulfilled, (state, action) => {
        state.evidence = action.payload || [];
      })
      .addCase(fetchProcurementGraph.fulfilled, (state, action) => {
        state.graph = action.payload;
      });
  },
});

export const { setCurrentProcurement, clearProcurementError } = procurementSlice.actions;
export default procurementSlice.reducer;
