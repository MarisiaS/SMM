import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, IconButton } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';


const MyTable = ({data, columns}) => {
  const table = useMaterialReactTable({
    columns: columns,
    data: data,
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => (
        <Box>
          <IconButton onClick={() => console.info('Edit')}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => console.info('Delete')}>
            <WorkspacePremiumIcon />
          </IconButton>
        </Box>
      ),
  });

  return <MaterialReactTable table={table} />;
};

export default MyTable;
