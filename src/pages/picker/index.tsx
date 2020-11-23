import React from 'react';
import Picker from '../../components/picker';

const pickerData = [
  [
    { text: '2015', value: 1 },
    { text: '2016', value: 2 },
    { text: '2017', value: 3 },
    { text: '2018', value: 4 },
    { text: '2019', value: 5 },
    { text: '2020', value: 6 },
    { text: '2021', value: 2 },
    { text: '2022', value: 3 },
    { text: '2023', value: 2 },
    { text: '2024', value: 3 },
    { text: '2025', value: 2 },
    { text: '2026', value: 3 },
    { text: '2027', value: 2 },
    { text: '2028', value: 3 },
    { text: '2029', value: 2 },
    { text: '2030', value: 3 },
  ],
];

const PickerPage: React.FC = () => {
  return (
    <>
      <Picker
        // ref="picker"
        data={pickerData}
        // invalidIndex="[[2, 3, 4]]"
        // @initialed="onPickerInitialed"
        // @change="onPickerConfirm"
        isView
      />
    </>
  );
};

export default PickerPage;
