import React, { useState, useMemo } from 'react';
import { Check, ChevronDown, ChevronUp, ChevronsUpDown } from '@tamagui/lucide-icons';

import type { FontSizeTokens, SelectProps } from 'tamagui';
import { Adapt, Select, Sheet, XStack, YStack, getFontSize, isWeb } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

export function DropDownSelect({
  items,
  label,
  onValueChange,
  value,
}: {
  items: {
    name: string;
    id: string;
  }[];
  label: string;
  onValueChange: (value: string) => void;
  value: string;
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
          />
        </XStack>
      )}
    </YStack>
  );
}

function DropDownSelectItem(
  props: SelectProps & { items: { name: string; id: string }[]; label: string }
) {
  const { items, label, value, onValueChange } = props;

  return (
    <Select value={value} onValueChange={onValueChange} disablePreventBodyScroll {...props}>
      <Select.Trigger iconAfter={ChevronsUpDown} rounded={'$6'}>
        <Select.Value placeholder="pLaceholder">{value}</Select.Value>
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
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
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
          // animation="quick"
          // animateOnly={['transform', 'opacity']}
          // enterStyle={{ o: 0, y: -10 }}
          // exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <Select.Group>
            <Select.Label>{label}</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <Select.Item index={i} key={item.name} value={item.name}>
                      <Select.ItemText>{item.name}</Select.ItemText>
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
