import { Button, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useLogout } from "@/hooks/api/useAuth";

export default function FourthScreen() {
  const router = useRouter();
  const logout = useLogout();

  return (
    <View className="justify-center flex-1 p-4">
      <Text>Fourth Screen</Text>
      <Button
        title="Back"
        onPress={() => {
          router.back();
        }}
      />
      <Button title="Log out!" onPress={logout} />
    </View>
  );
}
