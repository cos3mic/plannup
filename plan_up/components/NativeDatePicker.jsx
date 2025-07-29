import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function NativeDatePicker({ visible, onClose, onDateSelected, value, minimumDate, maximumDate }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  React.useEffect(() => {
    if (visible) setDatePickerVisibility(true);
    else setDatePickerVisibility(false);
  }, [visible]);

  const handleConfirm = (date) => {
    onDateSelected(date);
    setDatePickerVisibility(false);
    onClose();
  };

  const handleCancel = () => {
    setDatePickerVisibility(false);
    onClose();
  };

  return (
    <DateTimePickerModal
      isVisible={isDatePickerVisible}
      mode="date"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      date={value || new Date()}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
    />
  );
} 