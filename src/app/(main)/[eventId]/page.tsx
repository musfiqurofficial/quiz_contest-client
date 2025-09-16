"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { 
  fetchEventQuizzes, 
  registerForEvent, 
  fetchRegisteredEvents 
} from '@/redux/features/eventSlice';
import { 
  fetchQuizForParticipation, 
  clearQuizForParticipation,
  clearQuizResult 
} from '@/redux/features/quizSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarDays, 
  Clock, 
  Users, 
  BookOpen, 
  Trophy,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { RootState } from '@/store/store';

const EventDetailsAndRegisterPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId;
  
  const { 
    events, 
    registeredEvents, 
    eventQuizzes, 
    loading: eventLoading, 
    error: eventError 
  } = useSelector((state: RootState) => state.events);
  
  const { 
    quizForParticipation, 
    quizResult, 
    loading: quizLoading 
  } = useSelector((state: RootState) => state.quiz);
  
  const [activeTab, setActiveTab] = useState('details');
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const event = events.find(e => e._id === eventId);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventQuizzes(eventId));
      dispatch(fetchRegisteredEvents());
    }
    
    return () => {
      dispatch(clearQuizForParticipation());
      dispatch(clearQuizResult());
    };
  }, [dispatch, eventId]);

  useEffect(() => {
    if (registeredEvents.length > 0 && event) {
      const registered = registeredEvents.some(e => e._id === event._id);
      setIsRegistered(registered);
    }
  }, [registeredEvents, event]);

  const handleRegister = async () => {
    if (!event) return;
    
    setRegistrationLoading(true);
    setRegistrationMessage(null);
    
    try {
      await dispatch(registerForEvent(event._id)).unwrap();
      setIsRegistered(true);
      setRegistrationMessage({ type: 'success', message: 'Successfully registered for the event!' });
      dispatch(fetchRegisteredEvents());
    } catch (error) {
      setRegistrationMessage({ type: 'error', message: 'Failed to register for the event. Please try again.' });
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleParticipateInQuiz = async (quizId: string) => {
    try {
      await dispatch(fetchQuizForParticipation(quizId)).unwrap();
      setActiveTab('quiz');
    } catch (error) {
      console.error('Error fetching quiz for participation:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const goBack = () => {
    router.back();
  };

  if (eventLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">Error loading event</h3>
          <p className="mt-2 text-sm text-gray-500">{eventError || 'Event not found'}</p>
          <Button onClick={goBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={goBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                  <Badge className={`ml-3 ${getStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {event.description || "No description available"}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                {isRegistered ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="h-5 w-5 mr-1" />
                    <span>Registered</span>
                  </div>
                ) : (
                  <Button 
                    onClick={handleRegister}
                    disabled={registrationLoading}
                  >
                    {registrationLoading ? 'Registering...' : 'Register for Event'}
                  </Button>
                )}
              </div>
            </div>
            
            {registrationMessage && (
              <div className={`mt-4 p-3 rounded-md ${registrationMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <div className="flex">
                  {registrationMessage.type === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  <span>{registrationMessage.message}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50">
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDays className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Start Date</p>
                <p>{format(new Date(event.startDate), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDays className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">End Date</p>
                <p>{format(new Date(event.endDate), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Participants</p>
                <p>{event.participants?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="quizzes" disabled={!isRegistered}>Quizzes</TabsTrigger>
            <TabsTrigger value="quiz" disabled={!quizForParticipation}>Take Quiz</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {event.description || "No detailed description available for this event."}
                </p>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Event Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <CalendarDays className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Duration</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(event.startDate), 'MMM dd, yyyy')} - {format(new Date(event.endDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Status</p>
                        <p className="text-sm text-gray-500">
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BookOpen className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Available Quizzes</p>
                        <p className="text-sm text-gray-500">{event.quizzes?.length || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Participants</p>
                        <p className="text-sm text-gray-500">{event.participants?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quizzes" className="mt-6">
            {!isRegistered ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-10">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Registration Required</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You need to register for this event before you can access the quizzes.
                    </p>
                    <Button onClick={handleRegister} className="mt-4">
                      Register Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : eventQuizzes.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-10">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Quizzes Available</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      There are no quizzes available for this event at the moment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {eventQuizzes.map((quiz) => (
                  <Card key={quiz._id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                          {quiz.title}
                        </CardTitle>
                        <Badge className={quiz.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {quiz.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardDescription>
                        {quiz.instructions || "No instructions provided"}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Duration: {quiz.duration} minutes</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Trophy className="h-4 w-4 mr-2" />
                          <span>Total Marks: {quiz.totalMarks}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span>Questions: {quiz.questions?.length || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-3">
                      <Button 
                        onClick={() => handleParticipateInQuiz(quiz._id)}
                        disabled={!quiz.isActive}
                        className="w-full"
                      >
                        {quiz.isActive ? 'Start Quiz' : 'Not Available'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="quiz" className="mt-6">
            {!quizForParticipation ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-10">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Quiz Selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Please select a quiz from the Quizzes tab to participate.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : quizLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <QuizParticipation 
                quiz={quizForParticipation} 
                onQuizComplete={() => setActiveTab('quizzes')} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Quiz Participation Component
const QuizParticipation = ({ quiz, onQuizComplete }) => {
  const dispatch = useDispatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft]);

  const handleAnswerSelect = (questionId, selectedOption) => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex !== -1) {
      newAnswers[existingAnswerIndex] = { questionId, selectedOption };
    } else {
      newAnswers.push({ questionId, selectedOption });
    }
    
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const result = await dispatch(submitQuizAnswers({ 
        quizId: quiz._id, 
        answers 
      })).unwrap();
      
      setQuizResult(result);
      setQuizSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion._id);

  if (quizSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-green-600">Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {quizResult?.totalScore || 0}/{quiz.totalMarks}
            </div>
            <div className="text-lg text-gray-600 mb-6">
              {quizResult?.totalScore >= quiz.passingMarks ? (
                <span className="text-green-600">Congratulations! You passed the quiz.</span>
              ) : (
                <span className="text-red-600">You didn't pass the quiz. Try again!</span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Correct Answers</p>
                <p className="text-xl font-bold">
                  {quizResult?.answers?.filter(a => a.isCorrect).length || 0}/{quiz.questions.length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Passing Marks</p>
                <p className="text-xl font-bold">{quiz.passingMarks}</p>
              </div>
            </div>
            
            <Button onClick={onQuizComplete} className="mt-4">
              Back to Quizzes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{quiz.title}</CardTitle>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-1" />
            <span className={`font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {currentQuestion.text}
          </h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  currentAnswer?.selectedOption === option 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    currentAnswer?.selectedOption === option 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {currentAnswer?.selectedOption === option && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmitQuiz}>
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDetailsAndRegisterPage;