import { type FormEvent, useState } from 'react';
import {
    Avatar, Badge, Box, Button, Flex,
    Input, InputGroup, SimpleGrid,
    Text, useDisclosure, useToast,
    GridItem,
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import type { User, UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';

import { api } from '~/utils/api';
import BookSessionModal from './modals/BookSessionModal';
import { TRPCClientError } from '@trpc/client';

const Search = ({ role }: { role: Exclude<UserRole, "admin"> }) => {

    const [keyword, setKeyword] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [professor, setProfessor] = useState<{ id: string; name: string; }>({ id: '', name: '' });
    const {
        isOpen: isBookSessionModalOpen, onOpen: onBookSessionModalOpen, onClose: onBookSessionModalClose
    } = useDisclosure({ defaultIsOpen: false })
    const { mutateAsync: searchUsers, isSuccess: searchUsersSuccess } = api.user.searchUsers.useMutation();
    const { data: sessionData } = useSession();
    const toast = useToast()

    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await searchUsers({ query: keyword, role: role })
            setUsers(data);
        } catch (error) {
            if (error instanceof TRPCClientError) {
                try {
                    const messages = JSON.parse(error.message) as Array<{ code: string | number; message: string; path: Array<string> }>;
                    toast({
                        title: 'Error searching',
                        description: messages.map(m => m.message).join(' - '),
                        status: 'error'
                    })
                } catch (err) {
                    toast({
                        title: 'Error searching',
                        description: error.message,
                        status: 'error'
                    })
                }
            }

            else
                toast({
                    title: 'Error searching',
                    description: 'Something went wrong',
                    status: 'error'
                })
        }
    }

    return (
        <>
            <div className='flex flex-col justify-center items-center gap-8'>
                <div className='w-1/2 bg-white rounded-l-lg'>
                    <form onSubmit={handleSearch}>
                        <InputGroup>
                            <Input style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} type='search' placeholder='Search...' onChange={(e) => setKeyword(e.target.value)} value={keyword} />
                            <Button type='submit' style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} colorScheme='proffice' width={'100px'}><AiOutlineSearch /></Button>
                        </InputGroup>
                    </form>
                </div>
                <SimpleGrid className="p-10" columns={[1, 2, 3]} gap={6}>
                    {users.length ? users.map((user, index) => (
                        <GridItem w='100%' h='100%' bg='white' className="rounded-xl p-4" key={`user_${index}`}>
                            <Flex align="center" gap="10">
                                <Flex>
                                    <Avatar src={user.image || ''} />
                                    <Box ml='3'>
                                        <Text fontWeight='bold'>
                                            {user.name}
                                            <Badge ml='1' colorScheme='proffice'>
                                                {user.role}
                                            </Badge>
                                        </Text>
                                        <Text fontSize='sm'>{user.email}</Text>
                                    </Box>
                                </Flex>
                                {sessionData!.user.role === 'student' && role === "professor"
                                    ? (
                                        <Button onClick={() => { setProfessor({ id: user.id, name: user.name || '' }); onBookSessionModalOpen(); }} colorScheme='proffice' variant='outline'>
                                            Book
                                        </Button>
                                    )
                                    : <></>}
                            </Flex>
                        </GridItem>
                    )) : <GridItem colSpan={3}><Text align="center" fontFamily="body" fontSize='xl'>{keyword && searchUsersSuccess ? 'No Users Found' : 'Enter a keyword to begin the search'}</Text></GridItem>}
                </SimpleGrid>

            </div>
            {isBookSessionModalOpen ? <BookSessionModal professor={professor} onClose={onBookSessionModalClose} /> : <></>}
        </>
    );
};

export default Search;
