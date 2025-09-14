import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@/data/api";

// Types
export interface IAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  marksObtained: number;
}

export interface IParticipation {
  _id: string;
  studentId: string;
  quizId: string;
  answers: IAnswer[];
  totalScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipationState {
  participations: IParticipation[];
  loading: boolean;
  error: string | null;
}

// Async thunks
export const fetchParticipations = createAsyncThunk<IParticipation[]>(
  "participations/fetchAll",
  async () => {
    const res = await axios.get(`${api}/participations`);
    return res.data.data as IParticipation[];
  }
);

export const createParticipation = createAsyncThunk<
  IParticipation,
  Partial<IParticipation>
>("participations/create", async (participationData) => {
  const res = await axios.post(`${api}/participations`, participationData);
  return res.data.data as IParticipation;
});

// Slice
const initialState: ParticipationState = {
  participations: [],
  loading: false,
  error: null,
};

const participationSlice = createSlice({
  name: "participations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParticipations.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchParticipations.fulfilled,
        (state, action: PayloadAction<IParticipation[]>) => {
          state.loading = false;
          state.participations = action.payload;
        }
      )
      .addCase(fetchParticipations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching participations";
      })
      .addCase(
        createParticipation.fulfilled,
        (state, action: PayloadAction<IParticipation>) => {
          state.participations.push(action.payload);
        }
      );
  },
});

export default participationSlice.reducer;
