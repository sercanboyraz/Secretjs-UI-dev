import { AudioOutlined } from '@ant-design/icons';
import { Col, Divider, message, Row, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import DividerImage from '../../images/dividerImage.png';
import DividerImage2 from '../../images/dividerImage2.png';
import FooterLeft from '../../images/footerLeft.png';
import KeplrWalletStore from '../../stores/keplrWalletStore';
import Stores from '../../stores/storeIdentifier';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Buttons from '@mui/material/Button';
import axios from 'axios';
import AppConsts from '../../lib/appconst';
const qs = require('qs');

interface IDashboardProps {
    keplrWalletStore: KeplrWalletStore,
    history: any,
}

const http = axios.create({
    baseURL: AppConsts.remoteServiceBaseUrl,
    timeout: 60000,
    paramsSerializer: function (params) {
        return qs.stringify(params, {
            encode: false,
        });
    },
});

declare var window: any;
@inject(Stores.KeplrWalletStore)
@observer
export class OtherPage extends React.Component<IDashboardProps> {

    state = {
        width: 0,
        email: undefined,
        ratio: 0
    }

    componentDidMount() {
        // this.props.keplrWalletStore.backgroundVisibilityFalse();
        // this.props.keplrWalletStore.setVisibility();
        if (window.innerWidth > 2200) {
            this.setState({ ratio: 1 })
        }
        else if (window.innerWidth > 1900) {
            this.setState({ ratio: 0.8 })
        }
        else if (window.innerWidth > 1601) {
            this.setState({ ratio: 0.7 })
        }
        else if (window.innerWidth > 1401) {
            this.setState({ ratio: 0.5 })
        }
        else if (window.innerWidth > 1101) {
            this.setState({ ratio: 0.5 })
        }
        else if (window.innerWidth > 901) {
            this.setState({ ratio: 0.4 })
        }
        else if (window.innerWidth > 600) {
            this.setState({ ratio: 0.4 })
        }
        else {
            this.setState({ ratio: 0.4 })
        }
    }

    loadKeplrWallet() {
        this.props.keplrWalletStore.loadKeplrWallet().then((result: any) => {
            if (result) {
                message.success({ content: 'Connected to Keplr', style: { right: 0, bottom: 0, position: 'fixed', display: 'flex', justifyContent: 'right', verticalAlign: 'bottom', transformOrigin: 'bottom' } })
            }
        })
    }

    redirect() {
        this.props.history.push("/stake")
    }

    suffix = () => (
        <AudioOutlined
            style={{
                fontSize: 16,
                color: '#1890ff',
            }}
        />
    );

    SubscriptionInsert(): void {
        if (/.+@.+\.[A-Za-z]+$/.test(this.state.email!)) {
            var input: any = {};
            input.EmailAddress = this.state.email;
            input.Name = this.state.email;
            input.SurName = this.state.email;
            input.UserName = this.state.email;
            http.post("api/services/app/User/SubscriptionAdd", input).then(x => {
                message.success("Subscription successful");
                this.setState({ email: undefined })
            })
        }
    }

    render() {
        const { keplr } = this.props.keplrWalletStore;
        return (
            <div style={{ overflow: 'auto', height: '100%', backgroundColor: '#fff !important' }}>
                {
                    !keplr ?
                        <>
                            <div style={{ height: 1290 * this.state.ratio }}></div>
                            <div style={{ height: 129 * this.state.ratio }} id="about"></div>
                            <div>
                                <Row style={{ marginBottom: 0 }} >
                                    <Col xl={12} lg={12} md={4} sm={4} xs={4}>
                                        <p style={{ fontSize: 70 * this.state.ratio, marginBottom: 10, color: '#fff !important' }}>01</p>
                                    </Col>
                                    <Col xl={12} lg={12} md={20} sm={20} xs={20}>
                                        <p style={{ fontSize: 70 * this.state.ratio, marginBottom: 10, color: '#fff !important' }}>ABOUT SELENIAN</p>
                                    </Col>
                                </Row>
                                <Divider style={{ backgroundColor: '#efefef', marginTop: 0 }}></Divider>
                                <Row>
                                    <Col xl={12} lg={12} md={0} sm={0} xs={0}>

                                    </Col>
                                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>

                                        {
                                            window.innerWidth < 600 ?
                                                <Row>
                                                    <Col span={23} offset={1}>
                                                        <p style={{ fontSize: 24, marginBottom: 2, color: '#fff !important' }}>se·​le·​ni·​an | \ sə̇ˈlēnēən \</p>
                                                        <p style={{ fontSize: 24, marginBottom: 10, color: '#fff !important' }}>: of, relating to, or designating the moon</p>
                                                        <p style={{ fontSize: 24, marginBottom: 10, color: '#fff !important' }}>Selenian summit refers to the "highest" point on the Moon, notionally similar to Mount Everest on the Earth. This is where we want to take our users.</p>
                                                        <p style={{ fontSize: 24, marginBottom: 10, color: '#fff !important' }}>Selenian Protocol aims to become the go-to decentralized finance hub for Cosmos -Internet-of-Blockchains ecosystem- both for yield optimization and ease of User Experience. We help users collect the best returns on Cosmos with hassle-free products.</p>
                                                        <br />
                                                    </Col>
                                                </Row>
                                                :
                                                <Row>
                                                    <Col span={11} offset={1}>
                                                        <p style={{ fontSize: 24, marginBottom: 2, color: '#fff !important' }}>se·​le·​ni·​an | \ sə̇ˈlēnēən \</p>
                                                        <p style={{ fontSize: 24, marginBottom: 10, color: '#fff !important' }}>: of, relating to, or designating the moon</p>
                                                        <p style={{ fontSize: 24, marginBottom: 10, color: '#fff !important' }}>Selenian summit refers to the "highest" point on the Moon, notionally similar to Mount Everest on the Earth. This is where we want to take our users.</p>
                                                    </Col>
                                                    <Col span={11} offset={1}>
                                                        <p style={{ fontSize: 24, marginBottom: 10, color: '#fff !important' }}>Selenian Protocol aims to become the go-to decentralized finance hub for Cosmos -Internet-of-Blockchains ecosystem- both for yield optimization and ease of User Experience. We help users collect the best returns on Cosmos with hassle-free products.</p>
                                                        {/* <p style={{ fontSize: 24, marginBottom: 10, color: '#fff !important' }}>Selenian protocol will then build a lending protocol and other banking products. </p> */}
                                                        <br /><br /><br />
                                                    </Col>
                                                </Row>
                                        }
                                        <Row justify="end">
                                            <Col span={24} style={{ textAlign: 'right', marginRight: window.innerWidth < 600 ? 1 : 40 }}>
                                                <p style={{ fontSize: 30 }}><a href="https://discord.gg/PrUdPENRqk" target={'_blank'} style={{ color: 'white', fontWeight: 500 }}>Discord</a>   |   <a href="https://medium.com/@selenian" target="_blank" style={{ color: 'white', fontWeight: 500 }}>Medium</a>   |   <a href="https://twitter.com/SelenianNetwork" target="_blank" style={{ color: 'white', fontWeight: 500 }}>Twitter</a></p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                            {
                                window.innerWidth > 600 &&
                                <div style={{ marginTop: 100 }} >
                                    <img src={DividerImage} style={{ width: '100%', height: 240 }}></img>
                                </div>
                            }

                            <div style={{ height: 100 }} id="networks"></div>
                            <div>
                                <Row style={{ marginBottom: 0 }}>
                                    <Col span={24}>
                                        <p style={{ fontSize: 70 * this.state.ratio, marginBottom: 10, color: '#fff !important' }}>02 &nbsp;&nbsp;&nbsp;NETWORKS</p>
                                    </Col>
                                </Row>
                                <Divider style={{ backgroundColor: '#efefef', marginTop: 0, marginBottom: 50 }}></Divider>
                                <Row justify="space-around" align="middle">
                                    <Col xl={2} lg={1} md={1} sm={1} xs={1} style={{ display: "table", overflow: "hidden" }}>
                                    </Col>
                                    <Col xl={2} lg={2} md={5} sm={23} xs={23} style={{ display: "table", overflow: "hidden" }}>
                                        <p style={{ fontSize: 28, marginBottom: 10, display: " table-cell", verticalAlign: "middle", color: '#fff !important' }}>SCRT</p>
                                    </Col>
                                    <Col xl={12} lg={12} md={17} sm={23} xs={23} offset={1} style={{ display: "table", overflow: "hidden" }}>
                                        <p style={{ fontSize: 24, marginBottom: 10, display: " table-cell", verticalAlign: "middle", color: '#fff !important' }}>Secret is the first blockchain with privacy-preserving smart contracts. Built to protect data and empower users.</p>
                                    </Col>
                                    {/* <Col xl={6} lg={6} md={15} sm={23} xs={23} offset={1} style={{ display: "table", overflow: "hidden" }}>
                                        <p style={{ fontSize: 28, marginBottom: 10, display: " table-cell", verticalAlign: "middle", color: '#fff !important' }} ><strong style={{ color: '#482EFF', }}>10% APR — $5 Million Staked</strong> </p>
                                    </Col> */}
                                    <Col xl={4} lg={5} md={4} sm={24} xs={24} style={{ display: "table", overflow: "hidden" }}>
                                        <Button style={{ background: 'transparent', borderRadius: 20, padding: 7, height: 60, fontSize: 24, color: 'white', width: 230, zIndex: 10, display: 'block', margin: 'auto' }}
                                            onClick={() => this.loadKeplrWallet()}>
                                            Stake Now
                                        </Button>
                                        {/* <Button style={{ background: 'transparent', borderRadius: 20, padding: 7, height: 60, fontSize: 24, color: 'white', width: 230, zIndex: 10, display: 'block', margin: 'auto' }}
                                        >
                                            Coming Soon
                                        </Button> */}
                                    </Col>
                                    <Col xl={2} lg={1} md={0} sm={0} xs={0} style={{ display: "table", overflow: "hidden" }}>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={2} lg={1} md={1} sm={1} xs={1} style={{ display: "table", overflow: "hidden" }}>
                                    </Col>
                                    <Col span={20} style={{ display: "table", overflow: "hidden" }}>
                                        <Divider style={{ backgroundColor: '#efefef', marginTop: 20, marginBottom: 30 }}></Divider>
                                    </Col>
                                    <Col xl={2} lg={1} md={1} sm={1} xs={1} style={{ display: "table", overflow: "hidden" }}>
                                    </Col>
                                </Row>
                                <Row justify="space-around" align="middle">
                                    <Col xl={2} lg={1} md={1} sm={1} xs={1} style={{ display: "table", overflow: "hidden" }}>
                                    </Col>
                                    <Col xl={2} lg={2} md={5} sm={23} xs={23} style={{ display: "table", overflow: "hidden" }}>
                                        <p style={{ fontSize: 28, marginBottom: 10, display: " table-cell", verticalAlign: "middle", color: '#fff !important' }}>JUNO</p>
                                    </Col>
                                    <Col xl={12} lg={12} md={17} sm={23} xs={23} offset={1} style={{ display: "table", overflow: "hidden" }}>
                                        <p style={{ fontSize: 24, marginBottom: 10, display: " table-cell", verticalAlign: "middle", color: '#fff !important' }}>
                                            Juno originates & evolves from a community driven initiative, prompted by dozens of developers, validators & delegators in the Cosmos ecosystem.
                                        </p>
                                    </Col>
                                    {/* <Col xl={6} lg={6} md={15} sm={23} xs={23} offset={1} style={{ display: "table", overflow: "hidden" }}>
                                        <p style={{ fontSize: 28, marginBottom: 10, display: " table-cell", verticalAlign: "middle", color: '#fff !important' }} ><strong style={{ color: '#482EFF', }}>7% APR — $3 Million Staked </strong></p>
                                    </Col> */}
                                    <Col xl={4} lg={5} md={4} sm={24} xs={24} style={{ display: "table", overflow: "hidden" }}>
                                        <Button style={{ background: 'transparent', borderRadius: 20, padding: 7, height: 60, fontSize: 24, color: 'white', width: 230, zIndex: 10, display: 'block', margin: 'auto' }}
                                            onClick={() => this.loadKeplrWallet()}
                                            >
                                            Stake Now
                                        </Button>
                                        {/* <Button style={{ background: 'transparent', borderRadius: 20, padding: 7, height: 60, fontSize: 24, color: 'white', width: 230, zIndex: 10, display: 'block', margin: 'auto' }} >
                                            Coming Soon
                                        </Button> */}
                                    </Col>
                                    <Col xl={2} lg={1} md={0} sm={0} xs={0} style={{ display: "table", overflow: "hidden" }}>
                                    </Col>
                                </Row>
                            </div>
                            {
                                window.innerWidth > 600 &&
                                <div style={{ marginTop: 100 }}>
                                    <img src={DividerImage2} style={{ width: '100%', height: 240 }}></img>
                                </div>
                            }
                            <div style={{ height: 100 }} id="roadmap"></div>
                            <div>
                                <Row style={{ marginBottom: 0 }}>
                                    <Col xl={12} lg={12} md={4} sm={4} xs={4}>
                                        <p style={{ fontSize: 70 * this.state.ratio, marginBottom: 10, color: '#fff !important' }}>03</p>
                                    </Col>
                                    <Col xl={12} lg={12} md={20} sm={20} xs={20}>
                                        <p style={{ fontSize: 70 * this.state.ratio, marginBottom: 10, color: '#fff !important' }}>ROADMAP</p>
                                    </Col>
                                </Row>
                                <Divider style={{ backgroundColor: '#efefef', marginTop: 0 }}></Divider>
                                <Row>
                                    <Col xl={12} lg={12} md={12} sm={0} xs={0}>

                                    </Col>
                                    <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <Row>
                                            <Col span={24}>
                                                <p style={{ fontSize: 24, marginLeft: 10, marginBottom: 10, color: '#fff !important' }}>
                                                    We have a rich roadmap and we will be launching innovative tools and widgets that will help users from all backgrounds benefit from the advantages of DeFi.
                                                </p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                            <div style={{ marginTop: 100 }}>
                                <Divider type="horizontal" style={{ width: "100%", backgroundColor: '#efefef', marginTop: 0 }} />
                                <Divider type="horizontal" style={{ width: "100%", backgroundColor: '#efefef', marginTop: 0 }} />
                                <Divider type="horizontal" style={{ width: "100%", backgroundColor: '#efefef', marginTop: 0 }} />
                                <Row style={{ margin: '40px 0' }}>
                                    <Col xl={4} lg={4} md={3} sm={0} xs={0}>
                                        {/* <Divider type="vertical" style={{ height: 270 * this.state.ratio, width: 1, backgroundColor: 'rgb(239, 239, 239)', margin: '-90px 27px -127px 0px', float: 'right' }} />
                                        <Divider type="vertical" style={{ height: 270 * this.state.ratio, width: 1, backgroundColor: 'rgb(239, 239, 239)', margin: '-90px 27px -127px 0px', float: 'right' }} /> */}
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={0} xs={0} offset={1}>
                                        <div><strong style={{ color: '#482EFF', fontSize: 32, textAlign: 'center' }}>STEP 01 <br /> Q2 2022 </strong></div>
                                        <p style={{ fontSize: 20, marginBottom: 10, color: '#fff !important' }}>Selenian Protocol will initially allow staking derivatives on Secret Network and Juno. </p>
                                        {/* <List style={{ marginTop: 30, color: 'white' }}>
                                            <List.Item style={{ color: 'white', fontSize: 20 }}>- STAKING DERIVATIVES ON SECRET NETWORK</List.Item>
                                            <List.Item style={{ color: 'white', fontSize: 20 }}>- STAKING DERIVATIVES ON JUNO NETWORK</List.Item>
                                        </List> */}
                                    </Col>
                                    <Col xl={0} lg={0} md={0} sm={22} xs={22} offset={1}>
                                        <div><strong style={{ color: '#482EFF', fontSize: 32, textAlign: 'center' }}>STEP 01 <br /> Q2 2022 </strong></div>
                                        <p style={{ fontSize: 20, marginBottom: 10, color: '#fff !important' }}>Selenian Protocol will initially allow staking derivatives on Secret Network and Juno. </p>
                                        {/* <List style={{ marginTop: 30, color: 'white' }}>
                                            <List.Item style={{ color: 'white', fontSize: 20 }}>- STAKING DERIVATIVES ON SECRET NETWORK</List.Item>
                                            <List.Item style={{ color: 'white', fontSize: 20 }}>- STAKING DERIVATIVES ON JUNO NETWORK</List.Item>
                                        </List> */}
                                    </Col>
                                    <Col xl={2} lg={2} md={2} sm={0} xs={0} style={{ borderLeft: '1px solid', borderRight: '1px solid' }}>
                                        {/* <Divider type="vertical" style={{ height: 270 * this.state.ratio, width: 1, backgroundColor: 'rgb(239, 239, 239)', margin: '-90px 0px -127px 35%' }} />
                                        <Divider type="vertical" style={{ height: 270 * this.state.ratio, width: 1, backgroundColor: 'rgb(239, 239, 239)', margin: '-90px 0px -127px 27px' }} />*/}
                                    </Col>

                                    <Col xl={0} lg={0} md={0} sm={24} xs={24} style={{ borderBottom: '1px solid', height: 30 }}>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={0} xs={0} offset={1}>
                                        <strong style={{ color: '#482EFF', fontSize: 32 }}>STEP 02 <br /> Q3 2022 </strong>
                                        <p style={{ fontSize: 20, marginBottom: 10, color: '#fff !important' }}>
                                            Selenian Protocol will build on this strong basis and with the goal of going multi chain and increasing its bandwidth with more partnerships through IBC Selenian Protocol will roll out a suite of IBC DeFi Primitives. In the next phases of our expansion, we will develop DeFi tools to better leverage dTokens to maximize your yield.
                                        </p>
                                        {/* <List style={{ marginTop: 30, color: 'white' }}>
                                            <List.Item style={{ color: 'white', fontSize: 20 }}>- STABLECOIN</List.Item>
                                            <List.Item style={{ color: 'white', fontSize: 20 }}>- LENDING AND BORROWING</List.Item>
                                        </List> */}
                                    </Col>
                                    <Col xl={0} lg={0} md={0} sm={22} xs={22} offset={1} style={{ paddingTop: 30 }}>
                                        <strong style={{ color: '#482EFF', fontSize: 32 }}>STEP 02 <br /> Q3 2022 </strong>
                                        <p style={{ fontSize: 20, marginBottom: 10, color: '#fff !important' }}>
                                            Selenian Protocol will build on this strong basis and with the goal of going multi chain and increasing its bandwidth with more partnerships through IBC Selenian Protocol will roll out a suite of IBC DeFi Primitives. In the next phases of our expansion, we will develop DeFi tools to better leverage dTokens to maximize your yield.
                                        </p>
                                        {/* <List style={{ marginTop: 30, color: 'white' }}>
                                            <List.Item style={{ color: 'white', fontSize: 20 }}>- STABLECOIN</List.Item>
                                            <List.Item style={{ color: 'white', fontSize: 20 }}>- LENDING AND BORROWING</List.Item>
                                        </List> */}
                                    </Col>
                                    <Col xl={4} lg={4} md={3} sm={0} xs={0}>
                                    </Col>
                                </Row>
                                <Divider type="horizontal" style={{ width: "100%", backgroundColor: '#efefef', marginTop: 0 }} />
                                <Divider type="horizontal" style={{ width: "100%", backgroundColor: '#efefef', marginTop: 0 }} />
                                <Divider type="horizontal" style={{ width: "100%", backgroundColor: '#efefef', marginTop: 0 }} />
                            </div>

                            <Row>
                                <Col xl={24} lg={24} md={24} sm={0} xs={0}>
                                    <div className="background05">
                                        <table style={{ width: '100%' }}>
                                            <tbody>
                                                <tr >
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td colSpan={4} rowSpan={2}>
                                                        <Row style={{ padding: '15px 25px', backgroundColor: 'black' }}>
                                                            <Col span={24}>
                                                                <p style={{ fontSize: 45, marginBottom: 13, color: '#fff !important', textAlign: 'center' }}>Subscribe to our mailing list</p>
                                                            </Col>
                                                            <Col span={24}>
                                                                <p style={{ fontSize: 20, marginBottom: 15, color: '#fff !important', textAlign: 'center' }}>Stay up to date with Selenian news</p>
                                                            </Col>
                                                            <Col span={24} style={{ position: 'static', margin: '0px auto', maxWidth: 500 }}>
                                                                {/* <Search placeholder="Amount SCRT" suffix={this.suffix} style={{ width: '100%', marginBottom: 15 }} enterButton="MAX" size="large" /> */}
                                                                <FormControl sx={{ m: 1 }} variant="outlined" style={{ marginBottom: 15, width: '97%', maxWidth: 500 }}>
                                                                    <InputLabel htmlFor="outlined-adornment-email" style={{ color: 'white' }}>Email</InputLabel>
                                                                    <OutlinedInput
                                                                        id="outlined-adornment-email"
                                                                        type={'text'}
                                                                        color="secondary"
                                                                        endAdornment={
                                                                            <InputAdornment position="end">
                                                                                <Buttons variant="contained" className='smallButton' style={{ borderRadius: 15, backgroundColor: '#4C4C4C', color: 'white' }} onClick={() => this.SubscriptionInsert()}>Submit</Buttons>
                                                                            </InputAdornment>
                                                                        }
                                                                        label="Email"
                                                                        value={this.state.email}
                                                                        onChange={(event: any) => this.setState({ email: event.target.value })}
                                                                        inputProps={{ style: { borderRadius: 15, borderColor: 'white', borderWidth: 2 } }}
                                                                    />
                                                                </FormControl>
                                                            </Col>
                                                            <Col span={24}>
                                                                <p style={{ fontSize: 20, marginBottom: 15, color: '#fff !important', textAlign: 'center' }}>By subscribe you accept our <a href="" style={{ color: 'white' }}>Privacy Notice</a></p>
                                                            </Col>
                                                        </Row>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </Col>
                                <Col xl={0} lg={0} md={0} sm={24} xs={24}>
                                    <div className="background05">
                                        <Row style={{ padding: '15px 25px', backgroundColor: 'black' }}>
                                            <Col span={24}>
                                                <p style={{ fontSize: 45, marginBottom: 13, color: '#fff !important', textAlign: 'center' }}>Subscribe to our mailing list</p>
                                            </Col>
                                            <Col span={24}>
                                                <p style={{ fontSize: 18 * this.state.ratio + 5, marginBottom: 15, color: '#fff !important', textAlign: 'center' }}>Stay up to date with Selenian news</p>
                                            </Col>
                                            <Col span={24} style={{ position: 'static', margin: '0px auto', maxWidth: 500 }}>
                                                {/* <Search placeholder="Amount SCRT" suffix={this.suffix} style={{ width: '100%', marginBottom: 15 }} enterButton="MAX" size="large" /> */}
                                                <FormControl sx={{ m: 1 }} variant="outlined" style={{ marginBottom: 15, width: '97%', maxWidth: 500 }}>
                                                    <InputLabel htmlFor="outlined-adornment-email" style={{ color: 'white' }}>Email</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-email"
                                                        type={'text'}
                                                        color="secondary"
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <Buttons variant="contained" className='smallButton' style={{ borderRadius: 15, backgroundColor: '#4C4C4C', color: 'white' }} onClick={() => this.SubscriptionInsert()}>Submit</Buttons>
                                                            </InputAdornment>
                                                        }
                                                        label="Email"
                                                        value={this.state.email}
                                                        onChange={(event: any) => this.setState({ email: event.target.value })}
                                                        inputProps={{ style: { borderRadius: 15, borderColor: 'white', borderWidth: 2 } }}
                                                    />
                                                </FormControl>
                                            </Col>
                                            <Col span={24}>
                                                <p style={{ fontSize: 18 * this.state.ratio + 5, marginBottom: 15, color: '#fff !important', textAlign: 'center' }}>By subscribe you accept our <a href="" style={{ color: 'white' }}>Privacy Notice</a></p>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>

                            <div style={{ width: '100%', backgroundColor: '#343434', padding: 20 }}>
                                <Row justify="center" align="middle">
                                    <Col xl={18} lg={18} md={0} sm={0} xs={0}>
                                        <img src={FooterLeft} style={{ height: 165 }}></img>
                                    </Col>
                                    <Col xl={0} lg={0} md={24} sm={24} xs={24}>
                                        <img src={FooterLeft} style={{ height: 165, display: 'block', margin: 'auto' }}></img>
                                    </Col>
                                    <Col xl={6} lg={6} md={24} sm={24} xs={24} style={{ textAlign: "center" }}>
                                        <p style={{ fontSize: 20 }}><a href="https://discord.gg/PrUdPENRqk" target={'_blank'} style={{ color: 'white', fontWeight: 500 }}>Discord</a>   |   <a href="https://medium.com/@selenian" target="_blank" style={{ color: 'white', fontWeight: 500 }}>Medium</a>   |   <a href="https://twitter.com/SelenianNetwork" target="_blank" style={{ color: 'white', fontWeight: 500 }}>Twitter</a></p>
                                    </Col>
                                    <Divider style={{ backgroundColor: '#efefef', marginTop: 20 }}></Divider>
                                    <Col xl={18} lg={18} md={0} sm={0} xs={0} >
                                        <p>© 2022 Selenian.Network All rights resevered</p>
                                    </Col>
                                    <Col xl={0} lg={0} md={24} sm={24} xs={24} >
                                        <p style={{ textAlign: 'center' }}>© 2022 Selenian.Network All rights resevered</p>
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

            </div>
        );
    }
}

export default OtherPage;
