import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Skeleton } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'

import { api } from '~/utils/api';
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

const Calendar = () => {

    const toast = useToast();
    const router = useRouter();
    const { data: sessionData } = useSession();
    const { isLoading: isCalendarLoading, data: myCalendar, error: calendarError } =
        api.officeHoursSession.getMyCalendar.useQuery(
            undefined, { refetchInterval: 5000 }
        );

    if (isCalendarLoading)
        return <Skeleton height='80vh' speed={1.2} />;

    if (calendarError) {
        toast({
            title: 'Error Showing the calendar',
            description: calendarError.message,
            status: 'error',
            duration: 5000,
        })
        void router.push('/500');
        return <></>
    }

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='timeGridWeek'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={3}
            events={
                myCalendar.map((session) => ({
                    id: session.id,
                    date: session.startDate,
                    end: session.endDate,
                    editable: false,
                    durationEditable: false,
                    title: sessionData!.user.role === 'professor' ? session.officeHoursSession ? `Session with ${session.officeHoursSession.student.name?.split('<')[0] || ''}` : `Available` : `Session with Professor: ${session.professor.name?.split('<')[0] || ''}`,
                    backgroundColor: session.officeHoursSession ? 'red' : 'green',
                    display: ''
                }))
            }
            eventOverlap={false}
            // eventClick={}
            // businessHours={[]}
        />
    );
};

export default Calendar;