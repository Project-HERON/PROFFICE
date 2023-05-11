import { useState } from 'react';
import {
    Avatar, Badge, Box, Button, Flex, GridItem, Input, InputGroup, SimpleGrid, Text, useDisclosure
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import type { User, UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';

import { api } from '~/utils/api';
import BookSessionModal from './modals/BookSessionModal';

const Search = ({ role }: { role: Exclude<UserRole, "admin"> }) => {

    const [keyword, setKeyword] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [professor, setProfessor] = useState<{ id: string; name: string; }>({ id: '', name: '' });
    const {
        isOpen: isBookSessionModalOpen, onOpen: onBookSessionModalOpen, onClose: onBookSessionModalClose
    } = useDisclosure({ defaultIsOpen: false })
    const { mutateAsync: searchUsers } = api.user.searchUsers.useMutation();
    const { data: sessionData } = useSession();

    const handleSearch = async () => {
        try {
            const data = await searchUsers({ query: keyword, role: role })
            setUsers(data);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className='flex flex-col justify-center items-center gap-8'>
                <div className='w-1/2 bg-white rounded-l-lg'>
                    <InputGroup>
                        <Input style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} type='search' placeholder='Search...' onChange={(e) => setKeyword(e.target.value)} value={keyword} />
                        <Button style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} colorScheme='proffice' width={'100px'} onClick={handleSearch}><AiOutlineSearch /></Button>
                    </InputGroup>
                </div>
                <SimpleGrid className="p-10" columns={[1, 2, 3]} gap={6}>
                    {users.map((user, index) => (
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
                    ))}

                </SimpleGrid>
            </div>
            {isBookSessionModalOpen ? <BookSessionModal professor={professor} onClose={onBookSessionModalClose} /> : <></>}
        </>
    );
};

export default Search;
