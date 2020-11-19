/* eslint-disable */

import React from 'react';
import classnames from 'classnames';
import { noop, getDpr, traverse, inArray, extend, warn } from '../../util';
import { render } from '../../util/render';

const dpr = getDpr();

interface PickerColumnProps {
  data: any[];
  cols?: number;
  lineHeight?: number;
  invalidIndexs?: any[];
}

const PickerColumn: React.FC<PickerColumnProps> = (props) => {
  const [columnValues, setColumnValues] = React.useState<any[]>([]);
  const [isMouseDown, setMouseDown] = React.useState<boolean>(false);
  const [scrollDirect, setScrollDirect] = React.useState<number>(1);
  const [scrollPosition, setScrollPosition] = React.useState<number>(0);
  const [activedIndexs, setActivedIndexs] = React.useState<any[]>([]);
  const [isInitialed, setInitialed] = React.useState<boolean>(false);
  const [isScrollInitialed, setScrollInitialed] = React.useState<boolean>(false);
  const [isScrolling, setScrolling] = React.useState<boolean>(false);
  const { data, cols, lineHeight = 45, invalidIndexs = [] } = props;
  const style = {
    maskerHeight: (lineHeight * 2 + 10) * dpr,
    indicatorHeight: lineHeight * dpr,
  };
  const $_isColumnIndexActive = (columnIndex: number, itemIndex: number) => {
    const activeIndex = activedIndexs[columnIndex];
    return activeIndex === itemIndex;
  };
  const $_isColumnIndexInvalid = (columnIndex: number, itemIndex: number) => {
    const invalidIndex = invalidIndexs[columnIndex];
    return inArray(invalidIndex, itemIndex);
  };
  return (
    <div
      className="wm-picker-column"
      style={{ height: `${style.indicatorHeight + 2 * style.maskerHeight}px` }}
    >
      <div className="wm-picker-column-container">
        <div
          className="wm-picker-column-masker top"
          style={{ height: `${style.maskerHeight}px` }}
        />
        <div
          className="wm-picker-column-masker bottom"
          style={{ height: `${style.maskerHeight}px` }}
        />
        <div className="wm-picker-column-list">
          {columnValues &&
            columnValues.map &&
            columnValues.map((column, i) => (
              <div className="wm-picker-column-item" key={i}>
                <ul className="column-list" style={{ paddingTop: `${style.maskerHeight}px` }}>
                  {column &&
                    column.map &&
                    column.map((item: any, j: number) => (
                      <li
                        className={classnames('column-item', {
                          active: $_isColumnIndexActive(i, j),
                          disabled: $_isColumnIndexInvalid(i, j),
                        })}
                        style={{
                          height: `${style.indicatorHeight}px`,
                          lineHeight: `${style.indicatorHeight}px`,
                        }}
                        key={j}
                      >
                        {item.text || item.label}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          {cols
            ? [...Array(cols - columnValues.length).keys()].map((n) => (
                <div className="wm-picker-column-item" key={n + columnValues.length}>
                  <ul className="column-list" style={{ paddingTop: `${style.maskerHeight}px` }} />
                </div>
              ))
            : null}
        </div>
        <div className="wm-picker-column-hooks">
          {cols
            ? [...Array(cols).keys()].map((n) => (
                <div
                  className="wm-picker-column-hook"
                  key={n}
                  onTouchStart={($event) => $_onColumnTouchStart($event, n)}
                  onMouseDown={($event) => $_onColumnTouchStart($event, n, true)}
                  onTouchMove={($event) => $_onColumnTouchMove($event, n)}
                  onMouseMove={($event) => $_onColumnTouchMove($event, n, true)}
                  onTouchEnd={($event) => $_onColumnTouchEnd($event, n)}
                  onMouseUp={($event) => $_onColumnTouchEnd($event, n, true)}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

PickerColumn.defaultProps = {
  cols: 1,
};

export default PickerColumn;
