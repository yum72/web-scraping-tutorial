require('dotenv').config()
const request = require('./request')
const processHTML = require('./processHTML')
const moment = require('moment')
const fs = require('fs')
const csvWriter = require('csv-write-stream')

//set csv file headers
const writer = csvWriter({
  headers: ['Link', 'Title', 'timeAgo', 'hasRequiredJob']
})

//create a file in which data will be appended
const fileName =
  moment().format('YY-MM-DD-HH:mm:ss') + '-hackerNews-jobs' + '.csv'
writer.pipe(fs.createWriteStream(fileName, { flags: 'a' }))

//env file variables
let {
  URL,
  FILTER_VALUES: filterValues,
  MAX_DAYS_BACK: maxDaysBack
} = process.env
filterValues = JSON.parse(filterValues) //convert string to array

const scrapePage = async URL => {
  //get site HTML
  let siteHTML = await request(URL)

  //process HTML and get relevant data
  let { data, nextPage } = processHTML(siteHTML, filterValues, maxDaysBack)

  // save to CSV file
  for (let rowData of data) {
    let { link, title, timeAgo, hasFilterItem } = rowData
    writer.write([link, title, timeAgo, hasFilterItem])
  }

  console.log(data.length, ' Jobs saved!')

  // scrape next pages
  if (nextPage) {
    console.log(URL)
    scrapePage(nextPage)
  } else {
    console.log('Finished!')
  }
}

scrapePage(URL)
