import { Storage } from "@plasmohq/storage"

import { getDomain } from "~src/libs/utils"

const storage = new Storage({
  area: "local"
})

const defaultBlockedUrls = [
  "youtube.com",
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "reddit.com",
  "gupy.io",
  "linkedin.com"
]

// Get all blocked URLs (default + custom)
async function getAllBlockedUrls(): Promise<string[]> {
  const customBlockedUrls = await storage.get<string[]>("customBlockedUrls") || []
  return [...defaultBlockedUrls, ...customBlockedUrls]
}

// Check if domain has temporary access
async function hasTemporaryAccess(domain: string): Promise<boolean> {
  const tempAccess = await storage.get<Record<string, number>>("temporaryAccess") || {}
  const expirationTime = tempAccess[domain]

  if (!expirationTime) return false

  // Check if access has expired
  if (Date.now() > expirationTime) {
    // Clean up expired entry
    delete tempAccess[domain]
    await storage.set("temporaryAccess", tempAccess)
    return false
  }

  return true
}

// Base to check URL trying access
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const url = changeInfo.url || tab.url || null
  if (url) {
    const blockedUrls = await getAllBlockedUrls()

    if (blockedUrls.some((blockedUrl) => url!.includes(blockedUrl))) {
      const domain = getDomain(url)

      // Check if this domain has temporary access
      if (await hasTemporaryAccess(domain)) {
        console.log(`Temporary access granted for ${domain}`)
        return // Allow access
      }

      console.log(`Tab URL changed: ${tabId} - New URL: ${url}`)
      // Redirect to block content page
      const blockPageUrl = chrome.runtime.getURL(
        `tabs/block-content.html?requestedUrl=${encodeURIComponent(url)}`
      )
      chrome.tabs.update(tabId, { url: blockPageUrl })
    }
  } else {
    console.log(`Tab updated: ${tabId}`, changeInfo, tab)
  }
})
