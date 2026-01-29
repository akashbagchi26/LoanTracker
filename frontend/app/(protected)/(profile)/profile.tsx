import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useLogout } from "@/hooks/api/useAuth";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.name || "User"}</Text>
          <Text style={styles.email}>{user.email || ""}</Text>
        </View>

        <View style={styles.menu}>
          <MenuItem
            label="✏️ Edit Profile"
            onPress={() => router.push("/(protected)/(profile)/edit-profile")}
          />
          <MenuItem
            label="👥 Add/View Client"
            onPress={() =>
              router.push("/(protected)/(profile)/(client)/borrower")
            }
          />
        </View>
      </ScrollView>

      {/* Fixed Logout Button */}
      <View style={styles.logoutContainer}>
        <LogoutBtn label="Logout" onPress={logout} />
      </View>
    </View>
  );
}

const MenuItem = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
);

const LogoutBtn = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.logoutItem} onPress={onPress}>
    <Text style={styles.logoutText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#00C853",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  email: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  menu: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#f4f4f4",
  },
  logoutItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
    marginBottom: 12,
  },
  logoutText: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "600",
  },
});
