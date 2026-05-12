import { createClient } from '@/lib/supabase/client';

export const auditService = {
  /**
   * Log an event to the system audit trail
   */
  async logEvent(action: string, details: any = {}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('system_audit_logs')
      .insert([{
        user_id: user?.id || null,
        user_email: user?.email || 'System',
        action: action,
        details: details,
        created_at: new Date().toISOString()
      }]);

    if (error) console.error('Audit Log Error:', error);
  },

  /**
   * Fetch recent audit logs for the Admin
   */
  async getRecentLogs(limit = 50) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('system_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
};
