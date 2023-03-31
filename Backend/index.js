//Require
const express = require("express");
const cors = require("cors");

const connectToDatabase = require("./database.js");

//Setup
const app = express();
const newApi = express();

//Config Cors
app.use(cors());
newApi.use(cors());

app.use(express.json());

const port = 3000;

newApi.listen(port + 1, () => {
	console.log(`Another api listening on port: ${port + 1}`);
});

app.listen(port, () => {
	console.log(`Server is listening on port: ${port}`);
});

//API
async function loadAllAPI() {
	const connection = await connectToDatabase();
	connection.query(
		"SELECT * FROM api_list",
		function (error, results, fields) {
			if (error) throw error;

			results.forEach((element) => {
				newApi.get("/" + element["name"], (req, res) => {
					res.send(
						`${element["name"]} | Success ${element["type"]} Data.`
					);
				});
				app.use("/" + element["name"], newApi);
			});
		}
	);
}

loadAllAPI();

app.post("/create-api/:apiName", (main_req, main_res) => {
	const apiName = main_req.params.apiName;

	newApi.get("/" + apiName, (req, res) => {
		const jsonData = main_req.body;
		res.send(`${apiName} | Success ${jsonData["type"]} Data.`);
	});
	app.use("/" + apiName, newApi);

	main_res.send(`API ${apiName} created`);
});
