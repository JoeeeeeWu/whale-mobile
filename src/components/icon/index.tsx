import React from 'react';
import classnames from 'classnames';
import loadSprite from './load-spirte';
import defaultSvg from './default-svg-list';
import './index.less';

interface IconProps {
  name?: string;
  size?: string;
  color?: string;
  svg?: boolean;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = (props) => {
  const {
    svg,
    name,
    size,
    color,
    onClick,
  } = props;
  const isInnerSvg = !!defaultSvg[name as string];
  React.useEffect(() => loadSprite(), []);
  if (svg || isInnerSvg) {
    return (
      <svg
        className={classnames(
          'wm-icon',
          'icon-svg',
          `wm-icon-${name}`,
          size,
        )}
        style={{ fill: color }}
        onClick={onClick}
      >
        <use xlinkHref={`#${name}`} />
      </svg>
    );
  }
  if (name) {
    return (
      <i
        className={classnames(
          'wm-icon',
          'icon-font',
          `wm-icon-${name}`,
          name,
          size,
        )}
        style={{ color }}
        onClick={onClick}
      />
    );
  }
  return null;
};

Icon.defaultProps = {
  name: '',
  size: 'md',
  color: '',
  svg: false,
};

export default Icon;
