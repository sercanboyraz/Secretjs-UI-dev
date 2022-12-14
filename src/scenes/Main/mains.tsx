import './css/content.css'
import './css/core.css'
import './css/footer.css'
import './css/navigation.css'
import './css/normalize.min.css'
import './css/theme.css';
import './css/popup.css'
import './css/content.css'
import { Menu, message } from 'antd';
import { inject, observer } from 'mobx-react';
import KeplrWalletStore from '../../stores/keplrWalletStore';
import Stores from '../../stores/storeIdentifier';
import * as React from 'react';
import axios from 'axios';
import AppConsts from '../../lib/appconst';
const qs = require('qs');

declare var window: any;
interface IDashboardProps {
    keplrWalletStore: KeplrWalletStore,
    history: any,
    location: any
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
interface IDashboardState {
    anchorEl: any,
    deleteImage: boolean,
    ratio: number,
    email: string,
    message: string
}

@inject(Stores.KeplrWalletStore)
@observer
export class Mains extends React.Component<IDashboardProps, IDashboardState> {

    state = {
        anchorEl: null,
        deleteImage: false,
        ratio: 0,
        email: "",
        message: ""
    }

    loadKeplrWallet() {
        this.props.keplrWalletStore.loadKeplrWallet().then((result: any) => {
            if (result) {
                message.success({ content: 'Connected to Keplr', style: { right: 0, bottom: 0, position: 'fixed', display: 'flex', justifyContent: 'right', verticalAlign: 'bottom', transformOrigin: 'bottom' } })
            }
        })
    }

    menuWallet = () => (
        <Menu>
            <Menu.Item key="0">
                <a onClick={(e) => this.loadKeplrWallet()}>Connect Keplr</a>
            </Menu.Item>
        </Menu>
    );

    SubscriptionInsert(): void {
        if (/.+@.+\.[A-Za-z]+$/.test(this.state.email!)) {
            var input: any = {};
            input.EmailAddress = this.state.email;
            input.Name = this.state.email;
            input.SurName = this.state.email;
            input.UserName = this.state.email;
            http.post("api/services/app/User/SubscriptionAdd", input).then(x => {
                // message.success("Subscription successful");
                this.setState({ email: "" })
                this.setState({ message: "Subscription successful" });
                this.togglePopup();
            }).catch(x => {
                this.setState({ message: x.toString() });
                this.togglePopupError();
                // message.error(x.toString())
            })
        }
    }

    redirect() {
        this.props.history.push("/stake")
    }

    handleClick = (event: any) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    async togglePopup() { document.getElementById('popup')!.classList.toggle('show'); }
    async togglePopupError() { document.getElementById('popupError')!.classList.toggle('show'); }
    async togglePopupSubs() { document.getElementById('popupSubs')!.classList.toggle('show'); }


