
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { api } from "@/data/api";


export interface IEvent {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  quizzes: string[];
  participants: string[]; 
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface EventState {
  events: IEvent[];
  activeEvents: IEvent[]; 
  registeredEvents: IEvent[]; 
  eventQuizzes: any[]; 
  eventResults: any[]; 
  loading: boolean;
  error: string | null;
}


export const fetchEvents = createAsyncThunk<IEvent[]>(
  "events/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api}/events`);
      return res.data.data as IEvent[];
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);


export const fetchActiveEvents = createAsyncThunk<IEvent[]>(
  "events/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api}/events/active`);
      return res.data.data as IEvent[];
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);


export const registerForEvent = createAsyncThunk<string, string>(
  "events/register",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${api}/events/${eventId}/register`);
      return res.data.message;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);


export const fetchRegisteredEvents = createAsyncThunk<IEvent[]>(
  "events/fetchRegistered",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api}/events/registered`);
      return res.data.data as IEvent[];
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);


export const fetchEventQuizzes = createAsyncThunk<any[], string>(
  "events/fetchQuizzes",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api}/events/${eventId}/quizzes`);
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);


export const fetchEventResults = createAsyncThunk<any[], string>(
  "events/fetchResults",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api}/events/${eventId}/results`);
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);

export const createEvent = createAsyncThunk<IEvent, Partial<IEvent>>(
  "events/create",
  async (eventData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${api}/events`, eventData);
      return res.data.data as IEvent;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);

export const updateEvent = createAsyncThunk<IEvent, { id: string; data: Partial<IEvent> }>(
  "events/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${api}/events/${id}`, data);
      return res.data.data as IEvent;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEvent = createAsyncThunk<string, string>(
  "events/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${api}/events/${id}`);
      return id;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);


const initialState: EventState = {
  events: [],
  activeEvents: [],
  registeredEvents: [],
  eventQuizzes: [],
  eventResults: [],
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEventQuizzes: (state) => {
      state.eventQuizzes = [];
    },
    clearEventResults: (state) => {
      state.eventResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<IEvent[]>) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(fetchActiveEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveEvents.fulfilled, (state, action: PayloadAction<IEvent[]>) => {
        state.loading = false;
        state.activeEvents = action.payload;
      })
      .addCase(fetchActiveEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(registerForEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerForEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(fetchRegisteredEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegisteredEvents.fulfilled, (state, action: PayloadAction<IEvent[]>) => {
        state.loading = false;
        state.registeredEvents = action.payload;
      })
      .addCase(fetchRegisteredEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(fetchEventQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventQuizzes.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.eventQuizzes = action.payload;
      })
      .addCase(fetchEventQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(fetchEventResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventResults.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.eventResults = action.payload;
      })
      .addCase(fetchEventResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<IEvent>) => {
        state.events.push(action.payload);
      })
      
      
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<IEvent>) => {
        const index = state.events.findIndex(event => event._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      
      
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.events = state.events.filter(event => event._id !== action.payload);
      });
  },
});

export const { clearEventQuizzes, clearEventResults } = eventSlice.actions;
export default eventSlice.reducer;