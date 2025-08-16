'use client';

import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Alert } from '@mui/material';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { useGetLowInventoryReportQuery } from '@/state/api';
import { formatCurrency } from '@/utils/formatters';

export default function LowInventoryReport() {
  const { data: lowInventoryItems, isLoading, error } = useGetLowInventoryReportQuery();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent>
          <Typography>Loading low inventory report...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error || !lowInventoryItems) {
    return (
      <Card className="h-full">
        <CardContent>
          <Typography color="error">Error loading low inventory report</Typography>
        </CardContent>
      </Card>
    );
  }

  const criticalItems = lowInventoryItems.filter(item => item.stockQuantity <= 5);
  const warningItems = lowInventoryItems.filter(item => item.stockQuantity > 5 && item.stockQuantity < 10);

  return (
    <Card className="h-full">
      <CardContent className="space-y-6">
        {/* Header */}
        <Box className="flex items-center space-x-2">
          <AlertTriangle className="text-orange-600" size={24} />
          <Typography variant="h6" className="font-semibold text-gray-800">
            Low Inventory Report
          </Typography>
        </Box>

        {/* Summary Stats */}
        <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Box className="text-center p-3 bg-red-50 rounded-lg">
            <TrendingDown className="text-red-600 mx-auto mb-2" size={20} />
            <Typography variant="h5" className="font-bold text-red-600">
              {criticalItems.length}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Critical (≤5)
            </Typography>
          </Box>
          <Box className="text-center p-3 bg-orange-50 rounded-lg">
            <AlertTriangle className="text-orange-600 mx-auto mb-2" size={20} />
            <Typography variant="h5" className="font-bold text-orange-600">
              {warningItems.length}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Warning (&lt;10)
            </Typography>
          </Box>
          <Box className="text-center p-3 bg-blue-50 rounded-lg">
            <Package className="text-blue-600 mx-auto mb-2" size={20} />
            <Typography variant="h5" className="font-bold text-blue-600">
              {lowInventoryItems.length}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Total Items
            </Typography>
          </Box>
        </Box>

        {/* Alerts */}
        {criticalItems.length > 0 && (
          <Alert severity="error" className="bg-red-50 border border-red-200">
            <Typography variant="body2" className="text-red-800">
              <strong>Critical Alert:</strong> {criticalItems.length} product(s) have dangerously low stock (≤5 units).
              Please reorder immediately.
            </Typography>
          </Alert>
        )}

        {warningItems.length > 0 && (
          <Alert severity="warning" className="bg-orange-50 border border-orange-200">
            <Typography variant="body2" className="text-orange-800">
              <strong>Warning:</strong> {warningItems.length} product(s) have low stock (&lt;10 units).
              Consider reordering soon.
            </Typography>
          </Alert>
        )}

        {/* Products Table */}
        <Box>
          <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
            Low Stock Products
          </Typography>
          <TableContainer className="max-h-80">
            <Table size="small">
              <TableHead>
                <TableRow className="bg-gray-50">
                  <TableCell className="font-semibold">Product Name</TableCell>
                  <TableCell className="font-semibold">Category</TableCell>
                  <TableCell className="font-semibold">Stock</TableCell>
                  <TableCell className="font-semibold">Price</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowInventoryItems.map((item) => {
                  const isCritical = item.stockQuantity <= 5;
                  const isWarning = item.stockQuantity > 5 && item.stockQuantity < 10;
                  
                  return (
                    <TableRow 
                      key={item.productId}
                      className={
                        isCritical 
                          ? 'hover:bg-gray-50 bg-red-50' 
                          : isWarning 
                            ? 'hover:bg-gray-50 bg-orange-50'
                            : 'hover:bg-gray-50'
                      }
                    >
                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.category} 
                          size="small" 
                          className="bg-gray-100 text-gray-700"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.stockQuantity}
                          size="small"
                          className={
                            isCritical 
                              ? 'bg-red-100 text-red-800' 
                              : isWarning 
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }
                        />
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={isCritical ? 'Critical' : isWarning ? 'Warning' : 'Low'}
                          size="small"
                          className={
                            isCritical 
                              ? 'bg-red-100 text-red-800' 
                              : isWarning 
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Summary */}
        <Box className="flex items-center justify-between pt-2 border-t border-gray-200">
          <Typography variant="body2" className="text-gray-600">
            Showing {lowInventoryItems.length} low stock products
          </Typography>
          <Chip 
            label="Stock &lt; 10" 
            size="small" 
            className="bg-orange-100 text-orange-800"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
