import { createClient } from '@/lib/supabase/client';

export const adminService = {
  /**
   * Fetch site-wide metrics for the Super Admin
   */
  async getGlobalMetrics() {
    const supabase = createClient();
    
    // Total Listings
    const { count: totalListings, error: listingsError } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true });
      
    // Total Users (Agents/Seekers)
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Total Views (Sum of all listing views)
    const { data: viewsData, error: viewsError } = await supabase
      .from('listings')
      .select('view_count');
    
    const totalViews = viewsData?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0;

    return {
      totalListings: totalListings || 0,
      totalUsers: totalUsers || 0,
      totalViews,
      totalCities: 8 // Based on seed data
    };
  },

  /**
   * Get all listings with agent info
   */
  async getAllListings() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        host:profiles!host_id (full_name, email),
        cities (name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get all users (Agents and Seekers)
   */
  async getAllUsers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get detailed platform stats (Analytics)
   */
  async getDetailedStats() {
    const supabase = createClient();
    
    // Fetch stats for the last 30 days
    const { data: listings } = await supabase
      .from('listings')
      .select('created_at, view_count, type');

    const { data: users } = await supabase
      .from('profiles')
      .select('created_at, role');

    return {
      listings,
      users,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Update user role (e.g. Promote to Admin or Agent)
   */
  async updateUserRole(userId: string, role: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;
    return true;
  },

  /**
   * Approve or reject a listing
   */
  async updateListingStatus(id: string, status: 'active' | 'pending' | 'rejected') {
    const supabase = createClient();
    const { error } = await supabase
      .from('listings')
      .update({ status })
      .eq('id', id);

    if (!error) {
      try {
        const { auditService } = await import('./auditService');
        await auditService.logEvent('LISTING_STATUS_UPDATE', { listing_id: id, new_status: status });
      } catch (auditErr) {
        console.warn('Audit logging failed, but the status update was successful:', auditErr);
      }
    }

    if (error) throw error;
    return true;
  },

  /**
   * Fetch listings pending approval
   */
  async getPendingApprovals() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        host:profiles!host_id (full_name, email),
        cities (name)
      `)
      .eq('approval_status', 'pending_approval')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Approve, Reject or Request Changes for a listing
   */
  async moderateListing(id: string, status: 'approved' | 'rejected' | 'changes_requested', reason?: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const updatePayload: any = {
      approval_status: status,
      rejection_reason: reason || null,
      approved_by: status === 'approved' ? user?.id : null,
      approved_at: status === 'approved' ? new Date().toISOString() : null,
      // If approved, set the general status to active
      status: status === 'approved' ? 'active' : 'inactive'
    };

    const { error } = await supabase
      .from('listings')
      .update(updatePayload)
      .eq('id', id);

    if (!error) {
      try {
        const { auditService } = await import('./auditService');
        await auditService.logEvent('LISTING_MODERATION', { 
          listing_id: id, 
          decision: status,
          reason 
        });
      } catch (auditErr) {
        console.warn('Audit logging failed:', auditErr);
      }
    }

    if (error) throw error;
    return true;
  },

  /**
   * Delete a user account (Requires Edge Function)
   */
  async deleteUser(userId: string) {
    const supabase = createClient();
    const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr) throw sessionErr;
    if (!session?.access_token) throw new Error("No active session found. Please log in again.");

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      },
      body: JSON.stringify({ userId })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || `Error ${response.status}`);
    return data;
  },

  /**
   * Create a new team member account (Requires Edge Function)
   */
  async createAgent(email: string, fullName: string, password?: string, role: string = 'agent') {
    const supabase = createClient();
    const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr) throw sessionErr;
    if (!session?.access_token) throw new Error("No active session found. Please log in again.");

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      },
      body: JSON.stringify({ email, full_name: fullName, password, role })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || `Error ${response.status}`);
    return data;
  },

  /**
   * Delete a listing from the platform
   */
  async deleteListing(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
      .select('id')
      .single();

    if (!error) {
      const { auditService } = await import('./auditService');
      await auditService.logEvent('LISTING_DELETION', { listing_id: id });
    }

    if (error) throw error;
    return true;
  },

  /**
   * Fetch system notifications for the admin
   */
  async getNotifications() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data;
  },

  /**
   * Mark notification as read
   */
  async markNotificationRead(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  /**
   * Submit a support message
   */
  async submitSupportMessage(payload: { full_name: string, email: string, subject: string, message: string }) {
    const supabase = createClient();
    const { error } = await supabase
      .from('support_messages')
      .insert(payload);

    if (error) throw error;
    return true;
  },

  /**
   * Submit a listing report
   */
  async submitReport(payload: { listing_id: string, reason: string, evidence: string }) {
    const supabase = createClient();
    const { error } = await supabase
      .from('reports')
      .insert(payload);

    if (error) throw error;
    return true;
  }
};
