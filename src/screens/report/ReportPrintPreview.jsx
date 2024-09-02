import React, { useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.common.white,
  color: theme.palette.common.black,
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  '@media print': {
    display: 'none',
  },
}));

const ReportPrintPreview = ({
  title,
  data,
  columns,
  showTotal = true,
  summary = [],
}) => {
  console.log('Report Data:', data);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    doc.autoTable({
      head: [columns.map((col) => col.header)],
      body: [
        ...data.map((row) => columns.map((col) => row[col.field])),
        showTotal
          ? columns.map((col, index) =>
              index === 0
                ? 'Total'
                : data.reduce(
                    (sum, row) =>
                      sum +
                      (typeof row[col.field] === 'number' ? row[col.field] : 0),
                    0
                  )
            )
          : [],
      ],
      startY: 20,
    });
    doc.save(`${title}.pdf`);
  };

  const total = showTotal
    ? columns.reduce((acc, col) => {
        if (col.field !== columns[0].field) {
          acc[col.field] = data.reduce(
            (sum, row) => sum + (parseFloat(row[col.field]) || 0),
            0
          );
        }
        return acc;
      }, {})
    : null;

  return (
    <Box ref={componentRef}>
      <Typography variant='h5' gutterBottom align='left'>
        INS ROYAL
      </Typography>
      <Typography
        variant='h6'
        gutterBottom
        align='left'
        style={{ whiteSpace: 'pre-line' }}
      >
        {title}
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <StyledTableCell key={col.field} align={col.align || 'center'}>
                  {col.header}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.field} align={col.align || 'left'}>
                    {row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {showTotal && (
              <TableRow>
                <StyledTableCell>Total</StyledTableCell>
                {columns.slice(1).map((col) => (
                  <StyledTableCell key={col.field} align={col.align || 'left'}>
                    {col.format
                      ? col.format(total[col.field])
                      : total[col.field]}
                  </StyledTableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {summary.length > 0 && (
        <Box sx={{ mt: 2, mb: 2 }}>
          {summary.map((item, index) => (
            <Typography key={index} variant='body1'>
              {item.label}: {item.value}
            </Typography>
          ))}
        </Box>
      )}
      <Typography variant='body2' align='left'>
        © INS ROYAL Restaurant
      </Typography>
      <Typography variant='body2' align='left'>
        *This is a computer-generated document. No signature is required.
      </Typography>
      <Typography variant='body2' align='left'>
        {new Date().toLocaleString()}
      </Typography>
      <ButtonContainer>
        <Button variant='contained' onClick={handlePrint}>
          Print Report
        </Button>
        <Button variant='contained' onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </ButtonContainer>
    </Box>
  );
};

export default ReportPrintPreview;
