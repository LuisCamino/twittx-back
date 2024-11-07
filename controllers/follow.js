const testFollow = (req, res) => {
    return res.status(200).send({
        message: 'current endpoint is /follow'
    });
}

module.exports = {
    testFollow
};