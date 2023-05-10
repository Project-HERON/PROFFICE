import React, { useState } from "react";
import {
    Input,
    Button, Modal, ModalOverlay,
    ModalContent, ModalHeader,
    ModalCloseButton, ModalBody,
    FormControl, FormLabel,
    ModalFooter,
    Select,
    useToast
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { selectAvailabilityModalState, closeModal } from "~/store/modalsSlice";
import { api } from "~/utils/api";
import { TRPCClientError } from "@trpc/client";

const AddAvailabilityModal = () => {

    const isOpen = useAppSelector(selectAvailabilityModalState);
    const dispatch = useAppDispatch();
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [interval, setInterval] = useState<number>(0);
    const { mutateAsync: createAvailability } = api.availability.createAvailability.useMutation();
    const toast = useToast();

    const handleSubmit = async () => {
        try {
            await createAvailability({ interval, startDate, endDate });
            toast({
                title: 'Successfully created the availability',
                status: 'success'
            })
            dispatch(closeModal('addAvailabilityModal'))
        } catch (error) {
            if (error instanceof TRPCClientError) {
                try {
                    const messages = JSON.parse(error.message) as Array<{ code: string|number; message: string; path: Array<string>}>;
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


    return (
        <Modal
            isOpen={isOpen}
            onClose={() => dispatch(closeModal('addAvailabilityModal'))}
            size='3xl'
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add your availability</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Start Time</FormLabel>
                        <Input
                            placeholder="Select Date and Time"
                            size="md"
                            type="datetime-local"
                            // value={startDate?.toString()}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>End Time</FormLabel>
                        <Input
                            placeholder="Select Date and Time"
                            size="md"
                            type="datetime-local"
                            // value={endDate?.toString()}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Length of every session</FormLabel>
                        <Select defaultValue={0} onChange={(e) => setInterval(parseInt(e.target.value))} placeholder='Select an option'>
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                        </Select>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button disabled={(interval === 0)} onClick={handleSubmit} colorScheme='blue' mr={3}>
                        Add Availability
                    </Button>
                    <Button onClick={() => dispatch(closeModal('addAvailabilityModal'))}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddAvailabilityModal;