import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";
import BottomSheet, {
  BottomSheetView,
  useBottomSheetInternal,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { usePrepayLoan } from "@/hooks/api/usePrepayLoan";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

/* -------------------- CUSTOM INPUT -------------------- */

const CustomBottomSheetTextInput = forwardRef<any, TextInputProps>(
  ({ onFocus, onBlur, ...props }, ref) => {
    const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

    const handleOnFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        shouldHandleKeyboardEvents.value = true;
        onFocus?.(e);
      },
      [onFocus, shouldHandleKeyboardEvents],
    );

    const handleOnBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        shouldHandleKeyboardEvents.value = false;
        onBlur?.(e);
      },
      [onBlur, shouldHandleKeyboardEvents],
    );

    useEffect(() => {
      return () => {
        shouldHandleKeyboardEvents.value = false;
      };
    }, [shouldHandleKeyboardEvents]);

    return (
      <TextInput
        ref={ref}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        {...props}
      />
    );
  },
);

CustomBottomSheetTextInput.displayName = "CustomBottomSheetTextInput";

/* -------------------- TYPES -------------------- */

export interface MyBottomSheetProps {
  prePaid: number;
  loanId: string;
  loanType: string;
}

/* -------------------- BOTTOM SHEET -------------------- */

export const MyBottomSheet = forwardRef<BottomSheetMethods, MyBottomSheetProps>(
  (props, ref) => {
    const { loanId, prePaid, loanType } = props;
    const theme = useColorScheme();
    const colors = Colors[theme];

    const bottomSheetRef = useRef<BottomSheet>(null);
    const inputRef = useRef<RNTextInput>(null);

    const [customAmount, setCustomAmount] = useState("");

    useImperativeHandle(
      ref,
      () => bottomSheetRef.current as BottomSheetMethods,
    );

    const snapPoints = useMemo(() => [1], []);

    const { mutateAsync: prepayLoan } = usePrepayLoan?.() || {};

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index >= 0) {
          if (loanType === "emi") {
            setCustomAmount(prePaid.toString());
          } else {
            setCustomAmount("");
            setTimeout(() => inputRef.current?.focus(), 300);
          }
        }
      },
      [loanType, prePaid],
    );

    /* -------------------- INPUT CHANGE -------------------- */
    const handleCustomAmountChange = useCallback(
      (value: string) => {
        if (!value) {
          setCustomAmount("");
          return;
        }

        const num = Number(value);
        if (isNaN(num)) return;

        setCustomAmount(num > prePaid ? prePaid.toString() : value);
      },
      [prePaid],
    );

    /* -------------------- SUBMIT -------------------- */
    const handleSubmit = async () => {
      try {
        const amount = loanType === "emi" ? prePaid : Number(customAmount);

        if (!amount || amount <= 0) return;

        if (prepayLoan) {
          await prepayLoan({
            loanId,
            amount,
          });
        }

        Keyboard.dismiss();
        setCustomAmount("");
        bottomSheetRef.current?.close();
      } catch (err) {
        console.error("Payment failed:", err);
      }
    };

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing
        enablePanDownToClose
        onChange={handleSheetChanges}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        handleIndicatorStyle={[
          styles.handle,
          { backgroundColor: colors.border },
        ]}
        backgroundStyle={[
          styles.sheetBackground,
          { backgroundColor: colors.background },
        ]}
        enableOverDrag={false}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={[styles.heading, { color: colors.text }]}>
            Record Payment
          </Text>
          <Text style={[styles.subheading, { color: colors.secondaryText }]}>
            Confirm the transaction amount
          </Text>

          <CustomBottomSheetTextInput
            label="Pending Due"
            mode="outlined"
            editable={false}
            value={`₹${prePaid.toLocaleString()}`}
            style={[styles.input, { backgroundColor: colors.surface }]}
            textColor={colors.text}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            theme={{
              colors: {
                primary: colors.primary,
                onSurfaceVariant: colors.secondaryText,
              },
            }}
          />

          {loanType !== "emi" && (
            <CustomBottomSheetTextInput
              ref={inputRef}
              label="Custom Amount"
              placeholder="e.g. 5000"
              mode="outlined"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={handleCustomAmountChange}
              style={[styles.input, { backgroundColor: colors.card }]}
              textColor={colors.text}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              theme={{
                colors: {
                  primary: colors.primary,
                  onSurfaceVariant: colors.secondaryText,
                },
              }}
            />
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Ionicons
              name="card"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>
              {loanType === "emi" ? "Confirm EMI Payment" : "Submit Payment"}
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

MyBottomSheet.displayName = "MyBottomSheet";

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  handle: {
    height: 5,
    width: 44,
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 12,
  },
  contentContainer: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 4,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});
