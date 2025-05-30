import React from 'react';
import { Box, Typography } from '@mui/material';
import { MaintenanceRecord } from '../../types';
import MaintenanceCard from './MaintenanceCard';

interface MaintenanceCardListProps {
  maintenances: MaintenanceRecord[];
  onDeleteRecord: (recordId: number) => void;
}

const MaintenanceCardList: React.FC<MaintenanceCardListProps> = ({ maintenances, onDeleteRecord }) => {
  console.log('[Component - MaintenanceCardList] Received maintenances:', maintenances); 
  if (!maintenances || maintenances.length === 0) {
    console.log('[Component - MaintenanceCardList] No maintenance records to display.'); 
    return <Typography>Nenhum registro de manutenção para este ativo.</Typography>;
  }

  return (
    <Box>
      {maintenances.map((record) => {
        console.log('[Component - MaintenanceCardList] Mapping record:', record.id); 
        return (
            <MaintenanceCard
                key={record.id}
                record={record}
                onDelete={onDeleteRecord}
            />
        );
    })}
    </Box>
  );
};

export default MaintenanceCardList;