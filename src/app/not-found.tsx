import Link from 'next/link';
import {
  Container,
  Heading,
  Text,
  Link as RadixLink,
  Section,
  Box,
  Flex,
} from '@radix-ui/themes';

export default function NotFound() {
  return (
    <Container size="4" height="calc(100dvh - 84px)" overflow="hidden" px="4">
      <Box height="100%" py="6">
        <Flex asChild direction="column" align="center" justify="center">
          <Section
            className="HomeGeneratorSection"
            position="relative"
            height="100%"
            px="4"
          >
            <Heading size={{initial: '8', md: '9'}} align="center" mb="1">
              Oh no!
            </Heading>
            <Text align="center" wrap="pretty" mb="4">
              Oops! It looks like you tried to visit a page that does not exist.
            </Text>
            <RadixLink asChild>
              <Link href="/">Go back home</Link>
            </RadixLink>
          </Section>
        </Flex>
      </Box>
    </Container>
  );
}
