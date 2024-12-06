import { Box } from '@chakra-ui/react'
import React from 'react'

export const Container = ({ children }) => {
    return (
        <Box w={"95%"} maxW={"1600px"} m={"0 auto"}>
            {children}
        </Box>
    )
}

export default Container