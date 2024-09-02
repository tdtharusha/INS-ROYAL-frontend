import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  startDate: new Date().toISOString().split('T')[0], // Today's date
  endDate: new Date().toISOString().split('T')[0], // Today's date
  currentReport: null,
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setCurrentReport: (state, action) => {
      state.selectedReportType = action.payload;
    },
    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate || state.startDate;
      state.endDate = action.payload.endDate || state.endDate;
    },
    clearReport: (state) => {
      state.currentReport = null;
      state.startDate = '';
      state.endDate = '';
    },
  },
});

export const { setCurrentReport, setDateRange, clearReport } =
  reportSlice.actions;

export default reportSlice.reducer;
