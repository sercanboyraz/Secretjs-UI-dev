import { Col, Menu, message, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import KeplrWalletStore from '../../stores/keplrWalletStore';
import StakingStore from '../../stores/stakingStore';
import Stores from '../../stores/storeIdentifier';
import Main from '../../images/main.png';

interface IDashboardProps {
  keplrWalletStore: KeplrWalletStore,
  stakingStore: StakingStore,
  history: any
}

interface IDashboardState {
  scrt: number,
  dscrt: number,
  gas: number
}

declare var window: any;
@inject(Stores.KeplrWalletStore, Stores.StakingStore)
@observer
export class Dashboard extends React.Component<IDashboardProps, IDashboardState> {

  state = {
    scrt: 0,
    dscrt: 0,
    gas: 0
  }

  async keplrConnect(e: any) {
    await this.props.keplrWalletStore.loadKeplrWallet().then((result: any) => {
      if (result) {
        message.success({ content: 'Connected to Keplr', style: { right: 0, bottom: 0, position: 'fixed', display: 'flex', justifyContent: 'right', verticalAlign: 'bottom', transformOrigin: 'bottom' } })
      }
    }).catch(x => {
      message.error(x.toString())
    });
    // await this.props.keplrWalletStore.getNetworkBalance().then(x => {
    //   message.success('Claims with get balance')
    // }).catch(x => {
    //   message.error(x.toString())
    // });
  }

  columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: 'Apr',
      dataIndex: 'apr',
      key: 'apr',
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: 'Uptime',
      dataIndex: 'uptime',
      key: 'uptime',
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: 'Commission',
      key: 'commission',
      dataIndex: 'commission',
      render: (text: any) => <div>{text}</div>,
    }
  ];

  menuWallet = (
    <Menu>
      <Menu.Item key="0">
        <a onClick={(e) => this.keplrConnect(e)}>Connect Keplr</a>
      </Menu.Item>
    </Menu>
  );

  rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
  };

  onFinish = (values: any) => {
    console.log('Success:', values);
  };

  onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  async stakeClick() {
    await this.props.keplrWalletStore.stakeSCRT(this.state.scrt.toString()).then(x => {
      this.props.keplrWalletStore.loadKeplrWallet().catch(x => {
        message.error(x.toString())
      });
    }).catch(x => {
      message.error(x.toString())
    })
  }

  isDisable() {
    var result = this.state.scrt > 0 && this.state.gas > 0
    return !result;
  }

  redirect() {
    // window.location.replace(process.env.REACT_APP_APP_BASE_URL + "/stake")
    this.props.history.push("/stake")
  }

  render() {
    const { keplr } = this.props.keplrWalletStore;
    return (
      <React.Fragment>
        {
          !keplr ?
            <>
              <img src={Main} width='100%' style={{ position: "absolute", flex: "auto", margin: 0, padding: 0, left: 0, right: 0, top: 50 }}></img>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'white' }}><a href='https://faucet.secrettestnet.io/' target={'_blank'}>Faucet Secret TestNet Link</a></h3>
              </div>
              <div style={{
                backgroundColor: '#3C2F77',
                opacity: 0.9,
                width: '40%',
                border: '2px solid #3C2F77',
                padding: '30px',
                margin: '0px auto',
                // position: 'absolute',
                // top: '50%',
                // left: '20%',
                // msTransform: 'translateY(-50%)',
                // transform: 'translateY(-50%)',
                marginTop: '10vh',
                borderRadius: 10,
              }}>
                <Row style={{ margin: '30px 0' }}>
                  <Col style={{ margin: '0px auto' }}>
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.1 48.5001C15.6 48.4001 15.2 48.3001 14.7 48.1001C14.2 47.9001 13.8 47.8001 13.4 47.6001C12.5 47.2001 11.7 46.7001 10.9 46.1001C9.3 45.0001 8 43.5001 7 41.7001C6 40.0001 5.4 38.0001 5.3 36.1001C5.2 35.1001 5.3 34.2001 5.4 33.2001C5.5 32.7001 5.6 32.3001 5.7 31.8001C5.8 31.3001 6 30.9001 6.1 30.4001L6.2 31.8001C6.2 32.3001 6.3 32.7001 6.4 33.2001C6.5 34.1001 6.7 35.0001 6.9 35.8001C7.3 37.5001 7.9 39.1001 8.8 40.6001C9.7 42.1001 10.7 43.5001 12 44.8001C12.6 45.4001 13.3 46.0001 14 46.6001C14.3 46.9001 14.7 47.2001 15.1 47.5001L16.1 48.5001ZM15.8 52.1001C15.5 52.3001 15.1 52.4001 14.7 52.5001C14.3 52.6001 14 52.7001 13.6 52.7001C12.9 52.8001 12.1 52.9001 11.3 52.8001C9.8 52.7001 8.2 52.3001 6.9 51.6001C5.5 50.9001 4.3 49.8001 3.5 48.5001C3.1 47.9001 2.7 47.2001 2.4 46.5001C2.3 46.2001 2.2 45.8001 2.1 45.4001C2.1 45.1001 2 44.8001 2 44.4001C2.3 44.7001 2.5 45.0001 2.7 45.2001C3 45.5001 3.2 45.8001 3.4 46.0001C3.9 46.5001 4.3 47.0001 4.8 47.4001C5.8 48.3001 6.8 49.1001 8 49.7001C9.1 50.3001 10.4 50.8001 11.6 51.2001C12.2 51.4001 12.9 51.5001 13.6 51.7001C13.9 51.8001 14.3 51.8001 14.6 51.9001C15.1 52.0001 15.4 52.0001 15.8 52.1001ZM38.4 3.5001C38.9 3.6001 39.3 3.8001 39.8 4.0001C40.3 4.2001 40.7 4.4001 41.1 4.6001C42 5.1001 42.8 5.6001 43.6 6.2001C45.2 7.4001 46.5 9.0001 47.4 10.8001C48.3 12.6001 48.8 14.6001 48.8 16.5001C48.8 17.5001 48.7 18.4001 48.5 19.4001C48.4 19.9001 48.3 20.3001 48.1 20.8001C47.9 21.3001 47.8 21.7001 47.6 22.1001L47.5 20.7001C47.5 20.2001 47.5 19.8001 47.4 19.3001L47.1 16.6001C46.8 14.9001 46.2 13.2001 45.4 11.6001C44.6 10.0001 43.6 8.6001 42.4 7.3001C41.8 6.6001 41.1 6.0001 40.5 5.3001C40.2 5.0001 39.8 4.7001 39.4 4.4001L38.4 3.5001ZM47.1 3.1001C47.5 3.2001 47.8 3.3001 48.1 3.5001C48.4 3.6001 48.8 3.8001 49.1 4.0001C49.7 4.4001 50.3 4.8001 50.9 5.3001C52 6.3001 52.9 7.5001 53.4 8.9001C54 10.3001 54.2 11.8001 54 13.3001C53.9 14.0001 53.7 14.7001 53.5 15.4001C53.4 15.7001 53.2 16.1001 53.1 16.4001C52.9 16.7001 52.8 17.0001 52.5 17.3001V15.3001C52.5 14.6001 52.4 14.0001 52.4 13.4001C52.2 12.1001 52 10.9001 51.5 9.8001C51 8.6001 50.4 7.6001 49.7 6.5001C49.3 6.0001 48.9 5.4001 48.5 4.9001C48.3 4.6001 48.1 4.4001 47.8 4.1001C47.6 3.6001 47.3 3.3001 47.1 3.1001Z" fill="#42ADE2" />
                      <path d="M9.99914 18C7.99914 18.9 7.29914 21.3 8.19914 23.3L20.7991 49.6L27.7991 46.3L15.1991 19.9C14.2991 17.9 11.9991 17 9.99914 18ZM43.0991 38.9L50.4991 35.4L36.0991 5.40004C35.0991 3.40004 32.6991 2.50004 30.5991 3.50004C28.5991 4.50004 27.6991 6.90004 28.6991 9.00004L43.0991 38.9Z" fill="#FFDD67" />
                      <path d="M30.6996 3.40022C30.4996 3.50022 30.2996 3.60022 30.0996 3.80022C31.9996 3.30022 33.9996 4.20022 34.8996 6.00022L49.2996 36.0002L50.5996 35.4002L36.1996 5.40022C35.1996 3.30022 32.7996 2.40022 30.6996 3.40022Z" fill="#EBA352" />
                      <path d="M27.7999 46.2001L35.4999 42.5001L20.7999 11.9001C19.7999 9.80007 17.1999 8.80007 15.0999 9.80007C12.9999 10.8001 12.0999 13.4001 13.0999 15.5001L27.7999 46.2001Z" fill="#FFDD67" />
                      <path d="M15.1 9.90007C14.9 10.0001 14.7 10.1001 14.5 10.3001C16.4 9.80007 18.6 10.7001 19.5 12.6001L28.6 31.7001L30.8 33.0001L20.8 12.0001C19.8 9.80007 17.3 8.90007 15.1 9.90007Z" fill="#EBA352" />
                      <path d="M34.2999 40.1002L41.9999 36.4002L27.2999 5.80018C26.2999 3.70018 23.6999 2.70018 21.5999 3.80018C19.4999 4.80018 18.5999 7.40018 19.5999 9.50018L34.2999 40.1002Z" fill="#FFDD67" />
                      <path d="M21.6004 3.69987C21.4004 3.79987 21.2004 3.99987 21.0004 4.09987C22.9004 3.59987 25.1004 4.49987 26.0004 6.39987L36.3004 27.9999L38.5004 29.2999L27.3004 5.79987C26.3004 3.59987 23.7004 2.69987 21.6004 3.69987ZM10.0004 17.9999C9.80039 18.0999 9.60039 18.1999 9.40039 18.3999C11.2004 17.8999 13.1004 18.7999 13.9004 20.5999L21.4004 36.2999L23.6004 37.5999L15.2004 19.9999C14.3004 17.8999 12.0004 16.9999 10.0004 17.9999Z" fill="#EBA352" />
                      <path d="M60.7999 14.9999C58.0999 12.8999 53.6999 15.1999 51.4999 22.3999C49.9999 27.3999 49.7999 28.8999 46.5999 30.3999L44.7999 26.6999C44.7999 26.6999 16.3999 40.3999 17.4999 42.5999C17.4999 42.5999 20.8999 53.1999 26.6999 58.0999C35.2999 65.4999 55.3999 57.5999 56.2999 38.4999C56.7999 27.3999 63.6999 17.2999 60.7999 14.9999Z" fill="#FFDD67" />
                      <path d="M60.8004 14.9998C60.3004 14.5998 59.7004 14.3998 59.1004 14.2998C59.2004 14.3998 59.4004 14.3998 59.5004 14.4998C62.5004 16.7998 59.4004 22.0998 57.7004 26.8998C56.3004 30.6998 55.1004 34.5998 55.3004 38.3998C56.1004 54.9998 39.4004 62.8998 29.4004 59.8998C39.2004 63.9998 57.4004 56.1998 56.6004 38.8998C56.4004 35.0998 57.5004 31.3998 59.0004 27.3998C60.6004 22.5998 63.7004 17.2998 60.8004 14.9998Z" fill="#EBA352" />
                      <path d="M47.5 30C41.3 30.7 32.2 39.6 38.6 49.3C33.9 39.5 41.6 32.9 46.5 30.6C47 30.2 47.5 30 47.5 30Z" fill="#EBA352" />
                    </svg>
                  </Col>
                </Row>
                <Row style={{ margin: '30px 0' }}>
                  <Col style={{ margin: '0px auto', fontSize: 18, fontWeight: 500, color: 'white' }}>
                    Welcome to the Selenian community!
                  </Col>
                </Row>
                <Row style={{ margin: '30px 0' }}>
                  <Col style={{ margin: '0px auto', fontSize: 18, color: 'white' }}>
                    Please connect your wallet to experience liquid staking with Selenian
                  </Col>
                </Row>
                <Row style={{ margin: '100px 0 0px 0' }}>
                  <Col style={{ margin: '0px auto', fontSize: 18, color: 'white' }}>
                    {/* <Dropdown overlay={this.menuWallet} trigger={['click']} >
                      <Button type="primary" shape="round" onClick={e => e.preventDefault()} icon={<WalletOutlined />} size={'large'} style={{ color: 'white', fontWeight: '500' }}>
                        Connect Wallet
                      </Button>
                    </Dropdown> */}
                  </Col>
                </Row>
              </div>
            </>

            :
            <>
              {
                this.redirect()
              }
            </>
        }

      </React.Fragment >
    );
  }
}

export default Dashboard;