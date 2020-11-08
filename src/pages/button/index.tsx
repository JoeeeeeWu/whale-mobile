import React from 'react';
import Button from '../../components/button';
// import ActivityIndicatorRolling from '../../components/activity-indicator/roller';

const ButtonPage: React.FC = () => {
  return (
    <>
      <Button type="default">Default</Button>
      <Button type="default" inactive>
        Default Inactive
      </Button>
      <Button type="primary">Default</Button>
      <Button type="primary" inactive>
        Default Inactive
      </Button>
      <Button type="primary" loading>
        Loading
      </Button>
      <Button type="warning">Warning</Button>
      <Button type="warning" inactive>
        Warning Inactive
      </Button>
      <Button type="disabled" inactive>
        Disabled
      </Button>

      <Button type="default" plain>
        Default & Plain
      </Button>
      <Button type="primary" plain>
        Primary & Plain
      </Button>
      <Button type="warning" plain>
        Warning & Plain
      </Button>
      <Button type="disabled" plain>
        Disabled & Plain
      </Button>
      <Button type="primary" plain round>
        Primary & Plain & Round
      </Button>
      <Button type="primary" plain round loading>
        Loading
      </Button>
    </>
  );
};

export default ButtonPage;
