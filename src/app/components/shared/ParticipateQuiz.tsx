"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  fetchQuestionsByQuizId,
  IQuestion,
} from "@/redux/features/questionSlice";
import {
  createParticipation,
  IAnswer,
  checkParticipation,
} from "@/redux/features/participationSlice";
import { addParticipant } from "@/redux/features/eventSlice";
import { AppDispatch, RootState } from "@/store/store";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  fetchUserProfile,
} from "@/redux/features/auth/authSlice";

interface ParticipateQuizProps {
  quizId: string;
  quizTitle: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  eventId?: string;
}

// Quiz state management with useReducer
interface QuizState {
  quizStarted: boolean;
  quizCompleted: boolean;
  answers: IAnswer[];
  currentQuestionIndex: number;
  timeLeft: number;
}

type QuizAction =
  | { type: "START_QUIZ"; payload: { answers: IAnswer[] } }
  | { type: "COMPLETE_QUIZ" }
  | {
      type: "UPDATE_ANSWER";
      payload: {
        questionId: string;
        selectedOption: string;
        isCorrect: boolean;
        marksObtained: number;
      };
    }
  | { type: "NEXT_QUESTION" }
  | { type: "PREV_QUESTION" }
  | { type: "UPDATE_TIME"; payload: number }
  | { type: "RESET_QUIZ"; payload: { duration: number } };

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case "START_QUIZ":
      return {
        ...state,
        quizStarted: true,
        quizCompleted: false,
        answers: action.payload.answers,
        currentQuestionIndex: 0,
      };
    case "COMPLETE_QUIZ":
      return {
        ...state,
        quizCompleted: true,
      };
    case "UPDATE_ANSWER":
      return {
        ...state,
        answers: state.answers.map((answer) =>
          answer.questionId === action.payload.questionId
            ? {
                ...answer,
                selectedOption: action.payload.selectedOption,
                isCorrect: action.payload.isCorrect,
                marksObtained: action.payload.marksObtained,
              }
            : answer
        ),
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };
    case "PREV_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex - 1,
      };
    case "UPDATE_TIME":
      return {
        ...state,
        timeLeft: action.payload,
      };
    case "RESET_QUIZ":
      return {
        quizStarted: false,
        quizCompleted: false,
        answers: [],
        currentQuestionIndex: 0,
        timeLeft: action.payload.duration * 60,
      };
    default:
      return state;
  }
};

