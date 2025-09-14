'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  IEvent,
} from '@/redux/features/eventSlice';
import {
  fetchQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  IQuiz,
} from '@/redux/features/quizSlice';
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  IQuestion,
} from '@/redux/features/questionSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import EventsTab from '../_components/EventsTab';
import QuizzesTab from '../_components/QuizzesTab';
import QuestionsTab from '../_components/QuestionsTab';
import StatsTab from '../_components/StatsTab';

const AdminQuizManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, loading: eventsLoading } = useSelector((state: RootState) => state.events);
  const { quizzes, loading: quizzesLoading } = useSelector((state: RootState) => state.quizzes);
  const { questions, loading: questionsLoading } = useSelector((state: RootState) => state.questions);
  
  const [newEvent, setNewEvent] = useState<Partial<IEvent>>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });
  
  const [newQuiz, setNewQuiz] = useState<Partial<IQuiz>>({
    title: '',
    eventId: '',
    duration: 30,
    totalMarks: 0,
    passingMarks: 0,
    instructions: '',
    isActive: true,
  });
  
  const [newQuestion, setNewQuestion] = useState<Partial<IQuestion>>({
    quizId: '',
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    marks: 1,
    difficulty: 'medium',
  });
  
  const [activeTab, setActiveTab] = useState('events');
  const [editItem, setEditItem] = useState<{type: string, data: any} | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{type: string, id: string} | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      await Promise.all([
        dispatch(fetchEvents()),
        dispatch(fetchQuizzes()),
        dispatch(fetchQuestions()),
      ]);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleCreateEvent = async () => {
    try {
      await dispatch(createEvent(newEvent)).unwrap();
      toast.success('Event created successfully');
      setNewEvent({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        isActive: true,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    }
  };

  const handleCreateQuiz = async () => {
    try {
      await dispatch(createQuiz(newQuiz)).unwrap();
      toast.success('Quiz created successfully');
      setNewQuiz({
        title: '',
        eventId: '',
        duration: 30,
        totalMarks: 0,
        passingMarks: 0,
        instructions: '',
        isActive: true,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create quiz');
    }
  };

  const handleCreateQuestion = async () => {
    try {
      await dispatch(createQuestion(newQuestion)).unwrap();
      toast.success('Question created successfully');
      setNewQuestion({
        quizId: '',
        text: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        marks: 1,
        difficulty: 'medium',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create question');
    }
  };

  const handleUpdateEvent = async () => {
    if (!editItem) return;
    try {
      await dispatch(updateEvent({ id: editItem.data._id, data: editItem.data })).unwrap();
      toast.success('Event updated successfully');
      setEditItem(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update event');
    }
  };

  const handleUpdateQuiz = async () => {
    if (!editItem) return;
    try {
      await dispatch(updateQuiz({ id: editItem.data._id, data: editItem.data })).unwrap();
      toast.success('Quiz updated successfully');
      setEditItem(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quiz');
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editItem) return;
    try {
      await dispatch(updateQuestion({ id: editItem.data._id, data: editItem.data })).unwrap();
      toast.success('Question updated successfully');
      setEditItem(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update question');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
      toast.success('Event deleted successfully');
      setDeleteDialog(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    try {
      await dispatch(deleteQuiz(id)).unwrap();
      toast.success('Quiz deleted successfully');
      setDeleteDialog(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete quiz');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await dispatch(deleteQuestion(id)).unwrap();
      toast.success('Question deleted successfully');
      setDeleteDialog(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete question');
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    // Create a new array to avoid mutating state directly
    const currentOptions = [...(newQuestion.options || [])];
    const updatedOptions = [...currentOptions];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quiz Management Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={loadAllData} variant="outline">
            <Loader2 className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="events" className="flex items-center gap-2">
            Events
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            Quizzes
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            Questions
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            Overview
          </TabsTrigger>
        </TabsList>
        
        {/* Events Tab */}
        <TabsContent value="events">
          <EventsTab
            events={events}
            quizzes={quizzes}
            eventsLoading={eventsLoading}
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            handleCreateEvent={handleCreateEvent}
            setEditItem={setEditItem}
            setDeleteDialog={setDeleteDialog}
          />
        </TabsContent>
        
        {/* Quizzes Tab */}
        <TabsContent value="quizzes">
          <QuizzesTab
            events={events}
            quizzes={quizzes}
            questions={questions}
            quizzesLoading={quizzesLoading}
            newQuiz={newQuiz}
            setNewQuiz={setNewQuiz}
            handleCreateQuiz={handleCreateQuiz}
            setEditItem={setEditItem}
            setDeleteDialog={setDeleteDialog}
          />
        </TabsContent>
        
        {/* Questions Tab */}
        <TabsContent value="questions">
          <QuestionsTab
            quizzes={quizzes}
            questions={questions}
            questionsLoading={questionsLoading}
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
            handleCreateQuestion={handleCreateQuestion}
            handleOptionChange={handleOptionChange}
            setEditItem={setEditItem}
            setDeleteDialog={setDeleteDialog}
          />
        </TabsContent>
        
        {/* Stats Tab */}
        <TabsContent value="stats">
          <StatsTab
            events={events}
            quizzes={quizzes}
            questions={questions}
          />
        </TabsContent>
      </Tabs>
      
      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editItem?.type === 'event' && 'Edit Event'}
              {editItem?.type === 'quiz' && 'Edit Quiz'}
              {editItem?.type === 'question' && 'Edit Question'}
            </DialogTitle>
            <DialogDescription>
              Make changes to the {editItem?.type} information below.
            </DialogDescription>
          </DialogHeader>
          
          {editItem?.type === 'event' && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editEventTitle">Event Title</Label>
                <Input
                  id="editEventTitle"
                  value={editItem.data.title}
                  onChange={(e) => setEditItem({
                    ...editItem, 
                    data: {...editItem.data, title: e.target.value}
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editEventDescription">Description</Label>
                <Textarea
                  id="editEventDescription"
                  value={editItem.data.description || ''}
                  onChange={(e) => setEditItem({
                    ...editItem, 
                    data: {...editItem.data, description: e.target.value}
                  })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editStartDate">Start Date</Label>
                  <Input
                    id="editStartDate"
                    type="datetime-local"
                    value={editItem.data.startDate}
                    onChange={(e) => setEditItem({
                      ...editItem, 
                      data: {...editItem.data, startDate: e.target.value}
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editEndDate">End Date</Label>
                  <Input
                    id="editEndDate"
                    type="datetime-local"
                    value={editItem.data.endDate}
                    onChange={(e) => setEditItem({
                      ...editItem, 
                      data: {...editItem.data, endDate: e.target.value}
                    })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editEventActive"
                  checked={editItem.data.isActive !== false}
                  onChange={(e) => setEditItem({
                    ...editItem, 
                    data: {...editItem.data, isActive: e.target.checked}
                  })}
                  className="rounded"
                />
                <Label htmlFor="editEventActive" className="text-sm">
                  Active Event
                </Label>
              </div>
            </div>
          )}
          
          {editItem?.type === 'quiz' && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editQuizTitle">Quiz Title</Label>
                <Input
                  id="editQuizTitle"
                  value={editItem.data.title}
                  onChange={(e) => setEditItem({
                    ...editItem, 
                    data: {...editItem.data, title: e.target.value}
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editQuizEvent">Event</Label>
                <Select
                  value={editItem.data.eventId}
                  onValueChange={(value) => setEditItem({
                    ...editItem, 
                    data: {...editItem.data, eventId: value}
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event._id} value={event._id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editQuizDuration">Duration (minutes)</Label>
                  <Input
                    id="editQuizDuration"
                    type="number"
                    min="1"
                    value={editItem.data.duration}
                    onChange={(e) => setEditItem({
                      ...editItem, 
                      data: {...editItem.data, duration: Number(e.target.value)}
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editPassingMarks">Passing Marks</Label>
                  <Input
                    id="editPassingMarks"
                    type="number"
                    min="0"
                    value={editItem.data.passingMarks || 0}
                    onChange={(e) => setEditItem({
                      ...editItem, 
                      data: {...editItem.data, passingMarks: Number(e.target.value)}
                    })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editQuizInstructions">Instructions</Label>
                <Textarea
                  id="editQuizInstructions"
                  value={editItem.data.instructions || ''}
                  onChange={(e) => setEditItem({
                    ...editItem, 
                    data: {...editItem.data, instructions: e.target.value}
                  })}
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editQuizActive"
                  checked={editItem.data.isActive !== false}
                  onChange={(e) => setEditItem({
                    ...editItem, 
                    data: {...editItem.data, isActive: e.target.checked}
                  })}
                  className="rounded"
                />
                <Label htmlFor="editQuizActive" className="text-sm">
                  Active Quiz
                </Label>
              </div>
            </div>
          )}
          
          {editItem?.type === 'question' && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editQuestionQuiz">Quiz</Label>
                <Select
                  value={editItem.data.quizId}
                  onValueChange={(value) => setEditItem({
                    ...editItem, 
                    data: {...editItem.data, quizId: value}
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a quiz" />
                  </SelectTrigger>
                  <SelectContent>
                    {quizzes.map((quiz) => (
                      <SelectItem key={quiz._id} value={quiz._id}>
                        {quiz.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editQuestionText">Question Text</Label>
                <Textarea
                  id="editQuestionText"
                  value={editItem.data.text}
                  onChange={(e) => setEditItem({
                    ...editItem, 
                    data: {...editItem.data, text: e.target.value}
                  })}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {editItem.data.options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          // Create a new array to avoid mutating state directly
                          const currentOptions = [...editItem.data.options];
                          const updatedOptions = [...currentOptions];
                          updatedOptions[index] = e.target.value;
                          setEditItem({
                            ...editItem, 
                            data: {...editItem.data, options: updatedOptions}
                          });
                        }}
                      />
                      <input
                        type="radio"
                        name="editCorrectAnswer"
                        checked={editItem.data.correctAnswer === option}
                        onChange={() => setEditItem({
                          ...editItem, 
                          data: {...editItem.data, correctAnswer: option}
                        })}
                        className="rounded"
                      />
                      <Label className="text-sm">Correct</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editQuestionMarks">Marks</Label>
                  <Input
                    id="editQuestionMarks"
                    type="number"
                    min="1"
                    value={editItem.data.marks}
                    onChange={(e) => setEditItem({
                      ...editItem, 
                      data: {...editItem.data, marks: Number(e.target.value)}
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editQuestionDifficulty">Difficulty</Label>
                  <Select
                    value={editItem.data.difficulty}
                    onValueChange={(value) => setEditItem({
                      ...editItem, 
                      data: {...editItem.data, difficulty: value}
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (editItem?.type === 'event') handleUpdateEvent();
              else if (editItem?.type === 'quiz') handleUpdateQuiz();
              else if (editItem?.type === 'question') handleUpdateQuestion();
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {deleteDialog?.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (deleteDialog?.type === 'event') handleDeleteEvent(deleteDialog.id);
                else if (deleteDialog?.type === 'quiz') handleDeleteQuiz(deleteDialog.id);
                else if (deleteDialog?.type === 'question') handleDeleteQuestion(deleteDialog.id);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuizManagement;