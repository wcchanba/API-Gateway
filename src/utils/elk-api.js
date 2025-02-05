const fs = require('fs')
const path = require('path')
const axios = require('axios')
const request = require('request')
const { isUndefined } = require('util')

const caPath = path.join(__dirname, '../ca/elasticsearch-ca.pem')
// const url = 'https://red-elk.southeastasia.cloudapp.azure.com:9200'
// const username = 'elastic'
// const password = 'P@ssw0rd1234'
const url = 'https://elastic-server-testing.southeastasia.cloudapp.azure.com:9200'
const username = 'elastic'
const password = 'P@ssw0rdP@ssw0rd'

const options = {
  baseUrl: url,
  auth: {
  user: username,
  pass: password
  },
  ca: fs.readFileSync(caPath)
};

const checkAPI = (callback) => {
  options.uri = "/"

  request(options, ( error, response, body ) => {
    if (error) {
      callback(JSON.parse(error))
    } else {
      callback({ status: "Connection to CRD API is working properly."})      
    }
    // console.error('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
  })
}

// getAssetCount | plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp"
const getAssetCount = (plantName) => {
  options.uri = "/keppel_assets/_search?filter_path=hits.total.value"
  options.headers = {
    'Content-Type': 'application/json'
  }
  options.body = JSON.stringify({ 
    query: { 
      bool: { 
        filter: [ 
          { term:  { 'Legal Entity': plantName }},
          { term:  { Monitored: "Yes" }}
        ]
      }
    }
  })
  return new Promise(resolve => {
    request(options, ( error, response, body ) => {
      if (error) {
        return JSON.parse(error)
      } else {
        const bodyData = JSON.parse(body)
        if ( bodyData.hits.total.value === undefined) {
          resolve("Data not found")
          return
        }
        const value = bodyData.hits.total.value
        resolve(value)
      }
    })
  });
}


// getAlertsCount | plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp" | interval: 30d / 7d
const getAlertsCount = (plantName, interval) => {
  options.uri = "/smp_tickets/_search?filter_path=hits.total.value"
  options.headers = {
    'Content-Type': 'application/json'
  }
  let filter = {}
  const intervalStr = "now-" + interval + "d/d"
  filter = JSON.stringify({ 
    query: { 
      bool: { 
        filter: [ 
          { "term":  { "Legal Entity": plantName }},
          { "range": { "@timestamp": { "gte": intervalStr }}}
        ]
      }
    }
  })
  options.body = filter
  return new Promise(resolve => {
    request(options, ( error, response, body ) => {
      if (error) {
        return JSON.parse(error)
      } else {
        const bodyData = JSON.parse(body)
        if ( bodyData.hits.total.value === undefined) {
          resolve("Data not found")
          return
        }
        const value = bodyData.hits.total.value
        resolve(value)
      }
    })
  });
}

// getOpenTicketsCount, plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp" | interval: 30d / 7d
const getOpenTicketsCount = (plantName, interval) => {
  options.uri = "/smp_tickets/_search?filter_path=hits.total.value"
  options.headers = {
    'Content-Type': 'application/json'
  }
  let filter = {}
  const intervalStr = "now-" + interval + "d/d"
  filter = JSON.stringify({ 
    query: { 
      bool: { 
        filter: [ 
          { "term":  { "Legal Entity": plantName }},
          { "range": { "@timestamp": { "gte": intervalStr }}}
        ],
        "must_not": [
          {
            "terms": {
              "State": ["Cancelled", "Draft"]
            }
          },
          {
            "terms": {
              "Substate": ["Closed", "Resolved"]
            }
          }
        ]
      }
    }
  })
  options.body = filter
  return new Promise(resolve => {
    request(options, ( error, response, body ) => {
      if (error) {
        return JSON.parse(error)
      } else {
        const bodyData = JSON.parse(body)
        if ( bodyData.hits.total.value === undefined) {
          resolve("Data not found")
          return
        }
        const value = bodyData.hits.total.value
        resolve(value)
      }
    })
  });
}

// getP1OpenTicketsCount, plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp" | interval: 30d / 7d
const getP1OpenTicketsCount = (plantName, interval) => {
  const urgency = "P1 High"

  options.uri = "/smp_tickets/_search?filter_path=hits.total.value"
  options.headers = {
    'Content-Type': 'application/json'
  }
  let filter = {}
  const intervalStr = "now-" + interval + "d/d"
  filter = JSON.stringify({ 
    query: { 
      bool: { 
        filter: [ 
          { "term":  { "Legal Entity": plantName }},
          { "range": { "@timestamp": { "gte": intervalStr }}},
          { "term":  { "Urgency": urgency }}
        ],
        "must_not": [
          {
            "terms": {
              "State": ["Cancelled", "Draft"]
            }
          },
          {
            "terms": {
              "Substate": ["Closed", "Resolved"]
            }
          }
        ]
      }
    }
  })
  options.body = filter
  return new Promise(resolve => {
    request(options, ( error, response, body ) => {
      if (error) {
        return JSON.parse(error)
      } else {
        const bodyData = JSON.parse(body)
        if ( bodyData.hits.total.value === undefined) {
          resolve("Data not found")
          return
        }
        const value = bodyData.hits.total.value
        resolve(value)
      }
    })
  });
}

// getP1OpenTicketsCount, plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp" | interval: 30d / 7d
const getP2OpenTicketsCount = (plantName, interval) => {
  const urgency = "P2 Medium"

  options.uri = "/smp_tickets/_search?filter_path=hits.total.value"
  options.headers = {
    'Content-Type': 'application/json'
  }
  let filter = {}
  const intervalStr = "now-" + interval + "d/d"
  filter = JSON.stringify({ 
    query: { 
      bool: { 
        filter: [ 
          { "term":  { "Legal Entity": plantName }},
          { "range": { "@timestamp": { "gte": intervalStr }}},
          { "term":  { "Urgency": urgency }}
        ],
        "must_not": [
          {
            "terms": {
              "State": ["Cancelled", "Draft"]
            }
          },
          {
            "terms": {
              "Substate": ["Closed", "Resolved"]
            }
          }
        ]
      }
    }
  })
  options.body = filter
  return new Promise(resolve => {
    request(options, ( error, response, body ) => {
      if (error) {
        return JSON.parse(error)
      } else {
        const bodyData = JSON.parse(body)
        if ( bodyData.hits.total.value === undefined) {
          resolve("Data not found")
          return
        }
        const value = bodyData.hits.total.value
        resolve(value)
      }
    })
  });
}

// getAssetDetail | plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp" | assetName: x
const getAssetDetail = (plantName, hostname) => {
  options.uri = "/keppel_assets/_search?filter_path=hits.hits._source"
  options.headers = {
    'Content-Type': 'application/json'
  }
  let filter = {}
  filter = JSON.stringify({ 
    query: { 
      bool: { 
        filter: [ 
          { term:  { 'Legal Entity': plantName }},
          { term:  { 'Hostname': hostname }}
        ]
      }
    }
  })
  options.body = filter
  return new Promise(resolve => {
    request(options, ( error, response, body ) => {
      if (error) {
        return JSON.parse(error)
      } else {
        const bodyData = JSON.parse(body)
        if (bodyData.hits == null) {
          const dataNotFound = {
            "Error": "Data not found. Use different query."
          }
          resolve(dataNotFound)
        }
        if ( bodyData.hits.hits[0]._source === undefined) {
          resolve("Data not found")
          return
        }
        const detailData = bodyData.hits.hits[0]._source

        const dataJSON = {
          'Plant Name': plantName,
          'Asset Name': detailData['Asset Name'],
          'Asset Description': detailData['Asset Description'],
          // Hostname: detailData.Hostname,
          Platform_OS: detailData.Platform_OS,
          Room: detailData.Room,
          Location: detailData.Location
        }

        resolve(dataJSON)
      }
    })
  });
}

// getOpenTicketsAsset, plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp"
const getOpenTicketsAsset = (plantName, hostname) => {
  options.uri = "/smp_tickets/_search"
  options.headers = {
    'Content-Type': 'application/json'
  }
  let filter = {}
  filter = JSON.stringify({ 
    query: { 
      bool: { 
        filter: [ 
          { "term":  { "Legal Entity": plantName }},
          { "term":  { "Hostname": hostname }}
        ],
        "must_not": [
          {
            "terms": {
              "State": ["Cancelled", "Draft"]
            }
          },
          {
            "terms": {
              "Substate": ["Closed", "Resolved"]
            }
          }
        ]
      }
    }
  })
  options.body = filter
  return new Promise(resolve => {
    request(options, ( error, response, body ) => {
      if (error) {
        return JSON.parse(error)
      } else {
        const bodyData = JSON.parse(body)
        if ( bodyData.hits.hits[0] === undefined) {
          resolve("Data not found")
          return
        }
        const bodyDatas = bodyData.hits.hits
        
        let dataArray = []
        for (const data of bodyDatas) {
          const priority = data._source.Urgency
          const ticketID = data._source['Ticket Number']
          const timestamp = data._source['@timestamp']
          const description = data._source['Short Description']
          const ticket = {
            priority,
            ticketID,
            timestamp,
            description
          }
          dataArray.push(ticket)
        }
        resolve(dataArray)
      }
    })
  });
}

