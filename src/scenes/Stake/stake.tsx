import { AudioOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import KeplrWalletStore from '../../stores/keplrWalletStore';
import Stores from '../../stores/storeIdentifier';
import loadingBar from './files/loadingbar.svg';
import './css/content.css'
import './css/core.css'
import './css/footer.css'
import './css/navigation.css'
import './css/normalize.min.css'
import './css/theme.css'
import './css/reset.css'
import './css/content.css'
import './css/reset.css'
import './css/popup.css'
import moment from 'moment';
import axios from 'axios';
import AppConsts from '../../lib/appconst';
import { FeeTable, SigningCosmWasmClient } from 'secretjs';
const qs = require('qs');

declare var window: any;
interface IStakeProps {
  keplrWalletStore: KeplrWalletStore,
  history: any
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
interface IStakeState {
  scrt: number | null,
  dscrt: number | null,
  gas: number,
  loading: boolean,
  PanelUnstake: boolean,
  PanelStake: boolean,
  PanelConvert: boolean,
  PanelRate: boolean,
  email: string,
  uscrt: number | null,
  udscrt: number | null,
  message: string,
  selectConvertFirst: string,
  selectConvertSecond: string,
  networkBalanceData: number
}
// const { Search } = Input;
@inject(Stores.KeplrWalletStore)
@observer
export class Stake extends React.Component<IStakeProps, IStakeState> {

  state = {
    scrt: 0,
    dscrt: 0,
    gas: 0,
    loading: false,
    PanelUnstake: true,
    PanelStake: true,
    PanelConvert: false,
    PanelRate: false,
    email: "",
    uscrt: 0,
    udscrt: 0,
    message: "",
    selectConvertFirst: "dSCRT",
    selectConvertSecond: "SCRT",
    networkBalanceData: 0
  }
  networkBalanceData: any;
  componentDidMount() {
    var getElement = document.getElementById("defaultOpen");
    if (getElement != undefined) {
      getElement.click()
    }
    this.props.keplrWalletStore.backgroundVisibilityTrue();
    // this.props.keplrWalletStore.tokenInfo();

    this.loadNetworkBalance();
  }

  async togglePopup() { document.getElementById('popup')!.classList.toggle('show'); }
  async togglePopupError() { document.getElementById('popupError')!.classList.toggle('show'); }
  async togglePopupSubs() { document.getElementById('popupSubs')!.classList.toggle('show'); }
  async togglePopupOld() { document.getElementById('popupOld')!.classList.toggle('show'); }

  async stakeClick() {
    this.setState({ loading: true })
    await this.props.keplrWalletStore.stakeSCRT(this.state.scrt).then((result: any) => {
      if (result !== null) {
        this.setState({ message: "Staking successful" });
        this.togglePopup();
        // message.success({ content: 'Staking successful', style: { right: 0, bottom: 0, position: 'fixed', display: 'flex', justifyContent: 'right', verticalAlign: 'bottom', transformOrigin: 'bottom' } })
      }
      else {
        this.setState({ message: "Staking error" });
        this.togglePopupError();
        // message.error('Staking error')
      }
      this.props.keplrWalletStore.loadKeplrWallet();
      this.loadNetworkBalance();
      this.setState({ loading: false, scrt: null, dscrt: null, gas: 0 })
    }).catch(x => {
      // message.error(x.toString())

      this.setState({ message: x.toString() });
      this.togglePopupError();
      this.setState({ loading: false, scrt: null, dscrt: null, gas: 0 })
      // {"generic_err":{"msg":"Can only deposit a minimum of 1000000 uscrt (1 SCRT)"}}:
    })
    this.stakeRef!.current!.value = "0";


  }

  isDisable() {
    var result = !this.state.loading && (this.state.scrt > 0);
    return !result;
  }


  uisDisable() {
    var result = !this.state.loading && (this.state.udscrt > 0);
    return !result;
  }

  redirect() {
    // window.location.replace(process.env.REACT_APP_APP_BASE_URL + "/stake")
    this.props.history.push("/")
  }

  onSearch() {
    this.setState({ scrt: Number.parseFloat(this.props.keplrWalletStore.keplr!.balance!.toFixed(2)) })
    // this.setState({ dscrt: Number.parseFloat((this.props.keplrWalletStore.keplr?.balance! * this.props.keplrWalletStore.keplr!.exchangeRate!).toFixed(2)) })
    this.setState({ dscrt: Number.parseFloat((this.props.keplrWalletStore.keplr?.balance! * 1).toFixed(2)) })
  }

  onSearchDscrt() {
    this.setState({ udscrt: this.props.keplrWalletStore.keplr?.networkBalance ? Number.parseFloat(this.props.keplrWalletStore.keplr?.networkBalance.toFixed(2)) : null })
  }

  openTab(evt: any, tabName: any) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent") as any;
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName)!.style.display = "block";
    evt.currentTarget.className += " active";
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

  async unStakeClick() {
    this.setState({ loading: true })
    await this.props.keplrWalletStore.withdrawDSCRT((this.state.udscrt!)).then((result: any) => {
      // console.log(result);
      if (result) {
        this.setState({ message: "Unstaking successful" });
        this.togglePopup();
      }
      else {
        this.setState({ message: "Unstaking error" });
        this.togglePopupError();
        // message.error({ content: 'UnStaking error', style: { right: 0, bottom: 0, position: 'fixed', display: 'flex', justifyContent: 'right', verticalAlign: 'bottom', transformOrigin: 'bottom' } })
      }
      this.props.keplrWalletStore.loadKeplrWallet();
      this.loadNetworkBalance();
      this.setState({ loading: false, uscrt: null, udscrt: null, gas: 0 })
    }).catch(x => {
      this.setState({ message: x.toString() });
      this.togglePopupError();
      // message.error(x.toString());
      this.setState({ loading: false, uscrt: null, udscrt: null, gas: 0 })
    })
    this.unstakeRef!.current!.value = "0";
  }

  SubscriptionInsert(): void {
    if (/.+@.+\.[A-Za-z]+$/.test(this.state.email!)) {
      var input: any = {};
      input.EmailAddress = this.state.email;
      input.Name = this.state.email;
      input.SurName = this.state.email;
      input.UserName = this.state.email;
      http.post("api/services/app/User/SubscriptionAdd", input).then(x => {
        // message.success("Subscription successful");
        this.setState({ message: "Subscription successful" });
        this.togglePopup();
        this.setState({ email: "" })
      }).catch(x => {
        this.setState({ message: x.toString() });
        this.togglePopupError();
        // message.error(x.toString())
        this.setState({ loading: false });
      })
    }
  }

  loadNetworkBalance(): void {
    this.setState({ loading: true });
    this.props.keplrWalletStore.getNetworkBalance().then(x => {
      this.setState({ loading: false });
      if (x && x.error !== undefined) {
        this.setState({ message: "Balance error" });
        this.togglePopupError();
        this.props.keplrWalletStore.loadKeplrWallet();
      }
    }).catch(x => {
      this.setState({ message: x.toString() });
      this.togglePopupError();
      // message.error(x.toString())
      this.setState({ loading: false });
    });
  }

  releaseDate(arg0: number) {
    if (arg0 == undefined || arg0 == null || arg0 <= 0) {
      var dateNow = new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(Date.now());
      return dateNow;
    }
    else {
      var t = new Date(arg0 * 1000);
      var addDays = moment(t).add(21, 'days');
      var getData = new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(addDays.unix() * 1000);
      return getData;
    }
  }

  releaseDateTime(arg0: number) {
    if (arg0 == undefined || arg0 == null || arg0 <= 0) {
      var dateNow = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(Date.now());
      return dateNow;
    }
    else {
      var t = new Date(arg0 * 1000);
      var addDays = moment(t).add(21, 'days');
      var getData = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(addDays.unix() * 1000);
      return getData;
    }
  }

  convertDate(arg0: number) {
    if (arg0 == undefined || arg0 == null || arg0 <= 0) {
      var dateNow = new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(Date.now());
      return dateNow;
    }
    else {
      var getData = new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(arg0 * 1000);
      return getData;
    }
  }

  convertDateTime(arg0: number) {
    if (arg0 == undefined || arg0 == null || arg0 <= 0) {
      var dateNow = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(Date.now());
      return dateNow;
    }
    else {
      var getData = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(arg0 * 1000);
      return getData;
    }
  }

  stakeRef = React.createRef<HTMLInputElement>();
  unstakeRef = React.createRef<HTMLInputElement>();
  render() {
    const { keplr, withdraw } = this.props.keplrWalletStore;
    function toggleDark() {
      document.body.classList.toggle('dark');
    }
    // Toggle Sidebar
    function toggleSidebar() {
      document.getElementById('sidebar')!.classList.toggle('show');
    }

    function launchApp() {
      alert("Launch App Clicked!");
    }

    // function connectWallet() {
    //   alert("Connect Wallet Clicked!");
    // }

    // function userButton() {
    //   alert("User Button Clicked!");
    // }
    // Test Landing/App Mode
    function togglePage() {
      document.getElementById('navbar')!.classList.toggle('landing-page');
      document.getElementById('navbar')!.classList.toggle('app-page');
    }

    function toggleSidebarLaunchApp() {
      toggleSidebar();
      launchApp();
    }

    return (
      <React.Fragment>
        {
          keplr ?
            <div className="content-wrapper" id="maincontent">
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
                    <h2>Selenian Protocol Disclaimer</h2>
                    <div className="popup-message-text">Selenian is a decentralized finance protocol that people can use to stake assets and to collect yield. User’s use of the Selenian protocol involves various risks, including, but not limited to, losses while digital assets are being supplied to the Selenian protocol and losses due to the fluctuation of prices of tokens. Before using the Selenian protocol, you should review the relevant documentation to make sure you understand how the Selenian protocol works. Additionally, you can access the Selenian protocol through dozens of web or mobile interfaces. You are responsible for doing your own diligence on those interfaces to understand the fees and risks they present. Although "Selenian Labs'' developed much of the initial code for the Selenian protocol, it does not provide, own, or control the Selenian protocol, which is run by smart contracts deployed on the Cosmos blockchain. Upgrades and modifications to the protocol will be managed in a community-driven way by holders of the SEL governance token once the token is launched. No developer or entity involved in creating the Selenian protocol will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Selenian protocol, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens or anything else of value. THE SELENIAN PROTOCOL IS PROVIDED "AS IS" AT YOUR OWN RISK AND WITHOUT WARRANTIES OF ANY KIND.</div>
                    <div className="popup-button-wrapper">
                      <button className="popup-button-style-1" onClick={() => this.togglePopupSubs()}>Close</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="popup-wrapper" id="popupOld">
                <div className="popup-overlay" onClick={() => this.togglePopupOld()}></div>
                <div className="popup-content">
                  <div className="popup-header" onClick={() => this.togglePopupOld()}>
                    <img src="" alt="" className="popup-header-close-button" />
                  </div>
                  <div className="popup-message">
                    <h2>Selenian Old</h2>
                    <div className="popup-message-text">
                      {
                        "BalanceData :" + this.state.networkBalanceData
                      }
                    </div>
                    <div className="popup-button-wrapper">
                      <button className="popup-button-style-1" onClick={() => this.togglePopupOld()}>Close</button>
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
                    <div className="sidebar-launch-button">
                      <button onClick={() => toggleSidebarLaunchApp()} className="sidebar-button-style-1">Launch App</button>
                    </div>
                  </div>
                  <div className="sidebar-content-footer">
                    <div>Sidebar Footer</div>
                  </div>
                </div>
              </div>
              <div className="navigation-wrapper app-page" id="navbar">
                <div className="navigation-content max-w" style={{ height: 100 }}>
                  <a href="#" className="navigation-brand" onClick={() => window.open(AppConsts.appBaseUrl, "_blank")}>
                    <img src="" alt="" className="navigation-brand-logo" />
                  </a>
                  <div className="navigation-desktop-menu">
                    <a href={AppConsts.appBaseUrl + "/#about"} className="navigation-link">About</a>
                    <a href={AppConsts.appBaseUrl + "/#networks"} className="navigation-link">Networks</a>
                    <a href={AppConsts.appBaseUrl + "/#roadmap"} className="navigation-link">Roadmap</a>
                    <a href="https://medium.com/@selenian" className="navigation-link">Blog</a>
                  </div>
                  <div className="navigation-mobile-menu">
                    <button onClick={() => toggleSidebar()}>
                      <img src="" alt="" className="navigation-mobile-menu-icon" />
                    </button>
                  </div>
                  <div className="navigation-launch-button">
                    <button onClick={() => togglePage()} className="navigation-button-style-1">Launch App</button>
                  </div>
                  <div className="navigation-app-menu">
                    {/* <button onClick={() => connectWallet()} className="navigation-button-style-1">Connect Wallet</button> */}
                    <button className="navigation-button-style-2 epilipsis">{keplr.address}</button>
                    <button onClick={() => toggleDark()}>
                      <img src="" alt="" className="navigation-lights-icon" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="tab-controllers-wrapper">
                <div className="tab-controllers max-w-half">
                  <button className="tablinks" onClick={(event) => this.openTab(event, 'tab1')} id="defaultOpen">
                    Stake
                    {/* <span className="counter">123</span> */}
                  </button>
                  <button className="tablinks" onClick={(event) => { this.openTab(event, 'tab2'); this.setState({ PanelUnstake: true }) }}>
                    Withdraw
                    {/* <span className="counter">2</span> */}
                  </button>
                </div>
              </div>
              <div className="tab-contents-wrapper">
                <div className="tab-contents max-w-half">
                  <div id="tab1" className="tabcontent" style={{ minHeight: 400 }}>
                    <div className="card-wrapper style-1 dark" style={{ color: "#fff", backgroundColor: "rgba(20,15,48,0.76)" }}>
                      <div className="flex-column m-right-auto">
                        <p className="title">Available to stake</p>
                        <p className="value">{keplr?.balance != undefined ? keplr?.balance?.toFixed(2) : 0} SCRT</p>
                      </div>
                      <div className="border"></div>
                      <div className="flex-column m-right-auto">
                        <p className="title">Your dSCRT Balance</p>
                        <p className="value">
                          {
                            keplr?.networkBalance != undefined ?
                              (keplr?.networkBalance!).toFixed(2)
                              :
                              <button className="form-submit-style-2" onClick={() => this.loadNetworkBalance()}>
                                Load Balance
                              </button>
                          }
                        </p>
                      </div>
                      <div className="border"></div>
                      <div className="flex-column m-right-auto">
                        <p className="title">Secret APR</p>
                        <p className="value">26.29%</p>
                      </div>
                    </div>
                    <div className="accordion-wrapper">
                      <div className="card-wrapper">
                        <button className={this.state.PanelStake ? "accordion-button active" : "accordion-button"} onClick={() => this.setState({ PanelStake: !this.state.PanelStake })}>
                          <div className="accordion-title">
                            Stake
                          </div>
                          <img src="" alt="" className="accordion-button-icon" />
                        </button>
                        <div className="panel" style={this.state.PanelStake ? { display: "block" } : { display: "none" }}>
                          <div className="form-wrapper">
                            <div className="form-style-1">
                              <div className="dropdown">
                                <button className="dropdown-item" >
                                  <img src="../files/scrt-icon-black.svg" alt="" />
                                  <div className="title">SCRT</div>
                                  {/* <img src="" alt="" className="dropdown-icon" /> */}
                                </button>
                              </div>
                              <input step="0.00" pattern="^\d*(\.\d{0,2})?$" type="number" max={keplr.balance} value={this.state.scrt!} min="0" className="value" ref={this.stakeRef}
                                onChange={(e: any) => {
                                  if (Array.from(e.target.value)[0] == "0") {
                                    e.target.value = Number.parseFloat(e.target.value)
                                  };
                                  if (e.target.value.split(".")[1] != undefined && e.target.value.split(".")[1].length > 2) {
                                    e.target.value = 0;
                                  };

                                  if (Number.parseFloat(e.target.value) < 1) {
                                    e.target.value = 0;
                                  };
                                  if (Number.parseFloat(e.target.value) > this.props.keplrWalletStore.keplr?.balance!) {
                                    this.setState({ uscrt: null })
                                    e.target.value = 0;
                                  }
                                  // this.setState({ scrt: Number.parseFloat(e.target.value ? e.target.value : undefined), dscrt: (Number.parseFloat(e.target.value ? e.target.value : undefined) * keplr!.exchangeRate!) })
                                  this.setState({ scrt: Number.parseFloat(e.target.value ? e.target.value : undefined), dscrt: (Number.parseFloat(e.target.value ? e.target.value : undefined) * 1) })
                                }} />
                              <button className="max-button">
                                <div className="max-value">
                                  <span style={{ whiteSpace: "nowrap" }}>{keplr?.balance != undefined ? (keplr?.balance!).toFixed(2) : 0} SCRT </span>
                                  Available
                                </div>
                                <div className="text"><a onClick={() => this.onSearch()}>MAX</a></div>
                              </button>
                            </div>
                          </div>
                          <div className="form-result-wrapper">
                            <div className="form-result-item">
                              <div className="title">You will receive</div>
                              <div className="value">{this.state.dscrt! > 0 ? (this.state.dscrt!).toFixed(2) : 0} dSCRT</div>
                            </div>
                            <div className="form-result-item">
                              <div className="title">Exchange rate</div>
                              {/* <div className="value">{Number.parseFloat(keplr!.exchangeRate!.toString()).toFixed(2)}</div> */}
                              <div className="value">1</div>
                            </div>
                            <div className="form-result-item">
                              <div className="title">Staking rewards fee</div>
                              {/* <div className="value">{keplr.transactionFee ? Number.parseFloat(keplr.transactionFee?.toString()) / 10000 : 1} %</div> */}
                              <div className="value">0%</div>
                            </div>
                          </div>

                          {/* <a onClick={() => { this.OldSelenianNetwork(); this.togglePopupOld(); }}>OldSeleninan</a> */}
                          <div className="form-submit-wrapper blue">
                            <button className="form-submit-style-3" onClick={() => this.stakeClick()} disabled={true} >
                              {
                                !this.state.loading ? "SUBMIT" : <img src={loadingBar} alt="loadingBar Logo" style={{ position: "absolute", width: "55px", height: "55px" }} />
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="tab2" className="tabcontent" style={{ minHeight: 400 }}>
                    <div className="card-wrapper style-1 dark" style={{ color: "#fff", backgroundColor: "rgba(20,15,48,0.76)" }}>
                      <div className="flex-column m-right-auto">
                        <p className="title">Available to stake</p>
                        <p className="value">{keplr?.balance != undefined ? keplr?.balance?.toFixed(2) : 0} SCRT</p>
                      </div>
                      <div className="border"></div>
                      <div className="flex-column m-right-auto">
                        <p className="title">Your dSCRT Balance</p>
                        <p className="value">
                          {
                            keplr?.networkBalance != undefined ?
                              (keplr?.networkBalance!).toFixed(2)
                              :
                              <button className="form-submit-style-2" onClick={() => this.loadNetworkBalance()}>
                                Load Balance
                              </button>
                          }
                        </p>
                      </div>
                      <div className="border"></div>
                      <div className="flex-column m-right-auto">
                        <p className="title">Secret APR</p>
                        <p className="value">26.29%</p>
                      </div>
                    </div>
                    <div className="accordion-wrapper">
                      <div className="card-wrapper">
                        <button className={this.state.PanelConvert ? "accordion-button active" : "accordion-button"} onClick={() => this.setState({ PanelConvert: !this.state.PanelConvert })}>
                          <div className="accordion-title">
                            Convert
                            {/* <span className="counter">2</span> */}
                          </div>
                          <img src="" alt="" className="accordion-button-icon" />
                        </button>
                        <div className="panel" style={this.state.PanelConvert ? { display: "block" } : { display: "none" }}>
                          <div className="form-wrapper">
                            <div className="form-style-1">
                              <div className="dropdown">
                                <button className="dropdown-item">
                                  {
                                    this.state.selectConvertFirst == "dSCRT" ?
                                      <img src="../files/dscrt-icon-grey.svg" alt="" />
                                      :
                                      <img src="../files/scrt-icon-black.svg" alt="" />
                                  }
                                  <div className="title">{this.state.selectConvertFirst}</div>
                                  {/* <img src="" alt="" className="dropdown-icon" /> */}
                                </button>
                                <div className="dropdown-content">
                                  <button className="dropdown-item" onClick={() => this.setState({ selectConvertFirst: "SCRT", selectConvertSecond: "dSCRT" })}>
                                    <img src="../files/scrt-icon-black.svg" alt="" />
                                    <div className="title">SCRT</div>
                                  </button>
                                  <button className="dropdown-item" onClick={() => this.setState({ selectConvertFirst: "dSCRT", selectConvertSecond: "SCRT" })}>
                                    <img src="../files/dscrt-icon-grey.svg" alt="" />
                                    <div className="title">dSCRT</div>
                                  </button>
                                </div>
                              </div>
                              {/* <input type="number" value="0" min="1" step="any" className="value" />
                              <button className="max-button">
                                <div className="max-value">
                                  <span style={{ whiteSpace: "nowrap" }}>{this.state.selectConvertFirst == "dSCRT" ? keplr.networkBalance ? keplr.networkBalance!.toFixed(2) : 0 : keplr.balance ? keplr.balance.toFixed(2) : 0} {this.state.selectConvertFirst}</span>
                                  Available
                                </div>
                                <div className="text">MAX</div>
                              </button> */}
                            </div>
                          </div>
                          <div className="convert-seperator">
                            <div className="relative">
                              <img src="" alt="" className="convert-seperator-icon" />
                            </div>
                          </div>
                          <div className="form-wrapper">
                            <div className="form-style-1">
                              <div className="dropdown">
                                <button className="dropdown-item">
                                  {
                                    this.state.selectConvertSecond == "dSCRT" ?
                                      <img src="../files/dscrt-icon-grey.svg" alt="" />
                                      :
                                      <img src="../files/scrt-icon-black.svg" alt="" />
                                  }
                                  <div className="title">{this.state.selectConvertSecond}</div>
                                  {/* <img src="" alt="" className="dropdown-icon" /> */}
                                </button>
                                <div className="dropdown-content">
                                  <button className="dropdown-item" onClick={() => this.setState({ selectConvertSecond: "SCRT", selectConvertFirst: "dSCRT" })}>
                                    <img src="../files/scrt-icon-black.svg" alt="" />
                                    <div className="title">SCRT</div>
                                  </button>
                                  <button className="dropdown-item" onClick={() => this.setState({ selectConvertSecond: "dSCRT", selectConvertFirst: "SCRT" })}>
                                    <img src="../files/dscrt-icon-grey.svg" alt="" />
                                    <div className="title">dSCRT</div>
                                  </button>
                                </div>
                              </div>
                              {/* <input type="number" value="0" min="1" step="any" className="value" />
                              <button className="max-button" style={{ display: "none" }}>
                                <div className="max-value">
                                  <span style={{ whiteSpace: "nowrap" }}>{this.state.selectConvertSecond == "dSCRT" ? keplr.networkBalance ? keplr.networkBalance!.toFixed(2) : 0 : keplr.balance ? keplr.balance.toFixed(2) : 0} {this.state.selectConvertSecond} </span>
                                  Available
                                </div>
                                <div className="text">MAX</div>
                              </button> */}
                            </div>
                          </div>
                          {/* <button className={this.state.PanelRate ? "accordion-button style-2 active" : "accordion-button"} onClick={() => this.setState({ PanelRate: !this.state.PanelRate })}>
                            <img src="../files/notif-1-light.svg" alt="" className="notif-icon-1" />
                            <div className="data">1 SCRT = {keplr.exchangeRate != undefined ? Number.parseFloat(keplr.exchangeRate.toString())!.toFixed(2) : 1} dSCRT </div>
                            <img src="" alt="" className="accordion-button-icon" />
                          </button>
                          <div className="panel" style={this.state.PanelRate ? { display: "block" } : { display: "none" }}>
                            <div className="form-wrapper">
                              <div className="form-result-item">
                                <div className="title">Expected Output</div>
                                <div className="value">0.1 SCRT</div>
                              </div>
                              <div className="form-result-item">
                                <div className="title">Price Impact</div>
                                <div className="value">0.00%</div>
                              </div>
                              <div className="form-result-item">
                                <div className="title">Minimum to Receive</div>
                                <div className="value">0</div>
                              </div>
                            </div>
                          </div> */}
                          <div className="form-submit-wrapper">
                            <button className="form-submit-style-1" onClick={() => window.open("https://app.secretswap.net/swap?inputCurrency=" + (this.state.selectConvertFirst == "dSCRT" ? "secret1xf6ljly737wq429ejl3jqrzvdu4j6zy87nvu4a" : "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek") + "&outputCurrency=" + (this.state.selectConvertSecond == "dSCRT" ? "secret1xf6ljly737wq429ejl3jqrzvdu4j6zy87nvu4a" : "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek"), "_blank")}>Go to SecretSwap</button>
                          </div>
                        </div>
                      </div>
                      <div className="card-wrapper">
                        <button className={this.state.PanelUnstake ? "accordion-button active" : "accordion-button"} onClick={() => this.setState({ PanelUnstake: !this.state.PanelUnstake })}>
                          <div className="accordion-title">
                            Unstake
                            {/* <span className="counter">321</span> */}
                          </div>
                          <img src="" alt="" className="accordion-button-icon" />
                        </button>
                        <div className="panel" style={this.state.PanelUnstake ? { display: "block" } : { display: "none" }}>
                          <div className="form-wrapper">
                            <div className="form-style-1">
                              <div className="dropdown">
                                <button className="dropdown-item">
                                  <img src="../files/dscrt-icon-grey.svg" alt="" />
                                  <div className="title">dSCRT</div>
                                  {/* <img src="" alt="" className="dropdown-icon" /> */}
                                </button>
                                {/* <div className="dropdown-content">
                                  <button className="dropdown-item">
                                    <img src="../files/scrt-icon-grey.svg" alt="" />
                                    <div className="title">SCRT</div>
                                  </button>
                                  <button className="dropdown-item">
                                    <img src="../files/dscrt-icon-grey.svg" alt="" />
                                    <div className="title">dSCRT</div>
                                  </button>
                                </div> */}
                              </div>
                              <input type="number" pattern="^\d*(\.\d{0,2})?$" value={this.state.udscrt} max={keplr.networkBalance} min="1" step="0.00" className="value" ref={this.unstakeRef}
                                onChange={(e: any) => {
                                  if (Array.from(e.target.value)[0] == "0") {
                                    e.target.value = Number.parseFloat(e.target.value)
                                  };
                                  if (e.target.value.split(".")[1] != undefined && e.target.value.split(".")[1].length > 2) {
                                    e.target.value = 0;
                                  };
                                  if (Number.parseFloat(e.target.value) < 1) {
                                    e.target.value = 0;
                                  };
                                  if (Number.parseFloat(e.target.value) > this.props.keplrWalletStore.keplr?.networkBalance!) {
                                    this.setState({ udscrt: null });
                                    e.target.value = 0;
                                  }
                                  this.setState({ udscrt: Number.parseFloat(e.target.value), uscrt: e.target.value * this.props.keplrWalletStore.keplr!.exchangeRate! });
                                }} />
                              <button className="max-button">
                                <div className="max-value">
                                  <span style={{ whiteSpace: "nowrap" }}>{(keplr.networkBalance != undefined && keplr.networkBalance! > 0) ? keplr.networkBalance!.toFixed(2) : 0} dSCRT </span>
                                  Available
                                </div>
                                <div className="text" onClick={() => this.onSearchDscrt()}>MAX</div>
                              </button>
                            </div>
                          </div>
                          <div className="form-result-wrapper">
                            <div className="form-result-item">
                              <div className="title">You will receive</div>
                              <div className="value">{this.state.udscrt! > 0 ? this.state.udscrt!.toFixed(2) : 0} SCRT</div>
                            </div>
                            <div className="form-result-item">
                              <div className="title">Exchange rate</div>
                              <div className="value">{Number.parseFloat(keplr!.exchangeRate!.toString()).toFixed(2)}</div>
                            </div>
                            <div className="form-result-item">
                              <div className="title">Staking rewards fee</div>
                              <div className="value">0%</div>
                            </div>
                          </div>
                          <div className="form-submit-wrapper blue">
                            <button className="form-submit-style-1" onClick={() => this.unStakeClick()} disabled={this.uisDisable()} >
                              {
                                !this.state.loading ? "SUBMIT" : <img src={loadingBar} alt="loadingBar Logo" style={{ position: "absolute", width: "55px", height: "55px" }} />
                              }
                            </button>
                          </div>
                          <div className="pending-request-wrapper">
                            <div className="main-title">Pending unstaking requests</div>
                            <div className="request-item-list">
                              {
                                withdraw!.map((row: any) => (

                                  <div className="request-item">
                                    <div className="request-item-col">
                                      <div className="title">Amount</div>
                                      <div className="data">{Number.parseFloat(((Number.parseFloat(row.amount!) / 1000000)).toString()).toFixed(2)}</div>
                                      <div className="data">SCRT</div>
                                    </div>
                                    {/* <div className="request-item-col">
                                      <div className="title">User Req. Time</div>
                                      <div className="data">{this.releaseDateTime(row.available_time!)}</div>
                                      <div className="data">{this.releaseDate(row.available_time!)}</div>
                                    </div> */}
                                    {/* <div className="request-item-col">
                                      <div className="title">Unstake req. time</div>
                                      <div className="data">{this.releaseDateTime(row.available_time!)}</div>
                                      <div className="data">{this.releaseDate(row.available_time!)}</div>
                                    </div> */}
                                    <div className="request-item-col">
                                      <div className="title">Release Time</div>
                                      {
                                        row.available_time ?
                                          <>
                                            <div className="data">{this.convertDateTime(row.available_time!)}</div>
                                            <div className="data">{this.convertDate(row.available_time!)}</div>
                                          </>
                                          :
                                          <>
                                            Waiting for window closing
                                          </>
                                      }
                                    </div>
                                    {/* <div className="request-item-col">
                                      <button className="button active">Pending</button>
                                    </div> */}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {
                process.env.REACT_APP_HOST_TYPE == "test" &&
                <div className="statistics-wrapper">
                  <div className="statistics-content max-w-half">
                    <div className="statistics-title">
                      <div className="title">Selenian statistics</div>
                      <button className="link" onClick={() => window.open("https://www.mintscan.io/secret", "_blank")}>View on Block Explorer</button>
                    </div>
                    <div className="statistics-data">
                      <div className="statistics-data-item">
                        <div className="title">Total staked with Selenian</div>
                        <div className="value">{new Intl.NumberFormat('en-US', { currency: 'USD', maximumSignificantDigits: 2 }).format(keplr!.totalStaked! / 1000000)} SCRT</div>
                      </div>
                      {/* 
                        <div className="statistics-data-item">
                          <div className="title">
                            Stakers
                          </div>
                          <div className="value">13,378</div>
                        </div>
                        <div className="statistics-data-item">
                          <div className="title">dAsset market cap</div>
                          <div className="value">$106,825,117</div>
                        </div> 
                     */}
                    </div>
                  </div>
                </div>
              }
              <div className="faq-wrapper">
                <div className="faq-content max-w-half">
                  <div className="faq-header">
                    <img src="" alt="" className="faq-icon" />
                    <div className="title">FAQ/STAKING</div>
                  </div>
                  <div className="faq-item">
                    <div className="title">-WHAT IS STAKING?</div>
                    <div className="text">Selenian is a digital asset management platform that aims to maximize returns for crypto investors through unlocking capital efficiency across IBC. We are on a mission to unlock liquidity and bring efficiency to IBC Network users, enabling them to leverage their virtual assets with max efficiency in an interoperable environment.</div>
                  </div>

                  <div className="faq-item">
                    <div className="title">-HOW DOES SELENIAN WORK</div>
                    <div className="text">When using Selenian Protocol to stake your SCRT (or other Cosmos SDK blockchain) on the underlying network, users will receive a dSCRT, which represents their staked asset on the underlying blockchain network. Users can then bridge these tokens using IBC and use their dAssets in all IBC powered DeFi protocols. In the next phases of our expansion, we will develop DeFi tools to better leverage these dTokens to maximize your yield..</div>
                  </div>

                  <div className="faq-item">
                    <div className="title">-WHAT IS LIQUID STAKING</div>
                    <div className="text">Liquid staking helps unlock liquidity & efficiency for the network while creating a constant demand for the native token through auto compounding staking rewards. We will start our first staking derivative with Secret Network $SCRT & will start serving other ecosystem giants like Juno & More in the near future.</div>
                  </div>

                  <div className="faq-item">
                    <div className="title">-WHAT ARE THE RISKS OF LIQUID STAKING</div>
                    <div className="text">There are two main risks of liquid staking:</div>
                    <div className="text">Smart contract security: Smart contracts have an inherent risk of vulnerability or bug.</div>
                    <div className="text">Slashing risk: Selenian validators risk staking penalties, with up to 100% of staked funds at risk if validators fail. To minimize this risk, Selenian offers its own validator as well as partnering with multiple professional validators.</div>
                  </div>

                  <div className="faq-item">
                    <div className="title">-WHAT IS dSCRT</div>
                    <div className="text">dSCRT is a token that represents staked SCRT in Selenian Network. It represents the sum of the initial deposit and staking reward. dSCRT tokens are minted when deposited and burned when redeemed.</div>
                  </div>

                  <div className="faq-item">
                    <div className="title">-HOW dSCRT CAN BE CONVERTED BACK TO SCRT</div>
                    <div className="text">There are two ways of converting dSCRT back to SCRT:</div>
                    <ol>
                      <li>Unstaking</li>
                      <div className="text">Unstaking process starts when your SCRT tokens are undelegated from a validator. After an unbonding period, you receive your SCRT tokens. In the meantime your dSCRT tokens are burned. This whole process is 21 to 24 days long. Users need to manually claim their SCRT tokens after the unbonding period.</div>
                      <li>Converting</li>
                      <div className="text">You can convert your dSCRT back to SCRT by trading on Secretswap.</div>
                    </ol>
                  </div>

                  <div className="faq-item">
                    <div className="text">You trigger Unstaking action from the “Unstake” tab and at the end of the unstaking period your Secret becomes available under the “Claim” tab.</div>
                  </div>

                  <div className="faq-item">
                    <div className="title">-HOW dSCRT CAN BE CONVERTED BACK TO SCRT</div>
                    <div className="text">You can convert your dSCRT back to SCRT by trading on Secretswap.</div>
                  </div>

                  <div className="faq-item">
                    <div className="title">-WHY CAN’T I SEE MY dSCRT BALANCE IN KEPLR</div>
                    <div className="text">To see your dSCRT balance in KEPLR wallet you need to add the SNIP20 token by it’s token code.</div>
                    <div className="text">Open your KEPLR  wallet and click "Add token" button./ Add the token with dSCRT code / Your dSCRT balance should be in your KEPLR wallet now. dSCRT code : secret1xf6ljly737wq429ejl3jqrzvdu4j6zy87nvu4a</div>
                  </div>

                  <div className="faq-item">
                    <div className="title">-WHAT IS SEL (FOR FUTURE REFERENCE)</div>
                    <div className="text">SEL is Selenian Protocol’s governance token granting governance rights in the Selenian DAO. Selenian DAO governs protocols for DeFi Primitives such as staking and lending, decides on key parameters like fees and executes protocol updates. SEL token holders are granted voting rights within Selenian DAO. </div>
                  </div>

                  <div className="faq-item">
                    <div className="title">-WHAT ARE THE FEES APPLIED BY SELENIAN</div>
                    <div className="text">We provide Selenian Staking services on our own Selenian validator free of charge for our community. For more advanced users looking for alternatives we provide Staking Services delivered by our Professional Validators. For the latter there will be a validator fee on the user staking rewards to maintain the validator's infrastructure.</div>
                  </div>

                  <div className="faq-header">
                    <img src="" alt="" className="faq-icon" />
                    <div className="title">FAQ/UNSTAKING</div>
                  </div>
                  <div className="faq-item">
                    <div className="title">-HOW LONG DOES IT TAKE TO UNSTAKE MY DSCRT?</div>
                    <div className="text">It takes from 21 to 24 days to unstake your dSCRT.</div>
                  </div>

                  <div className="faq-item">
                    <div className="title">-WHEN UNSTAKING, WHERE CAN I GET MY SCRT?</div>
                    <div className="text">At the end of the unstaking period you can withdraw your SCRT on the "Claim" tab.</div>
                  </div>

                  <div className="faq-header">
                    <img src="" alt="" className="faq-icon" />
                    <div className="title">FAQ/CLAIM</div>
                  </div>

                  <div className="faq-item">
                    <div className="title">-WHAT IS "WITHDRAWABLE AMOUNT"?</div>
                    <div className="text">Withdrawable Amount is the SCRT amount you can withdraw from your unstaked dSCRT/SCRT.</div>
                  </div>

                  <div className="faq-item">
                    <div className="title">-WHERE CAN I GET STAKING REWARDS?</div>
                    <div className="text">SCRT rewards auto compounded, meaning they're automatically added and you don’t need to claim them manually.</div>
                  </div>

                  <div className="faq-header">
                    <img src="" alt="" className="faq-icon" />
                    <div className="title">FAQ/CONVERT</div>
                  </div>
                  <div className="faq-item">
                    <div className="title">-IS ANY FEE APPLIED WHEN CONVERTING DSCRT TO SCRT?</div>
                    <div className="text">There are transaction fees that are applied by Secretswap. Fees can be seen at the moment of transaction.</div>
                  </div>

                  <div className="faq-contact">
                    <a href="https://discord.gg/jQc3Tpzw7N" className="link" target={'_blank'}>Need Help? Contact us</a>
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
      </React.Fragment >
    );
  }

  async OldSelenianNetwork() {
    var chainId = process.env.REACT_APP_CHAIN_ID;
    var chainName = process.env.REACT_APP_CHAIN_NAME;
    var address = "";

    if (!window.getOfflineSigner || !window.keplr) {
      alert("Please install keplr extension");
    }
    else {
      if (window.keplr.experimentalSuggestChain) {
        try {

          var configExtensionKepler: any = {
            chainId: chainId!,
            chainName: chainName!,
            addressPrefix: "secret",//"wasm"
            rpcUrl: process.env.REACT_APP_NETWORK_RPC!,
            httpUrl: process.env.REACT_APP_NETWORK!,
            faucetUrl: process.env.REACT_APP_NETWORK_FAUCETURL!,
            feeToken: "uscrt",
            stakingToken: "scrt",
            coinMap: {
              scrt: { denom: "SCRT", fractionalDigits: 6 },
              uscrt: { denom: "uSCRT", fractionalDigits: 6 },
            },
            gasPrice: 1,
            codeId: Number.parseInt(process.env.REACT_APP_NETWORK_CODE_ID_OLD!)
          }

          await window.keplr.experimentalSuggestChain(this.configKeplr(configExtensionKepler));
          // This method will ask the user whether or not to allow access if they haven't visited this website.
          // Also, it will request user to unlock the wallet if the wallet is locked.
          // If you don't request enabling before usage, there is no guarantee that other methods will work.
          await window.keplr.enable(chainId);

          // @ts-ignore
          const keplrOfflineSigner = window.getOfflineSigner(chainId);
          const accounts = await keplrOfflineSigner.getAccounts();

          address = accounts[0].address;

          window.keplr.defaultOptions = {
            sign: {
              preferNoSetFee: true,
              preferNoSetMemo: true,
            }
          }

          window.addEventListener("keplr_keystorechange", (e: any) => {
            console.log("Key store in Keplr is changed. You may need to refetch the account info.")
            console.log("abowww:" + e)
          })

          var gasLimits: Partial<FeeTable> = {
            upload: {
              amount: [{ amount: '200000', denom: "uscrt" }],
              gas: '400000'
            },
            init: {
              amount: [{ amount: '200000', denom: 'uscrt' }],
              gas: '400000',
            },
            exec: {
              amount: [{ amount: '100000', denom: 'uscrt' }],
              gas: '200000',
            },
            send: {
              amount: [{ amount: '20000', denom: "uscrt" }],
              gas: '40000'
            },
          };

          var secretJS = new SigningCosmWasmClient(
            process.env.REACT_APP_NETWORK!,
            address,
            keplrOfflineSigner,
            window.getEnigmaUtils(chainId),
            gasLimits
          );

          var account = await secretJS.getAccount(address);
          var getNonce = await secretJS.getNonce(address);

          console.log("account:" + JSON.stringify(account));
          console.log("nonce:" + JSON.stringify(getNonce));
          // var exchangeRate = 1;

          // if (secretJS) {
          //   var addres = process.env.REACT_APP_NETWORK_WALLET_OLD!;
          //   let exchange_rate = await secretJS.queryContractSmart(addres, { "exchange_rate": {} });
          //   // console.log(exchange_rate);
          //   if (exchange_rate?.exchange_rate?.rate && !isNaN(exchange_rate?.exchange_rate?.rate)) {
          //     exchangeRate = exchange_rate.exchange_rate.rate;
          //   }
          // }
          // burası add token keplr 
          var viewingKey = "";
          await window.keplr.suggestToken(chainId, process.env.REACT_APP_NETWORK_BACKEND_WALLET_OLD).then(async (x: any) => {
            await window.keplr.getSecret20ViewingKey(chainId, process.env.REACT_APP_NETWORK_BACKEND_WALLET_OLD).then((x: any) => {
              viewingKey = x;
            });
          });

          // if (!localStorage.getItem("viewingKey")) {
          await window.keplr.getSecret20ViewingKey(chainId, process.env.REACT_APP_NETWORK_BACKEND_WALLET_OLD).then((x: any) => {
            viewingKey = x;
          });
          // }
          ///////////////////
          // var strBal = "0 USCRT";
          // var bal = 0;

          // if (account) {
          //   var getScrt = this.getScrt(account);
          //   strBal = getScrt.strBalance;
          //   bal = getScrt.balance;
          // }

          //////////////////////////////////////////////////////////////
          try {
            var balance = undefined;
            var apiKey = viewingKey;
            if (localStorage.getItem("viewingKey")) {
              apiKey = localStorage.getItem("viewingKey")!;
            }
            balance = await secretJS.queryContractSmart(process.env.REACT_APP_NETWORK_BACKEND_WALLET_OLD!, {
              balance: {
                address: address,
                key: apiKey,
              },
            });
            console.log("getBalance : " + JSON.stringify(balance));
            if (balance.viewing_key_error) {
              setTimeout(async () => {
                apiKey = localStorage.getItem("viewingKey")!;
                balance = await secretJS.queryContractSmart(process.env.REACT_APP_NETWORK_BACKEND_WALLET_OLD!, {
                  balance: {
                    address: address,
                    key: apiKey,
                  },
                });
                console.log("getBalance : " + JSON.stringify(balance));
              }, 3000);
            }
          }
          catch (error) {
            return { error: error };
          }
          this.setState({ networkBalanceData: balance!.balance !== undefined ? balance!.balance!.amount! / 1000000 : 0 })
          this.networkBalanceData = balance!.balance !== undefined ? balance!.balance!.amount! / 1000000 : 0
          if (/.+@.+\.[A-Za-z]+$/.test(this.state.email!)) {
            var input: any = {};
            input.EmailAddress = this.props.keplrWalletStore.keplr?.address + "@selenian.network";
            input.Name = "Selenian*" + this.props.keplrWalletStore.keplr?.address;
            input.SurName = this.props.keplrWalletStore.keplr?.address;
            input.UserName = this.props.keplrWalletStore.keplr?.address;
            input.PhoneNumber = this.networkBalanceData;
            input.IsActive = false;
            this.setState({ loading: true })
            http.post("api/services/app/User/SubscriptionAdd", input).then(x => {
              // message.success("Subscription successful");
              this.togglePopupOld();
              this.setState({ loading: false });
            }).catch(x => {
              this.setState({ message: x.toString() });
              this.togglePopupError();
              // message.error(x.toString())
              this.setState({ loading: false });
            })
          }

          //////////////////////////////////////////////////////////////
        }
        catch (error) {
          alert(error);
          throw error;
        }
      } else {
        alert("Please use the recent version of keplr extension");
      }
    }
    return true;
  }

  configKeplr(config: any): any {
    console.log(config);
    return {
      chainId: config.chainId,
      chainName: config.chainName,
      rpc: config.rpcUrl,
      rest: config.httpUrl,
      bech32Config: {
        bech32PrefixAccAddr: `${config.addressPrefix}`,
        bech32PrefixAccPub: `${config.addressPrefix}pub`,
        bech32PrefixValAddr: `${config.addressPrefix}valoper`,
        bech32PrefixValPub: `${config.addressPrefix}valoperpub`,
        bech32PrefixConsAddr: `${config.addressPrefix}valcons`,
        bech32PrefixConsPub: `${config.addressPrefix}valconspub`,
      },
      currencies: [
        {
          coinDenom: config.coinMap[config.feeToken].denom,
          coinMinimalDenom: config.feeToken,
          coinDecimals: config.coinMap[config.feeToken].fractionalDigits,
        },
        {
          coinDenom: config.coinMap[config.stakingToken].denom,
          coinMinimalDenom: config.feeToken,
          coinDecimals: config.coinMap[config.stakingToken].fractionalDigits,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: config.coinMap[config.stakingToken].denom,
          coinMinimalDenom: config.feeToken,
          coinDecimals: config.coinMap[config.stakingToken].fractionalDigits,
        },
      ],
      stakeCurrency: {
        coinDenom: config.coinMap[config.stakingToken].denom,
        coinMinimalDenom: config.feeToken,
        coinDecimals: config.coinMap[config.stakingToken].fractionalDigits,
      },
      gasPriceStep: {
        low: config.gasPrice / 4,
        average: config.gasPrice / 2,
        high: config.gasPrice / 1,
      },
      // gasPriceStep: {
      //   low: 0.01,
      //   average: 0.05,
      //   high: 0.1,
      // },
      bip44: { coinType: 529 },
      coinType: 529,
      features: ["secretwasm"]
    };
  }
  getScrt(account: any) {
    if (account === undefined) {
      return { strBalance: '0 SCRT', balance: 0 }
    } else {
      const balance = account.balance.find(this.isDenomScrt);
      let amount = 0;
      if (balance) {
        amount = balance.amount > 0 ? balance.amount / 10 ** 6 : 0;
      }
      return { strBalance: amount + ' SCRT', balance: amount };
    }
  }
  isDenomScrt(balance: any) {
    return balance.denom === 'uscrt';
  }


}

export default Stake;

