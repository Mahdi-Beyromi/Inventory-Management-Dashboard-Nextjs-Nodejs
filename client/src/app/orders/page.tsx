'use client';

import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { Plus } from 'lucide-react';
import Header from '@/app/{components}/Header';
import OrderListGrid from './OrderListGrid';
import CreateOrderModal from './CreateOrderModal';

export default function OrdersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Header name="Orders Management" />
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Order
        </Button>
      </div>

      <OrderListGrid />

      <CreateOrderModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </div>
  );
}
