import {Box, Container, Flex, Link, Text} from '@radix-ui/themes';

import {GitHubIcon} from '../icons/GitHubIcon';

export function Footer() {
  return (
    <Box
      asChild
      style={{
        backgroundColor: 'var(--gray-1)',
        borderTop: '1px solid var(--gray-3)',
      }}
    >
      <footer>
        <Container size="4" px="4" py="6">
          <Flex align="center" justify="between">
            <Text as="p" size="2" color="gray">
              {`MIT License | Made with `}
              <Text color="red">♥</Text>
              {` by `}
              <Link
                href="https://github.com/fantasy42"
                target="_blank"
                rel="noreferrer noopener"
                underline="always"
                color="blue"
              >
                Fantasy
              </Link>
              {` | © ${new Date().getFullYear()}`}
            </Text>

            <Text color="gray" size="2">
              <Link
                href="https://github.com/fantasy42/watermarkit"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub Repository"
              >
                <GitHubIcon
                  width={15}
                  height={15}
                  style={{display: 'inline'}}
                  aria-hidden
                />
              </Link>
            </Text>
          </Flex>
        </Container>
      </footer>
    </Box>
  );
}
