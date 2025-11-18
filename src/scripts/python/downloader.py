import yt_dlp

def download_with_progress(url, options=None):
    """Downloads a video with yt-dlp and reports progress via print()."""
    if options is None:
        options = {}

    # Set up a logger for yt-dlp
    class MyLogger:
        def debug(self, msg):
            pass
        def warning(self, msg):
            pass
        def error(self, msg):
            # If there's an important error, print it
            print(f"ERROR: {msg}")

    # This hook will be called periodically by yt-dlp
    def progress_hook(d):
        # d is a dict with keys like 'status', 'downloaded_bytes', 'total_bytes', 'eta', etc.
        # We print a JSON-serializable string, or a formatted string.
        if d.get("status") == "downloading":
            percent = None
            if d.get("total_bytes"):
                percent = d["downloaded_bytes"] / d["total_bytes"] * 100
            print(f"PROGRESS: {{'status':'downloading','downloaded':{d['downloaded_bytes']},'total':{d.get('total_bytes')},'percent':{percent},'eta':{d.get('eta')}}}")
        elif d.get("status") == "finished":
            print("PROGRESS: {'status':'finished'}")

    ydl_opts = {
        "logger": MyLogger(),
        "progress_hooks": [progress_hook],
        # Merge user-supplied options
    }
    ydl_opts.update(options)

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    return "done"
