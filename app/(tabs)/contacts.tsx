import {
  StyleSheet,
  Image,
  Platform,
  TextInput,
  Text,
  View,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { FlashList } from "@shopify/flash-list";

export default function ContactsPage() {
  const [contactData, setContactData] = useState<any>([]);
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync();

        if (data.length > 0) {
          const sortedContacts = data.sort((a, b) => {
            const nameA = a.firstName?.toLowerCase() || "";
            const nameB = b.firstName?.toLowerCase() || "";
            return nameA.localeCompare(nameB);
          });

          const contactsWithHeaders: any = [];
          let currentInitial = "";

          sortedContacts.forEach((contact) => {
            const firstLetter =
              contact.firstName?.charAt(0)?.toUpperCase() || "";

            // Add a header if the initial changes
            if (firstLetter && firstLetter !== currentInitial) {
              contactsWithHeaders.push({
                type: "header",
                initial: firstLetter,
              });
              currentInitial = firstLetter;
            }

            // Add the contact
            contactsWithHeaders.push({ type: "contact", ...contact });
          });

          setContactData(contactsWithHeaders);
          console.log(contactsWithHeaders); //
        }
      }
    })();
  }, []);

  function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Contacts</ThemedText>
      </ThemedView>

      <FlashList
        data={contactData}
        renderItem={({ item }: any) =>
          item.type === "header" ? (
            // Render the alphabet header
            <ThemedText
              style={{
                fontWeight: "bold",
                fontSize: 16,
                marginVertical: 6,
              }}
            >
              {item.initial}
            </ThemedText>
          ) : (
            <ThemedView
              style={{
                display: "flex",
                flexDirection: "row",
                marginVertical: 10,
                gap: 20,
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              {item?.imageAvailable ? (
                <Image
                  source={{ uri: item?.image.uri }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                  }}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: generateRandomColor(),
                    width: 44,
                    height: 44,
                    borderRadius: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 20,
                      fontWeight: "800",
                    }}
                  >
                    {item?.firstName?.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <ThemedText>{item.name}</ThemedText>
            </ThemedView>
          )
        }
        estimatedItemSize={200}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "column",
    gap: 8,  },
});
