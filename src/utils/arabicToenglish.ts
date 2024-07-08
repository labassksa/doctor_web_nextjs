export const convertArabicToEnglishNumbers = (input: string): string => {
  // Define the mapping with explicit types for keys and values
  const arabicToEnglish: { [key: string]: string } = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  // Replace each Arabic digit with the corresponding English digit
  return input.replace(
    /[٠١٢٣٤٥٦٧٨٩]/g,
    (char) => arabicToEnglish[char as keyof typeof arabicToEnglish]
  );
};
