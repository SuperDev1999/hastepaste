export default function Hero() {
	return (
		<div className="container flex flex-col items-center max-w-screen-xl px-16 pt-10 pb-32 mx-auto sm:flex-row">
			<div className="flex flex-col w-full pb-10 text-center sm:pb-0 sm:text-left">
				<h1 className="text-4xl text-white">
					Hello <span className="font-semibold">Stranger</span>
				</h1>
				<p className="text-xl text-white">Give us some time to remember you.</p>
			</div>
			<div className="flex items-center justify-center w-full sm:justify-end">
				<div className="box-border flex flex-col items-center justify-center h-48 px-5 py-5 transition duration-150 transform bg-opacity-50 border-4 border-dashed rounded-lg cursor-pointer hover:scale-105 w-80 bg-pink-300 border-pink-200">
					<span
						className="material-icons-round text-pink-100"
						style={{ fontSize: "64px" }}
					>
						add
					</span>
					<p className="text-pink-200 text-md">Loading...</p>
				</div>
			</div>
		</div>
	);
}
