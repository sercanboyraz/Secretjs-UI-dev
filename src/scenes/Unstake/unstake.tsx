import { AudioOutlined } from '@ant-design/icons';
import { Accordion, AccordionDetails, AccordionSummary, FormControl, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { Button, Card, Col, message, Popover, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import KeplrWalletStore from '../../stores/keplrWalletStore';
import StakingStore from '../../stores/stakingStore';
import Stores from '../../stores/storeIdentifier';
import Buttons from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface IStakeProps {
    keplrWalletStore: KeplrWalletStore,
    stakingStore: StakingStore,
    history: any
}

interface IStakeState {
    scrt: number | undefined,
    dscrt: number | undefined,
    gas: number,
    loading: boolean,
    expanded: string | boolean
}
@inject(Stores.KeplrWalletStore, Stores.StakingStore)
@observer
export class Stake extends React.Component<IStakeProps, IStakeState> {

    state = {
        scrt: undefined,
        dscrt: undefined,
        gas: 0,
        loading: false,
        expanded: "panel1"
    }

    componentDidMount() {
        this.props.keplrWalletStore.backgroundVisibilityTrue();
    }

    async unStakeClick() {
        this.setState({ loading: true })
        await this.props.keplrWalletStore.withdrawDSCRT((this.state.dscrt!)).then((result: any) => {
            // console.log(result);
            message.success({ content: 'UnStaking successful :)', style: { right: 0, bottom: 0, position: 'fixed', display: 'flex', justifyContent: 'right', verticalAlign: 'bottom', transformOrigin: 'bottom' } })
            this.props.keplrWalletStore.loadKeplrWallet();
            this.setState({ loading: false, scrt: undefined, dscrt: undefined, gas: 0 })
        }).catch(x => {
            message.error(x.toString());
            this.setState({ loading: false })
        })
    }

    isDisable() {
        var result = this.state.scrt! > 0
        return !result;
    }

    redirect() {
        // window.location.replace(process.env.REACT_APP_APP_BASE_URL + "/stake")
        this.props.history.push("/")
    }

    onSearch() {
        this.setState({ dscrt: this.props.keplrWalletStore.keplr?.networkBalance ? Number.parseInt(this.props.keplrWalletStore.keplr?.networkBalance.toFixed(2)) : undefined })
    }

    suffix = () => (
        <AudioOutlined
            style={{
                fontSize: 16,
                color: '#1890ff',
            }}
        />
    );

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


    expandedHandleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        this.setState({ expanded: isExpanded ? panel : false })
    };


    render() {
        const { keplr } = this.props.keplrWalletStore;
        return (
            <React.Fragment>
                {
                    keplr ?
                        <div style={{ marginTop: 120, zIndex: 0, position: 'absolute', width: '100%', right: 0 }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: 25, color: 'white', fontWeight: 'bold' }}>UNSTAKE SCRT</p>
                            </div>
                            {/* <div style={{ textAlign: 'center' }}>
                                <h3 style={{ color: 'white' }}>Unstake dSCRT to receive SCRT</h3>
                            </div> */}
                            <Row style={{ padding: '30px 30px' }}>
                                <Col xs={0} sm={0} md={0} lg={4} xl={6} xxl={7} >
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={9} xl={7} xxl={6} style={{ margin: '0px auto' }}>
                                    <Card style={{ borderRadius: '10px 10px 1px 1px', backgroundColor: '#333', opacity: 0.9 }} loading={this.state.loading}>
                                        <Row>
                                            <Col {...this.responsiveBig}>
                                                <Row>
                                                    <Col span={24}>
                                                        <div className='whiteColor'>Your dSCRT Balance </div>
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginBottom: 20 }}>
                                                    <Col span={24}>
                                                        {
                                                            keplr!.networkBalance ?
                                                                <h3 style={{ color: 'white', fontWeight: 'bold' }}>{Number.parseFloat(((keplr!.networkBalance!)).toString()).toFixed(2)} dSCRT</h3>
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
                                                        <label style={{ display: 'inline-block', width: '60%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {
                                                                keplr.address
                                                            }
                                                        </label>
                                                        <label style={{ display: 'inline-block', width: '40%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            |&nbsp;
                                                            {
                                                                Number.parseFloat(((keplr.balance!)).toString()).toFixed(2)
                                                            } SCRT
                                                        </label>
                                                    </Button>
                                                </Popover>
                                            </Col>
                                        </Row>
                                        {/* <Divider style={{ background: '#FB6D3A' }} /> */}
                                        {/* <Row>
                                            <Col span={24}>
                                                <div className='whiteColor'>Your dSCRT Balance </div>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginBottom: 20 }}>
                                            <Col span={24}>
                                                {
                                                    keplr!.networkBalance ?
                                                        <h3 style={{ color: 'white', fontWeight: 'bold' }}>{Number.parseFloat(((keplr!.networkBalance!)).toString()).toFixed(2)} dSCRT</h3>
                                                        :
                                                        <Button style={{ background: 'transparent', color: 'white', borderRadius: 10, padding: 8, height: 40 }} onClick={() => this.loadNetworkBalance()}>Load Claim</Button>
                                                }
                                            </Col>
                                        </Row> */}
                                    </Card>
                                    <Card style={{ borderRadius: '10px 10px 10px 10px', backgroundColor: '#111', marginTop: -20, color: 'white' }} loading={this.state.loading}>
                                        <Row className="rowMargin">
                                            <Col span={24} style={{ width: '100%' }}>
                                                {/* <Space style={{ width: '100%' }}>
                                                    <Search placeholder="Amount dSCRT" style={{ width: '100%' }}
                                                        onSearch={(value, e) => this.onSearch()} enterButton="MAX" size="large"
                                                        onChange={(e: any) => { this.setState({ dscrt: Number.parseInt(e.target.value), scrt: e.target.value * keplr!.exchangeRate! }); this.validation(e) }}
                                                        defaultValue={this.state.dscrt} value={this.state.dscrt} />
                                                </Space> */}
                                                <FormControl sx={{ m: 1 }} variant="outlined" style={{ marginBottom: 15, width: '97%' }}>
                                                    <InputLabel htmlFor="outlined-adornment-scrt" style={{ color: 'white' }}>Amount dSCRT</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-scrt"
                                                        color="secondary"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <Buttons variant="contained" className='smallButton' onClick={() => this.onSearch()}>MAX</Buttons>
                                                            </InputAdornment>
                                                        }
                                                        label="Amount dSCRT"
                                                        value={this.state.dscrt}
                                                        onChange={(e: any) => { this.setState({ dscrt: Number.parseInt(e.target.value), scrt: e.target.value * keplr!.exchangeRate! }); this.validation(e) }}
                                                        type="number"
                                                        inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*', style: { borderRadius: 15, borderColor: 'white', borderWidth: 2 } }}
                                                    />
                                                </FormControl>
                                            </Col>
                                        </Row>
                                        <Row style={{ padding: '9px 8px', rowGap: 0, backgroundColor: '#303030', borderRadius: 10, marginBottom: 10 }}>
                                            <Col span={12} style={{ color: '#fff', fontWeight: 900 }}>
                                                You will receive
                                            </Col>
                                            <Col span={12} style={{ color: '#fff', fontWeight: 900 }}>
                                                {this.state.dscrt! > 0 ? Number.parseFloat(this.state.dscrt!).toFixed(2) : 0} dSCRT
                                            </Col>
                                        </Row>
                                        <Row style={{ paddingBottom: 15 }}>
                                            <Col span={12}>
                                                Exchange rate
                                            </Col>
                                            <Col span={12}>
                                                {Number.parseFloat(keplr!.exchangeRate!.toString()).toFixed(2)}
                                            </Col>
                                        </Row>
                                        <Row style={{ paddingBottom: 15 }}>
                                            <Col span={12}>
                                                Transaction cost
                                            </Col>
                                            <Col span={12}>
                                                {keplr.transactionFee}
                                            </Col>
                                        </Row>
                                        <Row style={{ paddingBottom: 15 }}>
                                            <Col span={12}>
                                                Unstaking period
                                            </Col>
                                            <Col span={12}>
                                                21 Days
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                Currently unstaked
                                            </Col>
                                            <Col span={12}>
                                                TBD
                                            </Col>
                                        </Row>

                                        <Button className='stakeButton' onClick={() => this.unStakeClick()} disabled={this.isDisable()} style={{ background: 'transparent !important' }}> Unstake </Button>
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
                            </Row>
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

    validation(e: any) {
        // if (e.target.value === "") {
        //     this.setState({ scrt: undefined, dscrt: undefined })
        // }
        if (Number.parseFloat(e.target.value) > this.props.keplrWalletStore.keplr?.networkBalance!) {
            this.setState({ scrt: undefined, dscrt: undefined })
        }
    }

    loadNetworkBalance() {
        this.setState({ loading: true });
        this.props.keplrWalletStore.getNetworkBalance().then(x => {
            this.setState({ loading: false });
        }).catch(x => {
            message.error(x.toString())
            this.setState({ loading: false });
        });
    }
}

export default Stake;