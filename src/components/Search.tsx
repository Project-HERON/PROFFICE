import { Avatar, Badge, Box, Button, CheckboxIcon, Flex, Grid, GridItem, Input, InputGroup, SimpleGrid, Text, UnorderedList } from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaUserTie } from 'react-icons/fa';
import { useState } from 'react';
import { api } from '~/utils/api';
import { User, UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';


const Search = ({ role }: { role: Exclude<UserRole, "admin"> }) => {

    const [keyword, setKeyword] = useState('');
    const [users, setUsers] = useState<User[]>([]);
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
                            { sessionData!.user.role === 'student' && role === "professor" ? <Button colorScheme='proffice' variant='outline'>
                                Book
                            </Button> : <></>}
                        </Flex>
                    </GridItem>
                ))}

            </SimpleGrid>
        </div>
    );
};

export default Search;
