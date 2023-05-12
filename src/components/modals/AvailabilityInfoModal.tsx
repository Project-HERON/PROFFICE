/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import {
    Button, Modal, ModalOverlay,
    ModalContent, ModalHeader,
    ModalCloseButton, ModalBody,
    FormControl, FormLabel,
    ModalFooter,
    Input,
    useToast,
    Skeleton
} from "@chakra-ui/react";
import { api } from "~/utils/api";
import { TRPCClientError } from "@trpc/client";
import moment from "moment";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const AvailabilityInfoModal = ({ availabilityId, onClose }: { availabilityId: string; onClose: () => void }) => {

    const {
        data: availability, isLoading: availabilityLoading, error: availabilityError
    } = api.availability.getAvailability.useQuery({ availabilityId });
    const {
        mutateAsync: deleteAvailability, isLoading: deleteAvailabilityLoading
    } = api.availability.deleteAvailability.useMutation();
    const {
        mutateAsync: cancelSession, isLoading: cancelSessionLoading
    } = api.officeHoursSession.cancelOfficeHoursSession.useMutation()
    const toast = useToast();
    const router = useRouter();
    const { data: sessionData } = useSession();


    if (availabilityLoading)
        return <Skeleton height='20vh' speed={1.2} />

    if (availabilityError) {
        void router.push('/500');
        return <></>;
    }

    const handleSubmit = async () => {
        try {
            if (availability.officeHoursSession)
                await cancelSession({ officeHoursSessionId: availability.officeHoursSession.id });
            else
                await deleteAvailability({ availabilityId });

            toast({
                title: availability.officeHoursSession ? 'Successfully cancelled the session' : 'Successfully deleted the availability',
                status: 'success'
            })

            onClose();

        } catch (error) {
            if (error instanceof TRPCClientError) {
                try {
                    const messages = JSON.parse(error.message) as Array<{ code: string | number; message: string; path: Array<string> }>;
                    toast({
                        title: 'Error deleting the availability',
                        description: messages.map(m => m.message).join(' - '),
                        status: 'error'
                    })
                } catch (err) {
                    toast({
                        title: 'Error deleting the availability',
                        description: error.message,
                        status: 'error'
                    })
                }
            }

            else
                toast({
                    title: 'Error deleting the availability',
                    description: 'Something went wrong',
                    status: 'error'
                })

        }
    }

    return (
        <Modal
            isOpen
            onClose={onClose}
            size='3xl'
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{availability.officeHoursSession ? sessionData!.user.role === 'professor' ? `Session with ${availability.officeHoursSession.student.name || ''}` : `Session with Professor: ${availability.professor.name || ''}` : `Availability information`}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>{availability.officeHoursSession ? 'Session start:' : 'Availability start:'}</FormLabel>
                        <Input defaultValue={moment(availability.startDate).format('dddd, MMMM Do YYYY, h:mm a')} disabled placeholder='Start Date' />
                    </FormControl>
                    <FormControl>
                        <FormLabel>{availability.officeHoursSession ? 'Session end:' : 'Availability end:'}</FormLabel>
                        <Input defaultValue={moment(availability.endDate).format('dddd, MMMM Do YYYY, h:mm a')} disabled placeholder='Start Date' />
                    </FormControl>
                    {availability.officeHoursSession && availability.officeHoursSession.student.name ? <FormControl mt={4}>
                        <FormLabel>Booked by:</FormLabel>
                        <Input disabled defaultValue={availability.officeHoursSession.student.name} placeholder='Availability booked by' />
                    </FormControl> : <></>}
                </ModalBody>
                <ModalFooter>
                    <Button isLoading={deleteAvailabilityLoading || cancelSessionLoading} disabled={!availabilityId} onClick={handleSubmit} colorScheme='red' mr={3}>
                        {availability.officeHoursSession ? 'Cancel Session' : 'Delete Availability'}
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AvailabilityInfoModal;