'use client';

import { useState } from 'react';
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
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search } from 'lucide-react';
import { useGetOrdersQuery } from '@/state/api';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function OrderListTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();

  const filteredOrders = orders.filter((order) =>
    order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Box className="text-center py-8">
        <Typography>Loading orders...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="text-center py-8">
        <Typography color="error">Error loading orders</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box className="mb-4">
        <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
          Orders List
        </Typography>
        <TextField
          size="small"
          placeholder="Search orders by product name, order ID, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} className="text-gray-400" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} className="shadow-sm">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell className="font-semibold">Order ID</TableCell>
              <TableCell className="font-semibold">Product Name</TableCell>
              <TableCell className="font-semibold">Category</TableCell>
              <TableCell className="font-semibold text-center">Quantity</TableCell>
              <TableCell className="font-semibold text-right">Unit Price</TableCell>
              <TableCell className="font-semibold text-right">Total Price</TableCell>
              <TableCell className="font-semibold">Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No orders found matching your search' : 'No orders found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.orderId} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">
                    {order.orderId.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Typography className="font-medium">{order.product.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.product.category}
                      size="small"
                      className="bg-blue-100 text-blue-800"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Chip
                      label={order.quantity}
                      size="small"
                      className="bg-green-100 text-green-800"
                    />
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(order.product.price)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-green-600">
                    {formatCurrency(order.totalPrice)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="mt-4 text-right">
        <Typography variant="body2" className="text-gray-600">
          Total Orders: {filteredOrders.length}
        </Typography>
      </Box>
    </Box>
  );
}
