const app = require('./app');
const dbo = require("./db/Connection");


const port = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send('请求成功');
})

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
  dbo.connectToDb((err) => {
    if (err) console.error(err);
  })
});

module.exports = app;