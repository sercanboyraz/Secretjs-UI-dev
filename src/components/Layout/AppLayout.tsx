import './AppLayout.less';
import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import ProtectedRoute from '../../components/Router/ProtectedRoute';
import { appRouters } from '../Router/router.config';
import utils from '../../utils/utils';
import NotFoundRoute from '../Router/NotFoundRoute';
import Stores from '../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import KeplrWalletStore from '../../stores/keplrWalletStore';
import LoadableComponent from '../Loadable';

interface IAppLayoutProps {
  keplrWalletStore: KeplrWalletStore,
  history: any,
  location: any
}

declare var windows: any;
@inject(Stores.KeplrWalletStore)
@observer
class AppLayout extends React.Component<IAppLayoutProps> {
  state = {
    collapsed: false,
    ratio: 0
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onCollapse = (collapsed: any) => {
    this.setState({ collapsed });
  };

  loadBaseComponent() {
    var ttt = LoadableComponent(() => import('../../scenes/Main/mains'))
    return ttt;
  }

  render() {
    const {
      // history,
      location: { pathname },
    } = this.props;

    // function toggleSidebar() {
    //   document.getElementById('sidebar')!.classList.toggle('show');
    // }

    // function toggleDark() {
    //   document.body.classList.toggle('dark');
    // }

    const layout = (
      <>
        
        <Switch>
          {
            pathname === '/' &&
            <Route
              exact key={1000} path={"/"} render={(props) =>
                <ProtectedRoute component={this.loadBaseComponent()} />
              }
            />
          }
          {
            appRouters
              .filter((item: any) => !item.isLayout)
              .map((route: any, index: any) => (
                <Route
                  exact
                  key={index}
                  path={route.path}
                  render={(props) =>
                    <ProtectedRoute component={route.component} />
                  }
                />
              ))
          }
          {
            pathname !== '/' && <NotFoundRoute />
          }
        </Switch>
        
      </>
    );

    return <DocumentTitle title={utils.getPageTitle(pathname)}>{layout}</DocumentTitle>;
  }
}

export default AppLayout;
