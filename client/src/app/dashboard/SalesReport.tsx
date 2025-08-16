'use client';

import { Box, Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import { TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetSalesReportQuery } from '@/state/api';
import { formatCurrency } from '@/utils/formatters';

export default function SalesReport() {
  const { data: salesReport, isLoading, error } = useGetSalesReportQuery();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent>
          <Typography>Loading sales report...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error || !salesReport) {
    return (
      <Card className="h-full">
        <CardContent>
          <Typography color="error">Error loading sales report</Typography>
        </CardContent>
      </Card>
    );
  }

  const { totalOrders, totalRevenue, dailySales } = salesReport;

  return (
    <Card className="h-full">
      <CardContent className="space-y-6">
        {/* Header */}
        <Box className="flex items-center space-x-2">
          <TrendingUp className="text-blue-600" size={24} />
          <Typography variant="h6" className="font-semibold text-gray-800">
            Sales Report
          </Typography>
        </Box>

        {/* KPIs */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box className="text-center p-4 bg-blue-50 rounded-lg">
              <ShoppingCart className="text-blue-600 mx-auto mb-2" size={24} />
              <Typography variant="h4" className="font-bold text-blue-600">
                {totalOrders.toLocaleString()}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Total Orders
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="text-green-600 mx-auto mb-2" size={24} />
              <Typography variant="h4" className="font-bold text-green-600">
                {formatCurrency(totalRevenue)}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Total Revenue
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Chart */}
        <Box>
          <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
            Daily Sales (Last 30 Days)
          </Typography>
          <Box className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Sales']}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString();
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalAmount" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Summary */}
        <Box className="flex items-center justify-between pt-2 border-t border-gray-200">
          <Typography variant="body2" className="text-gray-600">
            Data updated in real-time
          </Typography>
          <Chip 
            label="Last 30 Days" 
            size="small" 
            className="bg-blue-100 text-blue-800"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