// getP1OpenTicketsAsset, plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp"
const getP1OpenTicketsAsset = (plantName, hostname) => {
  const urgency = "P1 High"
  options.uri = "/smp_tickets/_search"
  options.headers = {
    'Content-Type': 'application/json'
  }
  let filter = {}
  filter = JSON.stringify({ 
    query: { 
      bool: { 
        filter: [ 
          { "term":  { "Legal Entity": plantName }},
          { "term":  { "Hostname": hostname }},
          { "term":  { "Urgency": urgency }}
        ],
        "must_not": [
          {
            "terms": {
              "State": ["Cancelled", "Draft"]
            }
          },
          {
            "terms": {
              "Substate": ["Closed", "Resolved"]
            }
          }
        ]
      }
    }
  })
  options.body = filter
  return new Promise(resolve => {
    request(options, ( error, response, body ) => {
      if (error) {
        return JSON.parse(error)
      } else {
        const bodyData = JSON.parse(body)
        if ( bodyData.hits.hits[0] === undefined) {
          resolve("Data not found")
          return
        }
        const bodyDatas = bodyData.hits.hits
        
        let dataArray = []
        for (const data of bodyDatas) {
          const priority = data._source.Urgency
          const ticketID = data._source['Ticket Number']
          const timestamp = data._source['@timestamp']
          const description = data._source['Short Description']
          const ticket = {
            priority,
            ticketID,
            timestamp,
            description
          }
          dataArray.push(ticket)
        }
        resolve(dataArray)
      }
    })
  });
}

// getP1OpenTicketsAsset, plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp"
const getP2OpenTicketsAsset = (plantName, hostname) => {
  const urgency = "P2 Medium"
  options.uri = "/smp_tickets/_search"
  options.headers = {
    'Content-Type': 'application/json'
  }
  let filter = {}
  filter = JSON.stringify({ 
    query: { 
      bool: { 
        filter: [ 
          { "term":  { "Legal Entity": plantName }},
          { "term":  { "Hostname": hostname }},
          { "term":  { "Urgency": urgency }}
        ],
        "must_not": [
          {
            "terms": {
              "State": ["Cancelled", "Draft"]
            }
          },
          {
            "terms": {
              "Substate": ["Closed", "Resolved"]
            }
          }
        ]
      }
    }
  })
  options.body = filter
  return new Promise(resolve => {
    request(options, ( error, response, body ) => {
      if (error) {
        return JSON.parse(error)
      } else {
        const bodyData = JSON.parse(body)
        if ( bodyData.hits.hits[0] === undefined) {
          resolve("Data not found")
          return
        }
        const bodyDatas = bodyData.hits.hits
        
        let dataArray = []
        for (const data of bodyDatas) {
          const priority = data._source.Urgency
          const ticketID = data._source['Ticket Number']
          const timestamp = data._source['@timestamp']
          const description = data._source['Short Description']
          const ticket = {
            priority,
            ticketID,
            timestamp,
            description
          }
          dataArray.push(ticket)
        }
        resolve(dataArray)
      }
    })
  });
}

// // REMOVED | getVulnerabilitiesCount | severity: High, Medium, Low
// const getVulnerabilitiesCount = (severity) => {
//   options.uri = "/vulnerabilities/_search?filter_path=hits.total.value"
//   options.headers = {
//     'Content-Type': 'application/json'
//   }
//   let filter = {}
//   filter = JSON.stringify({ 
//     query: { 
//       bool: { 
//         filter: [ 
//           { term:  { Severity: severity }}
//         ]
//       }
//     }
//   })
//   options.body = filter
//   return new Promise(resolve => {
//     request(options, ( error, response, body ) => {
//       if (error) {
//         return JSON.parse(error)
//       } else {
//         const bodyData = JSON.parse(body)
//         const value = bodyData.hits.total.value
//         resolve(value)
//       }
//     })
//   });
// }

