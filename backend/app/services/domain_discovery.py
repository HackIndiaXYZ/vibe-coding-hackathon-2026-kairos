import re

# Known platform metadata: domain -> (display_name, category)
KNOWN_PLATFORMS = {
    # Social
    "facebook.com":     ("Facebook",     "social"),
    "instagram.com":    ("Instagram",    "social"),
    "twitter.com":      ("Twitter/X",    "social"),
    "x.com":            ("Twitter/X",    "social"),
    "linkedin.com":     ("LinkedIn",     "social"),
    "snapchat.com":     ("Snapchat",     "social"),
    "tiktok.com":       ("TikTok",       "social"),
    "reddit.com":       ("Reddit",       "social"),
    "pinterest.com":    ("Pinterest",    "social"),
    "discord.com":      ("Discord",      "social"),
    "telegram.org":     ("Telegram",     "social"),
    "whatsapp.com":     ("WhatsApp",     "social"),
    # Dev
    "github.com":       ("GitHub",       "dev"),
    "gitlab.com":       ("GitLab",       "dev"),
    "bitbucket.org":    ("Bitbucket",    "dev"),
    "stackoverflow.com":("Stack Overflow","dev"),
    "heroku.com":       ("Heroku",       "dev"),
    "vercel.com":       ("Vercel",       "dev"),
    "netlify.com":      ("Netlify",      "dev"),
    "digitalocean.com": ("DigitalOcean", "dev"),
    "aws.amazon.com":   ("AWS",          "dev"),
    "npmjs.com":        ("npm",          "dev"),
    # Shopping
    "amazon.com":       ("Amazon",       "shopping"),
    "amazon.in":        ("Amazon India", "shopping"),
    "flipkart.com":     ("Flipkart",     "shopping"),
    "ebay.com":         ("eBay",         "shopping"),
    "myntra.com":       ("Myntra",       "shopping"),
    "ajio.com":         ("AJIO",         "shopping"),
    "meesho.com":       ("Meesho",       "shopping"),
    "nykaa.com":        ("Nykaa",        "shopping"),
    "swiggy.com":       ("Swiggy",       "shopping"),
    "zomato.com":       ("Zomato",       "shopping"),
    # Finance
    "paypal.com":       ("PayPal",       "finance"),
    "razorpay.com":     ("Razorpay",     "finance"),
    "paytm.com":        ("Paytm",        "finance"),
    "phonepe.com":      ("PhonePe",      "finance"),
    "gpay.com":         ("Google Pay",   "finance"),
    "zerodha.com":      ("Zerodha",      "finance"),
    "groww.in":         ("Groww",        "finance"),
    "cred.club":        ("CRED",         "finance"),
    "stripe.com":       ("Stripe",       "finance"),
    # Email
    "gmail.com":        ("Gmail",        "email"),
    "googlemail.com":   ("Gmail",        "email"),
    "yahoo.com":        ("Yahoo Mail",   "email"),
    "outlook.com":      ("Outlook",      "email"),
    "hotmail.com":      ("Hotmail",      "email"),
    "protonmail.com":   ("ProtonMail",   "email"),
    "proton.me":        ("ProtonMail",   "email"),
    "icloud.com":       ("iCloud Mail",  "email"),
    # Streaming
    "netflix.com":      ("Netflix",      "entertainment"),
    "spotify.com":      ("Spotify",      "entertainment"),
    "youtube.com":      ("YouTube",      "entertainment"),
    "primevideo.com":   ("Prime Video",  "entertainment"),
    "hotstar.com":      ("Hotstar",      "entertainment"),
    "jiocinema.com":    ("JioCinema",    "entertainment"),
    "sonyliv.com":      ("SonyLIV",      "entertainment"),
    # Productivity
    "notion.so":        ("Notion",       "productivity"),
    "slack.com":        ("Slack",        "productivity"),
    "zoom.us":          ("Zoom",         "productivity"),
    "dropbox.com":      ("Dropbox",      "productivity"),
    "trello.com":       ("Trello",       "productivity"),
    "atlassian.com":    ("Atlassian",    "productivity"),
    "figma.com":        ("Figma",        "productivity"),
    # Google services
    "google.com":       ("Google",       "other"),
    "accounts.google.com": ("Google",   "other"),
    "noreply.github.com": ("GitHub",    "dev"),
}

# Domains to ignore (infra / mail servers / noise)
IGNORE_DOMAINS = {
    "googleusercontent.com", "gstatic.com", "googleapis.com",
    "mailchimp.com", "sendgrid.net", "mailgun.org", "amazonses.com",
    "bounce.com", "mailer.com", "noreply.com", "no-reply.com",
    "notifications.com", "email.com", "mail.com",
}

def extract_domain(sender: str) -> str | None:
    """Extract domain from email sender string like 'Name <email@domain.com>'"""
    sender = sender.lower().strip()
    match = re.search(r'@([a-zA-Z0-9._-]+\.[a-zA-Z]{2,})', sender)
    if match:
        domain = match.group(1).lstrip(".")
        # Strip common mail subdomain prefixes but keep the root
        root = _root_domain(domain)
        if root in IGNORE_DOMAINS:
            return None
        return root
    return None

def _root_domain(domain: str) -> str:
    """Reduce mail.github.com → github.com etc."""
    parts = domain.split(".")
    if len(parts) > 2:
        # Handle .co.in, .co.uk style
        if parts[-2] in ("co", "com", "net", "org") and len(parts[-1]) == 2:
            return ".".join(parts[-3:])
        return ".".join(parts[-2:])
    return domain

def enrich_domain(domain: str) -> dict:
    """Return display name and category for a domain."""
    if domain in KNOWN_PLATFORMS:
        name, category = KNOWN_PLATFORMS[domain]
    else:
        # Capitalize first part of domain as fallback name
        name = domain.split(".")[0].capitalize()
        category = "other"
    return {"domain": domain, "platform_name": name, "category": category}

def assess_domain_risk(domain: str, category: str) -> str:
    """Simple rule-based risk level for a domain."""
    high_risk_keywords = ["temp", "throwaway", "guerrilla", "mailinator", "yopmail", "10minute"]
    if any(kw in domain for kw in high_risk_keywords):
        return "high"
    if category in ("finance",):
        return "medium"
    if domain not in KNOWN_PLATFORMS:
        return "medium"
    return "low"