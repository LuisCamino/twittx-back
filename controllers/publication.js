const testPublication = (req, res) => {
    return res.status(200).send({
        message: 'current endpoint is /publication'
    });
}

module.exports = {
    testPublication
}