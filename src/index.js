require("dotenv").config();

const fs = require("fs");

// Module for reading the .xlsx file
const xlsxReader = require("xlsx");

// DD and knex(query builder) configuration
const knex = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
});

// Path of the xlsx file to be read
const dir = `${__dirname}/excel`;

fs.watch(dir, async (eventType, filename) => {
  if (eventType === "change") {
    const file = xlsxReader.readFile(`${dir}/${filename}`);
    let data = [];
    const sheets = file.SheetNames;

    sheets.map((value, index) => {
      const temp = xlsxReader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[index]]
      );

      temp.forEach((res) => {
        data.push(res);
      });
    });

    await knex("customer")
      .del()
      .insert("customer", data)
      .then((msg) => console.log("Operation Completed Successfully"))
      .catch((err) => console.log(err));
  }
});
