import history from '../utils/history'
import auth0 from 'auth0-js'


const localStorage = global.window.localStorage

const auth0Domain = 'luke-davison.au.auth0.com'
const auth0ClientId = 'WCPEyjdLQW37sKZfBMFYNNisB6oyrGdD'

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: auth0Domain,
    clientID: auth0ClientId,
    redirectUri: process.env.CALLBACK,
    audience: `https://${auth0Domain}/userinfo`,
    responseType: 'token id_token',
    scope: 'openid',
    logo: 'images/logo2.png'
  })
  

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication (cb) {
    this.auth0.icon = 'http://thebookingmanager.herokuapp.com/images/logo2.png'
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      }
      if (err) {
        console.log(err)
      }
      return cb()
    })
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    //history.replace('/home');
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/home');
  }

  isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}