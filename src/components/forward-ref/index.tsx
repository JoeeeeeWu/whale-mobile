import React from 'react';

function forwardRef(WrappedComponent: React.FC<any>) {
  // eslint-disable-next-line react/prefer-stateless-function
  class ForwardRefComponent extends React.Component {
    render() {
      const { ...rest } = this.props;
      return <WrappedComponent {...rest} />;
    }
  }

  return React.forwardRef((props: any, ref) => {
    return <ForwardRefComponent ref={ref} {...props} />;
  });
}

export default forwardRef;
