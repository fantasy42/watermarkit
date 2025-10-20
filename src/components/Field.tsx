import {Flex, Text} from '@radix-ui/themes';

import type {FlexProps, TextProps} from '@radix-ui/themes';

function FieldRoot(props: FlexProps) {
  return <Flex direction="column" gap="1" {...props} />;
}

function FieldLabel(props: TextProps) {
  return (
    <Flex>
      <Text as="label" size="2" weight="medium" {...props} />
    </Flex>
  );
}

function FieldControl(props: FlexProps) {
  return <Flex direction="column" {...props} />;
}

export {FieldRoot as Root, FieldLabel as Label, FieldControl as Control};
