const cheerio = require('cheerio')

const processHTML = (HTML, filterValues, maxDaysBack) => {
  const $ = cheerio.load(HTML)
  let data = []
  let nextPage = ''

  nextPage = 'https://news.ycombinator.com/' + $('.morelink').attr('href')

  //.each to loop over all class athing elements
  $('.athing').each(async (index, element) => {
    let title = $(element)
      .find('.titlelink')
      .text()
    let link = $(element)
      .find('a')
      .attr('href')
    let timeAgo = $(element)
      .next()
      .find('.age')
      .text()

    let titleLowerCase = title.toLowerCase()
    let hasFilterItem = filterValues.some(item => titleLowerCase.includes(item))

    //time of last job posted on current page
    let timeAgoSimplified = timeAgo.includes('days') ? timeAgo.split(' ')[0] : 1
    timeAgoSimplified = parseInt(timeAgoSimplified)

    //check if time posted was less than 30 days maxDaysBack
    if (timeAgoSimplified < maxDaysBack) {
      data.push({
        link,
        title,
        timeAgo,
        hasFilterItem
      })
    } else {
      nextPage = null
    }
  })

  return { data, nextPage }
}

module.exports = processHTML
