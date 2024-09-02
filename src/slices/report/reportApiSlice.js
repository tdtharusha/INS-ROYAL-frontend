import { apiSlice } from '../apiSlice';

const REPORT_URL = '/api/reports';

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrderInvoice: builder.query({
      query: (orderId) => ({
        url: `${REPORT_URL}/order-invoice/${orderId}`,
        method: 'GET',
      }),
    }),
    getRevenueReport: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `${REPORT_URL}/revenue`,
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    getExpenseReport: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `${REPORT_URL}/expense`,
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    getGRNInvoice: builder.query({
      query: (grnId) => ({
        url: `${REPORT_URL}/grn-invoice/${grnId}`,
        method: 'GET',
      }),
    }),
    getInventoryReport: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `${REPORT_URL}/inventory-report`,
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    getProfitReport: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `${REPORT_URL}/profit`,
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
  }),
});

export const {
  useGetOrderInvoiceQuery,
  useGetRevenueReportQuery,
  useGetExpenseReportQuery,
  useGetGRNInvoiceQuery,
  useGetInventoryReportQuery,
  useGetProfitReportQuery,
} = reportApiSlice;
