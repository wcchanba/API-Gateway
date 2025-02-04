const express = require('express')
const { 
    checkAPI, 
    getAssetCount,
    getAssetDetail,
    getAlertsCount,
    getOpenTicketsCount,
    getmonthlyAlertsCount,
    getMonthlyEventsCount,
    getHealthStatusSplunk,
    getP1OpenTicketsCount,
    getP2OpenTicketsCount,
    getP1OpenTicketsAsset,
    getP2OpenTicketsAsset
    // getVulnerabilitiesCount,
    // getVulnerabilitiesPlantCount,
    // getOpenTicketsAsset,
    // getTopThreatsPlant
} = require('../utils/elk-api')
const auth = require('../middleware/auth')
const router = new express.Router()

// ============================= ELK =============================
// Check connection to ELK API
router.get('', (req, res) => {
    checkAPI((data) => {
        res.send(data)
    })
})

// get overall data (country overview)
router.get('/getOverallData', auth, async (req, res) => {
    const interval = 30

    const dataCategory = ({
        "Energy as a Service": ["kdhc-chg", "kdhc-mpl", "kdhc-bpl", "kdhc-wdl", "onc"],
        "Power & Renewables": ["KMC"],
        "Enviromental": ["kstp"],
        "Water Services": ["UPNP"]
    })

    const [changiHS, mediapolisHS, biopolisHS, woodlandsHS, oncHS, kmcHS, upnpHS, kstpHS] = await Promise.all(
        [
            getHealthStatusSplunk("kdhc-chg"),
            getHealthStatusSplunk("kdhc-mpl"),
            getHealthStatusSplunk("kdhc-bpl"),
            getHealthStatusSplunk("kdhc-wdl"),
            getHealthStatusSplunk("onc"),
            getHealthStatusSplunk("KMC"),
            getHealthStatusSplunk("UPNP"),
            getHealthStatusSplunk("kstp")
        ])

    const dataHS = ({
        "changi": changiHS,
        "mediapolis": mediapolisHS,
        "biopolis": biopolisHS,
        "woodlands": woodlandsHS,
        "onc": oncHS,
        "kmc": kmcHS,
        "upnp": upnpHS,
        "kstp": kstpHS
    })
    
    const [changiTC, mediapolisTC, biopolisTC, woodlandsTC, oncTC, kmcTC, upnpTC, kstpTC] = await Promise.all(
        [
            getAlertsCount("kdhc-chg", interval), 
            getAlertsCount("kdhc-mpl", interval), 
            getAlertsCount("kdhc-bpl", interval), 
            getAlertsCount("kdhc-wdl", interval), 
            getAlertsCount("onc", interval),
            getAlertsCount("KMC", interval), 
            getAlertsCount("UPNP", interval), 
            getAlertsCount("kstp", interval)
        ])

    const totalTC = changiTC + mediapolisTC + biopolisTC + woodlandsTC + oncTC + kmcTC + upnpTC + kstpTC
    const dataTC = ({
        "changi": changiTC,
        "mediapolis": mediapolisTC,
        "biopolis": biopolisTC,
        "woodlands": woodlandsTC,
        "onc": oncTC,
        "kmc": kmcTC,
        "upnp": upnpTC,
        "kstp": kstpTC,
        "total": totalTC
    })
    
    const [changiAC, mediapolisAC, biopolisAC, woodlandsAC, oncAC, kmcAC, upnpAC, kstpAC] = await Promise.all(
        [
            getAssetCount("kdhc-chg"),
            getAssetCount("kdhc-mpl"),
            getAssetCount("kdhc-bpl"),
            getAssetCount("kdhc-wdl"),
            getAssetCount("onc"),
            getAssetCount("KMC"),
            getAssetCount("UPNP"),
            getAssetCount("kstp")
        ])

    const totalAC = changiAC + mediapolisAC + biopolisAC + woodlandsAC + oncAC + kmcAC + upnpAC + kstpAC
    const dataAC = ({
        "changi": changiAC,
        "mediapolis": mediapolisAC,
        "biopolis": biopolisAC,
        "woodlands": woodlandsAC,
        "onc": oncAC,
        "kmc": kmcAC,
        "upnp": upnpAC,
        "kstp": kstpAC,
        "total": totalAC
    })

    getAssetCount("KDHC Changi")

    const [changiOTC, mediapolisOTC, biopolisOTC, woodlandsOTC, oncOTC, kmcOTC, upnpOTC, kstpOTC] = await Promise.all(
        [
            getOpenTicketsCount("kdhc-chg", interval), 
            getOpenTicketsCount("kdhc-mpl", interval), 
            getOpenTicketsCount("kdhc-bpl", interval), 
            getOpenTicketsCount("kdhc-wdl", interval),
            getOpenTicketsCount("onc", interval), 
            getOpenTicketsCount("KMC", interval), 
            getOpenTicketsCount("UPNP", interval), 
            getOpenTicketsCount("kstp", interval)
        ])

    const totalOTC = changiOTC + mediapolisOTC + biopolisOTC + woodlandsOTC + oncOTC + kmcOTC + upnpOTC + kstpOTC
    const dataOTC = ({
        "changi": changiOTC,
        "mediapolis": mediapolisOTC,
        "biopolis": biopolisOTC,
        "woodlands": woodlandsOTC,
        "onc": oncOTC,
        "kmc": kmcOTC,
        "upnp": upnpOTC,
        "kstp": kstpOTC,
        "total": totalOTC
    })

    const [changiP1OTC, mediapolisP1OTC, biopolisP1OTC, woodlandsP1OTC, oncP1OTC, kmcP1OTC, upnpP1OTC, kstpP1OTC] = await Promise.all(
        [
            getP1OpenTicketsCount("kdhc-chg", interval), 
            getP1OpenTicketsCount("kdhc-mpl", interval), 
            getP1OpenTicketsCount("kdhc-bpl", interval), 
            getP1OpenTicketsCount("kdhc-wdl", interval),
            getP1OpenTicketsCount("onc", interval), 
            getP1OpenTicketsCount("KMC", interval), 
            getP1OpenTicketsCount("UPNP", interval), 
            getP1OpenTicketsCount("kstp", interval)
        ])

    const totalP1OTC = changiP1OTC + mediapolisP1OTC + biopolisP1OTC + woodlandsP1OTC + oncP1OTC + kmcP1OTC + upnpP1OTC + kstpP1OTC
    const dataP1OTC = ({
        "changi": changiP1OTC,
        "mediapolis": mediapolisP1OTC,
        "biopolis": biopolisP1OTC,
        "woodlands": woodlandsP1OTC,
        "onc": oncP1OTC,
        "kmc": kmcP1OTC,
        "upnp": upnpP1OTC,
        "kstp": kstpP1OTC,
        "total": totalP1OTC
    })

    const [changiP2OTC, mediapolisP2OTC, biopolisP2OTC, woodlandsP2OTC, oncP2OTC, kmcP2OTC, upnpP2OTC, kstpP2OTC] = await Promise.all(
        [
            getP2OpenTicketsCount("kdhc-chg", interval), 
            getP2OpenTicketsCount("kdhc-mpl", interval), 
            getP2OpenTicketsCount("kdhc-bpl", interval), 
            getP2OpenTicketsCount("kdhc-wdl", interval),
            getP2OpenTicketsCount("onc", interval), 
            getP2OpenTicketsCount("KMC", interval), 
            getP2OpenTicketsCount("UPNP", interval), 
            getP2OpenTicketsCount("kstp", interval)
        ])

    const totalP2OTC = changiP2OTC + mediapolisP2OTC + biopolisP2OTC + woodlandsP2OTC + oncP2OTC + kmcP2OTC + upnpP2OTC + kstpP2OTC
    const dataP2OTC = ({
        "changi": changiP2OTC,
        "mediapolis": mediapolisP2OTC,
        "biopolis": biopolisP2OTC,
        "woodlands": woodlandsP2OTC,
        "onc": oncP2OTC,
        "kmc": kmcP2OTC,
        "upnp": upnpP2OTC,
        "kstp": kstpP2OTC,
        "total": totalP2OTC
    })

    const data = {
        "categories": dataCategory,
        "healthStatus": dataHS,
        "alertsCount": dataTC,
        "assetsCount": dataAC,
        "openTicketsCount": dataOTC,
        "P1openTicketsCount": dataP1OTC,
        "P2openTicketsCount": dataP2OTC
    }

    res.send(data)
})

// // REMOVED: combined with other API | Get Health Status All
// router.get('/getHealthStatusAll', auth, async (req, res) => {
//     const [changi, mediapolis, biopolis, woodlands, onc, kmc, upnp, kstp] = await Promise.all(
//         [
//             getHealthStatusSplunk("kdhc-chg"),
//             getHealthStatusSplunk("kdhc-mpl"),
//             getHealthStatusSplunk("kdhc-bpl"),
//             getHealthStatusSplunk("kdhc-wdl"),
//             getHealthStatusSplunk("onc"),
//             getHealthStatusSplunk("KMC"),
//             getHealthStatusSplunk("UPNP"),
//             getHealthStatusSplunk("kstp")
//         ])

//     const data = ({
//         changi,
//         mediapolis,
//         biopolis,
//         woodlands,
//         onc,
//         kmc,
//         upnp,
//         kstp
//     })
//     res.send(data)
// })

// // REMOVED: combined with other API | Get All Threats Count
// router.get('/getAlertsCountAll', auth, async (req, res) => {
//     const interval = req.body.interval
//     const [changi, mediapolis, biopolis, woodlands, onc, kmc, upnp, kstp] = await Promise.all(
//         [
//             getAlertsCount("kdhc-chg", interval), 
//             getAlertsCount("kdhc-mpl", interval), 
//             getAlertsCount("kdhc-bpl", interval), 
//             getAlertsCount("kdhc-wdl", interval), 
//             getAlertsCount("ONC", interval),
//             getAlertsCount("KMC", interval), 
//             getAlertsCount("UPNP", interval), 
//             getAlertsCount("kstp", interval)
//         ])

