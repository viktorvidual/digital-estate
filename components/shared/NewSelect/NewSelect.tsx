import React from 'react';
import Select from 'react-dropdown-select';
import { MyText } from '../MyText/MyText';
import { View, getTokens, styled } from 'tamagui';

type Props<T> = {
  placeholder?: string;
  options: { label: string; value: string }[];
  onChange: (value: T[]) => void;
  values: { label: string; value: string }[];
  searchable?: boolean;
  setValue: (value: T) => void;
};

export const NewSelect = ({
  placeholder,
  options,
  onChange,
  values,
  searchable,
  setValue,
}: Props<{
  value: string;
  label: string;
}>) => {
  const tokens = getTokens();

  return (
    <View>
      <Select
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        values={values}
        style={{
          borderRadius: tokens.radius[6].val,
          backgroundColor: 'white',
          height: 45,
        }}
        searchable={searchable || false}
        dropdownPosition="auto"
        contentRenderer={({ props, state, methods }) => {
          return (
            <View p={10}>
              {state.values.length > 0 ? (
                <MyText>{state.values[0].label}</MyText>
              ) : (
                <MyText
                  style={{
                    fontSize: 16,
                    color: '#aaa', // Placeholder color
                  }}
                >
                  {props.placeholder}
                </MyText>
              )}
            </View>
          );
        }}
        dropdownRenderer={({ props, methods }) => {
          return (
            <View rounded={'$6'}>
              {props.options.map(item => {
                const select = item.value === values[0].value;
                return (
                  <DropDownMenuItem
                    key={item.value}
                    onPress={() => {
                      setValue(item);
                      methods.dropDown('toggle');
                    }}
                    selected={select}
                  >
                    <MyText color={select ? 'white' : 'black'} fw="medium" key={item.value}>
                      {item.label}
                    </MyText>
                  </DropDownMenuItem>
                );
              })}
            </View>
          );
        }}
      />
      {/* <View width={'100%'} height={45} position="absolute" top={0} left={0} right={0} bottom={0} /> */}
    </View>
  );
};

export const DropDownMenuItem = styled(View, {
  p: 10,
  hoverStyle: {
    bg: '$blue3',
  },
  pressStyle: {
    backgroundColor: '$blue3',
  },
  rounded: '$6',
  variants: {
    selected: {
      true: {
        bg: '$blue10',
        hoverStyle: { bg: '$blue10' },
      },
      false: {},
    },
  } as const,
});
