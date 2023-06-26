const { config } = require('dotenv')

const app = require('./app')

config()

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`🚀 Server listening on port ${PORT}! 🚀`)
})