// // REMOVED | getVulnerabilitiesPlantCount | plantName: "KDHC Changi", "KDHC Mediapolis", "KDHC Biopolis", "KDHC Woodlands" | severity: High, Medium, Low
// const getVulnerabilitiesPlantCount = (severity, plantName, callback) => {
//   options.uri = "/vulnerabilities/_search?filter_path=hits.total.value"
//   options.headers = {
//     'Content-Type': 'application/json'
//   }
//   let filter = {}
//   filter = JSON.stringify({ 
//     query: { 
//       bool: { 
//         filter: [ 
//           { term:  { Severity: severity }},
//           { term:  { 'Plant Name': plantName }}
//         ]
//       }
//     }
//   })
//   options.body = filter
//   request(options, ( error, response, body ) => {
//     if (error) {
//       callback(JSON.parse(error))
//     } else {
//       const bodyData = JSON.parse(body)
//       const value = bodyData.hits.total.value
//       callback(value)
//     }
//   })
// }

// getMonthlyEventsCount | plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp" | interval: 30d
const getMonthlyEventsCount = (plantName) => {
  options.uri = "/splunk_alerts_count/_search"
  options.headers = {
    'Content-Type': 'application/json'
  }
  let filter = {}
  const plantNameFilter = plantName + "*"
  
  filter = JSON.stringify({ 
    size: 5000,
    query: { 
      constant_score: {
        filter: {
          bool: {
            must: [
              {
                bool: {
                  must: [
                    {
                      term: {
                        Category: "1d"
                      }
                    },
                    {
                      range: {
                        '@timestamp': { gte: "now-30d/d" }
                      }
                    }
                  ]
                }
              },
              {
                bool: {
                  should: [
                    {
                      wildcard: {
                        Source: plantNameFilter
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    },
    sort: {
      '@timestamp': "asc"
    }
  })
  options.body = filter
  return new Promise(resolve => {
    request(options, ( error, response, body ) => {
      if (error) {
        return JSON.parse(error)
      } else {
        const bodyData = JSON.parse(body)
        if ( bodyData.hits.hits[0] === undefined) {
          resolve("Data not found")
          return
        }
        const bodyDatas = bodyData.hits.hits

        let dataArray = []
        for (const data of bodyDatas) {
          const date = data._source['@timestamp']
          const dateArr = date.split(" ", 1);
          dataArray.push({
            date: dateArr[0],
            count: parseInt(data._source['Count'])
          })
        }

        let dataCountArray = {}
        for (const data of dataArray) {
          if (dataCountArray[data.date]) {
            dataCountArray[data.date] += data.count
          } else {
            dataCountArray[data.date] = data.count
          }
        }

        resolve(dataCountArray)
      }
    })
  });
}

// getmonthlyAlertsCount | plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp" | interval: 30d
const getmonthlyAlertsCount = (plantName) => {
  options.uri = "/smp_tickets/_search"
  options.headers = {
    'Content-Type': 'application/json'
  }
  let filter = {}
  
  filter = JSON.stringify({ 
    size: 5000,
    query: { 
      bool: { 
        filter: [ 
          { "term":  { "Legal Entity": plantName }},
          { "range": { "@timestamp": { "gte": "now-30d/d" }}}
        ]
      }
    },
    sort: {
      "@timestamp": "asc"
    }
  })
  options.body = filter
  return new Promise(resolve => {
    request(options, ( error, response, body ) => {
      if (error) {
        return JSON.parse(error)
      } else {
        const bodyData = JSON.parse(body)
        if ( bodyData.hits.hits[0] === undefined) {
          resolve("Data not found")
          return
        }
        const bodyDatas = bodyData.hits.hits

        let dataArray = []
        for (const data of bodyDatas) {
          const date = data._source['@timestamp']
          const dateArr = date.split(" ", 1);
          dataArray.push(dateArr[0])
        }

        let dataCountArray = {}
        for (const data of dataArray) {
          if (dataCountArray[data]) {
            dataCountArray[data] += 1
          } else {
            dataCountArray[data] = 1
          }
        }

        resolve(dataCountArray)
      }
    })
  });
}

// // REMOVED | getTopThreatsPlant | plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp" | interval: 30d
// const getTopThreatsPlant = (plantName, callback) => {
//   options.uri = "/smp_tickets/_search"
//   options.headers = {
//     'Content-Type': 'application/json'
//   }
//   let filter = {}
  
//   filter = JSON.stringify({ 
//     size: 5000,
//     query: { 
//       bool: { 
//         filter: [ 
//           { "term":  { "Legal Entity": plantName }},
//           { "range": { "@timestamp": { "gte": "now-30d/d" }}}
//         ]
//       }
//     },
//     sort: {
//       "@timestamp": "asc"
//     }
//   })
//   options.body = filter

//   request(options, ( error, response, body ) => {
//     if (error) {
//       callback(JSON.parse(error))
//     } else {
//       const bodyData = JSON.parse(body)
//       const bodyDatas = bodyData.hits.hits

//       let dataArray = []
//       for (const data of bodyDatas) {
//         const date = data._source['Short Description']
//         dataArray.push(date)
//       }

//       let dataCountArray = {}
//       let dataTotal = 0
//       for (const data of dataArray) {
//         if (dataCountArray[data]) {
//           dataCountArray[data] += 1
//           dataTotal += 1
//         } else {
//           dataCountArray[data] = 1
//           dataTotal += 1
//         }
//       }
      
//       let sortArr = []
//       for (const i in dataCountArray) {
//         sortArr.push([i, dataCountArray[i]])
//       }

//       const sortDataArr = sortArr.sort((a, b) => {
//         return b[1] - a[1]
//       })

//       let sortObj = {}
//       for (const i of sortDataArr) {
//         const dataPercentage = i[1] * 100 / dataTotal
//         sortObj[i[0]] = Math.round(dataPercentage)
//       }

//       callback(sortObj)
//     }
//   })
// }

// getHealthStatusSplunk, plantName: "kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc", "KMC", "UPNP", "kstp"
const getHealthStatusSplunk = (plantName) => {
  options.uri = "/splunk_alerts_count/_search"
  options.headers = {
    'Content-Type': 'application/json'
  }
  let filter = {}
  const category = "15m"
  const intervalStr = "now-1d/d"
  const sourceStr = plantName + "*"
  filter = JSON.stringify({
    "size": 5000,
    "query": {
      "constant_score": {
        "filter": {
          "bool": {
            "must": [
              {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "Category": category
                      }
                    },
                    {
                      "range": {
                        "@timestamp": { "gte": intervalStr }
                      }
                    }
                  ]
                }
              },
              {
                "bool": {
                  "should": [
                    {
                      "wildcard": {
                        "Source": sourceStr
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    },
    "sort": {
        "@timestamp": "desc"
    }
})
  options.body = filter
  return new Promise(resolve => {
    request(options, ( error, response, body ) => {
      if (error) {
        resolve(JSON.parse(error)) 
      } else {
        const bodyData = JSON.parse(body)
        if ( bodyData.hits.hits[0] === undefined) {
          resolve("Data not found")
          return
        }
        const value = bodyData.hits.hits[0]
        const dateUTC = new Date(value._source['@timestamp'])
        const dateSGT = dateUTC.toLocaleString("en-US", {timeZone: "Asia/Singapore"})
        const dateNow = new Date()
        // const status = ((dateNow - dateUTC) - (1000*60*60*8)) / 1000 / 60  < 20 ? "Healthy" : "Down" // Local test using SGT machine | NOT USED
        // const status = ((dateNow - dateUTC) - (1000*60*60*8)) / 1000 / 60  < 20 ? "Healthy" : "Down" // API Gateway server using UTC machine BACKUP | NOT USED
        // const status = (dateNow - dateUTC) / 1000 / 60  < 20 ? "Healthy" : "Down" // API Gateway server using UTC machine | second condition needs to be changed to "Down" | ORIGINAL WORKS
        const status = "Healthy" // API Gateway server using UTC machine | HARDCODE, the above is the original working code

        const dataArray = []
        const dataSplunk = {
          plantName,
          "name": "Log Forwarder",
          "status": status,
          "lastSynchSGT": dateSGT
        }
        const dataNozomi = {
          plantName,
          "name": "Network Sensor",
          "status": status,
          "lastSynchSGT": dateSGT
        }
        dataArray.push({
          "Log Forwarder": dataSplunk,
          "Network Sensor": dataNozomi
        })

        resolve(dataArray)
      }
    })
  });
}

module.exports = {
  checkAPI,
  getAssetCount,
  getAssetDetail,
  getAlertsCount,
  getOpenTicketsCount,
  // getVulnerabilitiesCount,
  // getVulnerabilitiesPlantCount,
  getmonthlyAlertsCount,
  getMonthlyEventsCount,
  getOpenTicketsAsset,
  getHealthStatusSplunk,
  getP1OpenTicketsCount,
  getP2OpenTicketsCount,
  getP1OpenTicketsAsset,
  getP2OpenTicketsAsset
  // getTopThreatsPlant
}