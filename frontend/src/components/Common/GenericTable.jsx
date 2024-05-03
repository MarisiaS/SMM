import {
    MaterialReactTable,
    useMaterialReactTable,
  } from 'material-react-table';
  import { Box, IconButton } from '@mui/material';
  import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    ContentPasteSearch  as DetailsIcon,
    EmojiEvents as RankingIcon
  } from '@mui/icons-material';
  
  
  const GenericTable = ({data, columns}) => {
  
  
    const table = useMaterialReactTable({
      columns: columns,
      data: data,
      enableColumnFilters: false,
      enablePagination: false,
      enableSorting: false,
      enableGlobalFilter: false,
      enableRowActions: true,
      positionActionsColumn: 'last',
      renderRowActions: ({ row }) => (
          <Box>
            <IconButton onClick={() => console.info('Details')}>
              <DetailsIcon />
            </IconButton>
            <IconButton onClick={() => console.info('Edit')}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => console.info('Delete')}>
              <DeleteIcon />
            </IconButton>  
            <IconButton onClick={() => console.info('Ranking')}>
              <RankingIcon />
            </IconButton>
          </Box>
        ),
    });
  
  
    return <MaterialReactTable table={table} />;
  };
  
  export default GenericTable;