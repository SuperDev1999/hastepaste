import Link from "next/link";
import CONFIG from "src/config";
import styles from "./index.module.scss";

export default function Footer(): JSX.Element {
	return (
		<footer className={styles.footer}>
			<div className={styles.wrapper}>
				<div className={styles.upper}>
					<div className={styles.wrapper}>
						<div className={styles.column}>
							<span className={`${styles.header} mb-2`}>Follow Us</span>
							{CONFIG.FOOTER.FOLLOW_US.map((profile, idx) => (
								<span key={idx} className={styles.link}>
									<Link href={profile.path}>
										<span>{profile.name}</span>
									</Link>
								</span>
							))}
						</div>
						<div className={styles.column}>
							<span className={`${styles.header} mt-4 md:mt-0 mb-2`}>
								Useful Links
							</span>
							{CONFIG.FOOTER.USEFUL_LINKS.map((profile, idx) => (
								<span key={idx} className={styles.link}>
									<Link href={profile.path}>
										<span>{profile.name}</span>
									</Link>
								</span>
							))}
						</div>
						<div className={styles.column}>
							<span className={`${styles.header} mt-4 md:mt-0 mb-2`}>Contact Us</span>
							{CONFIG.FOOTER.CONTACT_US.map((profile, idx) => (
								<span key={idx} className={styles.link}>
									<Link href={profile.path}>
										<span>{profile.name}</span>
									</Link>
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className={styles.wrapper}>
				<div className={styles.lower}>
					<div className={styles.wrapper}>
						<p>
							<span className={styles.copy}>HastePaste</span> © 2020 | Back-end &
							front-end by{" "}
							<Link href="https://github.com/barbarbar338">
								<span className={styles.link}>barbarbar338</span>
							</Link>{" "}
							- Design by{" "}
							<Link href="https://github.com/thisisroi">
								<span className={styles.link}>Roi</span>
							</Link>
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
