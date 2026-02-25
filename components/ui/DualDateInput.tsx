'use client';

// هذا الملف يعيد تصدير المكون الجديد للتوافق مع الكود القديم
import ArabicDatePicker from './ArabicDatePicker';

interface DualDateInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  supportHijri?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export default function DualDateInput(props: DualDateInputProps) {
  // تجاهل supportHijri لأن المكون الجديد لا يدعمه حالياً
  const { supportHijri, ...rest } = props;
  return <ArabicDatePicker {...rest} />;
}
