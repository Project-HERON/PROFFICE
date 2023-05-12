import { render, screen } from '@testing-library/react';
import moment from 'moment';
import '@testing-library/jest-dom';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
 
describe('Calendar', () => {
  it('renders the calendar correctly', () => {
    render(<FullCalendar plugins={[ dayGridPlugin ]} initialView='dayGridMonth'/>);

    expect(screen.getByText(/may/i)).toBeInTheDocument()
  });
});