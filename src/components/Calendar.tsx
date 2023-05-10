import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Skeleton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Calendar = () => {
  const {
    isLoading,
    data: myOfficeHoursSessions,
    error,
  } = api.officeHoursSession.getMyOfficeHoursSessions.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const toast = useToast();
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventId, setEventId] = React.useState<string>("");
  const {
    isLoading: isLoadingAvailability,
    data: myAvailabilities,
    error: errorAvailability,
  } = api.availability.getProfessorAvailability.useQuery(
    { professorId: sessionData?.user.id || "" },
    { refetchInterval: 5000 }
  );
  const { mutate: deleteAvailability } =
    api.availability.deleteAvailability.useMutation();

  const handleDelete = (id: string) => {
    try {
      deleteAvailability({ availabilityId: id });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading || isLoadingAvailability)
    return <Skeleton height="80vh" speed={1.2} />;

  if (error || !myOfficeHoursSessions) {
    toast({
      title: "Error Showing the calendar",
      description: error.message,
      status: "error",
      duration: 5000,
    });
    void router.push("/500");
    return <h1>Error...</h1>;
  }

  if (errorAvailability || !myAvailabilities) {
    toast({
      title: "Error Showing the calendar",
      description: errorAvailability.message,
      status: "error",
      duration: 5000,
    });
    void router.push("/500");
    return <h1>Error...</h1>;
  }

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={5}
        weekends={false}
        events={[
          ...myOfficeHoursSessions.map((session) => ({
            id: session.id,
            title: `Session with ${
              sessionData!.user.role === "professor"
                ? session.student.name!
                : session.availability.professor.name!
            }`,
            date: session.availability.startDate,
            color: "red",
          })),
          ...myAvailabilities.map((availability) => ({
            id: availability.id,
            title: "Free spot",
            date: availability.startDate,
            color: "green",
          })),
        ]}
        eventClick={(info) => {
          setEventId(info.event.id);
          onOpen();
        }}
      />
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Availability</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Are you sure that you want to delete the availability?</p>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              variant="outline"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              onClick={() => handleDelete(eventId)}
              colorScheme="red"
              variant="solid"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Calendar;
