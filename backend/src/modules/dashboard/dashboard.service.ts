import pool from '@/config/db';
import { DashboardUpcomingItem } from '@/interfaces';
import { ApiError } from '@/utils/errorHandler';

export const getUpcomingMaintenanceService = async (userId: number): Promise<DashboardUpcomingItem[]> => {
  const query = `
    WITH LatestMaintenance AS (
        SELECT
            mr.id as maintenance_record_id,
            mr.asset_id,
            mr.service_description AS last_service_description,
            mr.next_maintenance_due_date,
            mr.next_maintenance_condition,
            ROW_NUMBER() OVER(PARTITION BY mr.asset_id ORDER BY mr.date_performed DESC, mr.created_at DESC) as rn
        FROM maintenance_records mr
        JOIN assets a ON mr.asset_id = a.id
        WHERE a.user_id = $1
    )
    SELECT
        a.id AS asset_id,
        a.name AS asset_name,
        a.description AS asset_description,
        lm.maintenance_record_id,
        lm.last_service_description,
        lm.next_maintenance_due_date,
        lm.next_maintenance_condition
    FROM LatestMaintenance lm
    JOIN assets a ON lm.asset_id = a.id
    WHERE lm.rn = 1
      AND (lm.next_maintenance_due_date IS NOT NULL OR lm.next_maintenance_condition IS NOT NULL)
    ORDER BY
        CASE
            WHEN lm.next_maintenance_due_date < CURRENT_DATE THEN 1 -- Vencidas primeiro
            WHEN lm.next_maintenance_due_date = CURRENT_DATE THEN 2 -- Vencendo hoje
            ELSE 3 -- Próximas
        END,
        lm.next_maintenance_due_date ASC NULLS LAST, -- Ordena por data, vencidas primeiro
        a.name ASC; -- Desempate por nome do ativo
  `;

  try {
    const result = await pool.query<DashboardUpcomingItem>(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching upcoming maintenance:", error);
    throw new ApiError(500, 'Failed to retrieve upcoming maintenance data');
  }
};