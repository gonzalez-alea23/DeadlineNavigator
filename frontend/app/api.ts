import { supabase } from "./supabaseClient";
export type Assignment = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
  tag_color: string;
  user_id: number;
  course_id: number | null;
  course_name?: string | null;
  score: number | null;
  score_total?: number | null;
  difficulty: number | null;
};

export type RegisterPayload = {
  email: string;
  username: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  email?: string;
  username: string;
};

export type RegisterResponse = {
  message: string;
  user: AuthUser;
};

export type LoginResponse = {
  message: string;
  user: AuthUser;
};

export type AssignmentCreatePayload = {
  title: string;
  description: string;
  deadline: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
  tag_color?: string;
  user_id: number;
  course_id?: number | null;
  course_name?: string | null;
  score?: number | null;
  score_total?: number | null;
  difficulty?: number | null;
};

export type AssignmentUpdatePayload = AssignmentCreatePayload;

export type PrioritySummaryItem = {
  priority: string;
  count: number;
};

export type UpcomingDeadlineItem = {
  id: number;
  title: string;
  course_name: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE" | string;
  deadline: string;
  days_remaining: number;
};

export type TaskInsightsResponse = {
  user_id: number;
  generated_at: string;
  priority_counts: Record<string, number>;
  priority_summary: PrioritySummaryItem[];
  upcoming_total: number;
  upcoming_deadlines: UpcomingDeadlineItem[];
};

export type NotificationSettings = {
  user_id: number;
  email_enabled: boolean;
  reminder_days: number[];
  updated_at: string;
};

export type NotificationSettingsUpdatePayload = {
  email_enabled: boolean;
  reminder_days: number[];
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000"
).replace(/\/$/, "");

async function parseApiError(response: Response) {
  try {
    const errorData = await response.json();
    if (typeof errorData?.detail === "string") {
      return errorData.detail;
    }
  } catch {
    return `Request failed: ${response.status}`;
  }

  return `Request failed: ${response.status}`;
}

export const authAPI = {
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error(
        `Cannot connect to backend API at ${API_BASE_URL}. Please ensure backend is running and CORS allows this frontend origin.`,
      );
    }

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return response.json();
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error(
        `Cannot connect to backend API at ${API_BASE_URL}. Please ensure backend is running and CORS allows this frontend origin.`,
      );
    }

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return response.json();
  },
};

export const assignmentAPI = {
  // 1. GET ALL ASSIGNMENTS (With automatic sorting by closest deadline!)
  async getAll(): Promise<Assignment[]> {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("User not logged in");
    }

    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      // Only get assignments belonging to the logged-in student
      .eq("user_id", userId) 
      // Teacher Requirement: Sort them automatically so closest deadlines are at the top!
      .order("due_date", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch assignments: ${error.message}`);
    }

    return (data || []) as unknown as Assignment[];
  },

  // 2. CREATE A NEW ASSIGNMENT
  async create(payload: AssignmentCreatePayload): Promise<Assignment> {
    const userId = localStorage.getItem("userId");
    
    const { data, error } = await supabase
      .from("assignments")
      .insert([
        {
          title: payload.title,
          class_name: payload.course_name || "General",
          due_date: payload.deadline,
          is_completed: false,
          user_id: userId
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create assignment: ${error.message}`);
    }

    return data as unknown as Assignment;
  },

  // 3. GET A SINGLE ASSIGNMENT BY ID
  async getById(id: number): Promise<Assignment> {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Failed to get assignment: ${error.message}`);
    }

    return data as unknown as Assignment;
  },

  // 4. UPDATE AN ASSIGNMENT (Editing title, date, etc.)
  async updateAssignment(id: number, payload: AssignmentUpdatePayload): Promise<Assignment> {
    const { data, error } = await supabase
      .from("assignments")
      .update({
        title: payload.title,
        class_name: payload.course_name,
        due_date: payload.deadline
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update assignment: ${error.message}`);
    }

    return data as unknown as Assignment;
  },

  // 5. UPDATE STATUS (Checking / Unchecking the task box)
  async updateStatus(id: number, status: Assignment["status"]): Promise<Assignment> {
    const completedStates = ["COMPLETED", "DONE"];
    const isCompleted = completedStates.includes(status.toUpperCase());

    const { data, error } = await supabase
      .from("assignments")
      .update({ is_completed: isCompleted })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update status: ${error.message}`);
    }

    return data as unknown as Assignment;
  },

  // 6. DELETE AN ASSIGNMENT
  async deleteAssignment(id: number): Promise<{ message: string }> {
    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete assignment: ${error.message}`);
    }

    return { message: "Assignment deleted successfully" };
  },
};

export const statisticsAPI = {
  async getTaskInsights(userId?: string | number): Promise<TaskInsightsResponse> {
    const resolvedUserId =
      userId ?? window.localStorage.getItem("userId");

    if (!resolvedUserId) {
      throw new Error("User not logged in");
    }

    const response = await fetch(
      `${API_BASE_URL}/statistics/task-insights?user_id=${resolvedUserId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return response.json();
  },
};

export const notificationAPI = {
  async getSettings(userId?: string | number): Promise<NotificationSettings> {
    const resolvedUserId = userId ?? window.localStorage.getItem("userId");
    if (!resolvedUserId) {
      throw new Error("User not logged in");
    }

    const response = await fetch(
      `${API_BASE_URL}/notification-settings?user_id=${resolvedUserId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return response.json();
  },

  async updateSettings(
    payload: NotificationSettingsUpdatePayload,
    userId?: string | number,
  ): Promise<NotificationSettings> {
    const resolvedUserId = userId ?? window.localStorage.getItem("userId");
    if (!resolvedUserId) {
      throw new Error("User not logged in");
    }

    const response = await fetch(
      `${API_BASE_URL}/notification-settings?user_id=${resolvedUserId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return response.json();
  },
};

export const googleCalendarAPI = {
  async getConnectUrl(userId: number): Promise<{ url: string }> {
    const response = await fetch(`${API_BASE_URL}/integrations/google-calendar/connect-url?user_id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return response.json();
  },

  async exchangeCode(userId: number, code: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/integrations/google-calendar/exchange-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, code }),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return response.json();
  },

  async syncAll(userId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/integrations/google-calendar/sync-all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return response.json();
  },

  async disconnect(userId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/integrations/google-calendar/disconnect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return response.json();
  },
};
