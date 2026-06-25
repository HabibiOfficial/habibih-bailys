"use strict"

Object.defineProperty(exports, "__esModule", { value: true })

const { makeCommunitiesSocket } = require("./community")

const makeWASocket = (config) => {
    const newConfig = {
        ...require("../Defaults/connection").DEFAULT_CONNECTION_CONFIG,
        ...config
    }

    if (config.shouldSyncHistoryMessage === undefined) {
        newConfig.shouldSyncHistoryMessage = () => !!newConfig.syncFullHistory
    }

    return makeCommunitiesSocket(newConfig)
}

exports.default = makeWASocket
