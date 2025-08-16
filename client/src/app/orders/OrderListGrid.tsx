'use client';

import { useState, useMemo } from 'react';
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridFilterModel,
  GridSortModel,
  GridPaginationModel,
} from '@mui/x-data-grid';
import { Box, Chip, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreHorizontal } from 'lucide-react';
import { useGetOrdersQuery, useUpdateOrderStatusMutation, Order, OrdersQueryParams } from '@/state/api';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getStatusLabel, getStatusColor, getStatusIcon, ORDER_STATUSES } from '@/utils/orderStatus';
import OrderSearchFilters from './OrderSearchFilters';

// Order Actions Component
const OrderActions = ({ order }: { order: Order }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [updateStatus] = useUpdateOrderStatusMutation();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateStatus({ orderId: order.orderId, status: newStatus });
      handleClose();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        className="text-gray-600 hover:text-gray-800"
      >
        <MoreHorizontal size={16} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {Object.values(ORDER_STATUSES).map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusUpdate(status)}
            disabled={status === order.status}
            className={status === order.status ? 'bg-gray-100' : ''}
          >
            <span className="mr-2">{getStatusIcon(status)}</span>
            {getStatusLabel(status)}
            {status === order.status && <span className="ml-2 text-xs text-gray-500">(Current)</span>}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const columns: GridColDef[] = [
  {
    field: 'orderId',
    headerName: 'Order ID',
    width: 150,
    type: 'string',
    filterable: true,
    renderCell: (params) => (
      <Typography className="font-mono text-sm">
        {params.value.slice(0, 8)}...
      </Typography>
    ),
  },
  {
    field: 'productName',
    headerName: 'Product Name',
    width: 200,
    type: 'string',
    filterable: true,
    renderCell: (params) => (
      <Typography className="font-medium">{params.value}</Typography>
    ),
  },
  {
    field: 'productCategory',
    headerName: 'Category',
    width: 150,
    type: 'string',
    filterable: true,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        className="bg-blue-100 text-blue-800"
      />
    ),
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    width: 120,
    type: 'number',
    filterable: true,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        className="bg-green-100 text-green-800"
      />
    ),
  },
  {
    field: 'unitPrice',
    headerName: 'Unit Price',
    width: 130,
    type: 'number',
    filterable: true,
    renderCell: (params) => (
      <Typography className="font-mono">
        {formatCurrency(params.value)}
      </Typography>
    ),
  },
  {
    field: 'totalPrice',
    headerName: 'Total Price',
    width: 140,
    type: 'number',
    filterable: true,
    renderCell: (params) => (
      <Typography className="font-mono font-semibold text-green-600">
        {formatCurrency(params.value)}
      </Typography>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 140,
    type: 'string',
    filterable: true,
    renderCell: (params) => (
      <Chip
        label={getStatusLabel(params.value)}
        size="small"
        className={getStatusColor(params.value)}
        icon={<span>{getStatusIcon(params.value)}</span>}
      />
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 180,
    type: 'string',
    filterable: true,
    renderCell: (params) => (
      <Typography className="text-sm text-gray-600">
        {formatDate(params.value)}
      </Typography>
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 100,
    type: 'string',
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <OrderActions order={params.row} />
    ),
  },
];

export default function OrderListGrid() {
  // State for search and filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Query parameters
  const queryParams: OrdersQueryParams = {
    search: search || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page: currentPage,
    limit: 50,
  };
  
  const { data: ordersResponse, isLoading, error, refetch } = useGetOrdersQuery(queryParams);
  
  // Extract orders and pagination from response
  const orders = ordersResponse?.orders || [];
  const pagination = ordersResponse?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 50,
  };
  
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: [],
  });
  
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'createdAt',
      sort: 'desc',
    },
  ]);
  
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 25,
    page: 0,
  });

  // Transform orders data for DataGrid with flattened fields
  const transformedOrders = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      // Flatten nested product fields for better filtering
      productName: order.product.name,
      productCategory: order.product.category,
      unitPrice: order.product.price,
      // Ensure createdAt is a string for proper handling
      createdAt: order.createdAt,
      // Include status field
      status: order.status,
    }));
  }, [orders]);

  if (isLoading) {
    return (
      <Box className="text-center py-8">
        <Typography>Loading orders...</Typography>
      </Box>
    );
  }

  // Handler functions for search and filters
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <Box className="text-center py-8">
        <Typography color="error">Error loading orders</Typography>
      </Box>
    );
  }

  return (
    <Box className="w-full space-y-6">
      {/* Search and Filters */}
      <OrderSearchFilters
        search={search}
        status={statusFilter}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalCount={pagination.totalCount}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPageChange={handlePageChange}
        onClearFilters={handleClearFilters}
        onRefresh={handleRefresh}
      />

      {/* DataGrid */}
      <DataGrid
        rows={transformedOrders}
        columns={columns}
        getRowId={(row) => row.orderId}
        checkboxSelection
        disableRowSelectionOnClick
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50, 100]}
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            csvOptions: { disableToolbarButton: false },
            printOptions: { disableToolbarButton: false },
          },
        }}
        className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700"
        sx={{
          '& .MuiDataGrid-toolbarContainer': {
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f3f4f6',
            borderBottom: '1px solid #e5e7eb',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f9fafb',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f3f4f6',
          },
        }}
      />
    </Box>
  );
}
