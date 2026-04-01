import { supabase } from '../lib/supabase';
import { Alert, AlertType } from '../types';

export interface CreateAlertParams {
  tripId: string;
  alertType: AlertType;
  targetPrice?: number | null;
}

export class AlertsService {
  async getAlerts(userId: string): Promise<{ alerts: Alert[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const alerts: Alert[] = (data || []).map(alert => ({
        id: alert.id,
        user_id: alert.user_id,
        trip_id: alert.trip_id,
        alert_type: alert.alert_type,
        target_price: alert.target_price,
        is_active: alert.is_active,
        last_triggered_at: alert.last_triggered_at,
        created_at: alert.created_at,
        updated_at: alert.updated_at,
      }));

      return { alerts, error: null };
    } catch (error) {
      return { alerts: [], error: error as Error };
    }
  }

  async getAlertsForTrip(tripId: string): Promise<{ alerts: Alert[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const alerts: Alert[] = (data || []).map(alert => ({
        id: alert.id,
        user_id: alert.user_id,
        trip_id: alert.trip_id,
        alert_type: alert.alert_type,
        target_price: alert.target_price,
        is_active: alert.is_active,
        last_triggered_at: alert.last_triggered_at,
        created_at: alert.created_at,
        updated_at: alert.updated_at,
      }));

      return { alerts, error: null };
    } catch (error) {
      return { alerts: [], error: error as Error };
    }
  }

  async createAlert(userId: string, params: CreateAlertParams): Promise<{ alert: Alert | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert({
          user_id: userId,
          trip_id: params.tripId,
          alert_type: params.alertType,
          target_price: params.targetPrice,
          is_active: true,
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return { alert: null, error: new Error('Failed to create alert') };
      }

      const alert: Alert = {
        id: data.id,
        user_id: data.user_id,
        trip_id: data.trip_id,
        alert_type: data.alert_type,
        target_price: data.target_price,
        is_active: data.is_active,
        last_triggered_at: data.last_triggered_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return { alert, error: null };
    } catch (error) {
      return { alert: null, error: error as Error };
    }
  }

  async toggleAlert(alertId: string, isActive: boolean): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({
          is_active: isActive,
        })
        .eq('id', alertId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async updateAlert(alertId: string, updates: Partial<CreateAlertParams>): Promise<{ error: Error | null }> {
    try {
      const updateData: Record<string, unknown> = {};

      if (updates.targetPrice !== undefined) updateData.target_price = updates.targetPrice;
      if (updates.alertType !== undefined) updateData.alert_type = updates.alertType;

      const { error } = await supabase
        .from('alerts')
        .update(updateData)
        .eq('id', alertId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async deleteAlert(userId: string, alertId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }
}

export const alertsService = new AlertsService();
