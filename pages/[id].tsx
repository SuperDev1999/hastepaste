import { LocaleParser } from "@libs/localeParser";
import Layout from "@components/Layout";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { supabase } from "@libs/initSupabase";
import { useSession } from "next-auth/client";
import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrowNight } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { MouseEvent, useEffect, useState } from "react";
import styles from "@styles/modules/explore.module.scss";
import Preloader from "@assets/preloader.gif";
import { toast } from "react-toastify";
import { generate as randomString } from "@libs/randomString";

export interface IExplorePage {
	paste: {
		fork?: string;
		title: string;
		description?: string;
		reported?: boolean;
		id: string;
		content: string;
		owner?: string;
	};
}

const ExplorePage: NextPage<IExplorePage> = ({ paste }) => {
	const [session] = useSession();
	const [fork, setFork] = useState(false);
	const [report, setReport] = useState(false);
	const [del, setDelete] = useState(false);
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const parser = new LocaleParser(router.locale);

	useEffect(() => {
		if (session) {
			if (paste.owner !== session.user.email && !paste.reported) {
				setFork(true);
				setReport(true);
				setDelete(false);
				setEdit(false);
			}
			if (paste.owner === session.user.email) {
				if (!paste.reported) {
					setDelete(true);
					setEdit(true);
				} else {
					setDelete(false);
					setEdit(false);
				}
				setFork(false);
				setReport(false);
			}
		} else {
			if (!paste.reported) setReport(true);
			else setReport(false);
			setFork(false);
			setDelete(false);
			setEdit(false);
		}
	});

	const handleFork = async (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
	) => {
		e.preventDefault();
		if (loading) return;
		setLoading(true);
		if (!fork) {
			toast.error(parser.get("fork_error"));
			setLoading(false);
			return;
		}
		const id = randomString();
		const { error } = await supabase.from("Pastes").insert({
			...paste,
			id,
			fork: paste.id,
			owner: session.user.email,
		});
		if (error) {
			toast.warning(parser.get("api_error"));
			setLoading(false);
			return;
		}
		setLoading(false);
		toast.success(parser.get("forked", { id }));
		router.push(`/${encodeURIComponent(id)}`);
	};

	const handleReport = async (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
	) => {
		e.preventDefault();
		if (loading) return;
		setLoading(true);
		if (!report) {
			toast.error(parser.get("report_error"));
			setLoading(false);
			return;
		}
		const { error } = await supabase
			.from("Pastes")
			.update({ reported: true })
			.eq("id", paste.id);

		if (error) {
			toast.warning(parser.get("api_error"));
			setLoading(false);
			return;
		}
		setLoading(false);
		toast.success(parser.get("reported_success", { id: paste.id }));
		router.push("/");
	};

	const handleDelete = async (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
	) => {
		e.preventDefault();
		if (loading) return;
		setLoading(true);
		if (!del) {
			toast.error(parser.get("delete_error"));
			setLoading(false);
			return;
		}
		const { error } = await supabase.from("Pastes").delete().eq("id", paste.id);

		if (error) {
			toast.warning(parser.get("api_error"));
			setLoading(false);
			return;
		}
		setLoading(false);
		toast.success(parser.get("deleted", { id: paste.id }));
		router.push("/");
	};

	const handleEdit = async (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
	) => {
		e.preventDefault();
		if (loading) return;
		if (!edit) return toast.error(parser.get("edit_error"));
		router.push(`/edit/${encodeURIComponent(paste.id)}`);
	};

	return (
		<Layout title={parser.get("explore") as string}>
			<div className={styles.wrapper}>
				<div className={styles.title}>
					<h2>
						{paste.title}{" "}
						{paste.fork && parser.get("forked_from", { id: paste.fork })}
					</h2>
					<p>{paste.description}</p>
				</div>
				<div className={styles.btnWrapper}>
					<button
						className={
							[styles.blue, "ld-over"].join(" ") +
							(loading ? " running" : "") +
							(fork ? "" : ` ${styles.notAllowed}`)
						}
						onClick={handleFork}
					>
						<img src={Preloader} className="ld" />
						{parser.get("fork")}
					</button>
					<button
						className={
							[styles.yellow, "ld-over"].join(" ") +
							(loading ? " running" : "") +
							(report ? "" : ` ${styles.notAllowed}`)
						}
						onClick={handleReport}
					>
						<img src={Preloader} className="ld" />
						{parser.get("report")}
					</button>
					<button
						className={
							[styles.red, "ld-over"].join(" ") +
							(loading ? " running" : "") +
							(del ? "" : ` ${styles.notAllowed}`)
						}
						onClick={handleDelete}
					>
						<img src={Preloader} className="ld" />
						{parser.get("delete")}
					</button>
					<button
						className={
							[styles.green, "ld-over"].join(" ") +
							(loading ? " running" : "") +
							(edit ? "" : ` ${styles.notAllowed}`)
						}
						onClick={handleEdit}
					>
						<img src={Preloader} className="ld" />
						{parser.get("edit")}
					</button>
				</div>
				<div className={styles.paste}>
					<SyntaxHighlighter style={tomorrowNight} className={styles.round}>
						{paste && paste.reported
							? (parser.get("reported_content") as string)
							: paste.content}
					</SyntaxHighlighter>
				</div>
			</div>
		</Layout>
	);
};

ExplorePage.getInitialProps = async (ctx) => {
	const id = typeof ctx.query.id === "string" ? ctx.query.id : ctx.query.id[0];
	const { data } = await supabase
		.from("Pastes")
		.select("*")
		.eq("id", id)
		.single();
	if (!data) {
		ctx.res.writeHead(302, {
			Location: "/404",
		});
		ctx.res.end();
	}
	return {
		paste: data,
	};
};

export default ExplorePage;