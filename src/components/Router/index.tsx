import * as React from 'react';

import {  Switch } from 'react-router-dom';

import utils from '../../utils/utils';
// import UserLayout from '../Layout/UserLayout';
import ProtectedRoute from './ProtectedRoute';

const Router = () => {
  const AppLayout = utils.getRoute('/layout').component;

  return (
    <Switch>
      <ProtectedRoute path="/" render={(props: any) => <AppLayout {...props} exact />} />
      {/* <Route path="/stake" render={(props: any) => <UserLayout {...props} />} /> */}
    </Switch>
  );
};

export default Router;
