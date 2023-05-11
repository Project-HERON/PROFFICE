/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import {
    Button, Modal, ModalOverlay,
    ModalContent, ModalHeader,
    ModalCloseButton, ModalBody,
    FormControl, FormLabel,
    ModalFooter,
    Select,
    useToast,
    Skeleton
} from "@chakra-ui/react";
import { api } from "~/utils/api";
import { TRPCClientError } from "@trpc/client";
import moment from "moment";
import { useRouter } from "next/router";

const BookSessionModal = ({ professor, onClose }: { professor: { id: string; name: string; }; onClose: () => void }) => {

    const {
        data: availabilities, isLoading: availabilitiesLoading, error: availabilitiesError
    } = api.availability.getProfessorAvailability.useQuery({ professorId: professor.id });
    const {
        mutate: bookSession, isLoading: createOfficeHoursSessionLoading
    } = api.officeHoursSession.createOfficeHoursSession.useMutation();
    const [availabilityId, setAvailabilityId] = useState<string>('');
    const toast = useToast();
    const router = useRouter();

    const handleSubmit = () => {
        try {
            bookSession({ availabilityId });
            toast({
                title: 'Successfully booked the session',
                status: 'success'
            })
            onClose();
        } catch (error) {
            if (error instanceof TRPCClientError) {
                try {
                    const messages = JSON.parse(error.message) as Array<{ code: string | number; message: string; path: Array<string> }>;
                    toast({
                        title: 'Error creating the availability',
                        description: messages.map(m => m.message).join(' - '),
                        status: 'error'
                    })
                } catch (err) {
                    toast({
                        title: 'Error creating the availability',
                        description: error.message,
                        status: 'error'
                    })
                }
            }

            else
                toast({
                    title: 'Error creating the availability',
                    description: 'Something went wrong',
                    status: 'error'
                })

        }
    }

    if (availabilitiesLoading)
        return <Skeleton height='20vh' speed={1.2} />

    if (availabilitiesError) {
        void router.push('/500');
        return <></>;
    }

    console.log(availabilities.map((av) => av.endDate))


    return (
        <Modal
            isOpen
            onClose={onClose}
            size='3xl'
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{`Book a session with Professor: ${professor.name}`}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl mt={4}>
                        <FormLabel>Select Availability</FormLabel>
                        <Select defaultValue='' onChange={(e) => setAvailabilityId(e.target.value)} placeholder='Select an option'>
                            {availabilities.length ? availabilities.map((av, index) => (
                                <option key={`availability_${index+1}`} value={av.id}>{`${moment(av.startDate).calendar()} - ${moment(av.endDate).format("hh:mm A")}`}</option>
                            )) : <></>}
                        </Select>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button isLoading={createOfficeHoursSessionLoading} disabled={!availabilityId} onClick={handleSubmit} colorScheme='blue' mr={3}>
                        Book Session
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default BookSessionModal;