//     const total = changi + mediapolis + biopolis + woodlands + onc + kmc + upnp + kstp
//     const data = ({
//         changi,
//         mediapolis,
//         biopolis,
//         woodlands,
//         onc,
//         kmc,
//         upnp,
//         kstp,
//         total
//     })
//     res.send(data)
// })

// // REMOVED: combined with other API | Get All Open Tickets Count
// router.get('/getOpenTicketsCountAll', auth, async (req, res) => {
//     const interval = req.body.interval
//     const [changi, mediapolis, biopolis, woodlands, onc, kmc, upnp, kstp] = await Promise.all(
//         [
//             getOpenTicketsCount("kdhc-chg", interval), 
//             getOpenTicketsCount("kdhc-mpl", interval), 
//             getOpenTicketsCount("kdhc-bpl", interval), 
//             getOpenTicketsCount("kdhc-wdl", interval),
//             getOpenTicketsCount("ONC", interval), 
//             getOpenTicketsCount("KMC", interval), 
//             getOpenTicketsCount("UPNP", interval), 
//             getOpenTicketsCount("kstp", interval)
//         ])

//     const total = changi + mediapolis + biopolis + woodlands + onc + kmc + upnp + kstp
//     const data = ({
//         changi,
//         mediapolis,
//         biopolis,
//         woodlands,
//         onc,
//         kmc,
//         upnp,
//         kstp,
//         total
//     })
//     res.send(data)
// })

