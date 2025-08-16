'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useCreateOrderMutation, useGetProductsQuery } from '@/state/api';
import { formatCurrency } from '@/utils/formatters';

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateOrderModal({ open, onClose }: CreateOrderModalProps) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const { data: products = [] } = useGetProductsQuery();
  const [createOrder, { isLoading, error, isSuccess }] = useCreateOrderMutation();

  const selectedProduct = products.find(p => p.productId === selectedProductId);

  // Calculate total price when product or quantity changes
  useEffect(() => {
    if (selectedProduct && quantity > 0) {
      setTotalPrice(selectedProduct.price * quantity);
    } else {
      setTotalPrice(0);
    }
  }, [selectedProduct, quantity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId || quantity <= 0) {
      return;
    }

    try {
      await createOrder({
        productId: selectedProductId,
        quantity,
      }).unwrap();
      
      // Reset form and close modal on success
      setSelectedProductId('');
      setQuantity(1);
      setTotalPrice(0);
      onClose();
    } catch (error) {
      // Error is handled by the mutation
      console.error('Failed to create order:', error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedProductId('');
      setQuantity(1);
      setTotalPrice(0);
      onClose();
    }
  };

  const availableProducts = products.filter(p => p.stockQuantity > 0);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="bg-gray-50">
        <Typography variant="h6" className="font-semibold">
          Create New Order
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4">
          {error && (
            <Alert severity="error" className="mb-4">
              {error.data?.message || 'Failed to create order. Please try again.'}
            </Alert>
          )}

          <FormControl fullWidth required>
            <InputLabel>Select Product</InputLabel>
            <Select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              label="Select Product"
              disabled={isLoading}
            >
              {availableProducts.map((product) => (
                <MenuItem key={product.productId} value={product.productId}>
                  <Box>
                    <Typography className="font-medium">{product.name}</Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {formatCurrency(product.price)} • Stock: {product.stockQuantity}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {availableProducts.length === 0 && (
              <Typography variant="body2" className="text-gray-500 mt-1">
                No products available in stock
              </Typography>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setQuantity(Math.max(1, value));
            }}
            inputProps={{ min: 1, max: selectedProduct?.stockQuantity || 1 }}
            required
            disabled={isLoading || !selectedProductId}
            helperText={
              selectedProduct
                ? `Available stock: ${selectedProduct.stockQuantity}`
                : 'Select a product first'
            }
          />

          {selectedProduct && (
            <Box className="bg-gray-50 p-4 rounded-lg">
              <Typography variant="subtitle2" className="text-gray-600 mb-2">
                Order Summary
              </Typography>
              <Box className="space-y-2">
                <Box className="flex justify-between">
                  <Typography>Product:</Typography>
                  <Typography className="font-medium">{selectedProduct.name}</Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography>Unit Price:</Typography>
                  <Typography>{formatCurrency(selectedProduct.price)}</Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography>Quantity:</Typography>
                  <Typography>{quantity}</Typography>
                </Box>
                <Box className="flex justify-between border-t pt-2">
                  <Typography className="font-semibold">Total Price:</Typography>
                  <Typography className="font-semibold text-lg text-green-600">
                    {formatCurrency(totalPrice)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions className="p-4 bg-gray-50">
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!selectedProductId || quantity <= 0 || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <Box className="flex items-center space-x-2">
                <CircularProgress size={16} />
                <Typography>Creating...</Typography>
              </Box>
            ) : (
              'Create Order'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
