
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { api } from "@/data/api";


export interface IQuiz {
  _id: string;
  title: string;
  eventId: string;
  event?: {
    _id: string;
    title: string;
  };
  duration: number;
  totalMarks: number;
  questions: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  passingMarks: number;
  instructions?: string;
}

export interface QuizState {
  quizzes: IQuiz[];
  quizForParticipation: any; 
  quizResult: any; 
  studentParticipations: any[]; 
  loading: boolean;
  error: string | null;
}


export const fetchQuizzes = createAsyncThunk<IQuiz[]>(
  "quizzes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api}/quizzes`);
      return res.data.data as IQuiz[];
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);


export const fetchQuizForParticipation = createAsyncThunk<any, string>(
  "quizzes/fetchForParticipation",
  async (quizId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api}/quizzes/${quizId}/participate`);
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);


export const submitQuizAnswers = createAsyncThunk<any, { quizId: string; answers: any[] }>(
  "quizzes/submit",
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${api}/quizzes/${quizId}/submit`, { answers });
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);


export const fetchQuizResult = createAsyncThunk<any, string>(
  "quizzes/fetchResult",
  async (participationId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api}/quizzes/result/${participationId}`);
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);


export const fetchStudentParticipations = createAsyncThunk<any[]>(
  "quizzes/fetchStudentParticipations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api}/quizzes/participations/mine`);
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);

export const createQuiz = createAsyncThunk<IQuiz, Partial<IQuiz>>(
  "quizzes/create",
  async (quizData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${api}/quizzes`, quizData);
      return res.data.data as IQuiz;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuiz = createAsyncThunk<IQuiz, { id: string; data: Partial<IQuiz> }>(
  "quizzes/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${api}/quizzes/${id}`, data);
      return res.data.data as IQuiz;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuiz = createAsyncThunk<string, string>(
  "quizzes/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${api}/quizzes/${id}`);
      return id;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);


const initialState: QuizState = {
  quizzes: [],
  quizForParticipation: null,
  quizResult: null,
  studentParticipations: [],
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    clearQuizForParticipation: (state) => {
      state.quizForParticipation = null;
    },
    clearQuizResult: (state) => {
      state.quizResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action: PayloadAction<IQuiz[]>) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(fetchQuizForParticipation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizForParticipation.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.quizForParticipation = action.payload;
      })
      .addCase(fetchQuizForParticipation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(submitQuizAnswers.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitQuizAnswers.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        
      })
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(fetchQuizResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizResult.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.quizResult = action.payload;
      })
      .addCase(fetchQuizResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(fetchStudentParticipations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentParticipations.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.studentParticipations = action.payload;
      })
      .addCase(fetchStudentParticipations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(createQuiz.fulfilled, (state, action: PayloadAction<IQuiz>) => {
        state.quizzes.push(action.payload);
      })
      
      
      .addCase(updateQuiz.fulfilled, (state, action: PayloadAction<IQuiz>) => {
        const index = state.quizzes.findIndex(quiz => quiz._id === action.payload._id);
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
      })
      
      
      .addCase(deleteQuiz.fulfilled, (state, action: PayloadAction<string>) => {
        state.quizzes = state.quizzes.filter(quiz => quiz._id !== action.payload);
      });
  },
});

export const { clearQuizForParticipation, clearQuizResult } = quizSlice.actions;
export default quizSlice.reducer;