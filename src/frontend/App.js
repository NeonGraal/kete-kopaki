import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Kete Kopaki</Text>
        <Text style={styles.subtitle}>Envelope budgeting foundation is ready.</Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    flex: 1,
    justifyContent: "center",
    padding: 16
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    maxWidth: 560,
    padding: 24,
    width: "100%"
  },
  subtitle: {
    color: "#334155",
    fontSize: 16
  },
  title: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8
  }
});
