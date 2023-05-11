import React, { type ReactNode } from 'react';
import Image from 'next/image';
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    type BoxProps,
    type FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Button,
} from '@chakra-ui/react';
import {
    FiHome,
    FiCompass,
    FiStar,
    FiMenu,
    FiChevronDown,
    FiPlusCircle,
} from 'react-icons/fi';
import {
    RiUserSearchFill,
    RiUserSearchLine
} from 'react-icons/ri';
import type { IconType } from 'react-icons';
import { signOut, useSession } from 'next-auth/react';
import { Link } from '@chakra-ui/next-js'
import { useRouter } from 'next/router';

import bookLogo from '~/../assets/bookLogo.png';
import { useAppDispatch } from '~/store/hooks';
import { openModal } from '~/store/modalsSlice';

interface LinkItemProps {
    name: string;
    icon: IconType;
    link?: string;
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Calendar', icon: FiHome, link: '/' },
    { name: 'Professors', icon: RiUserSearchFill, link: '/professors' },
    { name: 'Students', icon: RiUserSearchLine, link: '/students' },
    // { name: 'Sessions', icon: FiCompass, link: '/sessions' },
    // { name: 'Availabilities', icon: FiStar, link: '/availabilities' },
];

export default function Sidebar({
    children,
}: {
    children: ReactNode;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();


    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobile nav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Image className="w-12" src={bookLogo} alt="" />
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" textColor="proffice.300">
                    PROFFICE
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} link={link.link || '#'}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: string;
    link: string;
}
const NavItem = ({ icon, children, link, ...rest }: NavItemProps) => {
    const router = useRouter();

    return (
        <Link href={link} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                my="2"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'proffice.300',
                    color: 'white',
                }}
                bg={ link === router.pathname ? 'proffice.300' : undefined}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    const { data: sessionData } = useSession();

    const dispatch = useAppDispatch();

    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                PROFFICE
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                {
                    sessionData && sessionData.user.role === 'professor' ?
                        <Button onClick={() => dispatch(openModal('addAvailabilityModal'))} leftIcon={<FiPlusCircle />} colorScheme='proffice'>
                            Add Availability
                        </Button> : <></>
                }
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={sessionData?.user.image || ''}
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{sessionData?.user.name}</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        {sessionData?.user.role}
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            zIndex={2}
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem>Profile</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={() => void signOut({ callbackUrl: '/login' })}>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};