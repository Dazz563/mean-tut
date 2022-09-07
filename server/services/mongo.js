const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});
mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(`mongodb+srv://darren-user:${process.env.MONGO_ATLAS_PW}@cluster0.2yyh4.mongodb.net/post-project?retryWrites=true&w=majority`);
}

module.exports = {
    mongoConnect,
};
