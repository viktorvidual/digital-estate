import { Spinner } from "tamagui";
import { View } from "tamagui";

export const FullScreenLoader = () => {
    return (
        <View
            width={"100%"}
            height={"100%"}
            position={"fixed"}
            justify={"center"}
            items={"center"}
            bg={"$blue13"}
        >
            <Spinner size="large" />
        </View>
    );
};