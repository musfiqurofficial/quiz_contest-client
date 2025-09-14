import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, FileText, BarChart3 } from "lucide-react";
import { IEvent } from "@/redux/features/eventSlice";
import { IQuiz } from "@/redux/features/quizSlice";
import { IQuestion } from "@/redux/features/questionSlice";

interface StatsTabProps {
  events: IEvent[];
  quizzes: IQuiz[];
  questions: IQuestion[];
}

const StatsTab: React.FC<StatsTabProps> = ({ events, quizzes, questions }) => {
  const getEventStatus = (event: IEvent) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (now < startDate) return "upcoming";
    if (now > endDate) return "completed";
    return "ongoing";
  };

  // Stats calculations
  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.isActive).length;
  const totalQuizzes = quizzes.length;
  const activeQuizzes = quizzes.filter((q) => q.isActive).length;
  const totalQuestions = questions.length;
  const easyQuestions = questions.filter((q) => q.difficulty === "easy").length;
  const mediumQuestions = questions.filter(
    (q) => q.difficulty === "medium"
  ).length;
  const hardQuestions = questions.filter((q) => q.difficulty === "hard").length;

const upcomingEvents = [...events]
  .filter((event) => getEventStatus(event) === "upcoming")
  .sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )
  .slice(0, 3);

const recentQuizzes = [...quizzes]
  .sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  })
  .slice(0, 3);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {activeEvents} active events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">
              {activeQuizzes} active quizzes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Questions
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
            <p className="text-xs text-muted-foreground">
              {easyQuestions} easy, {mediumQuestions} medium, {hardQuestions}{" "}
              hard
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Events that are scheduled to start soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No upcoming events
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {getEventStatus(event) === "upcoming"
                        ? "Upcoming"
                        : "Ongoing"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quizzes</CardTitle>
            <CardDescription>Recently created quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            {recentQuizzes.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No quizzes yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentQuizzes.map((quiz) => {
                  const event = events.find((e) => e._id === quiz.eventId);
                  return (
                    <div
                      key={quiz._id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{quiz.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event?.title || "Unknown Event"}
                        </p>
                      </div>
                      <Badge variant={quiz.isActive ? "default" : "secondary"}>
                        {quiz.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StatsTab;
