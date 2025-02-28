# Playlist Saver a web extension for YouTube

A React TS project for saving playlist locally from YouTube in a json format.

## Mods

the `vite.config.ts` file was modified to build the contentScripts needed in the communication with the activeTab on the chrome browser.

### Interesting facts about chrome extensions

#### Background Scripts vs. Content Scripts in Chrome Extensions

| Feature               | Background Scripts                                                                         | Content Scripts                                                                |
| --------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| **Execution Context** | Runs in the background, separate from web pages                                            | Runs inside the context of a web page                                          |
| **Access to DOM**     | ❌ Cannot directly access the page DOM                                                     | ✅ Can directly access and manipulate the DOM                                  |
| **Persistent?**       | 🚫 No (in Manifest V3, it uses service workers)                                            | ✅ Yes, as long as the page is open                                            |
| **Messaging**         | ✅ Can communicate with content scripts and popup scripts via `chrome.runtime.sendMessage` | ✅ Can communicate with background scripts via `chrome.runtime.sendMessage`    |
| **Best Use Case**     | Handling API calls, event listeners, alarms, persistent storage, extension management      | Injecting scripts into web pages, modifying page content, scraping data        |
| **File Location**     | Defined in `background.service_worker` in `manifest.json`                                  | Defined in `content_scripts` in `manifest.json`                                |
| **Permissions**       | Requires permissions like `"background"`, `"storage"`, `"alarms"`                          | Requires permissions to match URL patterns (e.g., `"matches": ["<all_urls>"]`) |
| **Example Usage**     | Listening for browser events, handling long-running tasks                                  | Changing webpage styles, reading text content from a webpage                   |

#### Example Manifest Configuration

Background Script (Manifest V3)

```json
{
  "background": {
    "service_worker": "background.js"
  },
  "permissions": ["storage", "alarms"]
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

```

```
