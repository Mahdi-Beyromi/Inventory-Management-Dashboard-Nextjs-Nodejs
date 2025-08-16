'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  Grid,
  Pagination,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { ORDER_STATUSES, getStatusLabel, getStatusColor, getStatusIcon } from '@/utils/orderStatus';

interface OrderSearchFiltersProps {
  search: string;
  status: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
}

export default function OrderSearchFilters({
  search,
  status,
  currentPage,
  totalPages,
  totalCount,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onClearFilters,
  onRefresh,
}: OrderSearchFiltersProps) {
  const [searchInput, setSearchInput] = useState(search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        onSearchChange(searchInput);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, search, onSearchChange]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onSearchChange('');
  };

  const hasActiveFilters = search || (status && status !== 'all');

  return (
    <Paper className="p-4 mb-6 shadow-sm border border-gray-200">
      <Box className="space-y-4">
        {/* Header */}
        <Box className="flex items-center justify-between">
          <Typography variant="h6" className="font-semibold text-gray-800">
            Search & Filters
          </Typography>
          <Box className="flex items-center space-x-2">
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={onRefresh}
                className="text-gray-600 hover:text-gray-800"
              >
                <RefreshCw size={18} />
              </IconButton>
            </Tooltip>
            {hasActiveFilters && (
              <Tooltip title="Clear all filters">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={onClearFilters}
                  startIcon={<X size={16} />}
                  className="text-gray-600 border-gray-300 hover:border-gray-400"
                >
                  Clear Filters
                </Button>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Search and Filters Row */}
        <Grid container spacing={3}>
          {/* Search Input */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Orders"
              placeholder="Search by Order ID, Product Name, or Category..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              InputProps={{
                startAdornment: <Search size={20} className="text-gray-400 mr-2" />,
                endAdornment: searchInput && (
                                     <IconButton
                     size="small"
                     onClick={handleClearSearch}
                     className="text-gray-400 hover:text-gray-600"
                   >
                     <X size={16} />
                   </IconButton>
                ),
              }}
              className="bg-white"
            />
          </Grid>

          {/* Status Filter */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                label="Status Filter"
                className="bg-white"
              >
                <MenuItem value="all">
                  <Box className="flex items-center space-x-2">
                    <Chip
                      label="All Statuses"
                      size="small"
                      className="bg-gray-100 text-gray-700"
                    />
                    <Typography variant="body2" className="text-gray-500">
                      ({totalCount})
                    </Typography>
                  </Box>
                </MenuItem>
                {Object.values(ORDER_STATUSES).map((statusValue) => (
                  <MenuItem key={statusValue} value={statusValue}>
                    <Box className="flex items-center space-x-2">
                      <Chip
                        label={getStatusLabel(statusValue)}
                        size="small"
                        className={getStatusColor(statusValue)}
                        icon={<span>{getStatusIcon(statusValue)}</span>}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Active Filters Display */}
          <Grid item xs={12} md={3}>
            <Box className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <Typography variant="body2" className="text-gray-600">
                Active Filters:
              </Typography>
              {search && (
                <Chip
                  label={`Search: "${search}"`}
                  size="small"
                  onDelete={() => handleClearSearch()}
                  className="bg-blue-100 text-blue-800"
                />
              )}
              {status && status !== 'all' && (
                <Chip
                  label={`Status: ${getStatusLabel(status)}`}
                  size="small"
                  onDelete={() => onStatusChange('all')}
                  className="bg-green-100 text-green-800"
                />
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Results Summary */}
        <Box className="flex items-center justify-between pt-2 border-t border-gray-200">
          <Typography variant="body2" className="text-gray-600">
            Showing {totalCount > 0 ? `${((currentPage - 1) * 50) + 1}` : 0} to{' '}
            {Math.min(currentPage * 50, totalCount)} of {totalCount} orders
          </Typography>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box className="flex items-center space-x-2">
              <Typography variant="body2" className="text-gray-600">
                Page {currentPage} of {totalPages}
              </Typography>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => onPageChange(page)}
                size="small"
                showFirstButton
                showLastButton
                color="primary"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