// get plant overall data (site overview)
router.get('/getPlantOverallData', auth, async (req, res) => {
    const plantName = req.body.plantName
    const interval = 30

    let dataCategory = ""
    if (plantName == "kdhc-chg"|| plantName == "kdhc-mpl"|| plantName == "kdhc-bpl"|| plantName == "kdhc-wdl"|| plantName == "onc") {
        dataCategory = "Energy as a Service"
    } else if (plantName == "KMC") {
        dataCategory = "Power & Renewables"
    } else if (plantName == "kstp") {
        dataCategory = "Enviromental"
    } else if (plantName == "UPNP") {
        dataCategory = "Water Services"
    }

    const [healthStatus] = await Promise.all(
        [
            getHealthStatusSplunk(plantName)
        ])

    const dataHS = ({
        healthStatus
    })
    
    const [alertsCount] = await Promise.all(
        [
            getAlertsCount(plantName, interval)
        ])

    const dataTC = ({
        alertsCount
    })

    const [openTicketsCount] = await Promise.all(
        [
            getOpenTicketsCount(plantName, interval)
        ])

    const dataOTC = ({
        openTicketsCount
    })

    const [monthlyEventsCount] = await Promise.all(
        [
            getMonthlyEventsCount(plantName)
        ])

    const dataMEC = ({
        monthlyEventsCount
    })

    const [monthlyAlertsCount] = await Promise.all(
        [
            getmonthlyAlertsCount(plantName)
        ])

    const dataMTC = ({
        monthlyAlertsCount
    })

    const [p1openTicketsCount] = await Promise.all(
        [
            getP1OpenTicketsCount(plantName, interval)
        ])

    const dataP1OTC = ({
        p1openTicketsCount
    })

    const [p2openTicketsCount] = await Promise.all(
        [
            getP2OpenTicketsCount(plantName, interval)
        ])

    const dataP2OTC = ({
        p2openTicketsCount
    })

    const data = {
        "category": dataCategory,
        "healthStatus": dataHS.healthStatus,
        "threatsCount": dataTC.threatsCount,
        "openTicketsCount": dataOTC.openTicketsCount,
        "monthlyEventsCount": dataMEC.monthlyEventsCount,
        "monthlyAlertsCount": dataMTC.monthlyAlertsCount,
        "P1openTicketsCount": dataP1OTC.p1openTicketsCount,
        "P2openTicketsCount": dataP2OTC.p1openTicketsCount
    }

    res.send(data)
})

// // REMOVED: combined with other API | Get Plant Health Status
// router.get('/getHealthStatus', auth, async (req, res) => {
//     const plantName = req.body.plantName
//     const [healthStatus] = await Promise.all(
//         [
//             getHealthStatusSplunk(plantName)
//         ])

//     const data = ({
//         healthStatus
//     })
//     res.send(data)
// })

// // REMOVED: combined with other API | Get Plant Threats Count
// router.get('/getAlertsCount', auth, async (req, res) => {
//     const location = req.body.location
//     const interval = 30
//     const [threatsCount] = await Promise.all(
//         [
//             getAlertsCount(location, interval)
//         ])

//     const data = ({
//         threatsCount
//     })
//     res.send(data)
// })

// // REMOVED: combined with other API | Get Plant Open Tickets Count
// router.get('/getOpenTicketsCount', auth, async (req, res) => {
//     const location = req.body.location
//     const interval = 30
//     const [openTicketsCount] = await Promise.all(
//         [
//             getOpenTicketsCount(location, interval)
//         ])

//     const data = ({
//         openTicketsCount
//     })
//     res.send(data)
// })

// // REMOVED: combined with other API | Get Monthly Events Count
// router.get('/getMonthlyEventsCount', auth, async (req, res) => {
//     const plantName = req.body.PlantName

//     if (!plantName) {
//         res.status(404).send()
//     }

//     try {
//         getMonthlyEventsCount(plantName, (data) => {
//             res.send(data)
//         })
        
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// // REMOVED: combined with other API | Get Monthly Threats Count
// router.get('/getmonthlyAlertsCount', auth, async (req, res) => {
//     const plantName = req.body.PlantName

//     if (!plantName) {
//         res.status(404).send()
//     }

//     try {
//         getmonthlyAlertsCount(plantName, (data) => {
//             res.send(data)
//         })
        
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// // REMOVED | Get Asset Count
// router.get('/getAssetCount/all', async (req, res) => {
//     const [changi, mediapolis, biopolis, woodlands] = await Promise.all(
//         [
//             getAssetCount("KDHC Changi"), 
//             getAssetCount("KDHC Mediapolis"), 
//             getAssetCount("KDHC Biopolis"), 
//             getAssetCount("KDHC Woodlands")
//         ])

