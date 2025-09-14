// D:\PersonalClientWork\quiz-contest\quiz-contest-fr\src\redux\features\questionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@/data/api";

// Types
export interface IQuestion {
  _id: string;
  quizId: string;
  text: string;
  options: string[];
  correctAnswer: string;
  marks: number;
  difficulty: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionState {
  questions: IQuestion[];
  loading: boolean;
  error: string | null;
}

// Async thunks
export const fetchQuestions = createAsyncThunk<IQuestion[]>(
  "questions/fetchAll",
  async () => {
    const res = await axios.get(`${api}/questions`);
    return res.data.data as IQuestion[];
  }
);

export const createQuestion = createAsyncThunk<IQuestion, Partial<IQuestion>>(
  "questions/create",
  async (questionData) => {
    const res = await axios.post(`${api}/questions`, questionData);
    return res.data.data as IQuestion;
  }
);

export const updateQuestion = createAsyncThunk<IQuestion, { id: string; data: Partial<IQuestion> }>(
  "questions/update",
  async ({ id, data }) => {
    const res = await axios.put(`${api}/questions/${id}`, data);
    return res.data.data as IQuestion;
  }
);

export const deleteQuestion = createAsyncThunk<string, string>(
  "questions/delete",
  async (id) => {
    await axios.delete(`${api}/questions/${id}`);
    return id;
  }
);

// Slice
const initialState: QuestionState = {
  questions: [],
  loading: false,
  error: null,
};

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestions.fulfilled, (state, action: PayloadAction<IQuestion[]>) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching questions";
      })
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(createQuestion.fulfilled, (state, action: PayloadAction<IQuestion>) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error creating question";
      })
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuestion.fulfilled, (state, action: PayloadAction<IQuestion>) => {
        state.loading = false;
        const index = state.questions.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error updating question";
      })
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteQuestion.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.questions = state.questions.filter(q => q._id !== action.payload);
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error deleting question";
      });
  },
});

export default questionSlice.reducer;