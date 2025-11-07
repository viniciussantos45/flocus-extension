import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  MessengerLogoIcon,
  RedditLogoIcon,
  SteamLogoIcon,
  TiktokLogoIcon,
  TwitchLogoIcon,
  WhatsappLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon
} from "@phosphor-icons/react"

export const sitesInfo = {
  "youtube.com": {
    icon: YoutubeLogoIcon,
    name: "YouTube"
  },
  "instagram.com": {
    icon: InstagramLogoIcon,
    name: "Instagram"
  },
  "facebook.com": {
    icon: FacebookLogoIcon,
    name: "Facebook"
  },
  "twitter.com": {
    icon: TwitchLogoIcon,
    name: "Twitter"
  },
  "x.com": {
    icon: XLogoIcon,
    name: "X"
  },
  "linkedin.com": {
    icon: LinkedinLogoIcon,
    name: "LinkedIn"
  },
  "reddit.com": {
    icon: RedditLogoIcon,
    name: "Reddit"
  },
  "tiktok.com": {
    icon: TiktokLogoIcon,
    name: "TikTok"
  },
  "whatsapp.com": {
    icon: WhatsappLogoIcon,
    name: "WhatsApp"
  },
  "messenger.com": {
    icon: MessengerLogoIcon,
    name: "Messenger"
  },
  "steampowered.com": {
    icon: SteamLogoIcon,
    name: "Steam"
  }
}

export type SitesKey = keyof typeof sitesInfo
export type SitesInfo = (typeof sitesInfo)[SitesKey]
