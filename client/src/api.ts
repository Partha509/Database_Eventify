import axios, { AxiosInstance } from "axios";
import { secrets } from "./secrets";
import toast from "react-hot-toast";

export interface User {
  id?: number;
  user_name?: string;
  email: string;
  phone?: string;
  password?: string;
  token?: string;
}

export interface Event {
  event_id?: number;
  event_name: string;
  description: string;
  start_date_time: string;
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null;

  constructor() {
    this.token = localStorage.getItem("token");

    this.client = axios.create({
      baseURL: secrets.backendEndpoint,
      headers: { "Content-Type": "application/json" },
    });

    if (this.token) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    }
  }

  
  setToken(token: string) {
    this.token = token;

    localStorage.setItem("token", token);

    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // --------- AUTH ---------
  
  async register(fullName: string, email: string, phone: string, password: string) {

  try {

    const response = await this.client.post("/api/register", {
      user_name: fullName,
      email,
      phone,
      password_hash: password
    });

    return response.data;

  } catch (error) {

    this.handleError(error);
    throw error;

  }

}


 async login(email: string, password: string): Promise<User | undefined> {
  try {

    const response = await this.client.post("/api/login", { email, password });

    const token = response.data.token;

    if (token) {
      this.setToken(token);
    }

    toast.success("Login successful");

    return response.data;

  } catch (error) {
    this.handleError(error);
  }
 }

  async logout() {
    try {
      const response = await this.client.post("/api/logout");

      this.token = null;

      localStorage.removeItem("token");

      delete this.client.defaults.headers.common["Authorization"];

      toast.success("Logged out successfully");

      return response.data;

    } catch (error) {
      this.handleError(error);
    }
  }

  // --------- USER ---------

 async getProfile(): Promise<User | undefined> {
  try {
    // We use this.client.get because it already has the 
    // Authorization header set up in the constructor/setToken
    const response = await this.client.get("/api/profile");
    return response.data;
  } catch (error) {
    this.handleError(error);
  }
 }

  // --------- EVENTS ---------

  async getEvents(): Promise<Event[] | undefined> {
    try {
      const response = await this.client.get("/api/events");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getEvent(id: number): Promise<Event | undefined> {
    try {
      const response = await this.client.get(`/api/events/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createEvent(event_name: string, description: string, start_date_time: string) {
    try {
      const response = await this.client.post("/api/events", {
        event_name,
        description,
        start_date_time
      });

      toast.success("Event created successfully");

      return response.data;

    } catch (error) {
      this.handleError(error);
    }
  }

  // --------- ERROR HANDLING ---------

  private handleError(error: any) {

  if (error.response) {

    const message =
      error.response.data?.message ||
      error.response.data?.error ||
      "Server error";

    console.error("API Error:", message);

    toast.error(message);

  }
  else if (error.request) {

    console.error("No response from server", error.request);

    toast.error("Server not responding. Check Laravel server.");

  }
  else {

    console.error("Request Error:", error.message);

    toast.error(error.message);
  }

 }

 // --------- AI CHATBOT ---------
  
  // sending user text to our laravel backend which then talks to gemini
  async chatWithAI(message: string): Promise<{ reply: string } | undefined> {
    try {
      const response = await this.client.post("/api/chat", { message });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // --------- AI EVENT GENERATOR ---------
  
  async generateEvent(keywords: string): Promise<{ title: string, description: string, tags: string } | undefined> {
    try {
      const response = await this.client.post("/api/generate-event", { keywords });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default ApiClient;