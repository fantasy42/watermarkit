'use client';
import {Accordion} from '@base-ui-components/react/accordion';
import {Box, Flex, Text} from '@radix-ui/themes';

import {PlusIcon} from '../icons/PlusIcon';

function AccordionRoot(props: Accordion.Root.Props) {
  return (
    <Accordion.Root
      render={<Flex direction="column" justify="center" />}
      {...props}
    />
  );
}

function AccordionItem(props: Accordion.Item.Props) {
  return (
    <Accordion.Item render={<Box />} className="AccordionItem" {...props} />
  );
}

function AccordionTrigger(props: Accordion.Trigger.Props) {
  const {children, ...accordionTriggerProps} = props;
  return (
    <Accordion.Header className="rt-reset">
      <Accordion.Trigger
        className="rt-reset AccordionTrigger"
        {...accordionTriggerProps}
      >
        <Text>{children}</Text>
        <Flex asChild align="center" flexShrink="0" justify="center">
          <PlusIcon aria-hidden />
        </Flex>
      </Accordion.Trigger>
    </Accordion.Header>
  );
}

function AccordionPanel(props: Accordion.Panel.Props) {
  const {children, ...accordionPanelProps} = props;
  return (
    <Accordion.Panel
      render={<Box />}
      className="AccordionPanel"
      {...accordionPanelProps}
    >
      <Box p="4">
        <Text as="p" color="gray">
          {children}
        </Text>
      </Box>
    </Accordion.Panel>
  );
}

export {
  AccordionRoot as Root,
  AccordionItem as Item,
  AccordionTrigger as Trigger,
  AccordionPanel as Panel,
};
