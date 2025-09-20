"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, BookOpen } from "lucide-react";
import { getEventById } from "@/redux/features/eventSlice";
import { getQuizzesByEventId } from "@/redux/features/quizSlice";
import { AppDispatch, RootState } from "@/store/store";
import ParticipateQuiz from "@/app/components/shared/ParticipateQuiz";

export default function QuizzesBasedOnEvent() {
  const params = useParams();
  const eventId = params.eventId as string;

  const dispatch = useDispatch<AppDispatch>();

  // Selectors for event and quizzes
  const {
    selectedEvent: event,
    loading: eventLoading,
    error: eventError,
  } = useSelector((state: RootState) => state.events);
  const {
    quizzes,
    loading: quizzesLoading,
    error: quizzesError,
  } = useSelector((state: RootState) => state.quizzes);

  useEffect(() => {
    if (eventId) {
      console.log("Loading event and quizzes for eventId:", eventId);
      dispatch(getEventById(eventId));
      dispatch(getQuizzesByEventId(eventId));
    }
  }, [dispatch, eventId]);

  if (eventLoading || quizzesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (eventError || quizzesError) {
    console.error("Event or Quiz loading error:", { eventError, quizzesError });
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600">
          Error loading event or quizzes
        </h2>
        <p className="text-gray-600 mt-2">{eventError || quizzesError}</p>
        <p className="text-sm text-gray-500 mt-2">Event ID: {eventId}</p>
        <div className="mt-4">
          <button
            onClick={() => {
              console.log("Retrying event load...");
              dispatch(getEventById(eventId));
              dispatch(getQuizzesByEventId(eventId));
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Event not found</h2>
        <p className="text-gray-600 mt-2">
          The event you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Quizzes Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Quizzes</h2>
          {event.status === "ongoing" && <Button>Create New Quiz</Button>}
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold">No quizzes available</h3>
            <p className="text-gray-600 mt-2">
              There are no quizzes for this event yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {quizzes.map((quiz) => (
              <Card
                key={quiz._id}
                className="h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm group p-0"
              >
                {/* Header with gradient background */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>

                  {/* Quiz Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-2xl font-bold text-white line-clamp-2 mb-2">
                      {quiz.title}
                    </h3>
                    {quiz.instructions && (
                      <p className="text-white/90 text-sm line-clamp-2">
                        {quiz.instructions}
                      </p>
                    )}
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>

                  {/* Status indicator */}
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Duration */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {quiz.duration} Minutes
                        </p>
                        <p className="text-sm text-gray-600">Time limit</p>
                      </div>
                    </div>

                    {/* Total Marks */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {quiz.totalMarks} Total Marks
                        </p>
                        <p className="text-sm text-gray-600">Maximum score</p>
                      </div>
                    </div>

                    {/* Passing Marks */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {quiz.passingMarks} Passing Marks
                        </p>
                        <p className="text-sm text-gray-600">
                          Required to pass
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <ParticipateQuiz
                    quizId={quiz._id}
                    quizTitle={quiz.title}
                    duration={quiz.duration}
                    totalMarks={quiz.totalMarks}
                    passingMarks={quiz.passingMarks}
                    eventId={eventId}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
