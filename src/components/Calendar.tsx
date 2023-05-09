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

    const { isLoading, data: myOfficeHoursSessions, error } = api.officeHoursSession.getMyOfficeHoursSessions.useQuery(undefined, { refetchInterval: 5000 });
    const toast = useToast();
    const router = useRouter();
    const { data: sessionData } = useSession();

    if (isLoading)
        return <Skeleton height='80vh' speed={1.2} />

    if (error || !myOfficeHoursSessions) {
        toast({
            title: 'Error Showing the calendar',
            description: error.message,
            status: 'error',
            duration: 5000,
        })
        void router.push('/500');
        return <h1>Error...</h1>
    }

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={5}
            weekends={false}
            events={myOfficeHoursSessions.map((session) => ({
                id: session.id,
                title: `Session with ${sessionData!.user.role === 'professor' ? session.student.name! : session.availability.professor.name!}`,
                date: session.availability.startDate
            }))}
        // eventClick={}
        />
    );
};

export default Calendar;
