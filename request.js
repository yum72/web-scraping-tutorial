const axios = require('axios')

const requestURL = async URL => {
  let options = {
    method: 'get',
    url: URL
  }

  try {
    const response = await axios(options)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

module.exports = requestURL