//     const total = changi + mediapolis + biopolis + woodlands
//     const data = ({
//         changi,
//         mediapolis,
//         biopolis,
//         woodlands,
//         total
//     })
//     res.send(data)
// })

// Get Asset Detail
router.get('/getAssetDetail', auth, async (req, res) => {
    const plantName = req.body.plantName
    const hostname = req.body.hostname

    const [assetDetail] = await Promise.all(
        [
            getAssetDetail(plantName, hostname)
        ]
    )

    const dataAD = ({
        assetDetail
    })

    const [p1OpenTicketsAsset] = await Promise.all(
        [
            getP1OpenTicketsAsset(plantName, hostname)
        ]
    )

    const dataP1 = ({
        p1OpenTicketsAsset
    })

    const [p2OpenTicketsAsset] = await Promise.all(
        [
            getP2OpenTicketsAsset(plantName, hostname)
        ]
    )

    const dataP2 = ({
        p2OpenTicketsAsset
    })

    let dataHS = ({
        HS: "No health status for this host."
    })

    if (hostname == "KDHC-CHG-HF01") {
        const [changiHS] = await Promise.all(
            [
                getHealthStatusSplunk("kdhc-chg")
            ])
        dataHS = {
            HS: changiHS[0]['Log Forwarder']
        }
    } else if (hostname == "KDHC-CHG-NG01" || hostname == "ONC-CMC01") {
        const [changiHS] = await Promise.all(
            [
                getHealthStatusSplunk("kdhc-chg")
            ])
        dataHS = {
            HS: changiHS[0]['Network Sensor']
        }
    }

    const data = {
        assetDetail: dataAD.assetDetail,
        "P1 Tickets": dataP1.p1OpenTicketsAsset,
        "P2 Tickets": dataP2.p2OpenTicketsAsset,
        healthStatus: dataHS.HS
    }

    res.send(data)
})

// // REMOVED: combined with other API | Get Asset Open Tickets Details
// router.get('/getOpenTicketsAsset', auth, async (req, res) => {
//     const plantName = req.body.plantName
//     const hostname = req.body.hostname
//     const [openTickets] = await Promise.all(
//         [
//             getOpenTicketsAsset(plantName, hostname)
//         ])

//     const data = ({
//         openTickets
//     })
//     res.send(data)
// })

// // REMOVED: combined with other API | Get Asset P1 Open Tickets Details
// router.get('/getP1OpenTicketsAsset', auth, async (req, res) => {
//     const plantName = req.body.plantName
//     const hostname = req.body.hostname
//     const [openTickets] = await Promise.all(
//         [
//             getP1OpenTicketsAsset(plantName, hostname)
//         ])

//     const data = ({
//         openTickets
//     })
//     res.send(data)
// })

// // REMOVED | Get Vulnerabilities Count
// router.get('/getVulnerabilitiesCount/all', async (req, res) => {
//     const [high, medium, low] = await Promise.all(
//         [
//             getVulnerabilitiesCount("High"), 
//             getVulnerabilitiesCount("Medium"), 
//             getVulnerabilitiesCount("Low")
//         ])

//     const total = high + medium + low
//     const data = ({
//         high,
//         medium,
//         low,
//         total
//     })
//     res.send(data)
// })

// // REMOVED | Get Vulnerabilities Plant Count
// router.get('/getVulnerabilitiesPlantCount', async (req, res) => {
//     const severity = req.query.severity
//     const plantName = req.query.plantName
//     getVulnerabilitiesPlantCount(severity, plantName, (data) => {
//         const dataJSON = {
//             total: data
//         }
//         res.send(dataJSON)
//     })
// })

// // REMOVED | Get Top Threats Plant
// router.get('/getTopThreatsPlant', auth, async (req, res) => {
//     const plantName = req.body.PlantName

//     if (!plantName) {
//         res.status(404).send()
//     }

//     try {
//         getTopThreatsPlant(plantName, (data) => {
//             res.send(data)
//         })
        
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })



module.exports = router