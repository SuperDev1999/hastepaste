import NextApp from "next/app";
import { DefaultSeo } from "next-seo";
import CookieConsent from "react-cookie-consent";
import { ToastContainer } from "react-toastify";
import { CookiesProvider } from "react-cookie";

import Layout from "@components/Layout/index";

import "react-toastify/dist/ReactToastify.css";
import "@styles/tailwind.css";
import "@styles/styles.css";

class App extends NextApp {
	render(): JSX.Element {
		const { Component, pageProps } = this.props;
		return (
			<CookiesProvider>
				<DefaultSeo titleTemplate="%s - HastePaste" />
				<Layout>
					<Component {...pageProps} />
				</Layout>
				<CookieConsent
					location="bottom"
					buttonText="Close"
					cookieName="cookie_alert_disable"
					style={{
						background: "#ff414d",
					}}
					buttonStyle={{
						background: "white",
						borderRadius: "10px",
					}}
					expires={150}
				>
					This website uses cookies to enhance the user experience.
				</CookieConsent>
				<ToastContainer position="bottom-right" />
			</CookiesProvider>
		);
	}
}

export default App;