export default function ParticipateQuiz({
  quizId,
  quizTitle,
  duration,
  totalMarks,
  passingMarks,
  eventId,
}: ParticipateQuizProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [hasParticipated, setHasParticipated] = useState(false);
  const [participationStatus, setParticipationStatus] = useState<
    "completed" | "failed" | "pending" | null
  >(null);
  const [isCheckingParticipation, setIsCheckingParticipation] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

  // Use useReducer for quiz state management
  const [quizState, dispatchQuiz] = useReducer(quizReducer, {
    quizStarted: false,
    quizCompleted: false,
    answers: [],
    currentQuestionIndex: 0,
    timeLeft: duration * 60,
  });

  // Destructure quiz state
  const {
    quizStarted,
    quizCompleted,
    answers,
    currentQuestionIndex,
    timeLeft,
  } = quizState;

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { questions, loading: questionsLoading } = useSelector(
    (state: RootState) => state.questions
  );
  // const { loading: participationLoading } = useSelector(
  //   (state: RootState) => state.participations
  // );
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthInitialized = useSelector(
    (state: RootState) => state.auth.isAuthInitialized
  );

  // Since we're now fetching questions for this specific quiz, we don't need to filter
  const quizQuestions = useMemo(() => questions || [], [questions]);

  // Reset isFetchingProfile when user data is available
  useEffect(() => {
    if (isFetchingProfile && currentUser && currentUser._id) {
      setIsFetchingProfile(false);
    }
  }, [isFetchingProfile, currentUser]);

  // Check if user has already participated in this quiz
  useEffect(() => {
    const checkParticipationStatus = async () => {
      if (isAuthenticated && currentUser && quizId) {
        const userId = currentUser?._id;
        if (userId) {
          setIsCheckingParticipation(true);
          try {
            const result = await dispatch(
              checkParticipation({ studentId: userId, quizId })
            ).unwrap();

            if (result.hasParticipated) {
              setHasParticipated(true);
              setParticipationStatus(result.status);
            } else {
              setHasParticipated(false);
              setParticipationStatus(null);
            }
          } catch (error) {
            console.error("Failed to check participation:", error);
            setHasParticipated(false);
            setParticipationStatus(null);
          } finally {
            setIsCheckingParticipation(false);
          }
        }
      } else {
        // Reset participation state if not authenticated
        setHasParticipated(false);
        setParticipationStatus(null);
      }
    };

    checkParticipationStatus();
  }, [isAuthenticated, currentUser, quizId, dispatch]);

  // Fetch questions for this specific quiz when the modal opens
  useEffect(() => {
    if (open && quizId) {
      dispatch(fetchQuestionsByQuizId(quizId));
    }
  }, [dispatch, open, quizId]);

  const calculateScore = useCallback(() => {
    return answers.reduce((total, answer) => total + answer.marksObtained, 0);
  }, [answers]);

  const handleSubmitQuiz = useCallback(async () => {
    if (isSubmitting) return;

    const userId = currentUser?._id;

    if (!currentUser || !currentUser._id) {
      toast.error("User information not available. Please log in again.");
      router.push("/auth");
      return;
    }

    setIsSubmitting(true);
    const totalScore = calculateScore();

    try {
      await dispatch(
        createParticipation({
          studentId: userId!,
          quizId,
          answers,
          totalScore,
          status: "pending", // Changed to pending for admin review
        })
      ).unwrap();

      dispatchQuiz({ type: "COMPLETE_QUIZ" });
      setHasParticipated(true);
      setParticipationStatus("pending");
      toast.success(
        "Quiz submitted successfully! Your result is pending admin review."
      );
    } catch (error: unknown) {
      console.error("Quiz submission error:", error);
      toast.error(
        (error as Error).message || "Failed to submit quiz. Please try again."
      );
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    currentUser,
    router,
    dispatch,
    quizId,
    answers,
    calculateScore,
  ]);

  const handleQuizFail = useCallback(async () => {
    const userId = currentUser?._id;

    if (!currentUser || !currentUser._id) {
      toast.error("User information not available. Please log in again.");
      router.push("/auth");
      return;
    }

    dispatchQuiz({ type: "COMPLETE_QUIZ" });

    // Create a failed participation record
    const failedAnswers: IAnswer[] = quizQuestions.map((question) => ({
      questionId: question._id,
      selectedOption: "",
      isCorrect: false,
      marksObtained: 0,
    }));

    try {
      await dispatch(
        createParticipation({
          studentId: userId!,
          quizId,
          answers: failedAnswers,
          totalScore: 0,
          status: "failed",
        })
      ).unwrap();

      setHasParticipated(true);
      setParticipationStatus("failed");
    } catch (error: unknown) {
      console.error("Failed to record failed participation:", error);
    }
  }, [currentUser, router, dispatch, quizId, quizQuestions]);

  // Define functions with useCallback
  const handleTimeUp = useCallback(() => {
    toast.error("Time is up! Submitting your quiz now.");
    handleSubmitQuiz();
  }, [handleSubmitQuiz]);

  const handleTabSwitchFail = useCallback(() => {
    toast.error(
      "You switched tabs during the quiz. This attempt is marked as failed."
    );
    handleQuizFail();
  }, [handleQuizFail]);

  const handleBackButtonFail = useCallback(() => {
    toast.error(
      "You pressed the back button during the quiz. This attempt is marked as failed."
    );
    handleQuizFail();
  }, [handleQuizFail]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (open && quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setTimeout(() => {
        dispatchQuiz({ type: "UPDATE_TIME", payload: timeLeft - 1 });
      }, 1000);
    } else if (timeLeft === 0 && !quizCompleted) {
      // Time's up, submit the quiz
      handleTimeUp();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [open, quizStarted, quizCompleted, timeLeft, handleTimeUp]);

  // Handle browser/tab change with stricter security
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && quizStarted && !quizCompleted) {
        setIsWarningVisible(true);
        // Immediate failure for any tab switch or browser change
        handleTabSwitchFail();
      } else {
        setIsWarningVisible(false);
      }
    };

    // Handle window blur (switching to other applications)
    const handleWindowBlur = () => {
      if (quizStarted && !quizCompleted) {
        handleTabSwitchFail();
      }
    };

    // Handle window focus loss
    const handleWindowFocus = () => {
      if (quizStarted && !quizCompleted) {
        // Check if user was away for too long
        handleTabSwitchFail();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [quizStarted, quizCompleted, handleTabSwitchFail]);

  // Handle back button with stricter prevention
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      if (quizStarted && !quizCompleted) {
        e.preventDefault();
        e.stopPropagation();
        handleBackButtonFail();
        return false;
      }
    };

    // Prevent back button navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (quizStarted && !quizCompleted) {
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? This will fail your quiz attempt.";
        handleBackButtonFail();
        return "Are you sure you want to leave? This will fail your quiz attempt.";
      }
    };

    // Disable right-click context menu during quiz
    const handleContextMenu = (e: MouseEvent) => {
      if (quizStarted && !quizCompleted) {
        e.preventDefault();
        handleBackButtonFail();
      }
    };

    // Disable F5, Ctrl+R, Ctrl+Shift+R refresh
    const handleKeyDown = (e: KeyboardEvent) => {
      if (quizStarted && !quizCompleted) {
        if (
          e.key === "F5" ||
          (e.ctrlKey && e.key === "r") ||
          (e.ctrlKey && e.shiftKey && e.key === "R")
        ) {
          e.preventDefault();
          handleBackButtonFail();
        }
      }
    };

    window.addEventListener("popstate", handleBackButton);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [quizStarted, quizCompleted, handleBackButtonFail]);

  const handleOpen = async () => {
    // Prevent multiple clicks while processing
    if (isFetchingProfile) {
      return;
    }

    // Check if auth is initialized first
    if (!isAuthInitialized) {
      toast.error("Please wait while we verify your authentication...");
      return;
    }

    // Check if user has a token in localStorage
    const hasToken = localStorage.getItem("token");
    if (!hasToken) {
      toast.error("Please login to participate in the quiz");
      router.push("/auth");
      return;
    }

    // If we have a token but no user data, try to fetch profile
    if (hasToken && (!currentUser || !currentUser._id)) {
      setIsFetchingProfile(true);
      try {
        await dispatch(fetchUserProfile()).unwrap();
        toast.info("Please try again. User data is being refreshed.");
        return;
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("User information not available. Please log in again.");
        router.push("/auth");
        return;
      } finally {
        setIsFetchingProfile(false);
      }
    }

    // Check if user data is available after potential fetch
    if (!currentUser || !currentUser._id) {
      toast.error("User information not available. Please log in again.");
      router.push("/auth");
      return;
    }

    // Check if user is authenticated (this should be true if we have user data)
    if (!isAuthenticated) {
      toast.error("Authentication error. Please log in again.");
      router.push("/auth");
      return;
    }

    if (currentUser.role !== "student") {
      toast.error("Only students can participate in quizzes");
      return;
    }

    if (hasParticipated) {
      toast.error(
        `You have already ${participationStatus} this quiz. You cannot retake it.`
      );
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    // Prevent closing dialog once quiz has started
    if (quizStarted && !quizCompleted) {
      // Do nothing - dialog cannot be closed during quiz
      return;
    } else {
      setOpen(false);
      resetQuizState();
    }
  };

  const startQuiz = async () => {
    // Initialize answers array first
    let initialAnswers: IAnswer[] = [];
    try {
      if (quizQuestions && quizQuestions.length > 0) {
        initialAnswers = quizQuestions.map((question) => ({
          questionId: question._id,
          selectedOption: "",
          isCorrect: false,
          marksObtained: 0,
        }));
      } else {
        initialAnswers = [];
      }
    } catch (error) {
      console.error("Failed to initialize answers:", error);
      initialAnswers = [];
    }

    // Add participant to event if eventId is provided
    if (eventId && currentUser?._id) {
      try {
        await dispatch(
          addParticipant({
            eventId,
            studentId: currentUser._id,
          })
        ).unwrap();
      } catch (error: unknown) {
        console.log("Add participant error:", error);
        // Always continue with quiz regardless of participant add result
        console.log("Continuing with quiz regardless of participant status");
        // Don't show error to user, just log it
      }
    }

    // Use reducer to start quiz
    dispatchQuiz({
      type: "START_QUIZ",
      payload: { answers: initialAnswers },
    });
  };

  const handleAnswerChange = (questionId: string, selectedOption: string) => {
    const question = quizQuestions.find((q: IQuestion) => q._id === questionId);
    if (!question) return;

    const isCorrect = selectedOption === question.correctAnswer;
    const marksObtained = isCorrect ? question.marks : 0;

    dispatchQuiz({
      type: "UPDATE_ANSWER",
      payload: { questionId, selectedOption, isCorrect, marksObtained },
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      dispatchQuiz({ type: "NEXT_QUESTION" });
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      dispatchQuiz({ type: "PREV_QUESTION" });
    }
  };

  const resetQuizState = () => {
    dispatchQuiz({ type: "RESET_QUIZ", payload: { duration } });
    setIsSubmitting(false);
    setIsWarningVisible(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress =
    quizQuestions.length > 0
      ? ((currentQuestionIndex + 1) / quizQuestions.length) * 100
      : 0;

  return (
    <>
      {hasParticipated ? (
        <div className="space-y-2">
          <Button
            onClick={handleOpen}
            className="w-full"
            disabled={
              isCheckingParticipation || !isAuthInitialized || isFetchingProfile
            }
          >
            {!isAuthInitialized ? (
              "Loading..."
            ) : isCheckingParticipation ? (
              "Checking..."
            ) : isFetchingProfile ? (
              "Fetching Profile..."
            ) : participationStatus === "completed" ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Quiz Completed
              </>
            ) : participationStatus === "pending" ? (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Result Pending
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Quiz Failed
              </>
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 border-0"
          >
            <Link href="/student/quiz">View Results</Link>
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleOpen}
          className="w-full"
          disabled={
            isCheckingParticipation || !isAuthInitialized || isFetchingProfile
          }
        >
          {!isAuthInitialized
            ? "Loading..."
            : isCheckingParticipation
            ? "Checking..."
            : isFetchingProfile
            ? "Fetching Profile..."
            : !isAuthenticated || !currentUser || !currentUser._id
            ? "Login to Take Quiz"
            : "Take Quiz"}
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className={`${
            quizStarted
              ? "max-w-full h-screen w-screen m-0 rounded-none"
              : "max-w-4xl h-[90vh]"
          } flex flex-col`}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{quizTitle}</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(timeLeft)}
                </Badge>
                <Badge variant="secondary">
                  {currentQuestionIndex + 1} / {quizQuestions.length}
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>

          {isWarningVisible && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Warning: Switching tabs or browsers will result in quiz
                    failure. Return to the quiz immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {questionsLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <div className="ml-4">Loading questions...</div>
            </div>
          ) : quizQuestions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No questions available
                </h3>
                <p className="text-gray-500">
                  This quiz doesn&apos;t have any questions yet.
                </p>
              </div>
              <Button
                onClick={() => {
                  setOpen(false);
                  resetQuizState();
                }}
              >
                Close
              </Button>
            </div>
          ) : !quizStarted ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Quiz Instructions</h2>
                <p className="text-gray-600">
                  Please read the instructions carefully before starting the
                  quiz.
                </p>
              </div>

              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Quiz Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Questions:</span>
                    <span>{quizQuestions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Marks:</span>
                    <span>{totalMarks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passing Marks:</span>
                    <span>{passingMarks}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 p-4 rounded-lg max-w-md">
                <h3 className="font-medium text-blue-800">
                  Important Instructions
                </h3>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li>• Do not switch tabs or browsers during the quiz</li>
                  <li>• Do not press the back button</li>
                  <li>• Do not close the browser window</li>
                  <li>• Any violation will result in quiz failure</li>
                  <li>• You cannot retake this quiz if you fail</li>
                </ul>
              </div>

              <Button onClick={startQuiz} size="lg">
                Start Quiz
              </Button>
            </div>
          ) : quizCompleted ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <h2 className="text-2xl font-bold flex items-center">
                {participationStatus === "completed" ? (
                  <>
                    <CheckCircle className="mr-2 h-6 w-6 text-green-600" />
                    Quiz Completed
                  </>
                ) : participationStatus === "pending" ? (
                  <>
                    <Clock className="mr-2 h-6 w-6 text-yellow-600" />
                    Result Pending
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-6 w-6 text-red-600" />
                    Quiz Failed
                  </>
                )}
              </h2>
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Score:</span>
                    <span className="font-bold">
                      {calculateScore()} / {totalMarks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Correct Answers:</span>
                    <span>
                      {answers.filter((a) => a.isCorrect).length} /{" "}
                      {quizQuestions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Result:</span>
                    <span
                      className={`font-bold ${
                        calculateScore() >= passingMarks
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {calculateScore() >= passingMarks ? "Passed" : "Failed"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge
                      variant={
                        participationStatus === "completed"
                          ? "default"
                          : participationStatus === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {participationStatus === "completed"
                        ? "Completed"
                        : participationStatus === "pending"
                        ? "Pending Review"
                        : "Failed"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => {
                  setOpen(false);
                  resetQuizState();
                }}
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <Progress value={progress} className="mb-4" />

              <Card className="flex-1 mb-4">
                <CardHeader>
                  <CardTitle>
                    Question {currentQuestionIndex + 1}: {currentQuestion?.text}
                  </CardTitle>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Marks: {currentQuestion?.marks}</span>
                    <span>Difficulty: {currentQuestion?.difficulty}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={
                      answers.find((a) => a.questionId === currentQuestion?._id)
                        ?.selectedOption || ""
                    }
                    onValueChange={(value) =>
                      handleAnswerChange(currentQuestion?._id || "", value)
                    }
                  >
                    {currentQuestion?.options?.map(
                      (option: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`option-${index}`}
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      )
                    )}
                  </RadioGroup>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                {currentQuestionIndex === quizQuestions.length - 1 ? (
                  <Button onClick={handleSubmitQuiz} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>Next</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
