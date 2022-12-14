import './index.less';
import * as React from 'react';
import { Button, Col, Menu, message, Row } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import Stores from '../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import KeplrWalletStore from '../../stores/keplrWalletStore';
import { appRouters } from '../../components/Router/router.config';
import utils from '../../utils/utils';
import nightWhite from '../../images/night-white.svg';

declare var window: any;
@inject(Stores.KeplrWalletStore)
@observer
export class Header extends React.Component<any> {

  state = {
    isSelect: "",
    stake: true,
    anchorEl: null,
    openMenu: false
  }

  handleResize() {
    // window.location.reload();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  keplrConnect(e: any) {
    console.log(e);
  }

  loadKeplrWallet(keplrWalletStore: KeplrWalletStore) {
    keplrWalletStore.loadKeplrWallet().then((result: any) => {
      if (result) {
        message.success({ content: 'Connected to Keplr', style: { right: 0, bottom: 0, position: 'fixed', display: 'flex', justifyContent: 'right', verticalAlign: 'bottom', transformOrigin: 'bottom' } })
      }
    })
  }

  // menuWallet = (keplrWalletStore: KeplrWalletStore) => (
  //   <Menu>
  //     <Menu.Item key="0">
  //       <a onClick={(e) => this.loadKeplrWallet(keplrWalletStore)}>Connect Keplr</a>
  //     </Menu.Item>
  //   </Menu>
  // );

  menuLoginWallet = (storeKepler: KeplrWalletStore) => (
    <div className='fff'>
      <Row style={{ borderBottom: '1px solid #fff' }}>
        <Col style={{ padding: 10, display: 'inline-block', width: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <label placeholder={storeKepler.keplr?.address} onClick={() => { navigator.clipboard.writeText(storeKepler.keplr?.address!); message.info({ content: 'Wallet address copied to clipboard', style: { right: 0, bottom: 0, position: 'fixed', display: 'flex', justifyContent: 'right', verticalAlign: 'bottom', transformOrigin: 'bottom' } }); }}>
            {storeKepler.keplr?.address}
          </label>
        </Col>
      </Row>
      <Row>
        <Col span={8} style={{ float: 'left', padding: 10 }}>SCRT</Col>
        <Col span={16} style={{ float: 'right', padding: 10 }}>{storeKepler.keplr?.balance}</Col>
      </Row>
      <Row>
        <Col style={{ padding: 10 }}>
          <Button type="primary" shape="round"
            onClick={e =>
            (
              e.preventDefault(),
              storeKepler.clearWallet(),
              storeKepler.setVisibilityFalse(),
              storeKepler.backgroundVisibilityTrue(),
              this.setState({ isSelect: "", stake: true, convert: false, unstake: false, claim: false }),
              message.warning({ content: "Disconnected to Keplr", style: { right: 0, bottom: 0, position: 'fixed', display: 'flex', justifyContent: 'right', verticalAlign: 'bottom', transformOrigin: 'bottom' } }))
            }
            icon={<WalletOutlined />}
            size={'large'}
            style={{ color: 'white', fontWeight: '500', width: 260 }}
          >
            Disconnect Wallet
          </Button>
        </Col>
      </Row>
    </div>
  );

  handleMouseEnter(data: string, select: boolean) {
    var lastData = !this.state[data];
    if (select) {
      lastData = true;
    }
    else {
      if (lastData) {
        lastData = true;
      }
    }
    this.setState({ [data]: lastData });
  }

  handleMouseClick(data: string) {
    Object.keys(this.state).forEach(key => {
      this.state[key] = false;
    });

    this.setState({ isSelect: data });
  }

  handleClick = (event: any) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleNavDropdown() {
    var el = document.getElementById('navbar-dropdown')!;
    el.classList.toggle("show");

    var ele = document.getElementById("navbar")!;
    ele.classList.toggle("top-0");
  }

  render() {
    const { history } = this.props;
    const { keplr } = this.props.keplrWalletStore;
    const currentRoute = utils.getRoute(history.location.pathname);
    return (
      <div>
        {
          keplr ?
            <Col style={{ textAlign: 'left', background: 'black', color: 'white', fontSize: 20 }} xl={12} lg={12} md={12} sm={18} xs={18}>
              <Menu theme='dark' mode="horizontal" selectedKeys={[currentRoute ? currentRoute.path : '']} style={{ position: 'relative', display: 'flex', justifyContent: 'center', backgroundColor: 'black' }}>
                {
                  appRouters
                    .filter((item: any) => !item.isLayout && item.showInMenu)
                    .map((route: any, index: number) => {
                      return (
                        <Menu.Item key={route.path}
                          onClick={() => { this.handleMouseClick(route.name); history.push(route.path) }}
                          onMouseEnter={() => this.handleMouseEnter(route.name, false)}
                          onMouseLeave={() => this.handleMouseEnter(route.name, false)}>
                          {
                            this.state.isSelect == route.name ?
                              <route.iconSelect />
                              :
                              this.state[route.name] ?
                                <route.iconSelect />
                                :
                                <route.icon />
                          }
                          <span style={{ color: 'white' }}>{route.title}</span>
                        </Menu.Item>
                      );
                    })
                }
              </Menu>
            </Col>
            :
            <div className="navigation" id="navbar">
              <div className="container max-w">
                <div className="brand">
                  <a href="#" className="link logo"><img src="" alt="" /></a>
                </div>
                <div className="menu homepage">
                  <div className="dropdown">
                    <button className="button icon" onClick={() => this.toggleNavDropdown()} >
                      <img src="" alt="" style={{ pointerEvents: "none" }} />
                    </button>
                    <div className="dropdown-content" id="navbar-dropdown">
                      <a href="#about" className="link">About</a>
                      <a href="#networks" className="link">Networks</a>
                      <a href="#roadmap" className="link">Roadmap</a>
                      <a href="https://medium.com/@selenian" target="_blank" className="link">Blog</a>
                      <div className="dropdown-cta hide">
                        <button className="button launch">Launch App</button>
                      </div>
                    </div>
                  </div>
                  <div className="cta hide">
                    <button className="button launch">Launch App</button>
                  </div>
                </div>
                <div className="menu app hide">
                  <button className="button login">username7475@gmail.com</button>
                  <button className="button lights">
                    <img src={nightWhite} alt="" style={{ height: 14 }} />
                  </button>
                </div>
              </div>
            </div>
        }
      </div>
    );
  }
}

export default Header;
