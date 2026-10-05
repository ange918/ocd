import type { DashboardStats } from '@/types'
import { DASHBOARD_STATS } from '@/data/stats'
import { clone, delay } from './client'

/** TODO Supabase : vue SQL / RPC `dashboard_stats()` */
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(400)
  return clone(DASHBOARD_STATS)
}
