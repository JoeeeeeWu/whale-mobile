import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';

type TransitionProps = CSSTransitionProps & {
  name?: string;
  visible: boolean;
};

const Transition: React.FC<TransitionProps> = (props) => {
  const { name, visible, children, ...restProps } = props;
  return (
    <CSSTransition classNames={name} in={visible} unmountOnExit timeout={300} {...restProps}>
      {children}
    </CSSTransition>
  );
};

export default Transition;
