import { LocaleParser } from "@libs/localeParser";
import Layout from "@components/Layout";
import { useRouter } from "next/dist/client/router";
import styles from "@styles/modules/index.module.scss";
import { FormEvent, useState } from "react";
import { getSession } from "next-auth/client";
import { supabase } from "@libs/initSupabase";
import { toast } from "react-toastify";
import Preloader from "@assets/preloader.gif";
import { NextPage } from "next";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import { motion, Variants } from "framer-motion";

const container: Variants = {
	hidden: {
		opacity: 1,
		scale: 0,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			delayChildren: 0.3,
			staggerChildren: 0.2,
		},
	},
};

const itemY: Variants = {
	hidden: {
		y: 20,
		opacity: 0,
	},
	visible: {
		y: 0,
		opacity: 1,
	},
};

const itemX: Variants = {
	hidden: {
		x: 20,
		opacity: 0,
	},
	visible: {
		x: 0,
		opacity: 1,
	},
};

export interface IEditPage {
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

const EditPage: NextPage<IEditPage> = ({ paste }) => {
	const [content, setContent] = useState(paste.content);
	const [description, setDescription] = useState(paste.description);
	const [title, setTitle] = useState(paste.title);
	const [checked, setChecked] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const parser = new LocaleParser(router.locale);

	const submit = async (e: FormEvent<HTMLFormElement>): Promise<unknown> => {
		e.preventDefault();
		if (loading) return;
		if (!checked) return toast.error(parser.get("agree_terms"));
		if (!title) return toast.error(parser.get("specify_title"));
		if (!content) return toast.error(parser.get("specify_content"));
		setLoading(true);
		const { status } = await supabase
			.from("Pastes")
			.update({ title, description, content })
			.eq("id", paste.id);
		setLoading(false);
		if (status < 200 || status > 299)
			return toast.warning(parser.get("api_error"));
		router.push(`/${encodeURIComponent(paste.id)}`);
	};

	return (
		<Layout title={parser.get("edit") as string}>
			<motion.form
				className={styles.form}
				onSubmit={submit}
				variants={container}
				initial="hidden"
				animate="visible"
			>
				<motion.div variants={itemX}>
					<h3 className={styles.title}>{parser.get("edit_paste")}</h3>
					<p className={styles.desc}>{parser.get("edit_desc")}</p>
				</motion.div>
				<motion.input
					type="text"
					placeholder={parser.get("paste_name") as string}
					onChange={(e) => setTitle(e.target.value)}
					className={styles.input}
					defaultValue={title}
					variants={itemY}
				/>
				<motion.input
					type="text"
					placeholder={parser.get("paste_description") as string}
					onChange={(e) => setDescription(e.target.value)}
					className={styles.input}
					defaultValue={description}
					variants={itemY}
				/>
				<motion.div variants={itemY}>
					<Editor
						className={styles.code}
						value={content}
						onValueChange={(code) => setContent(code)}
						highlight={(code) => highlight(code, languages.js, "js")}
						padding={10}
						placeholder={parser.get("paste_content") as string}
						style={{
							fontFamily: '"Fira code", "Fira Mono", monospace',
						}}
					/>
				</motion.div>
				<motion.div className={styles.tosWrapper} variants={itemX}>
					<input
						type="checkbox"
						className={styles.check}
						onClick={() => setChecked(!checked)}
						defaultChecked={checked}
					/>
					<p
						dangerouslySetInnerHTML={{
							__html: parser.get("accept_tos", {
								tos: `<a href="/tos">${parser.get("tos_long")}</a>.`,
							}) as string,
						}}
					/>
				</motion.div>
				<motion.button
					className={`${styles.btn} ld-over${loading ? " running" : ""}`}
					variants={itemX}
				>
					<img src={Preloader} className="ld" />
					{parser.get("save")}
				</motion.button>
			</motion.form>
		</Layout>
	);
};

EditPage.getInitialProps = async (ctx) => {
	const session = await getSession(ctx);
	if (!session) {
		ctx.res.writeHead(302, {
			Location: "/api/auth/signin",
		});
		ctx.res.end();
	}
	const id = typeof ctx.query.id === "string" ? ctx.query.id : ctx.query.id[0];
	const { data } = await supabase
		.from("Pastes")
		.select("*")
		.eq("id", id)
		.single();
	if (!data || data.reported) {
		ctx.res.writeHead(302, {
			Location: "/404",
		});
		ctx.res.end();
	}
	return {
		paste: data,
	};
};

export default EditPage;