    render() {
        const { keplr } = this.props.keplrWalletStore;

        function toggleSidebar() {
            document.getElementById('sidebar')!.classList.toggle('show');
        }

        function toggleDark() {
            document.body.classList.toggle('dark');
        }
        return (
            <>
                {
                    !keplr ?
                        <div className='dark'>
                            <div className="popup-wrapper" id="popup">
                                <div className="popup-overlay" onClick={() => this.togglePopup()}></div>
                                <div className="popup-content">
                                    <div className="popup-header" onClick={() => this.togglePopup()}>
                                        <img src="" alt="" className="popup-header-close-button" />
                                    </div>
                                    <div className="popup-message">
                                        <img src="" alt="" className="popup-message-success-icon" />
                                        <div className="popup-message-text">{this.state.message}</div>
                                        <div className="popup-button-wrapper">
                                            <button className="popup-button-style-1" onClick={() => this.togglePopup()}>Ok</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="popup-wrapper" id="popupError">
                                <div className="popup-overlay" onClick={() => this.togglePopupError()}></div>
                                <div className="popup-content">
                                    <div className="popup-header" onClick={() => this.togglePopupError()}>
                                        <img src="" alt="" className="popup-header-close-button" />
                                    </div>
                                    <div className="popup-message">
                                        <img src="" alt="" className="popup-message-fail-icon" />
                                        <div className="popup-message-text">{this.state.message}</div>
                                        <div className="popup-button-wrapper">
                                            <button className="popup-button-style-1" onClick={() => this.togglePopupError()}>Ok</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="popup-wrapper" id="popupSubs">
                                <div className="popup-overlay" onClick={() => this.togglePopupSubs()}></div>
                                <div className="popup-content">
                                    <div className="popup-header" onClick={() => this.togglePopupSubs()}>
                                        <img src="" alt="" className="popup-header-close-button" />
                                    </div>
                                    <div className="popup-message">
                                        <h1>Selenian Protocol Disclaimer</h1>
                                        <h2 >Selenian is a decentralized finance protocol that people can use to stake assets and to collect yield. User’s use of the Selenian protocol involves various risks, including, but not limited to, losses while digital assets are being supplied to the Selenian protocol and losses due to the fluctuation of prices of tokens. Before using the Selenian protocol, you should review the relevant documentation to make sure you understand how the Selenian protocol works. Additionally, you can access the Selenian protocol through dozens of web or mobile interfaces. You are responsible for doing your own diligence on those interfaces to understand the fees and risks they present. Although "Selenian Labs'' developed much of the initial code for the Selenian protocol, it does not provide, own, or control the Selenian protocol, which is run by smart contracts deployed on the Cosmos blockchain. Upgrades and modifications to the protocol will be managed in a community-driven way by holders of the SEL governance token once the token is launched. No developer or entity involved in creating the Selenian protocol will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Selenian protocol, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens or anything else of value. THE SELENIAN PROTOCOL IS PROVIDED "AS IS" AT YOUR OWN RISK AND WITHOUT WARRANTIES OF ANY KIND.</h2>
                                        <div className="popup-button-wrapper">
                                            <button className="popup-button-style-1" onClick={() => this.togglePopupSubs()}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sidebar-wrapper" id="sidebar">
                                <div className="sidebar-overlay" onClick={() => toggleSidebar()}></div>
                                <div className="sidebar-content">
                                    <div className="sidebar-content-close">
                                        <button onClick={() => toggleSidebar()}>
                                            <img src="" alt="" className="sidebar-content-close-icon" />
                                        </button>
                                    </div>
                                    <div className="sidebar-content-menu">
                                        <a href="#about" onClick={() => toggleSidebar()} className="sidebar-link">About</a>
                                        <a href="#networks" onClick={() => toggleSidebar()} className="sidebar-link">Networks</a>
                                        <a href="#roadmap" onClick={() => toggleSidebar()} className="sidebar-link">Roadmap</a>
                                        <a href="https://medium.com/@selenian" onClick={() => toggleSidebar()} className="sidebar-link">Blog</a>
                                        <div className="sidebar-launch-button hide">
                                            <button onClick={() => toggleSidebar()} className="sidebar-button-style-1">Launch App</button>
                                        </div>
                                        {
                                            (process.env.REACT_APP_HOST_TYPE == "test" || process.env.REACT_APP_HOST_TYPE == "dev") &&
                                            <a href="https://faucet.secrettestnet.io/" onClick={() => toggleSidebar()} target={'_blank'} className="sidebar-link">Deposit Faucet SCRT</a>
                                        }
                                    </div>
                                    <div className="sidebar-content-footer">
                                    </div>
                                </div>
                            </div>
                            <div className="navigation-wrapper landing-page" id="navbar">
                                <div className="navigation-content max-w dark" style={{ height: 100 }}>
                                    <a href="#" className="navigation-brand">
                                        <img src="" alt="" className="navigation-brand-logo" />
                                    </a>
                                    <div className="navigation-desktop-menu">
                                        <a href="#about" className="navigation-link">About</a>
                                        <a href="#networks" className="navigation-link">Networks</a>
                                        <a href="#roadmap" className="navigation-link">Roadmap</a>
                                        <a href="https://medium.com/@selenian" className="navigation-link">Blog</a>
                                        {
                                            (process.env.REACT_APP_HOST_TYPE == "test" || process.env.REACT_APP_HOST_TYPE == "dev") &&
                                            <a href="https://faucet.secrettestnet.io/" target={'_blank'} className="navigation-link">Deposit Faucet SCRT</a>
                                        }
                                    </div>
                                    <div className="navigation-mobile-menu">
                                        <button onClick={() => toggleSidebar()}>
                                            <img src="" alt="" className="navigation-mobile-menu-icon" />
                                        </button>
                                    </div>
                                    <div className="navigation-launch-button hide">
                                        <button className="navigation-button-style-1">Launch App</button>
                                    </div>
                                    <div className="navigation-app-menu">
                                        <button className="navigation-button-style-1">Connect Wallet</button>
                                        <button className="navigation-button-style-2 epilipsis">username123456@gmail.com</button>
                                        <button onClick={() => toggleDark()}>
                                            <img src="" alt="" className="navigation-lights-icon" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="content flex col" style={{ backgroundColor: "#140F30" }}>
                                <div className="header-parallax-wrapper">
                                    <div className="header-parallax-layer-2"></div>
                                    <div className="header-parallax-layer-1"></div>
                                    <div className="header-parallax-gradient"></div>
                                </div>
                                <div id="header" className="header-section">
                                    <div className="container max-w">
                                        <div className="content-wrapper">
                                            <h1 className="title">Unlocking Capital Efficiency <span style={{ whiteSpace: "nowrap" }}>for IBC</span></h1>
                                            <p className="text">Selenian Protocol helps users maximize returns on digital assets through unlocking capital efficiency across IBC. With interoperability at heart, we are dedicated to build the DeFi powerhouse of the future.
                                            </p>
                                            <button className="cta" onClick={() => this.loadKeplrWallet()}>Connect Wallet</button>
                                            <div className="social-wrapper">
                                                <a href="https://discord.gg/PrUdPENRqk" target="_blank" className="social-1"><img src="" alt="" /></a>
                                                <a href="https://twitter.com/SelenianNetwork" target="_blank" className="social-2"><img src="" alt="" /></a>
                                                <a href="https://medium.com/@selenian" target="_blank" className="social-3"><img src="" alt="" /></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="about" className="about-section">
                                    <div className="container max-w">
                                        <div className="left">
                                            <h1 className="header" style={{ color: "white" }}>Welcome to Selenian</h1>
                                            <img src="" alt="" className="header-image desktop hide" />
                                        </div>
                                        <div className="right">
                                            <p className="text">
                                                <span className="text-highlight">
                                                    se·​le·​ni·​an | \ sə̇ˈlēnēən \ <br />
                                                    : of, relating to, or designating the moon<br /><br />
                                                </span>

                                                Selenian summit refers to the “highest” point on the Moon, nationally similar to Mount Everest
                                                on the Earth. This is where we want to take our users.<br /><br />

                                                <img src="" alt="" className="header-image mobile hide" />

                                                Selenian Protocol empowers its users with an array of IBC DeFi primitives and aims to maximize returns for them through unlocking capital efficiency across the IBC ecosystem. The protocol enables users to leverage their locked digital assets with max efficiency and simplicity.<br /><br />

                                                Our goal is to build the most user-friendly and “go-to” digital asset management platform in the IBC ecosystem with interchain communication at heart. In order to achieve this goal, Selenian protocol builds a Cosmwasm based DeFi stack which initially includes staking derivatives and staking derivative based collateralized debt positions (CDPs) to create a safe stable coin for Secret Network and the IBC ecosystem.<br />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div id="networks" className="networks-section">
                                    <div className="container max-w">
                                        <h1 className="title" style={{ color: "white" }}>Networks</h1>
                                        <div className="cards">
                                            <div className="card">
                                                <div className="header" style={{ alignItems: "center" }}>
                                                    <img src="" alt="" className="logo-1" />
                                                    <div className="header-title">Secret</div>
                                                </div>
                                                <p className="text">Secret is the first blockchain with privacy-preserving smart contracts. built to protect data and empower users.</p>
                                                <a href="#" className="link" onClick={() => this.loadKeplrWallet()}>Connect Wallet</a>
                                            </div>
                                            <div className="card">
                                                <div className="header" style={{ alignItems: "center" }}>
                                                    <img src="" alt="" className="logo-2" />
                                                    <div className="header-title">Atom</div>
                                                </div>
                                                <p className="text">Cosmos is a rapidly expanding ecosystem of independent interconnected blockchains built using developer-friendly application components and connected with ground-breaking IBC (Inter-Blockchain Communication) protocol.</p>
                                                <a href="#" className="link" onClick={() => this.loadKeplrWallet()}>Coming Soon</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="roadmap" className="roadmap-section">
                                    <div className="container max-w">
                                        <div className="header">
                                            <h1 className="title">Roadmap</h1>
                                            <p className="text">We have a rich roadmap and we will be launching innovative tools and widgets that
                                                will help users from all backgrounds benefit from the advantages of DeFi.</p>
                                        </div>
                                        <div id="controls" className="slider-controls">
                                            <button className="previous">
                                                <img src="" alt="" />
                                            </button>
                                            <button className="next">
                                                <img src="" alt="" />
                                            </button>
                                        </div>
                                        <div>
                                            <div id="my-slider">
                                                <div className="slide">
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        <div className="hover-border">
                                                            <h3 className="step">Step 1</h3>
                                                            <h5 className="quarter">Quarter 2 2022</h5>
                                                        </div>
                                                        <div className="border"></div>
                                                        <h1 className="title">
                                                            Staking Derivatives
                                                        </h1>
                                                        <p className="text">
                                                            Cosmwasm based staking derivatives contracts for the IBC ecosystem. to grow IBC DeFi TVL and secure zones in the Cosmos ecosystem.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="slide">
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        <div className="hover-border">
                                                            <h3 className="step">Step 2</h3>
                                                            <h5 className="quarter">Quarter 3 2022</h5>
                                                        </div>
                                                        <div className="border"></div>
                                                        <h1 className="title">
                                                            Collateralized Debt Positions
                                                        </h1>
                                                        <p className="text">
                                                            CDP module to create a safe on-chain collateralized stable coin for the IBC ecosystem.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="slide">
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        <div className="hover-border">
                                                            <h3 className="step">Step 3</h3>
                                                            <h5 className="quarter">Quarter 3 2022</h5>
                                                        </div>
                                                        <div className="border"></div>
                                                        <h1 className="title">
                                                            IBC Modules
                                                        </h1>
                                                        <p className="text">
                                                            Selenian fully leverages IBC to provide the highest usability in the market by focusing on creating fluid- hassle free experiences. This module will utilize IBC Interchain Account related services and it will be the main integration backbone of Selenian.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="slide">
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        <div className="hover-border">
                                                            <h3 className="step">Step 4</h3>
                                                            <h5 className="quarter">Quarter 4 2022</h5>
                                                        </div>
                                                        <div className="border"></div>
                                                        <h1 className="title">
                                                            Governance Management Module & Selenian DAO
                                                        </h1>
                                                        <p className="text">
                                                            Selenian DAO to enable decentralized governance and give power back to the people. Selenian DAO is expected to utilize privacy preserving voting enabled by Secret Network.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="footer-wrapper">
                                <div className="footer-content max-w">
                                    <div className="footer-left">
                                        <div className="footer-social-icons">
                                            <a href="https://discord.gg/PrUdPENRqk" target="_blank" ><img src="" alt="" className="footer-social-icon-1" /></a>
                                            <a href="https://twitter.com/SelenianNetwork" target="_blank"><img src="" alt="" className="footer-social-icon-2" /></a>
                                            <a href="https://medium.com/@selenian" target="_blank"><img src="" alt="" className="footer-social-icon-3" /></a>
                                        </div>
                                        <div className="footer-copyright">© 2022 Selenian Network</div>
                                    </div>
                                    <div className="footer-right">
                                        <img src="" alt="" className="footer-newsletter-icon" />
                                        <div>
                                            <div className="footer-right-title">Stay up to date with Selenian news.</div>
                                            <div className="footer-email-form">
                                                <input type="email" placeholder="Write your E-mail" className="footer-email-form-input" value={this.state.email} onChange={(event: any) => this.setState({ email: event.target.value })} />
                                                <input type="submit" value="Subscribe" className="footer-email-form-button" onClick={() => this.SubscriptionInsert()} />
                                            </div>
                                            <div className="footer-privacy">
                                                {/* By subscribe you accept our */}
                                                <a onClick={() => this.togglePopupSubs()}>Protocol Disclaimer</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <>
                            {
                                this.redirect()
                            }
                        </>

                }
            </>
        );
    }
}

export default Mains;



