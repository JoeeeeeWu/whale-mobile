import React from 'react';
import classnames from 'classnames';
import './index.less';

interface ActivityIndicatorRollingProps {
  className?: string;
  size?: number;
  width?: number;
  color?: string;
  borderColor?: string;
  fill?: string;
  linecap?: 'butt' | 'round' | 'square' | 'inherit';
  rotate?: number;
  process?: number; // process control 0-1
  circle?: any;
  defs?: any;
}

const ActivityIndicatorRolling: React.FC<ActivityIndicatorRollingProps> = (props) => {
  const {
    className,
    size = 70,
    width,
    color,
    borderColor,
    fill,
    linecap,
    rotate,
    process, // process control 0-1
    circle,
    defs,
    children,
  } = props;
  const strokeWidth = width || size / 12;
  const radius = size / 2;
  const viewBoxSize = size + 2 * strokeWidth;
  const circlePerimeter = size * 3.1415;
  const duration = 2;
  const strokeDasharray = `${(process || 0) * circlePerimeter} ${
    (1 - (process || 0)) * circlePerimeter
  }`;
  const isAutoAnimation = process === undefined;
  return (
    <div className={classnames('wm-activity-indicator-rolling', className)}>
      <div className="rolling-container">
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          style={{ width: `${size}px`, height: `${size}px`, transform: `rotateZ(${rotate}deg)` }}
          preserveAspectRatio="xMidYMid"
          className="wm-activity-indicator-svg rolling"
        >
          <circle
            fill="none"
            stroke={borderColor}
            strokeWidth={strokeWidth}
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius}
          />
          {circle || (
            <g className="circle">
              {isAutoAnimation || process > 0 ? (
                <circle
                  className="stroke"
                  cx={viewBoxSize / 2}
                  cy={viewBoxSize / 2}
                  fill={fill}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={
                    isAutoAnimation ? `${(110 * circlePerimeter) / 125}` : strokeDasharray
                  }
                  strokeLinecap={linecap}
                  r={radius}
                >
                  {isAutoAnimation ? (
                    <animate
                      attributeName="stroke-dashoffset"
                      values={`${(360 * circlePerimeter) / 125};${(140 * circlePerimeter) / 125}`}
                      dur="2.2s"
                      keyTimes="0;1"
                      calcMode="spline"
                      fill="freeze"
                      keySplines="0.41,0.314,0.8,0.54"
                      repeatCount="indefinite"
                      begin="0"
                    />
                  ) : null}
                  {isAutoAnimation ? (
                    <animateTransform
                      dur={`${duration}s`}
                      values={`0 ${viewBoxSize / 2} ${viewBoxSize / 2};360 ${viewBoxSize / 2} ${
                        viewBoxSize / 2
                      }`}
                      attributeName="transform"
                      type="rotate"
                      calcMode="linear"
                      keyTimes="0;1"
                      begin="0"
                      repeatCount="indefinite"
                    />
                  ) : null}
                </circle>
              ) : null}
            </g>
          )}
          {defs}
        </svg>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

ActivityIndicatorRolling.defaultProps = {
  size: 70,
  color: '#2F86F6',
  borderColor: 'rgba(0, 0, 0, .1)',
  fill: 'transparent',
  linecap: 'round',
  rotate: 0,
};

export default ActivityIndicatorRolling;
