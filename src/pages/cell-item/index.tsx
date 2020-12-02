import React from 'react';
import Field from '../../components/field';
import CellItem from '../../components/cell-item';

const CellItemPage: React.FC = () => {
  return (
    <div>
      <Field>
        <CellItem title="普通条目" />
        <CellItem title="动作条目" arrow />
        <CellItem title="禁用条目" disabled noBorder />
      </Field>
    </div>
  );
};

export default CellItemPage;
