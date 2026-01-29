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
} from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";
import BottomSheet, {
  BottomSheetView,
  useBottomSheetInternal,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { usePrepayLoan } from "@/hooks/api/usePrepayLoan";

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
        handleIndicatorStyle={styles.handle}
        backgroundStyle={styles.sheetBackground}
        enableOverDrag={false}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.heading}>💰 How Much Have You Paid?</Text>

          <CustomBottomSheetTextInput
            label="Pending Due"
            mode="outlined"
            editable={false}
            value={prePaid.toString()}
            style={styles.input}
            contentStyle={styles.inputContent}
          />

          {loanType !== "emi" && (
            <CustomBottomSheetTextInput
              ref={inputRef}
              label="Custom Amount"
              mode="outlined"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={handleCustomAmountChange}
              style={styles.input}
              contentStyle={styles.inputContent}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {loanType === "emi" ? "Pay EMI" : "Submit Payment"}
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    backgroundColor: "#ccc",
    height: 5,
    width: 40,
    borderRadius: 2.5,
    alignSelf: "center",
    marginVertical: 8,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
  },
  inputContent: {
    fontSize: 16,
    paddingVertical: 14,
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
