import React, { useMemo } from 'react';
import { Check, ChevronDown, ChevronUp, ChevronsUpDown } from '@tamagui/lucide-icons';

import type { FontSizeTokens, SelectProps } from 'tamagui';
import { Adapt, Select, Sheet, XStack, YStack, getFontSize, isWeb } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

export function DropDownSelect({
  items,
  label,
  onValueChange,
  value,
  progress,
}: {
  items: {
    name: string;
    id: string;
  }[];
  label: string;
  onValueChange: (value: string) => void;
  value: string;
  progress?: number;
}) {
  return (
    <YStack gap="$4">
      {isWeb ? (
        <XStack items="center" gap="$4">
          <DropDownSelectItem
            id="select-demo-1"
            items={items}
            label={label}
            value={value}
            onValueChange={onValueChange}
            progress={progress}
          />
        </XStack>
      ) : (
        <XStack items="center" gap="$4">
          <DropDownSelectItem
            id="select-demo-2"
            items={items}
            label={label}
            native
            onValueChange={onValueChange}
            progress={progress}
          />
        </XStack>
      )}
    </YStack>
  );
}

function DropDownSelectItem(
  props: SelectProps & { items: { name: string; id: string }[]; label: string; progress?: number }
) {
  const { items, label, value, progress, onValueChange } = props;

  return (
    <Select onValueChange={onValueChange} disablePreventBodyScroll {...props}>
      <Select.Trigger
        iconAfter={ChevronsUpDown}
        rounded={'$6'}
        bg="white"
        zIndex={10}
        width={'130px'}
        $lg={{
          width: '160px',
        }}
      >
        {progress && (
          <YStack
            position="absolute"
            left={0}
            top={0}
            bottom={0}
            width={`${progress}%`}
            bg="$blue6"
            opacity={0.3}
            zIndex={0}
          />
        )}

        <Select.Value
          size="$2"
          $lg={{
            size: '$4',
          }}
          placeholder="pLaceholder"
          zIndex={10}
        >
          {value}
        </Select.Value>
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet native={!!props.native} modal dismissOnSnapToBottom animation="medium">
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            backgroundColor="$shadowColor"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            pointerEvents="auto"
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={1000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
            borderRadius="$8"
          />
        </Select.ScrollUpButton>

        <Select.Viewport
        // to do animations:
        // animation="medium"
        // animateOnly={['transform', 'opacity']}
        // enterStyle={{ x: 0, y: -10 }}
        // exitStyle={{ x: 0, y: 10 }}
        // minWidth={200}
        >
          <Select.Group style={{ zIndex: 100 }}>
            <Select.Label>{label}</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <Select.Item
                      zIndex={100}
                      pointerEvents="auto"
                      index={i}
                      key={item.name}
                      value={item.name}
                    >
                      <Select.ItemText size="$4">{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [items]
            )}
          </Select.Group>
          {/* Native gets an extra icon */}
          {props.native && (
            <YStack
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              width={'$4'}
              pointerEvents="none"
            >
              <ChevronDown size={getFontSize((props.size as FontSizeTokens) ?? '$true')} />
            </YStack>
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
            rounded="$8"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}
