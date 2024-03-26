const repository = require('./repository');
const modules = {};

modules.addTrain = async (req, res) => {
    const train = req.body;
    const createdTrain = await repository.createTrain(train);
    res.status(201).json(createdTrain);
}

module.exports = modules;