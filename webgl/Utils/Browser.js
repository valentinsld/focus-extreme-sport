import Bowser from "bowser";

const browser = Bowser.getParser(window.navigator.userAgent);
const name = browser.getBrowserName()

export default {
	isFirefox: name === 'Firefox',
	isChrome: name === 'Chrome',
	isSafari: name === 'Safari'
}
