/* eslint-disable */

import React from 'react';
import classnames from 'classnames';
import { noop, getDpr, traverse, inArray, extend, warn } from '../../util';
import { render } from '../../util/render';
import Scroller from '../../util/scroller';
import './index.less';

const dpr = getDpr();

interface PickerColumnProps {
  data: any[];
  cols?: number;
  lineHeight?: number;
  invalidIndex?: any[];
  defaultValue?: any[];
  defaultIndex?: any[];
  keepIndex?: boolean;
  onInitialed?: Function;
  onChange?: Function;
}

const PickerColumn: React.FC<PickerColumnProps> = React.forwardRef((props, ref) => {
  const columnRef = React.useRef(null);
  React.useImperativeHandle(ref, () => ({
    activedIndexs,
    $_initColumnsScroller,
    refresh,
    setColumnValues: changeColumnValues,
  }));
  const [columnValues, setColumnValues] = React.useState<any[]>([]);
  const [isMouseDown, setMouseDown] = React.useState<boolean>(false);
  const [scrollDirect, setScrollDirect] = React.useState<number>(1);
  const [scrollPosition, setScrollPosition] = React.useState<number>(0);
  const [activedIndexs, setActivedIndexs] = React.useState<any[]>([]);
  const [isInitialed, setInitialed] = React.useState<boolean>(false);
  const [isScrollInitialed, setScrollInitialed] = React.useState<boolean>(false);
  const [isScrolling, setScrolling] = React.useState<boolean>(false);
  const [scrollers, setScrollers] = React.useState<any[]>([]);
  const {
    data,
    cols,
    lineHeight = 45,
    invalidIndex = [],
    defaultValue = [],
    defaultIndex = [],
    keepIndex = false,
    onInitialed = () => {},
    onChange = () => {},
  } = props;
  const style = {
    maskerHeight: (lineHeight * 2 + 10) * dpr,
    indicatorHeight: lineHeight * dpr,
  };

  const changeColumnValues = (index, values, callback = noop) => {
    /* istanbul ignore if */
    if (index === undefined || values === undefined) {
      return;
    }

    // reset active index
    if (!keepIndex) {
      activedIndexs[index] = 0;
      setActivedIndexs([...activedIndexs]);
    }

    // this.$set(this.columnValues, index, values)
    columnValues[index] = values;
    setColumnValues([...columnValues]);
    callback();
    // this.$nextTick(() => {
    //   // this.$_initSingleColumnScroller(index)
    //   callback(this)
    // })
  };

  const $_isColumnIndexActive = (columnIndex: number, itemIndex: number) => {
    const activeIndex = activedIndexs[columnIndex];
    return activeIndex === itemIndex;
  };
  const $_isColumnIndexInvalid = (columnIndex: number, itemIndex: number) => {
    const index = invalidIndex[columnIndex];
    return inArray(index, itemIndex);
  };
  const $_onColumnTouchStart = (event: any, index: number, isMouse?: boolean) => {
    event.preventDefault();
    const scroller = scrollers[index];
    const touches = isMouse ? [{ pageX: event.pageX, pageY: event.pageY }] : event.touches;

    /* istanbul ignore if */
    if (!scroller) {
      warn(`touchstart: scroller of column ${index} is undefined`);
      return;
    }

    setScrollPosition(isMouse ? event.pageY : event.touches[0].pageY);

    scroller.doTouchStart(touches, event.timeStamp);
    if (isMouse) {
      setMouseDown(true);
    }
  };

  const $_onColumnTouchMove = (event, index, isMouse) => {
    const scroller = scrollers[index];
    const touches = isMouse ? [{ pageX: event.pageX, pageY: event.pageY }] : event.touches;

    /* istanbul ignore if */
    if (!scroller || (isMouse && !isMouseDown)) {
      return;
    }

    const diff = scrollPosition - (isMouse ? event.pageY : event.touches[0].pageY);
    setScrollDirect(diff ? diff / Math.abs(diff) : 1);

    scroller.doTouchMove(touches, event.timeStamp);
    isMouse && setMouseDown(true);
  };

  const $_onColumnTouchEnd = (event, index, isMouse) => {
    const scroller = scrollers[index];

    /* istanbul ignore if */
    if (!scroller || (isMouse && !isMouseDown)) {
      return;
    }

    scroller.doTouchEnd(event.timeStamp);
    isMouse && setMouseDown(false);
  };

  const $_getColumnIndexByOffset = (top: number) => {
    return Math.round(top / style.indicatorHeight);
  };

  const getColumnValues = () => {
    const data = columnValues;
    const activeIndexs = activedIndexs;
    let activeValues: any = [];

    data.forEach((item, index) => {
      activeValues[index] = item[activeIndexs[index]];
    });

    return activeValues;
  };

  const getColumnValue = (index = 0) => {
    const activeValues = getColumnValues();
    return activeValues[index];
  };

  const $_onColumnScrollEnd = (index: number) => {
    const scroller = scrollers[index];
    const top = scroller.getValues().top;
    const scrollTop = $_scrollInZoon(scroller, top);
    const activeItemIndex = $_getColumnIndexByOffset(scrollTop);
    const isInvalid = $_isColumnIndexInvalid(index, activeItemIndex);

    if (isInvalid || activeItemIndex === activedIndexs[index]) {
      console.log('符合条件', activedIndexs);
      isInvalid && $_scrollToValidIndex(scroller, index, activeItemIndex);
      activeItemIndex === activedIndexs[index] && $_scrollToIndex(scroller, index, activeItemIndex);
      return false;
    }

    /* istanbul ignore next */
    // this.$set(this.activedIndexs, index, activeItemIndex)
    activedIndexs[index] = activeItemIndex;
    setActivedIndexs([...activedIndexs]);

    /* istanbul ignore next */
    // this.$emit('change', index, activeItemIndex, this.getColumnValue(index))
    setTimeout(() => {
      onChange(index, activeItemIndex, getColumnValue(index));
    });
  };

  const $_resetScrollingPosition = (columnIndex: number) => {
    const scroller = scrollers[columnIndex];
    const columnValue = columnValues[columnIndex] || [];
    let oldColumnActiveIndex = activedIndexs[columnIndex] || 0;

    if (!scroller || !oldColumnActiveIndex) {
      return;
    }

    if (oldColumnActiveIndex > columnValue.length - 1) {
      oldColumnActiveIndex = columnValue.length - 1;
    }

    $_scrollToIndex(scroller, columnIndex, oldColumnActiveIndex);
    activedIndexs[columnIndex] = oldColumnActiveIndex;
    setActivedIndexs([...activedIndexs]);
    // this.$set(this.activedIndexs, columnIndex, oldColumnActiveIndex)
  };

  const $_initSingleColumnScroller = (container, index) => {
    const columns = columnRef.current.querySelectorAll('.column-list');
    const content = columns[index];

    /* istanbul ignore if */
    if (index === undefined || !columns || !container || !content) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const scroller = new Scroller(
      (left, top) => {
        render(content, left, top);
      },
      {
        scrollingX: false,
        snapping: true,
        snappingVelocity: 1,
        animationDuration: 350,
        scrollingComplete: () => {
          $_onColumnScrollEnd(index);
        },
      },
    );

    // set scroller size
    scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);
    scroller.setDimensions(
      container.clientWidth,
      container.clientHeight,
      content.offsetWidth,
      content.offsetHeight + style.maskerHeight,
    );
    scroller.setSnapSize(0, style.indicatorHeight);

    // save scroller instance
    // this.$set(this.scrollers, index, scroller)
    scrollers[index] = scroller;
    setScrollers([...scrollers]);

    // reset scrolling position
    $_resetScrollingPosition(index);
  };

  const getHooks = () => {
    const _hooks = columnRef?.current?.querySelectorAll?.('.wm-picker-column-hook');
    /* istanbul ignore if */
    if (!_hooks) {
      return [];
    }
    return Array.isArray(_hooks) ? _hooks : Array.prototype.slice.call(_hooks);
  };

  // const hooks = getHooks();

  const $_getColumnIndexByDefault = (data, defaultIndex = [], defaultValue = [], fn = noop) => {
    if (!data) {
      return;
    }

    traverse(data, (item, level, indexs) => {
      const columnIndex = indexs[0];
      const itemIndex = indexs[1];
      let itemDefaultIndex = defaultIndex[columnIndex];
      const itemDefaultValue = defaultValue[columnIndex];

      /*
       * given a default itemIndex when both defaultIndex & defaultValue are undefined
       * avoid activieIndexs failing to initialize
       */
      if (itemDefaultIndex === undefined && itemDefaultValue === undefined) {
        itemDefaultIndex = 0;
      }

      // get initial itemIndex of each columnIndex by defaultIndex or defaultValue
      if (
        (itemDefaultIndex !== undefined && itemIndex === itemDefaultIndex) ||
        (itemDefaultValue !== undefined &&
          (item.text === itemDefaultValue ||
            item.label === itemDefaultValue ||
            item.value === itemDefaultValue))
      ) {
        fn(columnIndex, itemIndex);
        return 2;
      }
    });
  };

  const $_hasValidIndex = (columnIndex: number) => {
    for (const key of this.data[columnIndex].keys()) {
      if ($_isColumnIndexInvalid(columnIndex, key)) {
        return true;
      }
    }
    /* istanbul ignore next */
    warn(`hasValidIndex: has no valid items in column index ${columnIndex}`);
    return false;
  };

  const $_findValidIndex = (columnIndex: number, count) => {
    // Has no valid items
    if (!$_hasValidIndex(columnIndex)) {
      return count;
    }
    let tempCount = count;
    while ($_isColumnIndexInvalid(columnIndex, tempCount)) {
      tempCount += scrollDirect;
    }
    /**
     * No valid item in this direction,
     * find valid item in another direction
     */
    if (tempCount < 0 || tempCount > data[columnIndex].length - 1) {
      setScrollDirect(-scrollDirect);
      return $_findValidIndex(columnIndex, count);
    }
    return tempCount;
  };

  const $_getColumnOffsetByIndex = (index: number) => {
    return index * style.indicatorHeight;
  };

  const $_scrollInZoon = (scroller, top) => {
    const MaxTop = scroller.getScrollMax().top;

    if (top < 0) {
      return 0;
    } else if (top > MaxTop) {
      return MaxTop;
    } else {
      return top;
    }
  };

  const $_scrollToValidIndex = (scroller, columnIndex, itemIndex) => {
    const count = $_findValidIndex(columnIndex, itemIndex);
    const offsetTop = $_getColumnOffsetByIndex(count);
    scroller.scrollTo(0, $_scrollInZoon(scroller, offsetTop), true);
  };

  const $_scrollToIndex = (scroller, columnIndex, itemIndex) => {
    const offsetTop = $_getColumnOffsetByIndex(itemIndex);
    scroller.scrollTo(0, offsetTop);
  };

  const $_initColumnIndex = () => {
    const data = columnValues;

    $_getColumnIndexByDefault(data, defaultIndex, defaultValue, (columnIndex, itemIndex) => {
      const scroller = scrollers[columnIndex];

      /* istanbul ignore if */
      if (!scroller) {
        warn(`initialColumnIndex: scroller of column ${columnIndex} is undefined`);
        return 1;
      }

      /**
       * If the initial selection item is invalid,
       * then a valid item is automatically selected
       */
      if ($_isColumnIndexInvalid(columnIndex, itemIndex)) {
        $_scrollToValidIndex(scroller, columnIndex, itemIndex);
      } else {
        $_scrollToIndex(scroller, columnIndex, itemIndex);
        activedIndexs[columnIndex] = itemIndex;
        setActivedIndexs([...activedIndexs]);
        // this.$set(this.activedIndexs, columnIndex, itemIndex)
      }
    });
  };

  const $_initColumnsScroller = (startIndex: number = 0) => {
    const hooks = getHooks();
    for (let i = startIndex, len = hooks.length; i < len; i++) {
      const container = hooks[i];
      container && $_initSingleColumnScroller(container, i);
    }

    // initial index only refresh all columns
    if (!startIndex) {
      $_initColumnIndex();
      if (!isInitialed) {
        // this.isInitialed = true
        setInitialed(true);
        setTimeout(() => {
          // this.$emit('initialed')
          onInitialed();
        }, 0);
      }
    }

    setScrollInitialed(true);
  };

  // todo
  const refresh = (callback: Function, startIndex: number = 0) => {
    setTimeout(() => {
      $_initColumnsScroller(startIndex);
      if (callback) {
        callback();
      }
    }, 1000);
  };

  React.useEffect(() => {
    setColumnValues(extend([], data));
  }, [data]);
  return (
    <div
      ref={columnRef}
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
                  onTouchStart={($event: React.TouchEvent<HTMLDivElement>) =>
                    $_onColumnTouchStart($event, n)
                  }
                  onMouseDown={($event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                    $_onColumnTouchStart($event, n, true)
                  }
                  onTouchMove={($event: React.TouchEvent<HTMLDivElement>) =>
                    $_onColumnTouchMove($event, n)
                  }
                  onMouseMove={($event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                    $_onColumnTouchMove($event, n, true)
                  }
                  onTouchEnd={($event: React.TouchEvent<HTMLDivElement>) =>
                    $_onColumnTouchEnd($event, n)
                  }
                  onMouseUp={($event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                    $_onColumnTouchEnd($event, n, true)
                  }
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
});

PickerColumn.defaultProps = {
  cols: 1,
};

export default PickerColumn;
