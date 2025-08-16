'use client';

import { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Plus } from 'lucide-react';
import OrderListTable from './OrderListTable';
import CreateOrderModal from './CreateOrderModal';

export default function OrdersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Orders Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Order
        </Button>
      </Box>

      <Paper className="p-6">
        <OrderListTable />
      </Paper>

      <CreateOrderModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </Box>
  );
}
