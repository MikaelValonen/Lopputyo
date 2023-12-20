import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { useFirebase } from './FirebaseContext';
import { Agenda } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const Kalenteri = () => {
  const { firebaseData } = useFirebase() || { database: null };
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    generateCalendar();
  }, [currentMonth, firebaseData]);

  const generateCalendar = () => {
    const startOfMonthDate = startOfMonth(currentMonth);
    const endOfMonthDate = endOfMonth(currentMonth);
  
    // array of current month
    const daysInMonth = eachDayOfInterval({ start: startOfMonthDate, end: endOfMonthDate });
  
    // Map through the days and mark the ones present in Firebase
    const calendarData = daysInMonth.reduce((acc, day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const isEvent = checkIfEventExists(day);
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
  
      acc[dateKey].push({ date: day, isEvent });
  
      return acc;
    }, {});
  
    setCalendarDays(calendarData);
  };
  

  const handleDayPress = day => {
    const selectedDate = format(day.date, 'yyyy-MM-dd');
    const matchingEvent = firebaseData.find(event => format(new Date(event.date), 'yyyy-MM-dd') === selectedDate);

    if (matchingEvent) {
      const itemId = matchingEvent.id;
      navigation.navigate('MuokkaaTyötä', { Id: itemId });
    } else {
      console.log('No event for the selected date:', selectedDate);
    }
  };

  const checkIfEventExists = date => {
    return firebaseData?.some(event => {
      const eventDate = event.selectedDate;
      return isSameMonth(new Date(eventDate), date);
    }) || false;
  };

  return (
    <View>
      <Text>Calendar for {format(currentMonth, 'MMMM yyyy')}</Text>
      <Agenda
        items={calendarDays}
        onDayPress={handleDayPress}
        renderItem={(item, firstItemInDay) => (
          <TouchableOpacity onPress={() => handleDayPress(item.date)}>
            <View>
              <Text>{format(item.date, 'd')}</Text>
              <Text>{item.isEvent ? 'Event Present' : 'No Event'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Kalenteri;
