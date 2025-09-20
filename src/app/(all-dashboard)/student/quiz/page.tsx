"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchParticipations } from "@/redux/features/participationSlice";
import { getQuizzes } from "@/redux/features/quizSlice";
import { getEvents } from "@/redux/features/eventSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Clock,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  ClockIcon,
  Star,
  Target,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const QuizPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { participations, loading, error } = useSelector(
    (state: RootState) => state.participations
  );
  const { quizzes } = useSelector((state: RootState) => state.quizzes);
  const { events } = useSelector((state: RootState) => state.events);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchParticipations());
      dispatch(getQuizzes());
      dispatch(getEvents());
    }
  }, [dispatch, currentUser]);

  // Filter participations for current user
  const userParticipations = useMemo(() => {
    if (!currentUser?._id) return [];
    return participations.filter((p) => p.studentId === currentUser._id);
  }, [participations, currentUser]);

  // Create enriched participation data with quiz and event details
  const enrichedParticipations = useMemo(() => {
    return userParticipations.map((participation) => {
      const quiz = quizzes.find((q) => q._id === participation.quizId);
      const event = events.find((e) => e._id === quiz?.eventId);

      return {
        ...participation,
        quiz,
        event,
        percentage: quiz
          ? Math.round((participation.totalScore / quiz.totalMarks) * 100)
          : 0,
        passed: quiz ? participation.totalScore >= quiz.passingMarks : false,
      };
    });
  }, [userParticipations, quizzes, events]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg">
          <p>Error loading participations: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          My Quiz Results
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          View your quiz participation history and performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {enrichedParticipations.length}
                </p>
                <p className="text-blue-700">Total Quizzes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {enrichedParticipations.filter((p) => p.passed).length}
                </p>
                <p className="text-green-700">Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {enrichedParticipations.length > 0
                    ? Math.round(
                        enrichedParticipations.reduce(
                          (acc, p) => acc + p.percentage,
                          0
                        ) / enrichedParticipations.length
                      )
                    : 0}
                  %
                </p>
                <p className="text-purple-700">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participations List */}
      {enrichedParticipations.length === 0 ? (
        <div className="text-center p-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            No Quiz Results
          </h3>
          <p className="text-lg text-gray-600 mb-4">
            You haven&apos;t participated in any quizzes yet.
          </p>
          <p className="text-muted-foreground">
            Start participating in events to see your results here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrichedParticipations.map((participation) => (
            <Card
              key={participation._id}
              className="overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
            >
              {/* Header with gradient background */}
              <div className="relative h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge
                    className={`${
                      participation.passed
                        ? "bg-green-500 hover:bg-green-600"
                        : participation.status === "pending"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white font-semibold px-3 py-1 shadow-lg`}
                  >
                    {participation.passed ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Passed
                      </>
                    ) : participation.status === "pending" ? (
                      <>
                        <ClockIcon className="w-3 h-3 mr-1" />
                        Pending
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Failed
                      </>
                    )}
                  </Badge>
                </div>

                {/* Quiz Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-xl font-bold text-white line-clamp-2 mb-1">
                    {participation.quiz?.title || "Quiz Not Found"}
                  </h3>
                  {participation.event && (
                    <p className="text-white/90 text-sm line-clamp-1">
                      {participation.event.title}
                    </p>
                  )}
                </div>

                {/* Score Circle */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-white font-bold text-lg">
                      {participation.percentage}%
                    </div>
                    <div className="text-white/80 text-xs">Score</div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Score Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">
                        Your Score
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {participation.totalScore}
                      </p>
                      <p className="text-sm text-gray-600">
                        / {participation.quiz?.totalMarks || 0} marks
                      </p>
                    </div>
                  </div>

                  {/* Passing Marks */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-gray-900">
                        Passing Marks
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">
                        {participation.quiz?.passingMarks || 0}
                      </p>
                      <p className="text-sm text-gray-600">Required</p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600">
                      Duration: {participation.quiz?.duration || 0} minutes
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600">
                      Completed:{" "}
                      {format(
                        new Date(participation.createdAt),
                        "MMM dd, yyyy h:mm a"
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardHeader className="p-6 pt-0">
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/${participation.event?._id}`}>
                      View Event
                    </Link>
                  </Button>
                  {participation.passed && (
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                      <Trophy className="w-4 h-4 mr-2" />
                      Certificate
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
