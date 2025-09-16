"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchActiveEvents } from '@/redux/features/eventSlice';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { AppDispatch, RootState } from '@/store/store';
import { Button } from '@/components/ui/button';

const EventSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { activeEvents, loading, error } = useSelector((state: RootState) => state.events);

  useEffect(() => {
    dispatch(fetchActiveEvents());
  }, [dispatch]);

  const handleEventClick = (eventId: string) => {
    router.push(`/${eventId}`);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-red-600">Error loading events</h3>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  if (activeEvents.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">No active events</h3>
        <p className="mt-2 text-sm text-gray-500">Check back later for upcoming events.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Active Events
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Participate in our exciting quiz events and test your knowledge!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeEvents.map((event) => (
            <Card key={event._id} className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                    {event.title}
                  </CardTitle>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {event.description || "No description available"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 flex-grow">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <span>Start: {format(new Date(event.startDate), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <span>End: {format(new Date(event.endDate), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event.participants?.length || 0} participants</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{event.quizzes?.length || 0} quizzes</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-3">
                <Button
                  onClick={() => handleEventClick(event._id)}
                  className="w-full"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventSection;