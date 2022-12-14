import { AudioOutlined } from '@ant-design/icons';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { Button, Card, Col, message, Popover, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import * as React from 'react';
import KeplrWalletStore from '../../stores/keplrWalletStore';
import StakingStore from '../../stores/stakingStore';
import Stores from '../../stores/storeIdentifier';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


interface IClaimsProps {
  keplrWalletStore: KeplrWalletStore,
  stakingStore: StakingStore,
  history: any
}

interface IClaimsState {
  scrt: number,
  dscrt: number,
  gas: number,
  loading: boolean,
  expanded: string | boolean
}

@inject(Stores.KeplrWalletStore, Stores.StakingStore)
@observer
export class Claims extends React.Component<IClaimsProps, IClaimsState> {

  state = {
    scrt: 0,
    dscrt: 0,
    gas: 0,
    loading: false,
    expanded: "panel1"
  }

  componentDidMount() {
    this.props.keplrWalletStore.backgroundVisibilityTrue();
  }

  async stakeClick() {
    this.setState({ loading: true })
    await this.props.keplrWalletStore.withdrawDSCRT(this.state.scrt.toString()).then((result: any) => {
      // console.log(result);
      message.success({ content: 'UnStaking successful :)', style: { right: 0, bottom: 0, position: 'fixed', display: 'flex', justifyContent: 'right', verticalAlign: 'bottom', transformOrigin: 'bottom' } })
      this.props.keplrWalletStore.loadKeplrWallet();
      this.setState({ loading: false, scrt: 0, dscrt: 0, gas: 0 })
    }).catch(x => {
      message.error(x)
      this.setState({ loading: false })
    })
  }

  isDisable() {
    var result = this.state.scrt > 0
    return !result;
  }

  redirect() {
    // window.location.replace(process.env.REACT_APP_APP_BASE_URL + "/stake")
    this.props.history.push("/")
  }

  onSearch() {
    this.setState({ scrt: Number.parseInt(this.props.keplrWalletStore.keplr!.balance!.toFixed(2)) })
  }

  suffix = () => (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1890ff',
      }}
    />
  );

  loadClaims() {
    this.setState({ loading: true })
    this.props.keplrWalletStore.getNetworkBalance().then(x => {
      this.setState({ loading: false })
    }).catch(x => {
      message.error(x.toString())
      this.setState({ loading: false });
    });
  }

  responsiveBig = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12
  }

  responsiveContent = {
    xs: 24,
    sm: 24,
    md: 10,
    lg: 6,
  }

  responsiveTable = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 8,
    xl: 8
  }

  responsiveTable2 = {
    xs: 24,
    sm: 12,
    md: 4,
    lg: 4,
    xl: 4
  }

  expandedHandleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    this.setState({ expanded: isExpanded ? panel : false })
  };

  columns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: any) => <div></div>,
    },
    {
      title: 'Unstake Request Time',
      dataIndex: 'available_time',
      key: 'available_time2',
      render: (text: any) => <div></div>,
    },
    {
      title: 'Approximate Release Time',
      dataIndex: 'available_time',
      key: 'available_time1',
      render: (text: any) => <div></div>,
    },
  ];

  render() {
    const { keplr, withdraw } = this.props.keplrWalletStore;
    return (
      <React.Fragment>
        {
          keplr ?
            <div style={{ marginTop: 120, zIndex: 0, position: 'absolute', width: '100%', right: 0 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 25, color: 'white', fontWeight: 'bold' }}>CLAIM</p>
              </div>

              <Row style={{ padding: '30px 30px' }}>
                <Col xs={0} sm={0} md={0} lg={4} xl={6} xxl={7} >
                </Col>
                <Col xs={24} sm={24} md={12} lg={9} xl={7} xxl={6} style={{ margin: '0px auto' }}>
                  <Card style={{ borderRadius: '10px 10px 1px 1px', backgroundColor: '#333', opacity: 0.9 }} loading={this.state.loading}>
                    <Row >
                      <Col {...this.responsiveBig}>
                        <Row >
                          <Col span={24}>
                            <div className='whiteColor'>Your dSCRT Balance </div>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 20 }}>
                          <Col span={24}>
                            {
                              keplr!.networkBalance ?
                                <h3 style={{ color: 'white', fontWeight: 'bold' }}>{Number.parseFloat(((keplr!.networkBalance!)).toString()).toFixed(2)} SCRT</h3>
                                :
                                <Button style={{ background: 'transparent', color: 'white', borderRadius: 10, padding: 8, height: 40 }} onClick={() => this.loadNetworkBalance()}>Load Claim</Button>
                            }
                          </Col>
                        </Row>
                      </Col>
                      <Col {...this.responsiveBig}>
                        <Popover placement="bottomRight" style={{ background: '#241A52' }} trigger="click">
                          <Button type="primary" shape="round" onClick={e => (e.preventDefault(), navigator.clipboard.writeText(keplr?.address!), message.info({ content: 'Wallet address copied to clipboard', style: { right: 0, bottom: 0, position: 'fixed', display: 'flex', justifyContent: 'right', verticalAlign: 'bottom', transformOrigin: 'bottom' } }))} size={'large'}
                            style={{ color: 'white', fontWeight: '500', display: 'inline-block', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden !important', textOverflow: 'ellipsis', marginTop: 10 }}>
                            <label style={{ display: 'inline-block', width: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {
                                keplr.address
                              }
                            </label>
                            <label style={{ display: 'inline-block', width: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              |
                              {
                                keplr.balanceString
                              }
                            </label>
                          </Button>
                        </Popover>
                      </Col>
                    </Row>
                  </Card>
                  <Card style={{ borderRadius: '10px 10px 10px 10px', backgroundColor: '#111', marginTop: -20, color: 'white' }} loading={this.state.loading}>
                    <Row className="rowMargin">
                      <Col span={24} style={{ width: '100%' }}>
                        <h3 style={{ color: 'white', textAlign: 'left' }}>Pending  unstaking  requests</h3>
                      </Col>
                    </Row>
                    <Row justify="center" className="rowMarginTop">
                      <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="left"><strong>Amount</strong></TableCell>
                              <TableCell align="left"><strong>Unstake Request Time</strong></TableCell>
                              <TableCell align="left"><strong>Approximate Release Time</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                              withdraw!.map((row: any) => (
                                <TableRow
                                  key={row.name}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <TableCell align="left">{Number.parseFloat(((Number.parseInt(row.amount!) / 1000000)).toString()).toFixed(2)} SCRT</TableCell>
                                  <TableCell align="left">{this.convertDate(row.available_time!)}</TableCell>
                                  <TableCell align="left">{this.releaseDate(row.available_time!)}</TableCell>
                                  <TableCell align="left"> <Button onClick={() => this.props.keplrWalletStore.updateClaims()} >Click</Button></TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={7} xl={5} xxl={4} >
                  <div style={{ marginLeft: 30, marginTop: -5 }}>
                    <Accordion expanded={this.state.expanded === 'panel1'} onChange={this.expandedHandleChange('panel1')}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography style={{ margin: '0px auto' }}>
                          What is Staking?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                          Aliquam eget maximus est, id dignissim quam.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={this.state.expanded === 'panel2'} onChange={this.expandedHandleChange('panel2')}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography style={{ margin: '0px auto' }}>
                          Users
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                          varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                          laoreet.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={this.state.expanded === 'panel3'} onChange={this.expandedHandleChange('panel3')}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography style={{ margin: '0px auto' }}>
                          Advanced settings
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                          amet egestas eros, vitae egestas augue. Duis vel est augue.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    <div style={{ marginTop: 10, fontWeight: 600 }}>
                      <a href="https://discord.gg/D5pXt6XuTk" target={'_blank'} style={{ color: 'white', fontWeight: 500, marginLeft: 25, marginTop: 45 }} className="discordLink">Need help? Contact us!</a>
                    </div>
                  </div>
                </Col>
                <Col xs={0} sm={0} md={0} lg={4} xl={6} xxl={7} >
                </Col>
              </Row >

            </div>
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

  displayButton(sendadate: number) {
    var getDateNow = moment().unix()
    var t = new Date(sendadate * 1000);
    var addDays = moment(t).add(21, 'days').unix();
    if (addDays < getDateNow) {
      return true;
    }
    else {
      return false;
    }
  }

  loadNetworkBalance(): void {
    this.setState({ loading: true });
    this.props.keplrWalletStore.getNetworkBalance().then(x => {
      this.setState({ loading: false });
    }).catch(x => {
      message.error(x.toString())
      this.setState({ loading: false });
    });
  }

  releaseDate(arg0: number) {
    if (arg0 == undefined || arg0 == null || arg0 <= 0) {
      var dateNow = new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now());
      return dateNow;
    }
    else {
      var t = new Date(arg0 * 1000);
      var addDays = moment(t).add(21, 'days');
      var getData = new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(addDays.unix() * 1000);
      return getData;
    }
  }

  convertDate(arg0: number) {
    if (arg0 == undefined || arg0 == null || arg0 <= 0) {
      var dateNow = new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now());
      return dateNow;
    }
    else {
      var getData = new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(arg0 * 1000);
      return getData;
    }
  }
}

export default Claims; 