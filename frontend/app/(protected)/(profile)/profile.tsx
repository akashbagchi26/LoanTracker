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
import { useThemeStore } from "@/store/themeStore";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const logout = useLogout();
  const theme = useColorScheme();
  const colors = Colors[theme];
  const { theme: storeTheme, setTheme } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.headerContent}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`,
                }}
                style={styles.avatar}
              />
              <TouchableOpacity
                style={[styles.editAvatarBtn, { borderColor: colors.primary }]}
              >
                <Ionicons name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{user?.name || "User"}</Text>
            <Text style={styles.email}>{user?.email || ""}</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
            Account
          </Text>
          <View
            style={[
              styles.menu,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <MenuItem
              icon="person-outline"
              label="Edit Profile"
              colors={colors}
              onPress={() => router.push("/(protected)/(profile)/edit-profile")}
            />
            <MenuItem
              icon="people-outline"
              label="Add/View Client"
              colors={colors}
              onPress={() =>
                router.push("/(protected)/(profile)/(client)/borrower")
              }
              isLast
            />
          </View>

          <Text
            style={[
              styles.sectionTitle,
              { color: colors.secondaryText, marginTop: 24 },
            ]}
          >
            Appearance
          </Text>
          <View
            style={[
              styles.menu,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.themeToggleContainer}>
              <View style={styles.themeHeader}>
                <Ionicons
                  name="moon-outline"
                  size={20}
                  color={colors.secondaryText}
                />
                <Text style={[styles.themeLabel, { color: colors.text }]}>
                  Theme Mode
                </Text>
              </View>
              <View
                style={[
                  styles.themeButtons,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <ThemeButton
                  active={storeTheme === "light"}
                  label="Light"
                  icon="sunny"
                  onPress={() => setTheme("light")}
                  colors={colors}
                />
                <ThemeButton
                  active={storeTheme === "dark"}
                  label="Dark"
                  icon="moon"
                  onPress={() => setTheme("dark")}
                  colors={colors}
                />
                <ThemeButton
                  active={storeTheme === "system"}
                  label="Auto"
                  icon="settings-sharp"
                  onPress={() => setTheme("system")}
                  colors={colors}
                />
              </View>
            </View>
          </View>

          <Text
            style={[
              styles.sectionTitle,
              { color: colors.secondaryText, marginTop: 24 },
            ]}
          >
            Support
          </Text>
          <View
            style={[
              styles.menu,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <MenuItem
              icon="help-circle-outline"
              label="Help & Support"
              colors={colors}
              onPress={() => {}}
            />
            <MenuItem
              icon="information-circle-outline"
              label="About Application"
              colors={colors}
              onPress={() => {}}
              isLast
            />
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.logoutContainer,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.error }]}
          onPress={logout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.error}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const MenuItem = ({
  icon,
  label,
  onPress,
  colors,
  isLast = false,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  colors: any;
  isLast?: boolean;
}) => (
  <TouchableOpacity
    style={[
      styles.menuItem,
      !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
    ]}
    onPress={onPress}
  >
    <View style={styles.menuItemLeft}>
      <View
        style={[styles.menuIconWrapper, { backgroundColor: colors.surface }]}
      >
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.menuText, { color: colors.text }]}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color={colors.icon} />
  </TouchableOpacity>
);

const ThemeButton = ({
  active,
  label,
  icon,
  onPress,
  colors,
}: {
  active: boolean;
  label: string;
  icon: string;
  onPress: () => void;
  colors: any;
}) => (
  <TouchableOpacity
    style={[
      styles.themeBtn,
      active && {
        backgroundColor: colors.card,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    ]}
    onPress={onPress}
  >
    <Ionicons
      name={icon as any}
      size={18}
      color={active ? colors.primary : colors.secondaryText}
      style={{ marginBottom: 4 }}
    />
    <Text
      style={[
        styles.themeBtnText,
        {
          color: active ? colors.text : colors.secondaryText,
          fontWeight: active ? "700" : "500",
        },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: "center",
  },
  avatarWrapper: {
    padding: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 60,
    marginBottom: 16,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3b82f6",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#6366f1",
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  email: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    marginTop: 4,
    fontWeight: "500",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 8,
    marginBottom: 8,
  },
  menu: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
  },
  themeToggleContainer: {
    padding: 16,
  },
  themeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  themeButtons: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  themeBtn: {
    flex: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  themeBtnText: {
    fontSize: 13,
  },
  logoutContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
  },
  logoutBtn: {
    height: 56,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: "dashed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
